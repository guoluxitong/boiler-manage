<template>
  <div class="loginBox">

    <el-row v-show="pagination==1" >
      <el-col :span="7">
        <div style="width: 100%" >
              <h3 style="padding-left: 20px" >设备总数:{{devices}}台</h3>
              <div id="chartPie" style="height:350px;width: 100%"></div>
        </div>
      </el-col>
      <el-col :span="7">
        <div style="width: 100%">
          <h3 style="padding-left: 20px">设备在线总数:{{devicesOnline}}台</h3>
          <div id="chartPie1" style="height:350px;width: 100%"></div>
        </div>
      </el-col>
      <el-col :span="7">
        <div style="width: 100%">
          <h3 style="padding-left: 20px">在线设备绑定微信总数:{{ weChats}}台</h3>
          <div id="chartPie2" style="height:350px;width: 100%"></div>
        </div>
      </el-col>
      <el-col :span="2" :offset="1">
        <div >
          <el-button v-if="buttonVisible==1" type="success"  @click="handlebutton">刷新数据</el-button>
          <el-button v-if="buttonVisible==2" type="success"  @click="handlebutton1">返回</el-button>
        </div>
      </el-col>
    </el-row>
    <div v-show="pagination==2">
          <el-row>
            <el-col :span="2">
              <el-input v-model="product.controllerNo" placeholder="控制器编号" ></el-input>
            </el-col>
            <el-col :span="2">
              <el-select clearable v-model="product.power" placeholder="燃料">
                <el-option
                  v-for="item in fuelArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-select clearable  v-model="product.media" placeholder="介质">
                <el-option
                  v-for="item in mediumArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" >
              <el-button type="success" icon="el-icon-search" @click="handleselect">查询</el-button>
            </el-col>
            <el-col :span="2" :offset="14">
              <el-button type="success" icon="el-icon-back" @click="handleFilter">返回</el-button>
            </el-col>
          </el-row>
          <el-table class="main-table"
                    :data="deviceListArray.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    v-loading="listLoading"
                    element-loading-text="给我一点时间"
          >
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器编号">
              <template slot-scope="scope">
                <span v-if="buttonVisible==1">{{scope.row.deviceSuffix}}</span>
                <span v-if="buttonVisible==2">{{scope.row.controllerNo}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器型号">
              <template slot-scope="scope">
                <span >{{scope.row.deviceType}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
              <template slot-scope="scope">
                <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" :show-overflow-tooltip="true" align="left" label="介质">
              <template slot-scope="scope">
                <span >{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
              </template>
            </el-table-column>
           <!-- <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="连接方式">
              <template slot-scope="scope">
                <span >{{scope.row.deviceSuffix}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="绑定微信数量">
              <template slot-scope="scope">
                <span @click=handle(scope.row) >{{scope.row.wechat}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="微信在线时长">
              <template slot-scope="scope">
                <span >{{scope.row.deviceType}}</span>
              </template>
            </el-table-column>-->
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :pager-count="5"
              :current-page="currentPage"
              :page-sizes="[5]"
              layout="total,sizes,prev, pager,next"
              :total="deviceListArray.length"
            ></el-pagination>
          </div>
    </div>
    <div v-show="pagination==3">
          <el-row>
            <el-col :span="2">
              <el-input v-model="product.controllerNo" placeholder="控制器编号"
              ></el-input>
            </el-col>
            <el-col :span="2">
              <el-select clearable style="width: 150px" v-model="product.power" placeholder="燃料">
                <el-option
                  v-for="item in fuelArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-select clearable  v-model="product.media" placeholder="介质">
                <el-option
                  v-for="item in mediumArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="success" icon="el-icon-search" @click="handleselect1">查询</el-button>
            </el-col>
            <el-col :span="2" :offset="14">
              <el-button type="success" icon="el-icon-back" @click="handleFilter">返回</el-button>
            </el-col>
          </el-row>
          <el-table class="main-table"
                    :data="deviceList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
                    v-loading="listLoading"
                    element-loading-text="给我一点时间"
                    @row-contextmenu="openTableMenu"
          >
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器编号">
              <template slot-scope="scope">
                <span v-if="buttonVisible==1">{{scope.row.deviceSuffix}}</span>
                <span v-if="buttonVisible==2">{{scope.row.controllerNo}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器型号">
              <template slot-scope="scope">
                <span >{{scope.row.deviceType}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
              <template slot-scope="scope">
                <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" :show-overflow-tooltip="true" align="left" label="介质">
              <template slot-scope="scope">
                <span >{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
              </template>
            </el-table-column>
          <!--  <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="连接方式">
              <template slot-scope="scope">
                <span >{{scope.row.deviceSuffix}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="绑定微信数量">
              <template slot-scope="scope">
                <span >{{scope.row.wechat}}</span>
              </template>
            </el-table-column>
            <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="微信在线时长">
              <template slot-scope="scope">
                <span >{{scope.row.deviceType}}</span>
              </template>
            </el-table-column>-->
          </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="showControllerData" :width="100" :fontSize="14">监控</menu-context-item>
      </menu-context>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :pager-count="5"
              :current-page="currentPage1"
              :page-sizes="[5]"
              layout="total,sizes,prev, pager,next"
              :total="deviceList.length"
            ></el-pagination>
          </div>
      <!--监控-->
      <el-dialog :append-to-body="true" title="监控" :visible.sync="controllerRunInfoDialogVisible" width="40%" @open="open" @close="close">
        <controller-run-info-dialog
          ref="deviceRunInfo"
          lang="zh-cn"
          :boiler-no="boiler.boilerNo"
          :controller-no="boiler.controllerNo"
          :address="boiler.address"
          :runing="controllerRunInfoDialogVisible"
        ></controller-run-info-dialog>
      </el-dialog>
    </div>
    <div>
      <el-dialog :append-to-body="true" title="绑定微信" :visible.sync="wechatRunInfoDialogVisible" width="40%">
        <el-table class="main-table"
                  :data="deviceList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  @row-contextmenu="openTableMenu"
        >
          <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器编号">
            <template slot-scope="scope">
              <span >{{scope.row.deviceSuffix}}</span>
            </template>
          </el-table-column>
          <el-table-column style="color: aliceblue" align="left" :show-overflow-tooltip="true" label="控制器型号">
            <template slot-scope="scope">
              <span >{{scope.row.deviceType}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
            <template slot-scope="scope">
              <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
            </template>
          </el-table-column>
          <el-table-column style="color: aliceblue" :show-overflow-tooltip="true" align="left" label="介质">
            <template slot-scope="scope">
              <span >{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { initMedium, initFuel } from "./device-dictionary";
  import contextmenu from "@/components/ContextMenu";
  import { queryDevice,queryDeviceByMedium,queryDeviceOnline,queryControllerNo } from "@/api/device";
  import { queryDeviceByOnline } from "@/api/deviceonline";
  import { queryWeChatAmount,queryWeChatUser } from "@/api/wechat";
  import controllerRunInfoDialog from  "@sdcsoft/components/components/device-run-info/index";
  import echarts from 'echarts';
  function dictionaryValueFilter(dictionaryValue, value) {
    const dictionaryValueItem = dictionaryValue.filter(item => {
      return item.value == value;
    });
    return dictionaryValueItem[0];
  }
  export default {
    components: {
      controllerRunInfoDialog,
      contextmenu
    },
    data() {
      return  {
        buttonVisible:1,
        boiler:{
          address: null,
          controllerNo: null,
          boilerNo:null,
        },
        orgId: this.$store.state.user.orgId,
        controllerRunInfoDialogVisible:false,
        wechatRunInfoDialogVisible:false,
        list:[],
        deviceList:[],
        deviceListArray:[],
        amountList:[],
        pagination:1,
        devicesList:[],
        weChatsList: [],
        listLoading:false,
        backgroundUrl: "/static/common/background1.jpg",
        devices:null,
        devicesOnline:null,
        devicesArray:[],
        weChats:'',
        weChatUser:[],
        currentPage1: 1,
        pageSize1: 5,
        currentPage: 1,
        pageSize: 5,
        mediumArray: [],
        fuelArray: [],
        product: {
          media: null,
          power: null,
          controllerNo:null,
        },
        deviceControllerNo:null,
        chartPie: null,
      }
    },
    filters: {
      dictionaryValueFieldFilter(value, dictionaryValueArray) {
        if (dictionaryValueFilter(dictionaryValueArray, value))
          return dictionaryValueFilter(dictionaryValueArray, value).label;
        return;
      }
    },
    updated(){
      this.drawCharts();
    },
    created() {
      this.inint()
     setInterval(this.inint,100000)
    },
    watch: {   //监听值变化：devicesOnline
      devicesOnline:function () {
        this. drawPieChart1()
      },
      devices:function () {
        this. drawPieChart()
      },
      weChatUser:function () {
        this. drawPieChart2()
      }
    },
    methods: {
      handlebutton(){
        this.buttonVisible=2
      },
      handlebutton1(){
        this.buttonVisible=1
      },
      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(
          row,
          event,
          window.event.clientX,
          window.event.clientY
        );
      },
      showControllerData(row) {
        this.controllerRunInfoDialogVisible = true;
        this.boiler.controllerNo = row.deviceSuffix;
        this.boiler.boilerNo = '';
        this.boiler.address = '';
      },
      close() {
        this.$refs.deviceRunInfo.stopTimer();
      },
      open() {
        this.$nextTick(()=>{
          this.$refs.deviceRunInfo.startTimer();
        })
      },
      handle(row){
       this.wechatRunInfoDialogVisible=true
      },
      handleselect(){
        this.currentPage=1
        queryDeviceOnline().then(data => {
          this.devicesList=[]
          if(this.deviceControllerNo!=null){
            for(var i=0;i< data.data.data.length;i++){
              if(data.data.data[i].deviceSuffix.substring(0, this.deviceControllerNo.length)== this.deviceControllerNo){
                this.devicesList.push(data.data.data[i])
              }
            }
          }
          for(var i=0;i< this.devicesList.length;i++){
            this.devicesList[i].controllerNo=this.replacepos(this.devicesList[i].deviceSuffix,0,'*****')
          }
          queryWeChatUser().then(data => {
            this.weChatUser = data.data.data;
            this.weChats= this.weChatUser.length
            var we=0
            for(var i=0;i<this.devicesList.length;i++){
              we=0
              for(var j=0;j<this.weChatUser.length;j++){
                if(this.devicesList[i].deviceSuffix==this.weChatUser[j]){
                  we+=1
                }
              }
              this.devicesList[i].wechat =we
            }
            this.inintdevices()

          });
        });
      },
      inintdevices(){
        this.deviceListArray=[]
        for (var i=0;i<this.devicesList.length;i++){
          if(this.product.controllerNo!=null){
            if(this.product.controllerNo==this.devicesList[i].deviceSuffix||this.product.controllerNo==this.devicesList[i].deviceSuffix.substr(0,this.product.controllerNo.length)){
              this.deviceListArray.push(this.devicesList[i])
            }
          }else{
            if(this.product.media!=null){
              if(this.product.power!=null){
                if(this.product.media==this.devicesList[i].media&&this.product.power==this.devicesList[i].power){
                  this.deviceListArray.push(this.devicesList[i])
                }
              }else{
                if(this.product.media==this.devicesList[i].media){
                  this.deviceListArray.push(this.devicesList[i])
                }
              }
            }else{
              if(this.product.power!=null){
                if(this.product.power==this.devicesList[i].power){
                  this.deviceListArray.push(this.devicesList[i])
                }
              }
            }
          }
        }
        this.product={
          media: null,
          power: null,
          controllerNo:null,
        }
      },
      handleselect1(){
        this.currentPage1=1
        queryDeviceOnline().then(data => {
          this.devicesList=[]
          if(this.deviceControllerNo!=null){
            for(var i=0;i< data.data.data.length;i++){
              if(data.data.data[i].deviceSuffix.substring(0, this.deviceControllerNo.length)== this.deviceControllerNo){
                this.devicesList.push(data.data.data[i])
              }
            }
          }
          for(var i=0;i< this.devicesList.length;i++){
            this.devicesList[i].controllerNo=this.replacepos(this.devicesList[i].deviceSuffix,0,'*****')
          }
          queryDeviceByOnline().then(requst => {
            this.list=[]
            for(var i=0;i< this.devicesList.length;i++){
              for(var j=0;j< requst.data.length;j++){
                if(requst.data[j]==this.devicesList[i].deviceSuffix){
                  this.list.push(this.devicesList[i])
                }
              }
            }
            queryWeChatUser().then(data => {
              this.weChatUser = data.data.data;
              this.weChats= this.weChatUser.length
              for(var i=0;i<this.list.length;i++){
                var we=0
                for(var j=0;j<this.weChatUser.length;j++){
                  if(this.list[i].deviceSuffix==this.weChatUser[j]){
                    we+=1
                  }
                }
                this.list[i].wechat =we
              }
            });
           this.inintdevices1()
          });
        });
      },
      inintdevices1(){
        this.deviceList=[]
        for (var i=0;i<this.list.length;i++){
          if(this.product.controllerNo!=null){
            if(this.product.controllerNo==this.list[i].deviceSuffix||this.product.controllerNo==this.list[i].deviceSuffix.substr(0,this.product.controllerNo.length)){
              this.deviceList.push(this.list[i])
            }
          }else{
            if(this.product.media!=null){
              if(this.product.power!=null){
                if(this.product.media==this.list[i].media&&this.product.power==this.list[i].power){
                  this.deviceList.push(this.list[i])
                }
              }else{
                if(this.product.media==this.list[i].media){
                  this.deviceList.push(this.list[i])
                }
              }
            }else{
              if(this.product.power!=null){
                if(this.product.power==this.list[i].power){
                  this.deviceList.push(this.list[i])
                }
              }
            }
          }
        }
        this.product={
          media: null,
          power: null,
          controllerNo:null,
        }
      },
      handleFilter(){
        this.pagination=1
        this.product={
          media: null,
          power: null,
          controllerNo:null,
        }
        this.inint()
      },
    formateMedium: function (input) {
      var label=null
      for(var i=0;i<this.mediumArray.length; i++){
        if(this.mediumArray[i].value==input){
          label=this.mediumArray[i].label
        }
      }
        return  label
      },
      formateFuel: function (input) {
        var label=null
        for(var i=0;i<this.fuelArray.length; i++){
          if(this.fuelArray[i].value==input){
            label=this.fuelArray[i].label
          }
        }
        return  label
      },
      dateFormat: function (time) {
        if (time) {
          var date = new Date(time);
          var year = date.getFullYear();
          /* 在日期格式中，月份是从0开始的，因此要加0
           * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
           * */
          var month =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          var hours =
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          var minutes =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
          var seconds =
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
          // 拼接
          return (
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds
          );
        }
        else {
          return;
        }
      },
       replacepos(text,start,replacetext){
    var mystr = text.substr(0, start) + replacetext + text.substr(replacetext.length);
    return mystr;
  },
      inint() {
        initMedium().then(data => {
          this.mediumArray = data;
        });
        initFuel().then(data => {
          this.fuelArray = data;
        });
        queryControllerNo().then(data => {
          this.deviceControllerNo = data.data.data;
        });
        queryDeviceOnline().then(data => {
          this.devicesList=[]
          if(this.deviceControllerNo!=null){
            for(var i=0;i< data.data.data.length;i++){
              if(data.data.data[i].deviceSuffix.substring(0, this.deviceControllerNo.length)== this.deviceControllerNo){
                this.devicesList.push(data.data.data[i])
              }
            }
          }

          for(var i=0;i< this.devicesList.length;i++){
            this.devicesList[i].controllerNo=this.replacepos(this.devicesList[i].deviceSuffix,0,'*****')
          }
          this.devices=this.devicesList.length
          queryDeviceByOnline().then(requst => {
            this.list=[]
            for(var i=0;i< this.devicesList.length;i++){
              for(var j=0;j< requst.data.length;j++){
                if(requst.data[j]==this.devicesList[i].deviceSuffix){
                  this.list.push(this.devicesList[i])
                }
              }
            }
            this.devicesOnline = this.list.length;
            queryWeChatUser().then(data => {
              this.weChatUser=[]
              if(this.deviceControllerNo!=null){
                for(var i=0;i< data.data.data.length;i++){
                  if(data.data.data[i].substring(0, this.deviceControllerNo.length)== this.deviceControllerNo){
                    this.weChatUser.push(data.data.data[i])
                  }
                }
              }
              this.weChats= this.weChatUser.length
              for(var i=0;i<this.devicesList.length;i++){
                var we=0
                for(var j=0;j<this.weChatUser.length;j++){
                    if(this.devicesList[i].deviceSuffix==this.weChatUser[j]){
                      we+=1
                    }
                }
                this.devicesList[i].wechat =we
              }
              for(var i=0;i<this.list.length;i++){
                var we=0
                for(var j=0;j<this.weChatUser.length;j++){
                  if(this.list[i].deviceSuffix==this.weChatUser[j]){
                    we+=1
                  }
                }
                this.list[i].wechat =we
              }

            });
          });
        });
      },
      inintDevice(){
        var person=new Object();
        var person1=new Object();
        var person2=new Object();
        var person3=new Object();
        var person4=new Object();
        var person5=new Object();
        var person6=new Object();
        var person7=new Object();
        var person8=new Object();
        var person9=new Object();
        var person10=new Object();
        var person11=new Object();
        var person12=new Object();
        var person13=new Object();
        var person14=new Object();
        var person15=new Object();
        var person16=new Object();
        var person17=new Object();
        var person18=new Object();
        var person19=new Object();
        var person20=new Object();
        var person21=new Object();
        person.amount=0
        person1.amount=0
        person2.amount=0
        person3.amount=0
        person4.amount=0
        person5.amount=0
        person6.amount=0
        person7.amount=0
        person8.amount=0
        person9.amount=0
        person10.amount=0
        person11.amount=0
        person12.amount=0
        person13.amount=0
        person14.amount=0
        person15.amount=0
        person16.amount=0
        person17.amount=0
        person18.amount=0
        person19.amount=0
        person20.amount=0
        person21.amount=0
        var arr = new Array(20)
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].media<=0){
            if(this.list[i].power<=0){
              person.media=0
              person.wechatmedia=0
              person.power=0
              person.amount += 1
              arr.splice(0,1,person)
            }
            if(this.list[i].power==1){
              person1.media=0
              person1.wechatmedia=0
              person1.power=1
              person1.amount += 1
              arr.splice(1,1,person1)
            }
           if(this.list[i].power==2){
              person2.media=0
             person2.wechatmedia=0
              person2.power=2
              person2.amount += 1
             arr.splice(2,1,person2)
            }
            if(this.list[i].power==3){
              person3.media=0
              person3.wechatmedia=0
              person3.power=3
              person3.amount += 1
              arr.splice(3,1,person3)
            }
          }
          if(this.list[i].media==1){
            if(this.list[i].power<=0){
              person4.media=1
              person4.wechatmedia=0
              person4.power=0
              person4.amount += 1
              arr.splice(4,1,person4)
            }
            if(this.list[i].power==1){
              person5.media=1
              person5.wechatmedia=0
              person5.power=1
              person5.amount += 1
              arr.splice(5,1,person5)
            }
            if(this.list[i].power==2){
              person6.media=1
              person6.wechatmedia=0
              person6.power=2
              person6.amount += 1
              arr.splice(6,1,person6)
            }
            if(this.list[i].power==3){
              person7.media=1
              person7.wechatmedia=0
              person7.power=3
              person7.amount += 1
              arr.splice(7,1,person7)
            }
          }
          if(this.list[i].media==2){
            if(this.list[i].power<=0){
              person8.media=2
              person8.wechatmedia=0
              person8.power=0
              person8.amount += 1
              arr.splice(8,1,person8)
            }
            if(this.list[i].power==1){
              person9.media=2
              person9.wechatmedia=0
              person9.power=1
              person9.amount += 1
              arr.splice(9,1,person9)
            }
            if(this.list[i].power==2){
              person10.media=2
              person10.wechatmedia=0
              person10.power=2
              person10.amount += 1
              arr.splice(10,1,person10)
            }
            if(this.list[i].power==3){
              person11.media=2
              person11.wechatmedia=0
              person11.power=3
              person11.amount += 1
              arr.splice(11,1,person11)
            }
          }
          if(this.list[i].media==3){
            if(this.list[i].power<=0){
              person19.media=3
              person19.wechatmedia=0
              person19.power=0
              person19.amount += 1
              arr.splice(19,1,person19)
            }
            if(this.list[i].power==1){
              person12.media=3
              person12.wechatmedia=0
              person12.power=1
              person12.amount += 1
              arr.splice(12,1,person12)
            }
            if(this.list[i].power==2){
              person13.media=3
              person13.wechatmedia=0
              person13.power=2
              person13.amount += 1
              arr.splice(13,1,person13)
            }
            if(this.list[i].power==3){
              person14.media=3
              person14.wechatmedia=0
              person14.power=3
              person14.amount += 1
              arr.splice(14,1,person14)
            }
          }
          if(this.list[i].media==4){
            if(this.list[i].power<=0){
              person15.media=4
              person15.wechatmedia=0
              person15.power=0
              person15.amount += 1
              arr.splice(15,1,person15)
            }
            if(this.list[i].power==1){
              person18.media=4
              person18.wechatmedia=0
              person18.power=1
              person18.amount += 1
              arr.splice(18,1,person18)
            }
            if(this.list[i].power==2){
              person16.media=4
              person16.wechatmedia=0
              person16.power=2
              person16.amount += 1
              arr.splice(16,1,person16)
            }
            if(this.list[i].power==3){
              person17.media=4
              person17.wechatmedia=0
              person17.power=3
              person17.amount += 1
              arr.splice(17,1,person17)
            }
          }
        }
        for(var i = 0; i < arr.length; i++) {
          if(arr[i] == undefined) {
            arr.splice(i,1);
            i = i - 1;
          }
        }
        this.amountList=arr
      },
      inintDevice1(){
        var person=new Object();
        var person1=new Object();
        var person2=new Object();
        var person3=new Object();
        var person4=new Object();
        var person5=new Object();
        var person6=new Object();
        var person7=new Object();
        var person8=new Object();
        var person9=new Object();
        var person10=new Object();
        var person11=new Object();
        var person12=new Object();
        var person13=new Object();
        var person14=new Object();
        var person15=new Object();
        var person16=new Object();
        var person17=new Object();
        var person18=new Object();
        var person19=new Object();
        var person20=new Object();
        var person21=new Object();
        person.amount=0
        person1.amount=0
        person2.amount=0
        person3.amount=0
        person4.amount=0
        person5.amount=0
        person6.amount=0
        person7.amount=0
        person8.amount=0
        person9.amount=0
        person10.amount=0
        person11.amount=0
        person12.amount=0
        person13.amount=0
        person14.amount=0
        person15.amount=0
        person16.amount=0
        person17.amount=0
        person18.amount=0
        person19.amount=0
        person20.amount=0
        person21.amount=0
        var arr = new Array(20)
        for(var i=0;i<this.devicesList.length;i++){
          if(this.devicesList[i].media==0){
            if(this.devicesList[i].power==0){
              person.media=0
              person.wechatmedia=0
              person.power=0
              person.amount += 1
              arr.splice(0,1,person)
            }
            if(this.devicesList[i].power==1){
              person1.media=0
              person1.wechatmedia=0
              person1.power=1
              person1.amount += 1
              arr.splice(1,1,person1)
            }
            if(this.devicesList[i].power==2){
              person2.media=0
              person2.wechatmedia=0
              person2.power=2
              person2.amount += 1
              arr.splice(2,1,person2)
            }
            if(this.devicesList[i].power==3){
              person3.media=0
              person3.wechatmedia=0
              person3.power=3
              person3.amount += 1
              arr.splice(3,1,person3)
            }
          }
          if(this.devicesList[i].media==1){
            if(this.devicesList[i].power<=0){
              person4.media=1
              person4.wechatmedia=0
              person4.power=0
              person4.amount += 1
              arr.splice(4,1,person4)
            }
            if(this.devicesList[i].power==1){
              person5.media=1
              person5.wechatmedia=0
              person5.power=1
              person5.amount += 1
              arr.splice(5,1,person5)
            }
            if(this.devicesList[i].power==2){
              person6.media=1
              person6.wechatmedia=0
              person6.power=2
              person6.amount += 1
              arr.splice(6,1,person6)
            }
            if(this.devicesList[i].power==3){
              person7.media=1
              person7.wechatmedia=0
              person7.power=3
              person7.amount += 1
              arr.splice(7,1,person7)
            }
          }
          if(this.devicesList[i].media==2){
            if(this.devicesList[i].power<=0){
              person8.media=2
              person8.wechatmedia=0
              person8.power=0
              person8.amount += 1
              arr.splice(8,1,person8)
            }
            if(this.devicesList[i].power==1){
              person9.media=2
              person9.wechatmedia=0
              person9.power=1
              person9.amount += 1
              arr.splice(9,1,person9)
            }
            if(this.devicesList[i].power==2){
              person10.media=2
              person10.wechatmedia=0
              person10.power=2
              person10.amount += 1
              arr.splice(10,1,person10)
            }
            if(this.devicesList[i].power==3){
              person11.media=2
              person11.wechatmedia=0
              person11.power=3
              person11.amount += 1
              arr.splice(11,1,person11)
            }
          }
          if(this.devicesList[i].media==3){
            if(this.devicesList[i].power<=0){
              person19.media=3
              person19.wechatmedia=0
              person19.power=0
              person19.amount += 1
              arr.splice(19,1,person19)
            }
            if(this.devicesList[i].power==1){
              person12.media=3
              person12.wechatmedia=0
              person12.power=1
              person12.amount += 1
              arr.splice(12,1,person12)
            }
            if(this.devicesList[i].power==2){
              person13.media=3
              person13.wechatmedia=0
              person13.power=2
              person13.amount += 1
              arr.splice(13,1,person13)
            }
            if(this.devicesList[i].power==3){
              person14.media=3
              person14.wechatmedia=0
              person14.power=3
              person14.amount += 1
              arr.splice(14,1,person14)
            }
          }
          if(this.devicesList[i].media==4){
            if(this.devicesList[i].power<=0){
              person15.media=4
              person15.wechatmedia=0
              person15.power=0
              person15.amount += 1
              arr.splice(15,1,person15)
            }
            if(this.devicesList[i].power==1){
              person18.media=4
              person18.wechatmedia=0
              person18.power=1
              person18.amount += 1
              arr.splice(18,1,person18)
            }
            if(this.devicesList[i].power==2){
              person16.media=4
              person16.wechatmedia=0
              person16.power=2
              person16.amount += 1
              arr.splice(16,1,person16)
            }
            if(this.devicesList[i].power==3){
              person17.media=4
              person17.wechatmedia=0
              person17.power=3
              person17.amount += 1
              arr.splice(17,1,person17)
            }
          }
        }
        for(var i = 0; i < arr.length; i++) {
          if(arr[i] == undefined) {
            arr.splice(i,1);
            i = i - 1;
          }
        }
        this.devicesArray=arr
      },
      inintwechatmedia(){
        var arr = new Array()
        var arr1 = new Array()
        for(var i=0;i< this.fuelArray.length;i++){
         for(var j=0;j< this.mediumArray.length;j++){
           var person=new Object();
            person.media=this.mediumArray[j].value
            person.wechatmedia=0
            person.power=this.fuelArray[i].value
           arr.push(person)
          }
        }
        this.weChatsList=arr

        for(var i = 0; i < this.weChatUser.length; i++){
          for(var z = 0; z < this.devicesList.length; z++) {
            if(this.weChatUser[i] == this.devicesList[z].deviceSuffix) {
              for(var j = 0; j < this.weChatsList.length; j++){
                if(this.devicesList[z].media==this.weChatsList[j].media&&this.devicesList[z].power==this.weChatsList[j].power){
                  this.weChatsList[j].wechatmedia+=1
                } else{
                  if(this.devicesList[z].media<0||this.devicesList[z].power<0||this.devicesList[z].media==null||this.devicesList[z].power==null){
                    if(this.weChatsList[j].media==0&&this.weChatsList[j].power==0){
                      this.weChatsList[j].wechatmedia+=1
                    }
                  }
                }
              }
            }
          }
        }
        for(var i = 0; i <  this.weChatsList.length; i++) {
          if( this.weChatsList[i].wechatmedia == 0) {
            this.weChatsList.splice(i,1);
            i = i - 1;
          }
        }
      },
      handleSizeChange: function (pageSize) {
        this.pageSize = pageSize;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange: function (currentPage) {
        //页码切换
        this.currentPage = currentPage;
      },
      handleSizeChange1: function (pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage1);
      },
      handleCurrentChange1: function (currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      },
      tableRowStyle({row, rowIndex}) {
        return 'background-color: #286BA8 ;color: #fff;'
      },
     drawPieChart() {
        this.chartPie = echarts.init(document.getElementById('chartPie'));
        this.inintDevice1()
          var list=[]
       var that=this
        for(var i=0;i<this.devicesArray.length;i++){
         var person=new Object();
          person.value=this.devicesArray[i].amount
          person.name=this.formateFuel(this.devicesArray[i].power) + this.formateMedium(this.devicesArray[i].media)
          person.power=this.devicesArray[i].power
          person.media=this.devicesArray[i].media
          list.push(person)
}
        this.chartPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: list,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  color: function (params) {
                    //自定义颜色
                    var colorList = [
                      '#c23531', '#2f4554', '#7d081a', '#FF8C00', '#FF0000', '#FE8463', '#d48265', '#00FF00', '#a1917c', '#a6b3c4', '#6fa8a3', '#b78638'
                      , '#1015b0', '#bdcd19', '#988117', '#17a879', '#52b299', '#a3218b', '#1fa881', '#429110'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        });
       this.chartPie.off('click')
       this.chartPie.on('click', function(params) {
         that.deviceListArray=[]
         for(var i=0;i<that.devicesList.length;i++){
           if(that.devicesList[i].power==params.data.power&&that.devicesList[i].media==params.data.media){
             that.deviceListArray.splice(i,1,that.devicesList[i]);
           }
         }
         that.currentPage=1
         that.pagination=2
       })
      },
      drawPieChart1() {
        this.chartPie = echarts.init(document.getElementById('chartPie1'));
        this.inintDevice()
        var list=[]
        var that=this
        for(var i=0;i<this.amountList.length;i++){
          var person=new Object();
          person.value=this.amountList[i].amount
          person.name=this.formateFuel(this.amountList[i].power) + this.formateMedium(this.amountList[i].media)
          person.power=this.amountList[i].power
          person.media=this.amountList[i].media
          list.push(person)
        }
        this.chartPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: list,

              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  color: function (params) {
                    //自定义颜色
                    var colorList = [
                      '#c23531', '#2f4554', '#7d081a', '#FF8C00', '#FF0000', '#FE8463', '#d48265', '#00FF00', '#a1917c', '#a6b3c4', '#6fa8a3', '#b78638'
                      , '#1015b0', '#bdcd19', '#988117', '#17a879', '#52b299', '#a3218b', '#1fa881', '#429110'
                    ];
                    return colorList[params.dataIndex]
                  }
                }

              }
            }
          ]
        });
        this.chartPie.off('click')
        this.chartPie.on('click', function(params) {
          that.deviceList=[]
          for(var i=0;i<that.list.length;i++){
            if(that.list[i].power==params.data.power&&that.list[i].media==params.data.media){
             that.deviceList.splice(i,1,that.list[i]);
            }
          }
          that.currentPage1=1
          that.pagination=3
        })
      },
      drawPieChart2() {
        this.chartPie = echarts.init(document.getElementById('chartPie2'));
        var list=[]
        this.inintwechatmedia()
        for(var i=0;i<this.weChatsList.length;i++){

          var person=new Object();
          person.value=this.weChatsList[i].wechatmedia
          person.name=this.formateFuel(this.weChatsList[i].power) + this.formateMedium(this.weChatsList[i].media)
          list.push(person)
        }

        this.chartPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: list,

              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  color: function (params) {
                    //自定义颜色
                    var colorList = [
                      '#c23531', '#2f4554', '#7d081a', '#FF8C00', '#FF0000', '#FE8463', '#d48265', '#00FF00', '#a1917c', '#a6b3c4', '#6fa8a3', '#b78638'
                      , '#1015b0', '#bdcd19', '#988117', '#17a879', '#52b299', '#a3218b', '#1fa881', '#429110'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        });
      },
      drawCharts() {
      },
    }
  }
</script>
<style scoped>
  .loginBox {
    position: fixed;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }

</style>
