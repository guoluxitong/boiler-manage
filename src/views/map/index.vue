<template>
  <div style="margin-top: 20px">
    <div class="map-container">
      <div>
        <device-map :map-height="mapHeight" :medias="medias" :powers="powers" :devicewrans="devicewrans" :products="products" :customers="customers" :categories="categories" :showwarn="showwarn" :showInfo="showInfo" ak="eqPZV35edaZZGefOIopjLNqTSj4qI89Y" @search="search" @onDeviceClicked="deviceClick" :show-full-btn="true"></device-map>
      </div>
      <device-dialog
        ref="deviceRunInfoDialog"
        :boiler-no="this.boilerNo"
        :controller-no="this.controllerNo"
        :address="this.address"
        :show.sync="deviceDialogVisible"
      ></device-dialog>
    </div>
  </div>
</template>
<script>
  import { StringHashMap } from '@sdcsoft/comms'
  import { SdcSoftClient } from '@tomcat008/sdcsoftclient'
  import { DeviceAdapter,SdcSoftDevice2 } from '@tomcat008/devicelib'
  import mqtt from 'mqtt'
  import axios from "axios";
  import { formatDateTime } from "@/utils/date";
  import { initMedium, initFuel } from "./product-dictionary";
  import { getProductCategoryList } from "@/api/productCategory";
  import {productSearch} from "@/api/product";
  import { getList } from "@/api/customer";
import deviceMap from "@sdcsoft/components/components/map/device-map/index";
import deviceDialog from "./device-dialog/index";
  let webRequest = axios.create({
    baseURL: "https://apis.sdcsoft.com.cn",
    timeout: 8000,
  });
export default {
  name: "map-index",
  components: {
    'device-map':deviceMap,
    deviceDialog
  },
  data() {
    return {
      showInfo:true,
      showwarn:true,
      deviceDialogVisible: false,
      address: "",
      client:null,
      client1:null,
      devicelist:new StringHashMap(),
      deviceWarnlist:new StringHashMap(),
      controllerNo: "",
      boilerNo: null,
      product: {
        boilerNo: "",
        customerId: null,
        productCategoryId: null,
        tonnageNum: null,
        media: null,
        power: null
      },
      datamapId:null,
      searchOption: {
        boilerNo: "",
        customer: null,
        category: null,
        tonnageNum: null,
        media: null,
        power: null,
      },
      products: [],
      devicewrans: [],
      customers: [],
      categories: [],
      powers: [],
      medias: [],
      mapHeight: document.documentElement.clientHeight - 100+ "px"
    };
  },
  computed: {
    fullMap() {
      return this.$store.state.app.fullMap;
    }
  },
  mounted() {
    this.initSearchOptions()
  },
  watch: {
    fullMap(val) {
      if (val) {
        this.mapHeight = document.documentElement.clientHeight - 10 + "px";
      } else {
        this.mapHeight = document.documentElement.clientHeight - 100 + "px";
      }
    }
  },
  created(){
    this.client = new SdcSoftClient(mqtt,"wss://skt.sdcsoft.cn", "8084", 'sdcsoft.com.cn', '80201288@qq.com', 'MAP-'+this.guid())
    this.client.Connect()
    this.client.addMessageListener("01017", (deviceno, msg) => {
      if(msg.length == 0){
        this.devicelist.remove(deviceno)
      }else{
        this.devicelist.addItem(deviceno,deviceno)
      }

    }).then((deviceno) => {
      this.search(this.searchOption)
    })
  },
  destroyed() {
    productSearch({
      product: this.product,
      pageNum: 1,
      pageSize: 1000
    }).then(res => {
      let data = res.data;
        data.data.list.forEach(item => {
          if (item.isSell) {
            this.client.removeMessageListener(this.devicelist.getItem(item.controllerNo), (deviceno, msg) => {
            }).then((msg) => {
              console.log(item.controllerNo+'关闭监听成功1！')
            })
          }
        });
    })
    this.client.removeMessageListener("01017", (deviceno, msg) => {
    }).then((msg) => {
      this.client.OnClose = function (connect) {
        console.log('关闭连接')
      }
    })
  },
  methods: {
    getDataMap() {
      if (this.datamapId) {
        return webRequest.get("/wechat/DeviceDataMap/get", {
          params: {id: this.datamapId  },
        });
      }
    },
    getDeviceInfo(controllerNo) {
      if (controllerNo) {
        return webRequest.post("/webapi/output/decoder/suffix", null, {
          params: { deviceNo:controllerNo },
        });
      }
    },
    handleDevice(controllerNo) {
      // var adapter = new NewframeDeviceAdapter()
      this.getDataMap().then((data) => {
          this.client.addMessageListener(controllerNo, (deviceno, msg) => {
            //监听设备的数据
            let adapter = new DeviceAdapter()
            let addr = JSON.parse(data.data.data.pointIndexMap);
            let map = JSON.parse(data.data.data.deviceDataMap);
            adapter.Init(map, addr)
            adapter.handlerData(new Uint8Array(msg))
            //获取device对象
            let device = adapter.Device
            if(device.bj.length>0){
              let devicedatas = [];
              for (var i in device.bj) {
                let devicedata = {
                  title:  device.bj[i].name,
                  valueString:device.bj[i].vstr,
                };
                devicedatas.push(devicedata);
              }
              this.deviceWarnlist.addItem(controllerNo,devicedatas);
            }else{
              this.deviceWarnlist.remove(controllerNo)
            }

          }).then((controllerNo) => {
            this.searchwarn(this.searchOption)
          })
        }) .catch((reason) => {
        this.$message.error(reason);
      });
    },
    showDevice(controllerNo) {
      if(controllerNo){
        this.getDeviceInfo(controllerNo).then((data) => {
          if(data.data.data.deviceDataMapCn){
            this.datamapId = data.data.data.deviceDataMapCn;
          }
          if(data.data.data.deviceDataMapEn){
            this.datamapId = data.data.data.deviceDataMapEn;
          }

          this.handleDevice(controllerNo);
        })
          .catch((reason) => {
            console.log(reason);
          });
      }

    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    search(searchOption) {
      this.product.boilerNo=searchOption.boilerNo;
      this.product.controllerNo=searchOption.controllerNo;
      this.product.media=searchOption.media;
      this.product.power=searchOption.power;
      this.product.customerId=searchOption.customer;
      this.product.productCategoryId=searchOption.category
      productSearch({
        product: this.product,
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        let data = res.data;
        if (data.code) {
          this.$message.error(data.msg);
          return;
        } else {
          this.products = [];
          this.devicewrans = [];
          data.data.list.forEach(item => {
            if (item.isSell) {
              this.showDevice(this.devicelist.getItem(item.controllerNo))
              if(this.devicelist.getItem(item.controllerNo)){

                this.products.push({
                  lng: item.longitude,
                  lat: item.latitude,
                  boilerNo: item.boilerNo,
                  controllerNo: item.controllerNo,
                  customerId:item.customerId,
                  address: item.street,
                  onLione:true
                });
              }else{
                this.products.push({
                  lng: item.longitude,
                  lat: item.latitude,
                  boilerNo: item.boilerNo,
                  controllerNo: item.controllerNo,
                  customerId:item.customerId,
                  address: item.street,
                  onLione:false
                });
              }
            }
          })
        }
      });

    },
    searchwarn(searchOption) {
      productSearch({
        product: this.product,
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        let data = res.data;
          this.devicewrans = [];
          data.data.list.forEach(item => {
            if (item.isSell) {
              if( this.deviceWarnlist.getItem(item.controllerNo)){
                this.deviceWarnlist.getItem(item.controllerNo).forEach(data => {
                  let devicedata = {
                    deviceNo:  item.controllerNo,
                    title:  data.title,
                    time: formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
                  };
                  this.devicewrans.push(devicedata)
                })
              }
            }

          });
      });
    },
    initSearchOptions() {
      getProductCategoryList().then(data => {
        this.categories = [];
        data.data.data.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          this.categories.push(optionItem);
        });
      });
      getList({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.customers = [];
        response.data.data.list.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          this.customers.push(optionItem);
        });
      });
      initMedium().then(data => {
        this.medias = data;
      });
      initFuel().then(data => {
        this.powers = data;
      });
    },
    deviceClick(device) {
      if(!device.controllerNo){
        this.$message.error("该锅炉不支持监控功能")
      }else{
        this.address = device.address;
        this.controllerNo = device.controllerNo;
        this.boilerNo = device.boilerNo;
        this.deviceDialogVisible = true;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.map-container {
  .map {
    width: 100%;
  }
}
</style>
