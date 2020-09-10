<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.couponName"
          placeholder="请输入券码名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
          <el-select v-model="queryList.status" @change="getList" class="input fl" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <!-- <el-date-picker
            class="input fl"
            style="width:360px"
            v-model="queryList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker> -->
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
           <!-- <el-button type="primary" @click="exportData">导出</el-button> -->
         </div>
         <div>
           <el-button type="primary" @click="newlyIncreased">新增</el-button>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
         </div>
       </div>
    </div>
    <el-table v-loading="loading" :data="data.data" border stripe fit @expand-change="expandChange" style="width: 100%;">
        <!-- fit highlight-current-row -->
        <el-table-column type="expand" fixed label="点击展开券码记录" width="90px;">
            <template slot-scope="props">
                <el-table :data="props.row.batchList" border stripe style="width: 80%;" v-if="props.row.batchList.length > 0" v-loading="expandLoading">
                <el-table-column width="70" label="序号" type="index" align="center"></el-table-column>
                <el-table-column prop="type" label="数据方式" align="center">
                    <template slot-scope="scope">
                    <span>{{ scope.row.type == 0? "生成": "导入" }}</span>
                    </template>
                </el-table-column> 
                <el-table-column prop="num" label="数量" align="center">
                    <template slot-scope="scope">
                    <span>{{ scope.row.num }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created" label="生成时间" align="center">
                    <template slot-scope="scope">
                    <span>{{ scope.row.created }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                    <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" prop="" align="center">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" @click="lookInto(scope.row)">查 看</el-button>
                      <el-button size="mini" type="primary" @click="educe(scope.row)">导 出</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>
        </el-table-column>
        <el-table-column label="券码名称" prop="title" align="center" width="200px">
            <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column label="优惠券类别" prop="typeCopy" align="center"  width="100px">
            <template slot-scope="scope">
            <span>{{ scope.row.typeCopy }}</span>
            </template>
        </el-table-column>
        <el-table-column label="券面价值" prop="discountCopy" align="center" width="100px">
            <template slot-scope="scope">
            <span>{{ scope.row.discountCopy }}</span>
            </template>
        </el-table-column>   
        <el-table-column label="满减条件" prop="amountCopy" align="center" width="100px">
            <template slot-scope="scope">
            <span>{{ scope.row.amountCopy }}</span>
            </template>
        </el-table-column>
        <el-table-column label="券码数量" prop="totalNum" align="center" width="100px">
            <template slot-scope="scope">
            <span>{{ scope.row.totalNum }}</span>
            </template>
        </el-table-column>
        <el-table-column label="已领" prop="receiveNum" align="center" width="80px">
            <template slot-scope="scope">
            <span>{{ scope.row.receiveNum }}</span>
            </template>
        </el-table-column>
        <el-table-column label="已用" prop="useNum" align="center" width="80px">
            <template slot-scope="scope">
            <span>{{ scope.row.useNum }}</span>
            </template>
        </el-table-column>
        <el-table-column label="是否特定商品可用" prop="isAssign" align="center" width="90px">
            <template slot-scope="scope">
            <span>{{ scope.row.isAssign ==1? "是": "否" }}</span>
            </template>
        </el-table-column>
        <el-table-column label="使用说明" prop="content" align="center" width="220px">
            <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
            </template>
        </el-table-column>
        <el-table-column label="有效时间" prop="effect" align="center" width="340px">
            <template slot-scope="scope">
            <span>{{ scope.row.effect }}</span> &nbsp;&nbsp; ~ &nbsp;&nbsp; <span>{{ scope.row.expire }}</span>
            </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusCopy" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.statusCopy }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
            <template slot-scope="scope">
            <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="primary" @click="compile(scope.row)" v-if="!(scope.row.status == 3 || scope.row.status == 4)">编辑</el-button></div>
            <div style="width: 50%;padding:0 0 7px 0; float: left;" v-if="scope.row.status == 4"><el-button size="mini" type="danger" @click="remove(scope.row)">恢复已作废</el-button></div>
            <div style="width: 50%;padding:0 0 7px 0; float: left;" v-else><el-button size="mini" type="danger" @click="remove(scope.row)">作废</el-button></div>
            <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="success" @click="audit(scope.row)" v-if="!(scope.row.status == 3 || scope.row.status == 4)">生成券码</el-button></div>
            <div style="width: 50%;padding:0 0 7px 0; float: left;"><el-button size="mini" type="info" @click="lookData(scope.row)">查看券码</el-button></div>
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
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="50%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="180px" :model="itemObj" class="clearFix">
              <el-form-item label="券码名称：" prop="title" style="width: 100%" :rules="[{ required: true, message: '请输入券码名称', trigger: 'blur' }]" >
                  <el-input v-model="itemObj.title" style="width:50%" placeholder="请输入优惠劵名称"></el-input>
              </el-form-item>
              <el-form-item label="优惠券类别：" prop="type" style="width: 100%" :rules="[{ required: true, message: '请选择优惠券类别', trigger: 'change' }]">
                    <el-radio-group v-model="itemObj.type">
                        <el-radio :label="1">直减</el-radio>
                        <el-radio :label="2">满减</el-radio>
                        <el-radio :label="3">折扣</el-radio>
                    </el-radio-group>
              </el-form-item>
              <el-form-item label="满减条件(单位为分)：" v-if="itemObj.type === 2" prop="amount" style="width: 100%" :rules="[{ required: true, message: '请输入满减条件(单位为分)', trigger: 'blur' }]" >
                <!-- oninput="value=value.replace(/[^0-9.]/g,'')" -->
                  <el-input placeholder="满减券的额度条件(单位为分)" v-model="itemObj.amount" style="width:50%" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
              <el-form-item label="券面价值(单位为分)：" prop="discount" style="width: 100%" :rules="[{ required: true, message: '请输入券面价值(单位为分)', trigger: 'blur' }]" >
                  <el-input placeholder="满减券的额度条件(单位为分)" v-model="itemObj.discount" style="width:50%" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                  <span style="color: #f00">若折扣券，如90表示9折</span>   
              </el-form-item>
              <el-form-item label="是否特定商品可用：" prop="isAssign" style="width: 100%" :rules="[{ required: true, message: '请选择是否特定商品可用', trigger: 'change' }]">
                    <el-radio-group v-model="itemObj.isAssign">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
              </el-form-item>
              <el-form-item label="可用商品" v-if="itemObj.isAssign === 1" prop="assignProduct" style="width: 100%" :rules="[{type: 'array', required: true, message: '请至少选择一个可用商品', trigger: 'change'}]">
                    <el-checkbox-group v-model="itemObj.assignProduct">
                        <el-checkbox :label="item.id" :name="item.id" v-for="(item,index) in productList" :key="index">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="time" style="width: 100%" v-if="!period" :rules="[{ type: 'array', required: true, message: '请选择时间', trigger: 'change' }]">
                 <el-date-picker
                    :key="'period2'"
                    style="width:50%"
                    v-model="itemObj.time"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="有效期开始"
                    end-placeholder="有效期结束"
                    @blur="changePicker"
                  ></el-date-picker>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="expire" style="width: 100%" v-if="period" :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]">
                  <el-date-picker
                    :key="'period'"
                    v-model="itemObj.expire"
                    type="datetime"
                    default-time="23:59:59"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions2"
                    placeholder="有效期结束">
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="使用说明：" prop="content" style="width: 100%">
                  <el-input type="textarea" v-model="itemObj.content" autosize maxlength="300" show-word-limit style="width:50%" placeholder="请输入使用说明"></el-input>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 生成券码 -->
    <el-dialog
      title="确定生成券码?"
      :visible.sync="centerDialogVisible"
      width="30%"
      @close="closeVis"
      center>
      <div class="clearFix">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <el-form-item prop="num" label="券码数量" :rules="[{ required: true, message: '请输入生成券码数量', trigger: 'blur' },{ pattern: /^[1-9]\d*|0$/, trigger: 'blur' , message: '请输入正整数'}]">
            <el-input
              type="number"
              placeholder="请输入生成券码数量"
              v-model.number="dynamicValidateForm.num"
              :max="10000"
              :min="0"
              class="inputNumber"
              @mousewheel.native.prevent
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注" :rules="[{ required: true, message: '请输入备注，如本批次用于什么目的或渠道', trigger: 'blur' }]">
             <el-input type="textarea" v-model="dynamicValidateForm.remark" autosize maxlength="200" show-word-limit class="inputNumber" placeholder="请输入备注，如本批次用于什么目的或渠道"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCouponCode">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="lookEditDialog"
      width="83%"
      @close="close2"
      center>
      <el-divider content-position="left"><span class="title">查询</span></el-divider>
      <div class="query">
       <div class="input_box">
         <el-input
          v-model="dialogList.code"
          placeholder="请输入劵码号"
          class="input fl"
          @keyup.enter.native="look(obj)"/>
          <el-input
          v-model="dialogList.mobile"
          placeholder="请输入绑定的手机"
          class="input fl"
          @keyup.enter.native="look(obj)"/>
          <el-select v-model="dialogList.status" @change="look(obj)" class="input fl" placeholder="请选择券码状态">
            <el-option
              v-for="item in statusList2"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <!-- <el-date-picker
            class="input fl"
            style="width:360px"
            v-model="dialogList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="look(item)"
          ></el-date-picker> -->
       </div>
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="dialogRemove(2)">批量恢复/批量作废</el-button>
           <el-button type="primary" @click="exportData2(item)">导出券码</el-button>
           <el-button type="primary" @click="importExcel">导入券码</el-button>
           <el-button type="primary" icon="el-icon-search" @click="look(obj)">搜索</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData2(obj)"></el-button>
         </div>
       </div>
      </div>
        <el-table
          v-loading="loading2"
          :data="dialog.data"
          border
          stripe
          fit
          @selection-change="handleSelectionChange2"
          style="width: 100%;">
          <el-table-column
            align="center"
            type="selection"
            width="50">
        </el-table-column>
          <el-table-column label="劵码ID" prop="id" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="劵码号" prop="code" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人手机号" prop="mobile" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="statusCopy" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.statusCopy }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="created" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.created }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用时间" prop="receiveTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.receiveTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用时间" prop="useTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" prop="" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="dialogRemove(scope.row)" v-if="scope.row.status == 10 || scope.row.status == 11 || scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 14">恢复已作废</el-button>
              <el-button size="mini" type="danger" @click="dialogRemove(scope.row)" v-else>作废</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="dialog.total>0"
          :total="dialog.total"
          :page.sync="dialog.current_page"
          :limit.sync="dialog.per_page"
          @pagination="getPageData2"
        />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookEditDialog = false">返回列表</el-button>
      </span>
    </el-dialog>
    <!--上传文件的弹窗-->
    <el-dialog :visible.sync="uploaddialogVisible" :close-on-click-modal="false" title="导入数据" center>
      <div class="comment">
        <span>备注</span>
        <el-input v-model="comment" style="width:50%" placeholder="请输入备注"></el-input>
      </div>
      <el-upload ref="upload" :auto-upload="false" :multiple="false" :on-change="handleChange" :on-remove="removeFile"
        :limit="1" action="" drag class="upload-demo">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadgoBack">返 回</el-button>
        <el-button type="primary" @click="submitImportExcel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listCoupon, listCouponBatch, getCouponById, addCoupon, updateCoupon, deleteCouponById, recoveryCouponById, generateCouponCode, listCouponCode, exportCouponCode, deleteCouponCode, recoveryCouponCode, productList4Select, bindCouponCodeToMobile } from '@/api/couponCode'
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
export default {
  components: {
    Pagination
  },
  data() {
    var storePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空！'));
        } else {
          let reg = /^1[0-9]{10}$/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号！'));
          }else{
            callback()
          } 
        }
    };
    const dar = this
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
         // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值
        disabledDate(time) {
          return time.getTime() < new Date(dar.expire).getTime();
        }
      },
      comment: "",
      itemPicker: "有效期：",
      facilitatorId: null,
      uploadCarwashId: null,
      uploadCarwashsId: null,
      expire: "",
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      fileList: "",
      itemId: null,
      item: {},
      dynamicValidateForm: {},
      expandLoading: false,
      lookEditDialog: false,
      centerDialogVisible: false,
      disabledPrice: true,
      period: false,
      uploaddialogVisible: false,
      loadingBootm: false,
      urlBl: false,
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      loading2: false,
      passDialog: false,
      editDialog: false,
      itemArr2: [],
      dialogList: {
        code: null,
        status: null,
        mobile: null
        // time: ["", ""]
      },
      itemObj: {
        openingBank: false,
        assignProduct: [],
        time:[],
        content: ""
      },
      rules: {
      },
      data: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      dialog: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        couponName: null,
        couponCode: null,
        name: null,
        alias: null,
        status: null,
        time: ["", ""],
      },
      statusList: [
        {
          name: '未上架',
          value: 0
        },
        {
          name: '正常上架',
          value: 1
        },
        {
          name: '已过期',
          value: 3
        },
        {
          name: '已作废',
          value: 4
        }
      ],
      statusList2: [
        {
          name: "未领取",
          id: 0
        },
        {
          name: "后台绑定",
          id: 1
        },
        {
          name: "未使用",
          id: 2
        },
        {
          name: "使用中",
          id: 3
        },
        {
          name: "已使用",
          id: 4
        },
        {
          name: "已过期",
          id: 5
        },
        {
          name: "作废",
          id: 10
        }
      ],
      statusList3: [],
      statusInfoList: [],
      obj: {},
      productList: []
    }
  },
  created() {
    this.selectInfo()
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    lookInto(item){
      this.dialogList = {
        code: null,
        mobile: null,
        status: null
      }
      var obj = {
          couponId: item.couponId,
          batchId: item.id
      }
      this.obj = obj
      this.look(obj)
    },
    expandChange(row,expandedRows){
      // 该处是用于判断是展开还是收起行，只有展开的时候做请求，避免多次请求！
      // 展开的时候expandedRows有值，收起的时候为空.
    //   if (expandedRows.length > 0) {
    //     this.expandLoading = true
    //     var data = {}
    //     data.generalId = row.id
    //     findGeneralLogBygeneralId(data).then(res=>{
    //        this.expandLoading = false
    //        if (!res.data || res.data.length <= 0) {
    //           this.$message("暂无数据~")
    //        }
    //        if( res.data && res.data.length > 0){
    //          // 遍历当前页面表
    //          this.data.data.forEach((temp, index) => {
    //             // 找到当前点击的行，把动态获取到的数据赋值进去
    //             if (temp.id === row.id) {
    //               this.data.data[index].data = res.data
    //             }
    //          });
    //        }
    //     })
    //   }
    },
    lookData(data){
      this.dialogList = {
        code: null,
        mobile: null,
        status: null
      }
      var obj = {
          couponId: data.id,
          batchId: ""
      }
      this.obj = obj
      this.look(obj)
    },
    look(item,filter){
      this.loading2 = true
      this.lookEditDialog = true
      var data = {}
      data.couponId = item.couponId
      if(item.batchId){
          data.batchId = item.batchId
      }
      if (filter && this.dialog.current_page > 1) {
        data.page = this.dialog.current_page;
      } else {
        this.data.current_page = 1;
      }
      if(this.dialogList.code){
        data.code = this.dialogList.code
      }
      if(this.dialogList.mobile){
        data.mobile = this.dialogList.mobile
      }
      if(!(this.dialogList.status == null)){
        data.status = this.dialogList.status
      }
    //   if(this.dialogList.time && this.dialogList.time[0] && this.dialogList.time[1]) {
    //     data.startTime = this.dialogList.time[0]
    //     data.endTime = this.dialogList.time[1]
    //   }
      data.pageNum = this.dialog.current_page
      data.pageSize = this.dialog.per_page
      listCouponCode(data).then(res=>{
         this.loading2 = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.dialog = {
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
          this.dialog = res;
          this.dialog.current_page = res.pageNum
          this.dialog.per_page = res.pageSize
          this.dialog.total = res.total
          this.dialog.data.forEach(v=>{
              if(v.status == 0){
                v.statusCopy = "未领取"
              }else if(v.status == 1){
                v.statusCopy = "后台绑定手机号码"
              }else if(v.status == 2){
                v.statusCopy = "未使用"
              }else if(v.status == 3){
                v.statusCopy = "使用中"
              }else if(v.status == 4){
                v.statusCopy = "已使用"
              }else if(v.status == 5){
                v.statusCopy = "已过期"
              }else if(v.status == 10){
                v.statusCopy = "作废/未领取"
              }else if(v.status == 11){
                v.statusCopy = "作废/后台绑定"
              }else if(v.status == 12){
                v.statusCopy = "作废/未使用"
              }else if(v.status == 13){
                v.statusCopy = "作废/使用中"
              }else if(v.status == 14){
                v.statusCopy = "作废/已使用"
              }else if(v.status == 15){
                v.statusCopy = "作废/已过期"
              }
          })
        }
      })
    },
    educe(item){
      window.location.href = `${baseUrl}/wash/coupon/exportCouponCode?couponId=${item.couponId}&batchId=${item.id}`
    },
    exportData2(item){
      if(this.dialog.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var { status } = this.dialogList
          if(status == null){
            status = ""
          }
          window.location.href = `${baseUrl}/wash/coupon/exportCouponCode?couponId=${this.obj.couponId}&status=${status}`
      }
    },
    resetGetData2(item){
      this.dialogList = {
        code: null,
        mobile: null,
        status: null
      }
      this.look(item)
    },
    handleSelectionChange2(val){
       this.itemArr2 = val
    },
    dialogRemove(item){
      if(item === 2){
        if(this.dialogList.status == null){
          this.$message({
            type: 'info',
            message: '请选择状态！'
          })
          return
        }
        if(this.itemArr2.length == 0){
          this.$message({
            type: 'info',
            message: '请选择数据！'
          })
          return
        }
        var arr = []
        this.itemArr2.forEach(v=>{
          arr.push(v.id)
        })
        var Arrs = arr.join(",")
        if(this.dialogList.status == 0 || this.dialogList.status == 1 || this.dialogList.status == 2 || this.dialogList.status == 3 || this.dialogList.status == 4 || this.dialogList.status == 5){
          this.open3('确定批量作废优惠券劵码？', Arrs, false)
        }else{
          this.open3('确定批量恢复已作废的优惠券卷码？', Arrs, true)
        }
      }else{
        var ids = String(item.id)
        if(item.status == 0 || item.status == 1 || item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5){
          this.open3('确定作废该优惠券劵码？', ids, false)
        }else{
          this.open3('确定恢复该已作废的优惠券卷码？', ids, true)
        }
      }
    },
    open3(text,id,bl) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading2 = true
          if(bl){
            recoveryCouponCode({ids: id}).then(res=>{
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.look(this.obj)
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
          }else{
            deleteCouponCode({ids: id}).then(res=>{
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.look(this.obj)
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    getPageData2(e) {
      this.look( this.obj , "page" )
    },
    getPageData3(e) {
      this.getIntoData( this.itemInto , "page" )
    },
    getCouponCode(){
      this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid){
            var data = this.dynamicValidateForm
            data.couponId = this.itemId
            console.log(data);
            generateCouponCode(data).then(res=>{
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.centerDialogVisible = false
                this.getData()
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }  
            })
          }
      })
    },
    audit(item){
      this.itemId = item.id
      this.centerDialogVisible = true
    },
    apiGetProduct(){
        productList4Select().then(res=>{
            if(res.code == 200){
                this.productList = res.data
            }else{
                this.$message(res.msg)
            }
        })
    },
    newlyIncreased(){
      this.apiGetProduct()
      this.itemPicker = "有效期："
      this.editDialog = true
      this.period = false
      this.disabledPrice = false
    },
    changePicker(){
      this.$forceUpdate()
    },
    remove(item){
      if(item.status == 4){
        this.open('确定恢复已作废优惠券？', item.id, true)
      }else{
         this.open('确定作废优惠券？', item.id, false)
      }
    },
    open(text,id, bl) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          if(bl){
            recoveryCouponById({id: id}).then(res=>{
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
          }else{
            deleteCouponById({id: id}).then(res=>{
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
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    compile(item){
      this.apiGetProduct()
      this.itemPicker = "有效期结束："
      this.editDialog = true
      this.disabledPrice = true
      this.period = true
      this.itemObj = item
      this.itemObj.assignProduct = item.assignProduct.split(",")
      this.itemObj.time = [item.effect , item.expire]
      this.expire = item.expire
    },
    itemEditDialog(){
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
                var data = {}
                data.title = this.itemObj.title
                data.type = this.itemObj.type
                data.isAssign = this.itemObj.isAssign
                data.discount = this.itemObj.discount
                data.content = this.itemObj.content
                if(this.itemObj.type === 2){
                    data.amount = this.itemObj.amount
                }
                if(this.itemObj.isAssign === 1){
                    data.assignProduct = this.itemObj.assignProduct.join()
                }else{
                    data.assignProduct = ""
                }
              if(this.itemObj.id){
                data.effect = this.itemObj.effect
                data.expire = this.itemObj.expire
                data.id = this.itemObj.id
                updateCoupon(data).then(res=>{
                  if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.editDialog = false
                  }else{
                    this.$message({
                        type: 'info',
                        message: res.msg
                    })
                  }
                })
              }else{
                if(this.itemObj.time[0] && this.itemObj.time[1]) {
                  data.effect = this.itemObj.time[0]
                  data.expire = this.itemObj.time[1]
                }
                addCoupon(data).then(res=>{
                  if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.editDialog = false
                  }else{
                    this.$message({
                        type: 'info',
                        message: res.msg
                    })
                  }
                })
              }
          }
      })
    },
    close(){
      this.itemObj = {
          openingBank: false,
          assignProduct: [],
          time:[],
          content: ""
      }
      this.getData()
      this.expire = ""
    },
    close2(){
    },
    closeVis(){
      this.dynamicValidateForm = {}
      this.itemId = null
    },
    async selectInfo(){
    },
    exportData(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {couponName,couponCode,name,alias,status,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          window.location.href = `${baseUrl}/wash/generalCouponExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}
          &couponName=${couponName}&couponCode=${couponCode}&name=${name}&alias=${alias}&status=${status}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    submitImportExcel() {
        if (this.fileList) {
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('couponId', this.obj.couponId)
          formData.append('remark', this.comment)
          bindCouponCodeToMobile(formData).then(res => {
            if(res.code == 200){
              this.uploaddialogVisible = false
              this.$message({
                type: 'success',
                message: `上传成功!`
              })
              this.look(this.obj)
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
    importExcel() {
        this.fileList = null
        this.uploaddialogVisible = true
        this.$nextTick((i) => {
          this.$refs.upload.clearFiles()
        })
    },
    uploadgoBack() {
        this.uploaddialogVisible = false
    },
    removeFile(file, fileList) {
        this.fileList = null
    },
    handleChange(file, fileList) {
        this.fileList = fileList
    },
    getList(data){
      this.getData()
    },
    // 比较是否超过当前时间，严格上讲时间戳在后台生成是比较好的
    isThreeHourAgo(time) {
      const now = Date.now()
      const d = new Date(time)
      const secDiff = (now - d) / 1000
      return secDiff > 3 * 60 * 60
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
    //   if (queryList.couponName) {
    //     data.couponName = queryList.couponName
    //   }
      if(!(queryList.status == null)){
        data.status = queryList.status
      }
    //   if (queryList.time && queryList.time[0] && queryList.time[1]) {
    //     data.startTime = queryList.time[0]
    //     data.endTime = queryList.time[1]
    //   }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      listCoupon(data).then(res=>{
        this.loading = false;
        if (res.msg == "暂无数据") {
          this.$message("暂无数据~")
          this.data = {
              current_page: 1,
              data: [],
              last_page: 1,
              per_page: 10,
              total: 0,
              link: ""
            }
        }
        if(res.data && res.data.length > 0){
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          res.data.map(v=>{
            if(v.status == 0){
                v.statusCopy = "未上架"
            }else if(v.status == 1){
                v.statusCopy = "正常上架"
            }else if(v.status == 3){
                v.statusCopy = "已过期"
            }else if(v.status == 4){
                v.statusCopy = "已作废"
            } 
            if(v.type == 1){
                v.typeCopy = "直减"
                v.discountCopy = this.discountNum(v.discount) + "元"
            }else if(v.type == 2){
                v.typeCopy = "满减"
                v.discountCopy = this.discountNum(v.discount) + "元"
            }else if(v.type == 3){
                v.typeCopy = "折扣"
                v.discountCopy = this.discountNum2(v.discount) + "折"
            }
            v.amountCopy = this.discountNum(v.amount) + "元"
            v.data = []
          })
          this.data.data = res.data
        }
      })
    },
    discountNum(number){
        return isNaN(number) ? 0.00 : parseFloat((number/100).toFixed(2))
    },
    discountNum2(number){
        return isNaN(number) ? 0.00 : parseFloat((number/10).toFixed(2))
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        couponName: null,
        couponCode: null,
        name: null,
        alias: null,
        status: null,
        time: ["", ""],
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
/* element样式重置 start */
 // 处理input type = number的上下箭头
 @import "../../styles/cascader.css";
 /deep/.el-table__expanded-cell{
   background: #f0f9eb !important;
 }
 /deep/.el-table__expand-icon {
   height: 60px;
   >i{
     font-size: 25px;
   }
 }
.inputNumber{
  width: 300px;
  margin-left: 20px;
}
/deep/.el-date-editor .el-range-input{
  width: auto;
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
 .avatar-uploader-icon {
   border: 1px dashed #DFDFDF;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   font-size: 12px;
   color: #8c939d;
   width: 150px;
   height: 100px;
   line-height: 100px;
   text-align: center;
 }
 .avatar {
   width: 150px;
   height: 100px;
   display: block;
 }
  .upload-demo {
    text-align: center;
    padding: 0 100px;
  }
  .info{
    width: 300px;
    .infoItem{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .5rem;
      .left,.right{
        flex-shrink: 0;
        max-width: 50%
      }
      .left{
        font-weight: bold
      }
    }
  }
  .comment{
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    >span{
      margin-right: 12px;
    }
  }
</style>
