<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.startName"
          placeholder="请输入起点站名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.endName"
          placeholder="请输入终点站名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <!-- <el-select v-model="queryList.province" @change="getDataProvince" class="input fl" placeholder="请选择省份">
            <el-option
              v-for="item in areaJson"
              :label="item.province"
              :value="item.provinceid"
              :key="item.provinceid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.city" @change="getDataCity" class="input fl" placeholder="请选择城市">
            <el-option
              v-for="item in cityListJson"
              :label="item.city"
              :value="item.cityid"
              :key="item.cityid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.region" @change="getData" class="input fl" placeholder="请选择区/县">
            <el-option
              v-for="item in regionListJson"
              :label="item.area"
              :value="item.areaid"
              :key="item.areaid"
            ></el-option>
          </el-select> -->
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="remove(2)">批量删除</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" @click="newly">新增</el-button>
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
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column>
     <el-table-column width="70" label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="起点站名称" prop="startName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终点站名称" prop="endName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="compile(scope.row)" :loading="itemLoading">编辑</el-button>
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

    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editNewlyDialog"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="起点站名称：" prop="starting" style="width: 100%" v-if="!(starting && terminal)">
                <el-select v-model="itemObj.starting" placeholder="请选择起点站名称" filterable clearable style="width: 400px;" @change="originChange">
                    <el-option :label="value.name" :value="value.name" v-for="(value,index) in ttList" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终点站名称：" prop="terminal" style="width: 100%" v-if="!(starting && terminal)">
                  <el-select v-model="itemObj.terminal" placeholder="请选择终点站名称" filterable clearable style="width: 400px;" @change="forUpdate">
                    <el-option :label="value.name" :value="value.name" v-for="(value,index) in destinationList" :key="index"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="起点站名称：" style="width: 100%" v-if="starting && terminal">
                  <div style="font-size: 18px;font-weight: 600;">{{starting}}</div>
              </el-form-item>
              <el-form-item label="终点站名称：" style="width: 100%" v-if="starting && terminal">
                  <div style="font-size: 18px;font-weight: 600;">{{terminal}}</div>
              </el-form-item>
              <el-form-item label="坐席及价格填写：" prop="priceSeatLealList" style="width: 100%">
                  <el-checkbox-group v-model="itemObj.priceSeatLealList">
                    <div class="checkbox_box" v-for="(value,index) in seatList" :key="index">
                        <el-checkbox :label="value.id" :name="value.id" class="checkbox">{{ value.value }}</el-checkbox>
                        <el-input placeholder="请输入价格" v-model="value.price" class="checkbox_input" @input="forceUpdate" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    </div>
                  </el-checkbox-group>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNewlyDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTTTicketPriceList, getTTStationByIdNotIn, addTTTicketPrice, delTTTicketByStationId, getTTicketPriceById, updTTTicketByStationId } from '@/api/ticket/stationPrice'
import Pagination from "@/components/Pagination"
import { getTTStation } from "@/api/ticket/ticketService"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      starting: "",
      terminal: "",
      dialogTitle: "",
      itemLoading: false,
      disabledCity: false,
      editNewlyDialog: false,
      loadingBootm: false,
      loading: false,
      itemArr: [],
      itemObj: {
          priceSeatLealList: [],
          terminal: ""
      },
      rules: {
          starting: [
            { required: true, message: '请输入车站名称', trigger: 'change' }
          ],
          terminal: [
            { required: true, message: '请输入车站名称', trigger: 'change' }
          ],
          priceSeatLealList: [
            { type: 'array', required: true, message: '请选择坐席', trigger: 'change' }
          ]
      },
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        endName: null,
        startName: null
      },
      ttList: [],
      destinationList: [],
      seatList: [ 
          {
              value: "硬座",
              id: '1',
              price: ""
          },
          {
              value: "软座",
              id: '2',
              price: ""
          },
          {
              value: "硬卧",
              id: '3',
              price: ""
          },
          {
              value: "软卧",
              id: '4',
              price: ""
          },
          {
              value: "二等座",
              id: '11',
              price: ""
          },
          {
              value: "一等座",
              id: '12',
              price: ""
          },
          {
              value: "特等座",
              id: '13',
              price: ""
          },
          {
              value: "商务座",
              id: '14',
              price: ""
          }
      ]
    }
  },
  created() {
    this.getData()
    this.apiGetTTStation()
  },
  methods: {
    apiGetTTStation(){
        getTTStation().then(res=>{
            if(res.code == 200){
                this.ttList = res.data
            }
        })
    },
    originChange(){
        getTTStationByIdNotIn({name: this.itemObj.starting}).then(res=>{
            this.destinationList = res.data
            this.itemObj.terminal = ""
        })
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    itemDialog(){
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            var priceSeatLealList = []
            this.itemObj.priceSeatLealList.forEach(v=>{
              this.seatList.forEach(i=>{
                if(v === i.id){
                  var obj = {
                    seatLevel: v,
                    price: i.price
                  }
                  priceSeatLealList.push(obj)
                }
              })
            })
            var data = {}
            data.priceSeatLealList = priceSeatLealList
            if(this.itemObj.id){
              data.starting = this.starting
              data.terminal = this.terminal
              updTTTicketByStationId(data).then(res=>{
                if(res.code == 200){
                    this.$message({
                      type: "success",
                      message: "新增成功！"
                    })
                    this.editNewlyDialog = false
                  }else{
                    this.$message(res.msg)
                  }
              })
            }else{
               data.starting =  this.itemObj.starting
               data.terminal =  this.itemObj.terminal
                addTTTicketPrice(data).then(res=>{
                  if(res.code == 200){
                    this.$message({
                      type: "success",
                      message: "新增成功！"
                    })
                    this.editNewlyDialog = false
                  }else{
                    this.$message(res.msg)
                  }
                })
            }
          }
        })
    },
    remove(item){
      if(item === 2){
        if(this.itemArr.length == 0){
          this.$message({
            type: 'info',
            message: '请选择数据！'
          })
          return
        }
        var arr = []
        this.itemArr.forEach(v=>{
          var obj = {}
          obj.id = v.startName
          obj.eid = v.endName
          arr.push(obj)
        })
        this.open('确定批量删除？' , arr)
      }else{
        var obj = {
          id: item.startName,
          eid: item.endName
        }
        this.open('确定删除？' , [obj])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delTTTicketByStationId({ids: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.startName) {
        data.startName = queryList.startName
      }
      if (queryList.endName) {
        data.endName = queryList.endName
      }
      // if(!(queryList.usetypeid == null)){
      //   data.usetypeid = queryList.usetypeid
      // }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      getTTTicketPriceList(data).then(res=>{
        // this.data = res;
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
          // console.log(res);
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
        }
      })
    },
    close(){
      this.itemObj = {
        priceSeatLealList: [],
        terminal: ""
      }
      this.seatList.map(v=>{
        v.price = ""
      })
      this.$refs['ruleForm'].resetFields()
      this.starting = ""
      this.terminal = ""
      this.loadingBootm = false
      this.getData()
    },
    newly(){
        this.editNewlyDialog = true
        this.dialogTitle = "新增车站"
    },
    compile(item){
        this.itemLoading = true
        var data = {}
        data.id = item.id
        // data.eid = item.eid
        this.starting = item.startName
        this.terminal = item.endName
        getTTicketPriceById({
          startName: item.startName,
          endName: item.endName
        }).then(res=>{
          if(res.code == 200){
              var arr = []
              res.data.forEach(v=>{
                  var id = String(v.seatLevel)
                  arr.push(id)
              })
              this.seatList.map(i=>{
                res.data.forEach(v=>{
                  if(v.seatLevel == i.id){
                    i.price = v.price
                  }
                })
              })
              data.priceSeatLealList = arr
              this.itemObj = data
              this.editNewlyDialog = true
              this.dialogTitle = "编辑车站"
              this.itemLoading = false
          }else{
            this.itemLoading = false
            this.$message(res.msg)
          }
        })
    },
    handleFilter(){
      this.getData()
    },
    forceUpdate(){
        this.$forceUpdate()
    },
    forUpdate(){
      this.$forceUpdate()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        endName: null,
        startName: null
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
.checkbox_box{
    display: flex;
    align-items: center;
    margin-top: 10px;
    .checkbox{
        width: 90px;
    }
    .checkbox_input{
        width: 200px;
    }
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
  margin-left:20px;
  margin-top: 10px;
}
.picker{
  width: 250px;
  margin-left:20px;
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
// .fl{
//   float: left;
//   }
// .fr{
//   float: right;
//   }
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
.boxUpload{   
    .textUp{
      position: relative;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4.5%;
      margin-top: 3%;
      margin-left: 3%;
      .uploadTransparency{
          display: block;
          width: 150px;
          height: 100px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
        }
      .text{
        margin-top: 5px;
      }
      .btn{
        margin-top: 3px;
      }
    }
}
.avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
.avatar {
   width: 148px;
   height: 148px;
   border-radius: 4px;
   cursor: pointer;
 }
</style>
