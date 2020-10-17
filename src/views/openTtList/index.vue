<template>
  <div class="app-container">
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
          <!-- <div>
              <span>订单状态:</span>
              <el-select v-model="queryList.status" @change="getData" class="input" placeholder="请选择订单状态">
                    <el-option
                    v-for="item in statusList"
                    :label="item.value"
                    :value="item.id"
                    :key="item.id"
                    ></el-option>
              </el-select>
          </div> -->
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-plus" @click="newly">新增</el-button>
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
      <el-table-column label="出发站所属铁路局" prop="fromBelongto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fromBelongto }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的站所属铁路局" prop="toBelongto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.toBelongto }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <div style="margin-bottom: 8px;">
             <el-button size="mini" type="primary" @click="lookData(scope.row)">查看</el-button>
             <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
          </div>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
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
    <!-- 新增 -->
    <el-dialog 
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="newlyDialog"
      width="80%"
      @close="closeNewly"
      center>
        <el-form label-position="right" ref="ruleForm" label-width="150px" :model="newlyList" class="clearFix">
            <el-form-item label="出发站：" prop="fromStation" style="width: 100%" :rules="[{ required: true, message: '请选择出发站', trigger: 'blur' }]">
                <el-select
                    :disabled="fromTodisabled"
                    style="width:50%"
                    v-model="newlyList.fromStation"
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
                </el-select>
            </el-form-item>
            <el-form-item label="到达站：" prop="toStation" style="width: 100%" :rules="[{ required: true, message: '请选择到达站', trigger: 'blur' }]">
                <el-select
                    :disabled="fromTodisabled"
                    style="width:50%"
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
                    :label="item.to_station"
                    :value="item.to_station">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="座位价格配置：" prop="ttStationLinePriceList" style="width: 100%">
                <div class="price_box" v-for="item in seatLevel" :key="item.seatLevel">
                    <el-input v-model="item.price" placeholder="请输入价格" style="width:50%" oninput="value=value.replace(/[^0-9.]/g,'')" @input="forceUpdate">
                        <template slot="prepend">{{ item.name }}</template>
                        <template slot="append">元</template>
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item label="状态：" prop="status" style="width: 100%">
                  <el-radio-group v-model="newlyList.status" @change="forceUpdate">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">正常</el-radio>
                  </el-radio-group>
              </el-form-item>
            <el-form-item label="备注：" prop="remark" style="width: 100%">
                <el-input v-model="newlyList.remark" style="width:50%" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="线路介绍：" prop="introduce" style="width: 100%">
                <editor-bar v-model="newlyList.introduce" :isClear="isClear" @change="change"></editor-bar>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="newlyDialog = false">返 回</el-button>
            <el-button type="primary" @click="confirmNewly('ruleForm')" :loading="confirmLoading">确 定</el-button>
        </span>
    </el-dialog>

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
              <el-form-item label="出发站：" prop="fromStation" style="width: 100%">
                  <el-input v-model="itemList.fromStation" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="到达站：" prop="toStation" style="width: 100%">
                  <el-input v-model="itemList.toStation" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="出发站所属铁路局：" prop="fromBelongto" style="width: 100%">
                  <el-input v-model="itemList.fromBelongto" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="目的站所属铁路局：" prop="toBelongto" style="width: 100%">
                  <el-input v-model="itemList.toBelongto" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="statusCopy" style="width: 100%">
                  <el-input v-model="itemList.statusCopy" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="remark" style="width: 100%">
                  <el-input v-model="itemList.remark" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">拼音编码</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="[itemList]"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column width="70" label="序号" type="index" align="center"></el-table-column>
              <el-table-column label="出发车站拼音码" prop="fromSpellcode" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.fromSpellcode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="目的车站拼音码" prop="toSpellcode" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.toSpellcode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出发车站电报码" prop="fromTelecode" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.fromTelecode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="目的车站电报码" prop="toTelecode" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.toTelecode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出发站拼音全拼" prop="fromFullSpell" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.fromFullSpell }}</span>
                </template>
              </el-table-column>
              <el-table-column label="目的站拼音全拼" prop="toFullSpell" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.toFullSpell }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出发站拼音首字母" prop="fromFirstSpell" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.fromFirstSpell }}</span>
                </template>
              </el-table-column>
              <el-table-column label="目的站拼音首字母" prop="toFirstSpell" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.toFirstSpell }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <el-divider content-position="left"><span class="title">坐席价格</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="[itemList]"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column label="硬座" prop="priceYz" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceYz }}</span>
                </template>
              </el-table-column>
              <el-table-column label="软座" prop="priceRz" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceRz }}</span>
                </template>
              </el-table-column>
              <el-table-column label="硬卧" prop="priceYw" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceYw }}</span>
                </template>
              </el-table-column>
              <el-table-column label="动卧" prop="priceDw" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceDw }}</span>
                </template>
              </el-table-column>
              <el-table-column label="软卧" prop="priceRw" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceRw }}</span>
                </template>
              </el-table-column>
              <el-table-column label="二等座" prop="priceEd" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceEd }}</span>
                </template>
              </el-table-column>
              <el-table-column label=" 一等座" prop="priceYd" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceYd }}</span>
                </template>
              </el-table-column>
              <el-table-column label="特等座" prop="priceTd" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceTd }}</span>
                </template>
              </el-table-column>
              <el-table-column label="商务座" prop="priceSw" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.priceSw }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTTStationLineList, deleteTTStationLine, getTTStationTemp, getStationToPrice, addStationLine } from "@/api/ticket/openTtList"
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
// 富文本编辑器
import EditorBar from './components/wangEnduit'
export default {
  components: {
    Pagination,
    EditorBar
  },
  data() {
    return {
      isClear: false, 
      status: "",
      dialogTitle: "查看",
      newlyList: {
        status: 1
      },
      editorOption: {},
      itemObj: {},
      itemList: {},
      itemArr: [],
      idsArr: [],
      fromLoading: false,
      editDialog: false,
      newlyDialog: false,
      confirmLoading: false,
      fromTodisabled: false,
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
        toStation: null,
        fromStation: null
      },
      statusList: [
          {
            value: "已下单待支付",
            id: 0
          }
      ],
      stationList: [],
      stationList2: [],
      seatLevel: [
          {
              price: '0',
              seatLevel: 'price_yz',
              name: '硬座'
          },
          {
              price: '0',
              seatLevel: 'price_rz',
              name: '软座'
          },
          {
              price: '0',
              seatLevel: 'price_yw',
              name: '硬卧'
          },
          {
              price: '0',
              seatLevel: 'price_dw',
              name: '动卧'
          },
          {
              price: '0',
              seatLevel: 'price_rw',
              name: '软卧'
          },
          {
              price: '0',
              seatLevel: 'price_ed',
              name: '二等座'
          },
          {
              price: '0',
              seatLevel: 'price_yd',
              name: '一等座'
          },
          {
              price: '0',
              seatLevel: 'price_td',
              name: '特等'
          },
          {
              price: '0',
              seatLevel: 'price_sw',
              name: '商务'
          }
      ]
    }
  },
  created() {
    this.getData()
  },
  mounted(){
    
  },
  methods: {
    forceUpdate(){
        this.$forceUpdate()
    },
    change(val) {  
        console.log(val)  
    },  
    compile(item){
      var list = this.seatLevel.filter(v=>{
          if(v.seatLevel === "price_yz"){
            v.price = item.priceYz
          }else if(v.seatLevel === "price_rz"){
            v.price = item.priceRz
          }else if(v.seatLevel === "price_yw"){
            v.price = item.priceYw
          }else if(v.seatLevel === "price_dw"){
            v.price = item.priceDw
          }else if(v.seatLevel === "price_rw"){
            v.price = item.priceRw
          }else if(v.seatLevel === "price_ed"){
            v.price = item.priceEd
          }else if(v.seatLevel === "price_yd"){
            v.price = item.priceYd
          }else if(v.seatLevel === "price_td"){
            v.price = item.priceTd
          }else if(v.seatLevel === "price_sw"){
            v.price = item.priceSw
          }
          return v
      })
      this.newlyList.fromStation = item.fromStation
      this.newlyList.toStation = item.toStation
      this.newlyList.status = item.status
      this.newlyList.introduce = item.introduce
      this.seatLevel = list
      this.dialogTitle = "编辑"
      this.newlyDialog = true
      this.fromTodisabled = true
    },
    toInputChange(val){
        if(this.newlyList.fromStation){
            getStationToPrice({
                fromStation: this.newlyList.fromStation,
                toStation: val
            }).then(res=>{
                if(res.code == 200 && res.data && res.data.length>0){
                    res.data.forEach(v=>{
                        this.seatLevel.forEach(i=>{
                            if(v.seatLevel === i.seatLevel){
                                i.price = v.price
                            }
                        })
                    })
                }
            })
        }
    },
    confirmNewly(formName){
         this.$refs[formName].validate(valid => {
            if (valid) {
                this.confirmLoading = true
                var data = {}
                data.fromStation = this.newlyList.fromStation
                data.toStation  = this.newlyList.toStation
                var list = this.seatLevel.filter(v=>{
                    if(!v.price){
                        v.price = '0'
                    }
                    return v
                })
                data.ttStationLinePriceList = list
                data.remark = this.newlyList.remark
                data.status = this.newlyList.status
                data.introduce = this.newlyList.introduce
                addStationLine(data).then(res=>{
                    if(res.code == 200){
                        this.confirmLoading = false
                        this.newlyDialog = false
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getData()
                    }else{
                        this.confirmLoading = false
                        this.$message({
                            type: 'info',
                            message: res.msg
                        })
                    }
                })
            } else {
                console.log("error submit!!");
                return false;
            }
        })
    },
    querySearch(queryString) {
        if(queryString !== ''){
             this.fromLoading = true
            getTTStationTemp({fromStation: queryString}).then(res=>{
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
            getTTStationTemp({toStation: queryString}).then(res=>{
               this.fromLoading = false
               this.stationList2 = res.data
            })
        }else{
            this.stationList2 = []
        }
    },
    newly(){
        this.dialogTitle = "新增"
        this.newlyDialog = true
        this.fromTodisabled = false
        this.newlyList = {
          status: 1
        }
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    remove(item){
        this.open("确定删除？", item.id)
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          deleteTTStationLine({id: id}).then(res=>{
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
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
    },
    lookData(item){
      this.dialogTitle = "查看"
      this.editDialog = true
      this.itemList = item
    },
    closeNewly(){

    },
    close(){
      this.itemList = {}
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
    //   if(!(queryList.status == null)){
    //     data.status = queryList.status
    //   }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      getTTStationLineList(data).then(res=>{
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
            if(v.status == 1){
                v.statusCopy = "正常"
            }else if(v.status == 4){
                v.statusCopy = "已删除"
            }else{
                v.statusCopy = "禁用"
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
.price_box{
    width: 100%;
    margin-bottom: 10px;
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
