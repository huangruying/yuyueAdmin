<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box clearFix">
          <div>
            <span>订单 ID:</span>
            <el-input
            v-model="queryList.orderno"
            placeholder="请输入订单ID"
            class="input"
            @keyup.enter.native="handleFilter"
            style="margin-left: 18px;" />
          </div>
          <div>
              <span>出发日期:</span>
              <el-date-picker
                    class="picker"
                    v-model="queryList.time"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getData"
                ></el-date-picker>
                <!-- :default-time="['00:00:00', '23:59:59']"  -->
          </div>
          <div>
              <span>订单状态:</span>
              <el-select v-model="queryList.status" @change="getData" class="input" placeholder="请选择订单状态">
                    <el-option
                    v-for="item in statusList"
                    :label="item.value"
                    :value="item.id"
                    :key="item.id"
                    ></el-option>
              </el-select>
          </div>
          <div>
              <span>订单类别:</span>
              <el-select v-model="queryList.needBack" @change="getData" class="input" placeholder="请选择订单类别">
                    <el-option
                    v-for="item in statusClass"
                    :label="item.value"
                    :value="item.id"
                    :key="item.id"
                    ></el-option>
              </el-select>
          </div>
       </div>
      <!-- <div style="padding-top: 25px;"><el-divider content-position="left"><span class="title">导出筛选</span></el-divider></div> -->
      <div class="query">
        <div class="input_box clearFix">
          <div>
              <span>出发站:</span>
             <el-select v-model="queryList.fromStation" class="input" placeholder="请选择出发站" @change="handleFilter">
              <el-option
                v-for="item in fromStationList"
                :key="item.fromStation"
                :label="item.fromStation"
                :value="item.fromStation">
              </el-option>
            </el-select>
            </div>
            <div>
              <span>到达站:</span>
              <el-select v-model="queryList.toStation" class="input" placeholder="请选择到达站" @change="handleFilter">
              <el-option
                v-for="item in toStationList"
                :key="item.toStation"
                :label="item.toStation"
                :value="item.toStation">
              </el-option>
            </el-select>
            </div>
            <div>
                <span>导出出发日期:</span>
                <el-select v-model="queryList.bookingDate" class="input" placeholder="请选择出发日期" @change="getData">
                  <el-option
                    v-for="item in ticketDateList"
                    :key="item.ticketDate"
                    :label="item.ticketDate"
                    :value="item.ticketDate">
                  </el-option>
                </el-select>
            </div>
        </div>
      </div> 
       <div class="btn_box">
         <div>

           <!-- <el-button type="primary" @click="alterStatus">修改订单状态</el-button> -->
           <el-button type="danger" @click="reimburse(2)">批量退款</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" icon="el-icon-refresh-right" @click="reset">重置</el-button>
         </div>
         <div>
           <!-- <el-button type="primary" icon="el-icon-download" @click="exportForm">导出</el-button> -->
           <el-button type="primary" icon="el-icon-upload2" @click="toLead">导入</el-button>
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
      <el-table-column label="订单ID" prop="orderno" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderno }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="下单时间" prop="created" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发日期" prop="booking_date" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.booking_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订票数" prop="quantity" align="center" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发站" prop="from_station" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.from_station }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到达站" prop="to_station" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.to_station }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="去程车次" prop="code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template> 
      </el-table-column>
      <el-table-column label="返程车次" prop="dack_code" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dack_code }}</span>
        </template> 
      </el-table-column> -->
      <el-table-column label="座席" prop="seat_levelCopy" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.seat_levelCopy }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="专用安检通道" prop="need_quick" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.need_quick }}</span>
        </template>
      </el-table-column>
      <el-table-column label="候车定制" prop="need_waiting" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.need_waiting }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="联系人" prop="user_id" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone" align="center" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="下单价" prop="amount" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出票价" prop="realPrice" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.realPrice }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="订单类别" prop="need_back" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.need_back }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单状态" prop="status" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="reimburse(scope.row)" v-if="!(scope.row.status === '已退款')">退款</el-button>
          <el-button size="mini" type="primary" @click="lookData(scope.row)">查看</el-button>
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

    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="150px" :model="itemList" class="clearFix">
              <el-form-item label="出发站：" prop="from_station" style="width: 100%">
                  <el-input v-model="itemList.from_station" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="到达站：" prop="to_station" style="width: 100%">
                  <el-input v-model="itemList.to_station" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="出发日期：" prop="booking_date" style="width: 100%">
                  <el-input v-model="itemList.booking_date" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="坐席：" prop="seat_levelCopy" style="width: 100%">
                  <el-input v-model="itemList.seat_levelCopy" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="联系人：" prop="user_id" style="width: 100%">
                  <el-input v-model="itemList.user_id" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="联系电话：" prop="phone" style="width: 100%">
                  <el-input v-model="itemList.phone" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="订单类别：" prop="need_back" style="width: 100%">
                  <el-input v-model="itemList.need_back" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="订单状态：" prop="status" style="width: 100%">
                  <el-input v-model="itemList.status" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="价格：" prop="amount" style="width: 100%">
                  <el-input v-model="itemList.amount" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">乘客详情</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="itemObj.ttPassengerList"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column width="70" label="序号" type="index" align="center"></el-table-column>
              <el-table-column label="姓名" prop="name" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="证件类型" prop="idtype" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.idtypeCopy }}</span>
                </template>
              </el-table-column>
              <el-table-column label="证件号" prop="idno" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.idno }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号" prop="mobile" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.mobile }}</span>
                </template>
              </el-table-column>
              <el-table-column label="车票类别" prop="type" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.typeCopy }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog
      title="修改状态"
      :visible.sync="dialogStatus"
      width="30%">
      <div class="status">
        <span>订单状态:</span>
        <el-select v-model="status" placeholder="请选择订单状态">
              <el-option
              v-for="item in statusList"
              :label="item.value"
              :value="item.id"
              :key="item.id"
              ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="confirmStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!--上传文件的弹窗-->
    <el-dialog :visible.sync="uploaddialogVisible" :close-on-click-modal="false" title="导入数据" center>
      <el-upload ref="upload" :auto-upload="false" :multiple="false" :on-change="handleChange" :on-remove="removeFile"
        :limit="1" action="" drag class="upload-demo">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploaddialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="submitImportExcel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTTOrderList, exportTTOrderList, getTTOrderDetail, updateTT, refund , importTTOrderList , selectTicketDate , getToStationNewList , getFromStationList } from "@/api/ticket/orderTicket"
import Pagination from "@/components/Pagination"
import { export_txt_to_zip } from "@/vendor/Export2Zip.js"
import { baseUrl } from '@/utils/baseUrl'
import axios from 'axios'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      status: "",
      fileList: "",
      dialogTitle: "查看",
      itemObj: {},
      itemList: {},
      itemArr: [],
      idsArr: [],
      fromStationList: [],
      toStationList: [],
      ticketDateList: [],
      editDialog: false,
      dialogStatus: false,
      uploaddialogVisible: false,
      bookingDateOptions: {
          disabledDate(time) {
            // return time.getTime() > Date.now();
            return false
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      loading: false,
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        time: ["" , ""],
        bookingDate: "",
        status: null,
        orderno: null,
        needBack: null,
        fromStation: "",
        toStation: ""
      },
      statusList: [
          {
            value: "已下单待支付",
            id: 0
          },
          {
            value: "已支付待处理",
            id: 1
          },
          {
            value: "已导出处理",
            id: 2
          },
          {
            value: "出票成功",
            id: 3
          },
          {
            value: "出票失败待退款",
            id: 4
          },
          {
            value: "已重新下单",
            id: 5
          },
          {
            value: "已退款",
            id: 6
          },
          {
            value: "已取消",
            id: 7
          },
          {
            value: "已过期",
            id: 8
          }
      ],
      statusClass: [
          {
            value: "单程",
            id: 0
          },
          {
            value: "往返",
            id: 1
          }
      ],
      seatList: [ 
          {
              value: "硬座",
              id: 1
          },
          {
              value: "软座",
              id: 2
          },
          {
              value: "硬卧",
              id: 3
          },
          {
              value: "软卧",
              id: 4
          },
          {
              value: "二等座",
              id: 11
          },
          {
              value: "一等座",
              id: 12
          },
          {
              value: "特等座",
              id: 13
          },
          {
              value: "商务座",
              id: 14
          }
      ]
    }
  },
  created() {
    this.getData()
    this.getFromStationList()
    this.getToStationList()
  },
  methods: {
    getFromStationList(){
      getFromStationList().then(res=>{
        if(res.code == 200){
          this.fromStationList = res.data
        }
      })
    },
    getToStationList(){
      getToStationNewList().then(res=>{
        if(res.code == 200){
          this.toStationList = res.data
        }
      })
    },
    removeFile(file, fileList) {
        this.fileList = null
    },
    handleChange(file, fileList) {
        this.fileList = fileList
    },
    toLead(){
      this.uploaddialogVisible = true
    },
    submitImportExcel() {
        if (this.fileList) {
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          importTTOrderList(formData).then(res => {
            if(res.code == 200){
              this.uploaddialogVisible = false
              this.$message({
                type: 'success',
                message: `上传成功!`
              })
              this.getData()
            }else{
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        } else {
          this.$message({
            message: '请选择Excle文件!'
          })
        }
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    reimburse(item){
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
          arr.push(v.orderno)
        })
        this.open('确定批量退款？' , arr)
      }else{
        this.open('确定退款？' , [item.orderno])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          refund({orderList: id}).then(res=>{
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
    confirmStatus(){
      if(!this.status){
        this.$message({
          type: 'info',
          message: '请选择要修改的状态！'
        })
        return
      }
      updateTT({ids: this.idsArr, status: this.status}).then(res=>{
        if(res.code == 200){
          this.$message({
            type: 'succuss',
            message: "操作成功！"
          })
          this.dialogStatus = false
          this.getData()
        }else{
          this.$message(res.msg)
        }
      })
    },
    alterStatus(){
      if(this.itemArr.length == 0){
        this.$message({
          type: 'info',
          message: '请选择数据！'
        })
        return
      }
      var arr = []
      this.itemArr.forEach(v=>{
        arr.push(v.id)
      })
      this.idsArr = arr
      this.dialogStatus = true
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
    },
    exportForm(){
       if(!this.queryList.bookingDate){
         this.$message("请选择导出出发日期！")
         return
       }else if(!this.queryList.fromStation){
         this.$message("请输入出发站！")
         return
       }else if(!this.queryList.toStation){
         this.$message("请输入到达站！")
        return
       }
      //  window.location.href = `${baseUrl}/tt/exportTTOrderList?bookingDate=${this.queryList.bookingDate}`
      axios({
        url: `${baseUrl}/tt/exportTTOrderList`, // 请求路径
        responseType: 'blob', // 表明返回服务器返回的数据类型
        method: 'post',  // 请求方式
        data: {   // 请求需要传的数据
         bookingDate: this.queryList.bookingDate,
         fromStation: this.queryList.fromStation,
         toStation: this.queryList.toStation
       }
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
    lookData(item){
      this.editDialog = true
      this.itemList = item
      getTTOrderDetail({id: item.id}).then(res=>{
        this.itemObj = res.data[0]
        this.itemObj.ttPassengerList.map(v=>{
          if(v.idtype == 1){
            v.idtypeCopy = "身份证"
          }else if(v.idtype == 2){
            v.idtypeCopy = "护照"
          }else if(v.idtype == 3){
            v.idtypeCopy = "港澳通行证"
          }else if(v.idtype == 4){
            v.idtypeCopy = "台湾通行证"
          }
          if(v.type == 1){
            v.typeCopy = "成人票"
          }else if(v.type == 2){
            v.typeCopy = "儿童票"
          }else if(v.type == 3){
            v.typeCopy = "学生票"
          }else if(v.type == 4){
            v.typeCopy = "残军票"
          }
        })
      })
    },
    close(){
      this.itemObj = {}
      this.itemList = {}
    },
    getData(filter){
    //   this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.orderno) {
        data.orderno = queryList.orderno
      }
      if (queryList.toStation) {
        data.toStation = queryList.toStation
      }
      if (queryList.fromStation) {
        data.fromStation = queryList.fromStation
      }
      if (queryList.bookingDate) {
        data.bookingDate = queryList.bookingDate
      }
      if(!(queryList.status == null)){
        data.status = queryList.status
      }
      if(!(queryList.needBack == null)){
        data.needBack = queryList.needBack
      }
      if (queryList.time && queryList.time[0] && queryList.time[1]) {
        data.startDate = queryList.time[0]
        data.endDate = queryList.time[1]
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      getTTOrderList(data).then(res=>{
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
            this.seatList.forEach(i=>{
              if(i.id == v.seat_level){
                v.seat_levelCopy = i.value
              }
            })
          })
        }
      })
    },
    handleFilter(){
      this.getData()
      if(this.queryList.toStation && this.queryList.fromStation){
        selectTicketDate({
            fromStation: this.queryList.fromStation,
            toStation: this.queryList.toStation
        }).then(res=>{
            if(res.code ==200){
                this.ticketDateList = res.data
            }
        })
      }
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        time: ["" , ""],
        status: null,
        orderno: null,
        needBack: null,
        toStation: "",
        fromStation: "",
        bookingDate: ""
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
