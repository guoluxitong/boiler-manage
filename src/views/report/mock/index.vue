<template>
<div>
    <div v-if="showReport==0">
      <el-row class="app-query">
        <el-col :span="3">
          <el-select clearable v-model="product.customerId" placeholder="客户名称">
            <el-option
              style="width: 130px"
              v-for="item in customerList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select clearable v-model="product.categoryId" placeholder="锅炉型号">
            <el-option
              style="width: 130px"
              v-for="item in boilerModelNumberArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2.5">
          <el-select clearable style="width: 150px" v-model="product.power" placeholder="燃料">
            <el-option
              style="width: 130px"
              v-for="item in fuelArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2.5">
          <el-select clearable style="width: 150px" v-model="product.media" placeholder="介质">
            <el-option
              style="width: 130px"
              v-for="item in mediumArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2.5">
          <el-input v-model="product.boilerNo" placeholder="锅炉编号" style="width: 130px"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="selectDevice">查询</el-button>
        </el-col>
      </el-row>
      <!--数据展示-->
      <el-table
        :data="list.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        border
        fit
        highlight-current-row
        style="width: 120%"
        @row-contextmenu="openTableMenu"
        @row-dblclick="openTableMenu"
      >
        <el-table-column :show-overflow-tooltip="true" align="left" label="锅炉编号">
          <template slot-scope="scope">
            <span>{{scope.row.boilerNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="锅炉型号">
          <template slot-scope="scope">
            <span>{{scope.row.productCategoryId | dictionaryValueFieldFilter(boilerModelNumberArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="控制器编号">
          <template slot-scope="scope">
            <span>{{scope.row.controllerNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
          <template slot-scope="scope">
            <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="介质">
          <template slot-scope="scope">
            <span>{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="客户">
          <template slot-scope="scope">
            <span v-if="scope.row.customerName">{{scope.row.customerName}}</span>
            <span v-if="scope.row.customerName==null">无</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="售出地址">
          <template slot-scope="scope">
            <span>{{scope.row.street}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
                <el-tooltip :disabled="isShowTooltip" content="运行信息" placement="top" effect="dark" >
                    <el-button v-if="scope.row.device!=true"
                      circle
                      icon="el-icon-view"
                      type="success"
                      @click="selectReport(scope.$index, scope.row)"
                    ></el-button>
                </el-tooltip>
                <el-tooltip :disabled="isShowTooltip" content="故障报警" placement="top" effect="dark" >
                  <el-button v-if="scope.row.device!=true"
                             circle
                             icon="el-icon-view"
                             type="danger"
                             @click="selectReport2(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
      <menu-context ref="menuContext">
        <menu-context-item @click="exportData">导出数据</menu-context-item>

      </menu-context>
      <!--分页-->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[5]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.length"
        ></el-pagination>
      </div>
    </div>
    <div v-if="showReport==1">
      <data-mock-report v-show="reportShow" @back="back" :boiler="boiler" server="https://apis.sdcsoft.com.cn"></data-mock-report>
    </div>
    <div v-if="showReport==2">
      <data-expection-report1 v-show="reportShow" :deviceNo="deviceNo" @back="back" :boilers="boiler" server="https://apis.sdcsoft.com.cn"></data-expection-report1>
    </div>

  <el-dialog
    title="导出数据"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="back1">
    <el-date-picker
      type="date"
      placeholder="选择查询起始日期"
      v-model="exportDataArray.begintime"
      style="width: 100%;margin-top: 20px"
    ></el-date-picker>

    <el-date-picker
      type="date"
      placeholder="选择查询结束日期"
      v-model="exportDataArray.endtime"
      style="width: 100%;margin-top: 20px"
    ></el-date-picker>
    <el-row style="width: 100%;margin-top: 20px">
      <el-col :offset="11"  :span="4">

        <el-button type="primary" @click="confirmExportData">确认</el-button>

      </el-col>
    </el-row>

  </el-dialog>
</div>
</template>
<script>
  import {findSoldProduct} from "@/api/product";
  import {exportData} from "@/api/exportdata";
  import contextmenu from "@/components/ContextMenu";
  import {getProductCategoryList} from "@/api/productCategory";
  import {getList} from "@/api/customer";
  import { formatDateTime } from "@/utils/date";
  import {initMedium, initFuel} from "./device-dictionary";
  import dataMockReport from "@sdcsoft/components/components/data-report/device/mock/days";
  import dataExpectionReport1 from "@sdcsoft/components/components/data-report/device/exception/days/index";

  function dictionaryValueFilter(dictionaryValue, value) {
    const dictionaryValueItem = dictionaryValue.filter(item =>  item.value == value);
    if (dictionaryValueItem[0])
      return dictionaryValueItem[0].label;
    return '';
  }

  export default {
    name: "mock-view",
    components: {
      "data-mock-report": dataMockReport,
      "data-expection-report1": dataExpectionReport1,
      contextmenu
    },
    data() {
      return {
        dialogVisible:false,
        exportDataArray:{
          deviceNo:null,
          begintime:null,
          endtime:null,
          newframe:0,
        },
        boiler: null,
        isShowTooltip:false,
        seen:false,
        current:0,
        list: [],
        showReport: 0,
        reportShow: false,
        currentPage1: 1,
        pageNum1: 1,
        pageSize1: 5,
        listLoading: false,
        customerList: [],
        boilerModelNumberArray: [],
        mediumArray: [],
        fuelArray: [],
        listQuery: {
          total: 500,
          pageNum: 1,
          pageSize: 50
        },
        deviceNo:null,
        product: {
          total: 50,
          pageNum: 1,
          pageSize: 5,
          boilerNo: "",
          saleDate: null,
          controllerNo: "",
          customerId: null,
          boilerModelNumber: null,
          categoryId: null,
          media: null,
          power: null,
          userId: null,
          isSell: null,
          productCategoryName: ""
        }
      };
    },
    filters: {
      dictionaryValueFieldFilter(value, dictionaryValueArray) {
          return dictionaryValueFilter(dictionaryValueArray, value)
      }
    },
    created() {
      Promise.all([this.initSelect()]).then(() => {
        this.getDeviceList();
      });
    },
    methods: {
      exportData(row){
        this.exportDataArray.deviceNo=row.controllerNo
        this.dialogVisible = true;
      },
      confirmExportData(){
        this.exportDataArray.begintime = formatDateTime(
          new Date(this.exportDataArray.begintime),
          "yyyy-MM-dd"
        );
        this.exportDataArray.endtime = formatDateTime(
          new Date(this.exportDataArray.endtime),
          "yyyy-MM-dd"
        );
        let url="http://apis.sdcsoft.com.cn/webapi/report/device/excel?deviceNo="+this.exportDataArray.deviceNo+"&begintime="+this.exportDataArray.begintime+"&endtime="+this.exportDataArray.endtime+"&newframe=0"
        window.open(url)
        this.dialogVisible=false

      },

      openTableMenu(row, event) {
        this.$refs.menuContext.openTableMenu(
          row,
          event,
          window.event.clientX,
          window.event.clientY
        );
      },
      onMouseenter(index){
        this.isShowTooltip=true
        this.current=index
      },
      onMouseleave(){
        this.isShowTooltip=false
      },
      back(){
        this.showReport = 0
        this.reportShow = false
      },
      back1(){
        this.dialogVisible = false
      },
      selectDevice() {
        this.getDeviceList()
      },
      getDeviceList() {
        findSoldProduct(this.product).then(response => {
          if (response.data.code) {
            this.$message.error(response.data.msg)
            return
          }
          this.list= response.data.data
          for(var i=0;i<this.list.length;i++){
            if(!this.list[i].controllerNo){
              this.list[i].device=true
            }
          }
          this.listLoading = false;
        }).catch(reason => {
          this.$message.error(reason)
        })
      },
      selectReport(index, row) {
        this.showReport = 1;
        this.reportShow = true
        this.boiler = {
          categoryName: dictionaryValueFilter( this.boilerModelNumberArray,row.productCategoryId),
          boilerNo: row.boilerNo,
          controllerNo: row.controllerNo,
          power: dictionaryValueFilter( this.fuelArray,row.power),
          media: dictionaryValueFilter( this.mediumArray,row.media),
          customerName: row.customerName
        }
      },
      selectReport2(index, row) {

        this.deviceNo=row.controllerNo
        this.showReport = 2;
        this.reportShow = true
        this.boiler = {
          categoryName: dictionaryValueFilter( this.boilerModelNumberArray,row.productCategoryId),
          boilerNo: row.boilerNo,
          controllerNo: row.controllerNo,
          power: dictionaryValueFilter( this.fuelArray,row.power),
          media: dictionaryValueFilter( this.mediumArray,row.media),
          customerName: row.customerName
        }
      },
      initSelect() {
        getProductCategoryList().then(data => {
          this.boilerModelNumberArray = this.getAuxiliaryMachineAboutOptions(
            data.data.data
          );
        });
        getList(this.listQuery).then(response => {
          this.customerList = this.getcustomerListOptions(
            response.data.data.list
          );
        });
        initMedium().then(data => {
          this.mediumArray = data;
        });
        initFuel().then(data => {
          this.fuelArray = data;
        });
      },
      getcustomerListOptions(dataList) {
        let options = [];
        dataList.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          options.push(optionItem);
        });
        return options;
      },
      getAuxiliaryMachineAboutOptions(dataList) {
        let options = [];
        dataList.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          options.push(optionItem);
        });
        return options;
      },
      handleSizeChange1: function (pageSize) {
        this.pageSize1 = pageSize;
        this.handleCurrentChange1(this.currentPage);
      },
      handleCurrentChange1: function (currentPage) {
        //页码切换
        this.currentPage1 = currentPage;
      }
    }
  };
</script>

