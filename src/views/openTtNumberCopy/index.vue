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
            @keyup.enter.native="handleFilter"
            style="margin-left: 18px;" />
          </div>
          <div>
            <span>到达站名称:</span>
            <el-input
            v-model="queryList.toStation"
            placeholder="请输入到达站名称"
            class="input"
            @keyup.enter.native="handleFilter"
            style="margin-left: 18px;" />
          </div>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
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
      <!-- <el-table-column label="总票数" prop="amount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余票数量" prop="available" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.available }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="compile(scope.row)">编辑座位票数</el-button>
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
      :visible.sync="numberDialog"
      width="80%"
      @close="closeDialog"
      center>
      <el-dialog
        width="50%"
        title="批量操作"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        center
        append-to-body>
        <el-select v-model="dialogObj.seatLevel" placeholder="请选择坐席">
          <el-option
            v-for="item in seatList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="dialogObj.time"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input class="input_box_dialog" v-model="dialogObj.number" placeholder="请输入该段日期每日票数" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchAddSubmit">确定提交</el-button>
        </span>
      </el-dialog>
      <div class="text_box">{{ fromStation }} - {{ toStation }}</div>
      <div class="explain_text" v-if="blText">暂无该开通车站座位信息，请先去前往开通车站列表配置该车站座位价格~~</div>
      <el-button type="primary" v-if="!blText" @click="batchAdd(dialogList)">批量操作</el-button>
      <div class="dialog_box">
          <div v-for="(value,index) in dialogList" :key="index" v-show="value.price != 0">
              <div class="seat_text">{{ value.seatLevelName }} <span>{{ value.price }} 元</span></div>
              <div v-for="(item,idx) in value.properties" :key="idx" style="margin-top: 10px">
                <el-date-picker
                  class="input_box"
                  v-model="item.date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
                <el-input class="input_box" v-model="item.number" placeholder="请输入该日期票数" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                <el-button type="danger" icon="el-icon-delete" circle @click="iconDelete(idx, value.seatLevel)"></el-button>
              </div>
              <el-button type="primary" class="button" @click="addProperties(value.seatLevel)">添加</el-button>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="numberDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="itemDialog">确定提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTTStationLineTicketsList, getTTStationLineTicketByStation, addOrUpdateTTStationLineTicketByStation, batchTTStationLineTicketByStation } from "@/api/ticket/openTtNumber"
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
          numberDialog: false,
          loadingBootm: false,
          innerVisible: false,
          blText: false,
          dialogObj: {},
          dialogTitle: "编辑座位对应日期的票数",
          queryList: {
              toStation: null,
              fromStation: null
          },
          dialogList: [],
          seatList: [],
          toStation: "",
          fromStation: ""
        }
    },
    created() {
        this.getData()
    },
    mounted(){

    },
    methods: {
        batchAddSubmit(){
          if(!this.dialogObj.seatLevel){
            this.$message("请选择坐席！")
            return
          }
          if(!this.dialogObj.time){
            this.$message("请选择时间段！")
            return
          }
          if(!this.dialogObj.number){
            this.$message("请输入该段日期每日票数！")
            return
          }
          var obj = {}
          obj.toStation = this.toStation
          obj.fromStation = this.fromStation
          obj.startDate = this.dialogObj.time[0]
          obj.endDate = this.dialogObj.time[1]
          obj.number = this.dialogObj.number
          obj.seatLevel = this.dialogObj.seatLevel
          batchTTStationLineTicketByStation(obj).then(res=>{
            if(res.code == 200){
              this.innerVisible = false
              this.$message({
                message: "提交成功！",
                type: "success"
              })
              this.compile({
                toStation: obj.toStation,
                fromStation: obj.fromStation
              })
            }else{
              this.$message(res.msg)
            }
          })
        },
        batchAdd(item){
          this.innerVisible = true
          let list = item.filter(v=>{
            return v.price != 0
          })
          var arr = []
          list.forEach(t=>{
            var obj = {}
            obj.label = t.seatLevelName
            obj.value = t.seatLevel
            arr.push(obj)
          })
          this.seatList = arr
        },
        itemDialog(){
          addOrUpdateTTStationLineTicketByStation(this.dialogList).then(res=>{
            if(res.code == 200){
              this.numberDialog = false
              this.$message({
                message: "提交成功！",
                type: "success"
              })
              this.getData()
            }else{
              this.$message(res.msg)
            }
          })
        },
        addProperties(seatLevel){
          this.dialogList.map(v=>{
            if(v.seatLevel === seatLevel){
               var obj = {
                  date: "",
                  number: ""
               }
               v.properties.push(obj)
            }
          })
        },
        iconDelete(itemIndex, seatLevel){
          // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          //   });
          // }).catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });          
          // });
          var list = this.dialogList
          list.filter(v=>{
            if(v.seatLevel === seatLevel){
              v.properties.splice(itemIndex, 1)
            }
            return v
          })
        },
        compile(item){
          this.fromStation = item.fromStation
          this.toStation = item.toStation
            getTTStationLineTicketByStation({
                fromStation: item.fromStation,
                toStation: item.toStation
            }).then(res=>{
                if(res.code == 200 && res.data){
                    this.dialogList = res.data
                    let listBl = res.data.filter(v=>{
                      return v.price != 0
                    })
                    if(listBl.length === 0){
                      this.blText = true
                    }else{
                      this.blText = false
                    }
                }else{
                    this.$message(res.msg)
                }
            })
            this.numberDialog = true
        },
        closeDialog(){

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
                toStation: null
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
