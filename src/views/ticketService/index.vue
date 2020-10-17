<template>
  <div class="ticketService">
      <div class="form_box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
            <el-form-item label="出发日期" prop="bookingDate">
                <!-- @change="changedates" -->
                 <el-date-picker type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="forcedata" placeholder="请选择出发日期" v-model="ruleForm.bookingDate" style="width: 400px;"></el-date-picker>
            </el-form-item>
            <el-form-item label="去程出发站" prop="fromStation">
                <el-select v-model="ruleForm.fromStation" placeholder="请选择或输入去程出发站" filterable clearable style="width: 400px;" @change="forcedata">
                    <el-option :label="value.fromStation" :value="value.fromStation" v-for="(value,index) in ttList" :key="index"></el-option>
                </el-select>
                <!-- <el-select
                    style="width: 400px;"
                    v-model="ruleForm.fromStation"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入出发站"
                    :remote-method="querySearch"
                    :loading="fromLoading">
                    <el-option
                    v-for="item in stationList"
                    :key="item.id"
                    :label="item.from_station"
                    :value="item.from_station">
                    </el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="去程到达站" prop="toStation">
                <el-select v-model="ruleForm.toStation" placeholder="请选择或输入去程到达站" filterable clearable style="width: 400px;" @change="forcedata">
                    <el-option :label="value.toStation" :value="value.toStation" v-for="(value,index) in ttSList" :key="index"></el-option>
                </el-select>
                <!-- <el-select
                    @change="forcedata"
                    style="width: 400px;"
                    v-model="ruleForm.toStation"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入出发站"
                    :remote-method="querySearch2"
                    :loading="fromLoading">
                    <el-option
                    v-for="item in stationList2"
                    :key="item.id"
                    :label="item.to_station"
                    :value="item.to_station">
                    </el-option>
                </el-select> -->
            </el-form-item>
            <!-- <el-form-item label="去程优先乘车时间段" prop="bookingTime">  -->
                <!-- required -->
                <!-- <el-select v-model="ruleForm.bookingTime" placeholder="请选择去程优先乘车时间段" filterable clearable style="width: 400px;">
                    <el-option :label="value.text" :value="value.text" v-for="(value,index) in timeList" :key="index"></el-option>
                </el-select> -->
                <!-- <div class="date_box">
                    <el-form-item prop="value">
                        <el-time-select v-model="ruleForm.value" :picker-options="{start: '08:00',step: '00:15',end: '23:30'}" placeholder="请选择开始时间" style="width: 250px;">
                        </el-time-select>
                    </el-form-item>
                    <span>--</span>
                    <el-form-item prop="value2">
                        <el-time-select v-model="ruleForm.value2" :picker-options="{start: '08:00',step: '00:15',end: '23:30'}" placeholder="请选择结束时间" style="width: 250px;">
                        </el-time-select>
                    </el-form-item>
                </div> -->
            <!-- </el-form-item> -->
            <el-form-item prop="seatLevel" label="坐席">
                <el-select v-model="ruleForm.seatLevel" placeholder="请选择坐席" style="width: 400px;">
                    <el-option
                        v-for="item in seatList"
                        :key="item.seatLevel"
                        :label="item.seatLevelName"
                        :value="item.seatLevel">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="去程车次号" prop="code">
                <el-input type="text" placeholder="请输入去程车次号" v-model="ruleForm.code" style="width: 400px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="专用安检通道定制" prop="needQuick">
                <div class="orientation">
                    <el-radio-group v-model="ruleForm.needQuick">
                        <el-radio :label="0">不需要</el-radio>
                        <el-radio :label="1">需要</el-radio>
                    </el-radio-group>
                    <span>收费标准参考：10/人次（平日价）、20元/人次（周末）、30元/人次（节假日）</span>
                </div>
            </el-form-item>
            <el-form-item label="广铁U彩综合服务候车定制（20人以上团体）" prop="needWaiting" class="itemradio">
                <div class="orientation">
                    <el-radio-group v-model="ruleForm.needWaiting">
                        <el-radio :label="0">不需要</el-radio>
                        <el-radio :label="1">需要</el-radio>
                    </el-radio-group>
                    <span>收费标准参考：10/人次（平日价）、20元/人次（周末）、30元/人次（节假日）</span>
                </div>
            </el-form-item> -->
            <!-- <el-form-item label="是否需要预定往返" prop="needBack">
                    <el-radio-group v-model="ruleForm.needBack">
                        <el-radio :label="0">不预定往返</el-radio>
                        <el-radio :label="1">预定往返 （预定往返时，去程和返程人数需保持一致，不一致时请分开下单）</el-radio>
                    </el-radio-group>
            </el-form-item> -->
            <el-form-item label="返程日期" prop="backDate" v-if="ruleForm.needBack===1">
                 <el-date-picker type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="changedates2" placeholder="请选择返程日期" v-model="ruleForm.backDate" style="width: 400px;"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="返程优先乘车时间段" v-if="ruleForm.needBack===1" prop="backTime"> -->
                <!-- <el-select v-model="ruleForm.backTime" placeholder="请选择返程优先乘车时间段" filterable clearable style="width: 400px;">
                    <el-option :label="value.text" :value="value.text" v-for="(value,index) in timeList2" :key="index"></el-option>
                </el-select> -->
                <!-- <div class="date_box">
                    <el-form-item prop="date3">
                        <el-time-select v-model="ruleForm.date3" :picker-options="{start: '08:00',step: '00:15',end: '23:30'}" placeholder="请选择开始时间" style="width: 250px;">
                        </el-time-select>
                    </el-form-item>
                    <span>--</span>
                    <el-form-item prop="date4">
                        <el-time-select v-model="ruleForm.date4" :picker-options="{start: '08:00',step: '00:15',end: '23:30'}" placeholder="请选择结束时间" style="width: 250px;">
                        </el-time-select>
                    </el-form-item>
                </div> -->
            <!-- </el-form-item> -->
            <el-form-item label="返程车次号" prop="backCode" v-if="ruleForm.needBack===1">
                <el-input type="text" placeholder="请输入返程车次号" v-model="ruleForm.backCode" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="乘客信息" required>
                <div class="passenger" v-for="(item,index) in ruleForm.ttPassengerList" :key="index">
                    <el-form-item :prop="'ttPassengerList.' + index + '.name'" label="乘客姓名" :rules="ttOjbectRules.name">
                        <el-input type="text" placeholder="请输入乘客姓名" v-model="item.name" style="width: 400px;"></el-input>
                    </el-form-item>
                     <el-form-item :prop="'ttPassengerList.' + index + '.mobile'" label="联系电话" :rules="ttOjbectRules.mobile">
                        <el-input type="text" placeholder="请输入乘客联系电话" v-model="item.mobile" style="width: 400px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="idtype" label="证件类型">
                        <el-select v-model="item.idtype" placeholder="请选择证件类型" style="width: 400px;">
                            <el-option
                                v-for="value in certificateList"
                                :key="value.id"
                                :label="value.value"
                                :value="value.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :prop="'ttPassengerList.' + index + '.idno'" label="证件号码" :rules="ttOjbectRules.idno">
                        <el-input type="text" placeholder="请输入证件号码" v-model="item.idno" style="width: 400px;"></el-input>
                    </el-form-item>
                   <el-form-item prop="type" label="票类">
                        <el-select v-model="item.type" placeholder="请选择票类" style="width: 400px;">
                            <el-option label="成人票" :value="1"></el-option>
                            <el-option label="儿童票" :value="2"></el-option>
                            <el-option label="学生票" :value="3"></el-option>
                            <el-option label="残军票" :value="4"></el-option>
                        </el-select>
                   </el-form-item>
                    <div class="btn_box" v-if="!(index === 0)">
                         <el-button type="danger" icon="el-icon-delete" circle @click="openDanger(index)"></el-button>
                    </div>
                </div>
                <div class="btn_add">
                    <el-button type="primary" icon="el-icon-edit" @click="addPassenger">添加乘客</el-button>
                </div>
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item>
                <span class="remark_text">注：根据铁总价【2015】365号文，客票销售服务费为每张5元。若勾选订购增值服务，可减免服务费。</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-check">创建订单</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-dialog
        title="确定创建订单？"
        :visible.sync="dialogVisible"
        width="30%">
        <div class="site_box">
            <div>{{ fromIdText }}</div>
            <div class="iarrow">
                <i class="el-icon-d-arrow-left" v-if="ruleForm.needBack===1"></i>
                <i class="el-icon-d-arrow-right"></i>
            </div>
            <div>{{  toIdText }}</div>
        </div>
        <div class="user_number">
            <div>乘客数量</div>
            <span>{{ruleForm.ttPassengerList.length}}</span>
        </div>
        <div class="price_box">
            <div>预估费用</div>
            <span>{{ price }}元</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogSubmit" :loading="loadingBtn">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import formatTime from "@/utils/formatTime"
import { getTTStation, preAddTTPassenger, addTTPassenger, getAvailableTime, getSeatLeavelPriceByIdAndEid, getTTStationByNotInId, getFromOrToStation , getFromStationList , getToStationList , getSeatLevelByStation } from "@/api/ticket/ticketService"
export default {
    data(){
        const that = this
        return{
            fromLoading: false,
            stationList: [],
            stationList2: [],
            pickerOptions: {
                disabledDate(time) {
                    // var a = formatTime(time.getTime(),'yyyy-mm-dd')
                    // if(a === '2020-09-01' || a=== '2020-09-02' || a=== '2020-09-04'){
                    //     return true
                    // }else{
                    //     return false
                    // }
                    // return new Date(t).toDateString() === new Date().toDateString();  // 判断2个时间戳是不是同一天
                    // return time.getTime() < Date.now() - 8.64e7;
                    return time.getTime() < new Date(that.date).getTime() - 8.64e7;
                }
            },
            loadingBtn: false,
            dialogVisible: false,
            ruleForm: {
                // needQuick: 0,
                // needWaiting: 0,
                needBack: 0,
                ttPassengerList: [
                    {
                        name: "",
                        mobile: "",
                        idtype: 1,
                        idno: "", 
                        type: 1
                    }
                ]
            },
            ttOjbectRules: {
                name: [
                    { required: true, message: '请填写乘客姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请填写乘客联系电话', trigger: 'blur' }
                ],
                idno: [
                    { required: true, message: '请填写乘客证件号码', trigger: 'blur' }
                ]
            },
            rules: {
                bookingDate: [
                    { required: true, message: '请选择出发日期', trigger: 'change' }
                ],
                backDate: [
                    { required: true, message: '请选择返程日期', trigger: 'change' }
                ],
                fromStation: [
                    { required: true, message: '请选择出发车站', trigger: 'change' }
                ],
                toStation: [
                    { required: true, message: '请选择到达车站', trigger: 'change' }
                ],
                bookingTime: [
                    { required: true, message: '请选择去程优先乘车时间段', trigger: 'change' }
                ],
                seatLevel: [
                    { required: true, message: '请选择坐席', trigger: 'change' }
                ],
                backTime: [
                    { required: true, message: '请选择返程优先乘车时间段', trigger: 'change' }
                ],
            },
            certificateList: [
                {
                    value: "身份证",
                    id: 1
                },
                {
                    value: "护照",
                    id: 2
                },
                {
                    value: "港澳通行证",
                    id: 3
                },
                {
                    value: "台湾通行证",
                    id: 4
                }
            ],
            seatList: [ 
                // {
                //     value: "硬座",
                //     id: 1
                // },
                // {
                //     value: "软座",
                //     id: 2
                // },
                // {
                //     value: "硬卧",
                //     id: 3
                // },
                // {
                //     value: "软卧",
                //     id: 4
                // },
                // {
                //     value: "二等座",
                //     id: 11
                // },
                // {
                //     value: "一等座",
                //     id: 12
                // },
                // {
                //     value: "特等座",
                //     id: 13
                // },
                // {
                //     value: "商务座",
                //     id: 14
                // }
            ],
            timeList: [
              { text: '09:00-12:00', value: 1 },
              { text: '12:00-15:00', value: 2 },
              { text: '15:00-18:00', value: 3 },
              { text: '18:00-24:00', value: 4 }
                //  { text: '21:00-24:00', value: 5 }
            ],
            timeList2: [
              { text: '09:00-12:00', value: 1 },
              { text: '12:00-15:00', value: 2 },
              { text: '15:00-18:00', value: 3 },
              { text: '18:00-24:00', value: 4 }
                //  { text: '21:00-24:00', value: 5 }
            ],
            timeListCopy: [
              { text: '09:00-12:00', value: 1 },
              { text: '12:00-15:00', value: 2 },
              { text: '15:00-18:00', value: 3 },
              { text: '18:00-24:00', value: 4 }
                //  { text: '21:00-24:00', value: 5 }
            ],
            ttList: [],
            ttSList: [],
            fromIdText: "",
            toIdText: "",
            price: "",
            date: "",
            hours: "",
            dateHours: ""
        }
    },
    mounted(){
        getAvailableTime({hours: 72}).then(res=>{
            this.dateHours = res.data
            this.date = res.data.split(" ")[0]
            this.hours = res.data.split(" ")[1]
        })
        this.apiTtList()
        this.apiTtSList()
    },
    methods: {
        apiTtList(){
            getFromStationList().then(res=>{
                if(res.code == 200){
                  this.ttList = res.data
                }else{
                    this.$message(res.msg)
                }
            })
        },
        apiTtSList(){
            getToStationList().then(res=>{
                if(res.code == 200){
                  this.ttSList = res.data
                }else{
                    this.$message(res.msg)
                }
            })
        },
        querySearch(queryString) {
            if(queryString !== ''){
                this.fromLoading = true
                getFromOrToStation({fromStation: queryString}).then(res=>{
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
                getFromOrToStation({toStation: queryString}).then(res=>{
                this.fromLoading = false
                this.stationList2 = res.data
                })
            }else{
                this.stationList2 = []
            }
        },
      addPassenger(){
          if(this.ruleForm.ttPassengerList.length >= 5){
              this.$message("一次提交最多添加5位乘客信息！")
              return
          }
          var obj = {
            name: "",
            mobile: "",
            idtype: 1,
            idno: "", 
            type: 1
          }
          this.ruleForm.ttPassengerList.push(obj)
      },
      openDanger(index){
          this.$confirm('删除后点击下方添加乘客按钮可重新填写', '确定删除该乘客信息表?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ruleForm.ttPassengerList.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      dialogSubmit(){
          if(!this.loadingBtn){
              this.loadingBtn = true
              addTTPassenger(this.ruleForm).then(res=>{
                  this.loadingBtn = false
                  if(res.code == 200){
                      this.dialogVisible = false
                      this.$message.success("操作成功，你可前往定票订单查看订单")
                      this.resetForm('ruleForm')
                  }else{
                      this.$message(res.msg)
                  }
              }).catch(err=>{
                  this.loadingBtn = false
                  this.$message.error("提交失败，请重新提交~")
              })
          }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            preAddTTPassenger(this.ruleForm).then(res=>{ 
                if(res.code == 200){
                    this.price = res.data
                }else{
                   this.$message(res.msg)
                   return
                }
            })
            this.dialogVisible = true
            this.fromIdText = this.ruleForm.fromStation 
            this.toIdText = this.ruleForm.toStation 
          } else {
            this.$message("填写有误！")
            return false;
          }
        });
      },
      changedates(){
          if(this.ruleForm.bookingDate === this.date){
             var dataTime = this.timeList.filter(v=>{
                  var hoursend = v.text.split('-')[1]
                  var dates = this.date + " " + hoursend
                  return this.tab(dates, this.dateHours)
              })
              this.timeList = dataTime
            //   if(this.ruleForm.bookingTime){
            //       this.ruleForm.bookingTime = ""
            //   }
          }else{
              this.timeList = this.timeListCopy 
          }
      },
      changedates2(){
        //   if(!this.ruleForm.bookingDate || !this.ruleForm.bookingTime){
          if(!this.ruleForm.bookingDate){
              this.ruleForm.backDate = ""
              this.$message("请先选择出发日期及优先乘车时间段时间")
              this.$message("请先选择出发日期")
          }else{
            //   var time = this.ruleForm.bookingDate + " " + this.ruleForm.bookingTime.split("-")[0]
              var time = this.ruleForm.bookingDate
              if(this.ruleForm.bookingDate === this.ruleForm.backDate){
                //   出发和返程是同一天
                var dataTime = this.timeList2.filter(v=>{
                    var hoursend = v.text.split('-')[0]
                    var dates = this.date + " " + hoursend
                    return this.tab(dates, time)
                })
                if(dataTime.length == 0){
                    this.ruleForm.backDate = ""
                    this.$message("该日期已无时间可提供返程，请选择其他日期或修改出发时间。")
                }else{
                    this.timeList2 = dataTime
                    // if(this.ruleForm.backTime){
                    //     this.ruleForm.backTime = ""
                    // }
                }
              }else if(this.tab(this.ruleForm.bookingDate,this.ruleForm.backDate)){
                  this.ruleForm.backDate = ""
                  this.$message("返程日期不得小于出发日期，请选择其他日期或修改出发日期。")
              }else{
                  this.timeList2 = this.timeListCopy 
              }
          }
      },
      tab(date1,date2){
            var oDate1 = new Date(date1);
            var oDate2 = new Date(date2);
            if(oDate1.getTime() > oDate2.getTime()){
                return true
            } else {
                return false
            }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getSeatLeavelPrice(){
          if(!this.ruleForm.bookingDate){
              this.$message("请选择出发日期!")
              return
          }
          getSeatLevelByStation({
              fromStation: this.ruleForm.fromStation,
              toStation: this.ruleForm.toStation,
              ticketDate: this.ruleForm.bookingDate
          }).then(res=>{
              if(res.code == 200 && res.data){
                  this.seatList = res.data
                  if(res.data.length <= 0){
                      this.$message("该日期暂无坐席票数开放，请修改出发日期或更换出发、到达站点")
                  }
              }else{
                  this.$message(res.msg)
              }
          })
      },
      forcedata(){
          this.$forceUpdate()
          if(this.ruleForm.toStation && this.ruleForm.fromStation){
             this.getSeatLeavelPrice() 
          }
      }
    }
}
</script>

<style lang="less" scoped>
.user_number{
   width: 200px;
   display: flex;
   align-items: center; 
   font-weight: bold;
   font-size: 18px;
   margin-top: 15px;
   >span{
       margin-left: 10px;
       color: #1890ff;
   }
}
.price_box{
   width: 200px;
   display: flex;
   align-items: center; 
   font-weight: bold;
   margin-top: 15px;
   font-size: 20px;
   >span{
       margin-left: 10px;
       color: #f00;
   }
}
.site_box{
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div{
        font-weight: bold;
        font-size: 20px;
    }
    .iarrow{
        display: flex;
        align-items: center;
    }
}
.remark_text{
    margin-left: -50px;
}
.form_box{
    width: 80%;
    margin: 50px auto;
    .date_box{
        display: flex;
        align-items: center;
        >span{
            display: block;
            margin: 0 10px;
        }
    }
    .orientation{
        position: relative;
        >span{
            position: absolute;
            top: 25px;
            left: 0;
            color: rgb(152, 174, 189);
        }
    }
    .btn_add{
        width: 600px;
        text-align: right;
        margin-top: 14px;
    }
    .passenger{
        padding: 10px 0 15px;
        box-shadow: 0px 5px 24px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        width: 600px;
        .btn_box{
            text-align: right;
            .el-button{
                margin: 0 10px 0 0;
            }
        }
        /deep/.el-form-item__error{
            left: 100px;
        }
        /deep/.el-form-item__label{
            width: 100px !important;
        }
        /deep/.el-form-item--medium{
            margin-top: 20px;
        }
        /deep/.el-form-item__content{
            margin-left: 10px !important;
        }
    }
    .itemradio{
        /deep/.el-form-item__label{
            margin-top: 5px;
            line-height: 24px;
        }
    }
}
</style>
