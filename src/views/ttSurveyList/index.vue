<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box clearFix">
          <div>
            <span>出发站:</span>
            <el-input
            v-model="queryList.fromStation"
            placeholder="请输入出发站"
            class="input"
            @keyup.enter.native="handleFilter"
            style="margin-left: 18px;" />
          </div>
          <div>
            <span>到达站:</span>
            <el-input
            v-model="queryList.toStation"
            placeholder="请输入到达站"
            class="input"
            @keyup.enter.native="handleFilter"
            style="margin-left: 18px;" />
          </div>
          <div>
              <span>渠道:</span>
              <el-select v-model="queryList.channel" @change="getData" class="input" placeholder="请选择渠道">
                    <el-option
                    v-for="item in channelList"
                    :label="item.channel"
                    :value="item.channel"
                    :key="item.channel"
                    ></el-option>
              </el-select>
          </div>
       </div>
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" icon="el-icon-refresh-right" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      style="width: 100%;">
      <el-table-column width="70" label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="出发站" prop="fromStation" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fromStation }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="到达站" prop="toStation" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.toStation }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="渠道名称" prop="channel" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计出发日期一" prop="bookingDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookingDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计出发日期二" prop="bookingDate2" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookingDate2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="座席" prop="seatLevelCopy" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seatLevelCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="quantity" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="created" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />
  </div>
</template>

<script>
import { ttSurveyList , ttSurveyChannel , exportTTSurveyList } from "@/api/ticket/ttSurveyList"
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
import axios from 'axios'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      channelList: [],
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        fromStation: "",
        toStation: "",
        channel: null
      }
    }
  },
  created() {
    this.getData()
    this.getChannelList()
  },
  methods: {
    getChannelList(){
        ttSurveyChannel().then(res=>{
            if(res.code == 200){
                this.channelList = res.data
            }
        })
    },
    exportForm(){
        var obj = {}
       if(this.queryList.fromStation){
        obj.fromStation = this.queryList.fromStation
       }
       if(this.queryList.toStation){
         obj.toStation = this.queryList.toStation
       }
       if(this.queryList.channel){
        obj.channel = this.queryList.channel
       }
        axios({
            url: `${baseUrl}/tt/survey/exportTTSurveyList`, // 请求路径
            responseType: 'blob', // 表明返回服务器返回的数据类型
            method: 'post',  // 请求方式
            data: obj
      }).then(res=>{  // 请求成功之后
          //创建一个隐藏的a连接，
          const link = document.createElement('a');
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});  // 文件流处理
          link.style.display = 'none';  // 去除a标签的样式
          //设置连接
          link.href = URL.createObjectURL(blob);
          link.download = '自定义文件名';  
          document.body.appendChild(link);
          //模拟点击事件
          link.click();
       })
      //  exportTTOrderList({
      //    bookingDate: this.queryList.bookingDate,
      //    fromStation: this.queryList.fromStation,
      //    toStation: this.queryList.toStation
      //  }).then(res=>{
      //     //创建一个隐藏的a连接，
      //     const link = document.createElement('a');
      //     let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
      //     link.style.display = 'none';
      //     //设置连接
      //     link.href = URL.createObjectURL(blob);
      //     link.download = '自定义文件名'; 
      //     document.body.appendChild(link);
      //     //模拟点击事件
      //     link.click();
      //  })
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.fromStation) {
        data.fromStation = queryList.fromStation
      }
      if (queryList.toStation) {
        data.toStation = queryList.toStation
      }
      if(!(queryList.channel == null)){
        data.channel = queryList.channel
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      ttSurveyList(data).then(res=>{
        // console.log(res);
        this.loading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.data = {
            current_page: 1,
            data: [],
            last_page: 1,
            per_page: 15,
            total: 0,
            link: ""
          }
        }
        if( res.data && res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            if(v.seatLevel ==1){
                v.seatLevelCopy = "硬座"
            }else if(v.seatLevel == 2){
                v.seatLevelCopy = "软座"
            }else if(v.seatLevel == 3){
                v.seatLevelCopy = "硬卧"
            }else if(v.seatLevel == 4){
                v.seatLevelCopy = "软卧"
            }else if(v.seatLevel == 11){
                v.seatLevelCopy = "二等座"
            }else if(v.seatLevel == 12){
                v.seatLevelCopy = "一等座"
            }else if(v.seatLevel == 13){
                v.seatLevelCopy = "特等座"
            }else if(v.seatLevel == 14){
                v.seatLevelCopy = "商务座"
            }else if(v.seatLevel == 15){
                v.seatLevelCopy = "动卧"
            }
          })
        }
      })
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        fromStation: "",
        toStation: "",
        channel: null
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
  }
}
</script>

<style lang="less" scoped>
.upload-demo {
  text-align: center;
  padding: 0 100px;
}
.status{
  display: flex;
  align-items: center;
}
/deep/.el-date-editor .el-range-input{
  width: auto;
}
.el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
.title{
  font-size: 18px;
  font-weight: 600;
}
/deep/.el-dialog__header{
  background: #f8f8f8;
}
/deep/.el-divider--horizontal{
  margin: 0;
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
}
.input{
  width: 200px;
  margin-left: 6px;
  margin-top: 10px;
}
.picker{
  width: 360px;
  margin-left: 6px;
  margin-top: 10px;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}
/deep/.el-table .warning-row {
    background: oldlace;
  }

/deep/.el-table .success-row {
    background: #f0f9eb;
}
.center{
  display: block;
  align-items: center;
  display: flex;
  justify-content: center;
}
.input_box{
    >div{
        float: left;
        >span{
            margin-left: 25px;
            color: #666;
            font-size: 15px;
        }
    }
}
/deep/.el-form-item{
  float: left;
}
.clearFix::before,
.clearFix::after{
      content: "";
      display: block;
      visibility: hidden;
      height: 0;
      line-height: 0;
      clear: both;
}
</style>
