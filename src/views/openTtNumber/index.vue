<template>
  <div class="openTtNumber app-container">
    <!-- 开通车站座位数量列表 -->
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box clearFix">
          <div>
            <span>出发站名称:</span>
            <el-input
            v-model="queryList.fromStation"
            placeholder="请输入出发站名称"
            class="input"
            @keyup.enter.native="handleFilter" />
          </div>
          <div>
            <span>到达站名称:</span>
            <el-input
            v-model="queryList.toStation"
            placeholder="请输入到达站名称"
            class="input"
            @keyup.enter.native="handleFilter" />
          </div>
          <div>
              <span>日期:</span>
              <el-date-picker
                  class="input"
                  v-model="queryList.ticketDate"
                  @change="handleFilter"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择日期">
              </el-date-picker>
          </div>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="remove(2)">批量删除</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-plus" @click="newly">新增</el-button>
           <el-button type="primary" icon="el-icon-plus" @click="newly2">批量新增</el-button>
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
      <el-table-column align="center" type="selection" width="50"></el-table-column>
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
      <el-table-column label="坐席" prop="seatLevelName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seatLevelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="ticketDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ticketDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总票数" prop="amount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余票数量" prop="available" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.available }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
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
    <!-- 新增编辑 -->
    <el-dialog 
      title="新增"
      :close-on-click-modal="false"
      :visible.sync="newlyDialog"
      width="80%"
      @close="closeNewly"
      center>
        <el-form label-position="right" ref="ruleForm" label-width="150px" :model="newlyList" class="clearFix">
            <el-form-item label="出发站：" prop="fromStation" style="width: 100%" :rules="[{ required: true, message: '请选择出发站', trigger: 'blur' }]">
                <el-select
                    style="width: 400px"
                    :disabled="disabled"
                    v-model="newlyList.fromStation"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入出发站"
                    :remote-method="querySearch"
                    @change="toInputChange"
                    :loading="fromLoading">
                    <el-option
                    v-for="item in stationList"
                    :key="item.id"
                    :label="item.fromStation"
                    :value="item.fromStation">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="到达站：" prop="toStation" style="width: 100%" :rules="[{ required: true, message: '请选择到达站', trigger: 'blur' }]">
                <el-select
                    style="width: 400px"
                    :disabled="disabled"
                    v-model="newlyList.toStation"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入到达站"
                    :remote-method="querySearch2"
                    :loading="fromLoading"
                    @change="toInputChange">
                    <el-option
                    v-for="item in stationList2"
                    :key="item.id"
                    :label="item.toStation"
                    :value="item.toStation">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="坐席：" prop="seatLevel" style="width: 100%" :rules="[{ required: true, message: '请选择坐席', trigger: 'change' }]">
                <el-select v-model="newlyList.seatLevel" placeholder="请选择坐席" @change="forceUpdate" style="width: 400px" :disabled="disabled">
                    <el-option :label="value.seatLevelName" :value="value.seatLevel" v-for="(value,index) in seatLevel" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期：" prop="ticketDate" :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]" v-if="newlyBl">
               <el-date-picker
                  style="width: 400px"
                  :disabled="disabled"
                  @change="forceUpdate"
                  v-model="newlyList.ticketDate"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="日期：" prop="time" :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]" v-else>
                <el-date-picker
                    style="width: 400px"
                    @change="forceUpdate"
                    :picker-options="pickerOptions"
                    v-model="newlyList.time"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="票数：" prop="number" :rules="[{ required: true, message: '请输入该日期票数', trigger: 'blur' }]">
               <el-input style="width: 400px" v-model="newlyList.number" placeholder="请输入该日期票数" oninput="value=value.replace(/[^0-9]/g,'')" @input="forceUpdate"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="newlyDialog = false">返 回</el-button>
            <el-button type="primary" @click="confirmNewly('ruleForm')" :loading="confirmLoading">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTTStationLineTicketsList, getTTStationLineTicketByStation, addOrUpdateTTStationLineTicketByStation, batchTTStationLineTicketByStation , getByStation , getBySeatLevel , addTTStationLineTicketByStation , deleteByStation } from "@/api/ticket/openTtNumber"
import Pagination from "@/components/Pagination"
export default {
    components: {
        Pagination
    },
    data(){
        const that = this
        return{
          pickerOptions: {
            disabledDate(time) {
                // var a = formatTime(time.getTime(),'yyyy-mm-dd')
                // if(a === '2020-09-01' || a=== '2020-09-02' || a=== '2020-09-04'){
                //     return true
                // }else{
                //     return false
                // }
                // return new Date(t).toDateString() === new Date().toDateString();  // 判断2个时间戳是不是同一天
                return time.getTime() < Date.now() - 8.64e7;
                // return time.getTime() < new Date(that.date).getTime() - 8.64e7;
            }
          },
          data: {
            current_page: 1,
            data: [],
            last_page: 1,
            per_page: 15,
            total: 0,
            link: ""
          },
          loading: false,
          confirmLoading: false,
          newlyDialog: false,
          fromLoading: false,
          newlyBl: false,
          disabled: false,
          newlyList: {
              fromStation: "",
              toStation: "",
              seatLevel: "",
              ticketDate: "",
              number: "",
              time: ""
          },
          stationList: [],
          stationList2: [],
          seatLevel: [],
          queryList: {
              toStation: null,
              fromStation: null,
              ticketDate: ""
          },
          itemArr: []
        }
    },
    created() {
        this.getData()
    },
    mounted(){

    },
    methods: {
        handleSelectionChange(val) {
          this.itemArr = val
        },
        forceUpdate(){
            this.$forceUpdate()
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
              obj.fromStation = v.fromStation
              obj.toStation = v.toStation
              obj.seatLevel = v.seatLevel
              obj.ticketDate = v.ticketDate
              arr.push(obj)
            })
            this.open('确定批量删除？' , arr)
          }else{
            var obj = {}
            obj.fromStation = item.fromStation
            obj.toStation = item.toStation
            obj.seatLevel = item.seatLevel
            obj.ticketDate = item.ticketDate
            this.open('确定删除？' , [obj])
          }
        },
        open(text,arr) {
            this.$confirm( text , '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true
              deleteByStation({ttStationLineTicketsDataList: arr}).then(res=>{
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
        confirmNewly(formName){
         this.$refs[formName].validate(valid => {
            if (valid) {
                if(this.newlyList.time && this.newlyList.time[0] && this.newlyList.time[1]){
                    // "fromStation":"广州南",
                    // "toStation":"北京西",
                    // "seatLevel":"yz",  //席别
                    // "startDate":"2020-10-16",
                    // "endDate":"2020-10-18",
                    // "number":90
                    var obj = {}
                    obj.fromStation = this.newlyList.fromStation
                    obj.toStation = this.newlyList.toStation
                    obj.seatLevel = this.newlyList.seatLevel
                    obj.number = this.newlyList.number
                    obj.startDate = this.newlyList.time[0]
                    obj.endDate = this.newlyList.time[1]
                    batchTTStationLineTicketByStation(obj).then(res=>{
                        this.confirmLoading = false
                        if(res.code == 200){
                            this.newlyDialog = false
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
                    }).catch(err=>{
                        this.confirmLoading = false
                    })
                }else{
                    addTTStationLineTicketByStation(this.newlyList).then(res=>{
                        this.confirmLoading = false
                        if(res.code == 200){
                            this.newlyDialog = false
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
                    }).catch(err=>{
                        this.confirmLoading = false
                    })
                }
            }
         })
        },
        newly(){
            this.disabled = false
            this.newlyDialog = true
            this.newlyBl = true
        },
        newly2(){
            this.disabled = false
            this.newlyDialog = true
            this.newlyBl = false
        },
        querySearch(queryString) {
            if(queryString !== ''){
                this.fromLoading = true
                getByStation({fromStation: queryString}).then(res=>{
                    this.fromLoading = false
                    this.stationList = res.data
                })
            }else{
                this.stationList = []
            }
        },
        querySearch2(queryString) {
            if(queryString !== ''){
                this.fromLoading = true
                getByStation({toStation: queryString}).then(res=>{
                    this.fromLoading = false
                    this.stationList2 = res.data
                })
            }else{
                this.stationList2 = []
            }
        },
        toInputChange(){
            if(this.newlyList.fromStation && this.newlyList.toStation){
                getBySeatLevel({
                    fromStation: this.newlyList.fromStation,
                    toStation: this.newlyList.toStation
                }).then(res=>{
                    if(res.code == 200 && res.data && res.data.length>0){
                        this.seatLevel = res.data
                    }else{
                        this.$message("暂无该开通车站座位信息，请先去前往开通车站列表配置该车站座位价格")
                        this.newlyList.seatLevel = ""
                        this.seatLevel = []
                    }
                })
            }
        },
        compile(item){
          this.disabled = true
          this.newlyDialog = true
          this.newlyBl = true
        //   this.querySearch(item.fromStation)
        //   this.querySearch2(item.toStation)
          this.newlyList.fromStation = item.fromStation
          this.newlyList.toStation = item.toStation
          this.newlyList.seatLevel = item.seatLevel
          this.newlyList.ticketDate = item.ticketDate
          this.newlyList.number = item.amount   
          this.toInputChange()
        },
        closeNewly(){
            this.$refs['ruleForm'].resetFields();
            // this.newlyList = {
            //     fromStation: "",
            //     toStation: "",
            //     seatLevel: "",
            //     ticketDate: "",
            //     number: ""
            // }
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
            if (queryList.ticketDate) {
                data.ticketDate = queryList.ticketDate
            }
            if (filter && this.data.current_page > 1) {
                data.page = this.data.current_page;
            } else {
                this.data.current_page = 1;
            }
            data.pageNum = this.data.current_page
            data.pageSize = this.data.per_page
            getTTStationLineTicketsList(data).then(res=>{
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
                fromStation: null,
                toStation: null,
                ticketDate: ""
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
.explain_text{
  font-size: 17px;
  text-align: center;
  color: #f00;
  margin: 10px;
}
.text_box{
  width: 100%;
  text-align: center;
  font-size: 25px;
  font-weight: 600;
  margin: 10px auto;
}
.input_box_dialog{
  margin-left: 20px;
  width: 200px;
}
.dialog_box{
  .input_box{
    margin-left: 20px;
    width: 200px;
  }
  >div{
     position: relative;
     margin-bottom: 30px;
  }
  .button{
    position: absolute;
    bottom: 0;
    left: 540px;
  }
  .seat_text{
      font-weight: bold;
      font-size: 18px;
      margin: 12px 0;
      >span{
        font-size: 14px;
        color: #f00;
        font-weight: 500;
      }
  }
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
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
