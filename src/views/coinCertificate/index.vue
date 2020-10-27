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
        <el-table-column label="兑换券名称" prop="title" align="center" width="200px">
            <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column label="简介" prop="brief" align="center"  width="200px">
            <template slot-scope="scope">
            <span>{{ scope.row.brief }}</span>
            </template>
        </el-table-column>
        <el-table-column label="有效期类别" prop="validType" align="center" width="100px">
            <template slot-scope="scope">
            <span>{{ scope.row.validType==0? '固定有效期': '动态有效期' }}</span>
            </template>
        </el-table-column>   
        <el-table-column label="生效时间" prop="effect" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.effect }}</span>
            </template>
        </el-table-column>
        <el-table-column label="失效时间" prop="expire" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.expire }}</span>
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
        <el-table-column label="状态" prop="statusCopy" align="center" width="180px">
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
      width="80%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="180px" :model="itemObj" class="clearFix">
              <el-form-item label="兑换券名称：" prop="title" style="width: 100%" :rules="[{ required: true, message: '请输入兑换券名称', trigger: 'blur' }]" >
                  <el-input v-model="itemObj.title" style="width:50%" placeholder="请输入兑换券名称" @input="forceUpdate"></el-input>
              </el-form-item>
              <el-form-item label="简介：" prop="brief" style="width: 100%" :rules="[{ required: true, message: '请输入简介', trigger: 'blur' }]" >
                  <el-input v-model="itemObj.brief" style="width:50%" placeholder="请输入简介" @input="forceUpdate"></el-input>
              </el-form-item>
              <el-form-item label="有效期类别：" prop="validType" style="width: 100%" :rules="[{ required: true, message: '请选择优惠券类别', trigger: 'change' }]">
                    <el-radio-group v-model="itemObj.validType" @change="forceUpdate">
                        <el-radio :label="0">固定有效期</el-radio>
                        <el-radio :label="1">动态有效期（从领用时算）</el-radio>
                    </el-radio-group>
              </el-form-item>
              <el-form-item label="有效期：" v-if="itemObj.validType == 1" prop="validNum" style="width: 100%" :rules="[{ required: true, message: '请输入有效期', trigger: 'blur' }]" >
                  <el-input placeholder="请输入有效期数量" v-model="itemObj.validNum" @input="forceUpdate" class="input-with-select" style="width: 350px" oninput="value=value.replace(/[^0-9]/g,'')">
                        <el-select v-model="itemObj.validUnit" slot="append" placeholder="请选择" style="width: 110px" @change="forceUpdate">
                            <el-option label="时" value="0"></el-option>
                            <el-option label="日" value="1"></el-option>
                            <el-option label="周" value="2"></el-option>
                            <el-option label="月" value="3"></el-option>
                            <el-option label="季" value="4"></el-option>
                            <el-option label="年" value="5"></el-option>
                        </el-select>
                  </el-input>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="time" style="width: 100%" v-if="itemObj.validType == 0 && !period" :rules="[{ type: 'array', required: true, message: '请选择时间', trigger: 'change' }]">
                 <el-date-picker
                    :key="'period2'"
                    style="width: 400px"
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
              <el-form-item :label="itemPicker" prop="expire" style="width: 100%" v-if="itemObj.validType == 0 && period" :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]">
                  <el-date-picker
                    style="width: 400px"
                    :key="'period'"
                    v-model="itemObj.expire"
                    type="datetime"
                    default-time="23:59:59"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions2"
                    placeholder="有效期结束">
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="是否特定产品可用：" prop="isAssign" style="width: 100%">
                    <el-checkbox-group v-model="itemObj.checkboxList" :max="1" @change="forceUpdate">
                        <el-checkbox :label="1">渠道产品</el-checkbox>
                        <el-checkbox :label="2">供应商产品</el-checkbox>
                    </el-checkbox-group>
              </el-form-item> 
              <el-form-item label="可用渠道产品" v-if="itemObj.checkboxList[0] === 1" prop="cpid" style="width: 100%" :rules="[{ required: true, message: '请至少选择一个渠道产品', trigger: 'change'}]">
                    <el-radio-group v-model="itemObj.cpid" @change="forceUpdate">
                        <el-radio border :label="item.id" :name="item.id" v-for="(item,index) in productList" :key="index" style="margin-bottom: 10px;">{{item.name}}</el-radio>
                    </el-radio-group>
              </el-form-item>
              <el-form-item label="可用供应商产品" v-if="itemObj.checkboxList[0] === 2" prop="ppid" style="width: 100%" :rules="[{ required: true, message: '请至少选择一个供应商产品', trigger: 'change'}]">
                    <el-radio-group v-model="itemObj.ppid" @change="forceUpdate">
                        <el-radio border :label="item.id" :name="String(item.id)" v-for="(item,index) in findIproductInfosList" :key="index" style="margin-bottom: 10px;">{{item.name}}</el-radio>
                    </el-radio-group>
              </el-form-item>
              <el-form-item label="说明详情：" prop="description" style="width: 100%">
                  <!-- <quillEditor v-model="itemObj.description" ref="myQuillEditor" :options="editorOption"/> -->
                  <editor-bar v-model="itemObj.description" :isClear="isClear"></editor-bar>
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
      width="50%"
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
          <el-form-item label="渠道：" prop="channelId" style="width: 100%">
            <el-radio-group v-model="dynamicValidateForm.channelId" @change="forceUpdate">
                <el-radio :label="value.id" v-for="value in channelList" :key="value.id" border style="margin-bottom: 8px;">{{ value.name }}</el-radio>
            </el-radio-group>
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
          <el-select v-model="dialogList.channelId" @change="look(obj)" class="input fl" placeholder="请选择渠道">
            <el-option
              v-for="item in channelList"
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
           <el-button type="primary" @click="exportData2(obj)">导出券码</el-button>
           <el-button type="primary" @click="importExcel">导入券码</el-button>
           <el-button type="primary" icon="el-icon-search" @click="look(obj)">搜索</el-button>
         </div>
         <div>
           <el-button type="primary" @click="exportDataList">下载模板</el-button>
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
          <el-table-column label="渠道" prop="channelName" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.channelName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用人" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用人手机号" prop="mobile" align="center">
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
import { listRedeem, productList4Select, findIproductInfos, addRedeem, updateRedeem, deleteRedeemById, recoveryRedeemById, list4Select, listRedeemCode, deleteRedeemCode, recoveryRedeemCode, bindRedeemCodeToMobile, generateRedeemCode } from '@/api/coinCertificate'
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
// 富文本编辑器
// import { quillEditor } from "vue-quill-editor"; 
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
import EditorBar from './components/wangEnduit'
export default {
  components: {
    Pagination,
    // quillEditor
    EditorBar
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
      isClear: false,
      editorOption: {},
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
      channelList: [],
      dialogList: {
        code: null,
        status: null,
        mobile: null,
        channelId: null
        // time: ["", ""] 
      },
      itemObj: {
        checkboxList: [],
        time:[],
        validUnit: "3",
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
        status: null
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
      productList: [],
      findIproductInfosList: []
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
          channelId: item.channelId?item.channelId: '',
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
      this.apiList4Select()
      this.dialogList = {
        code: null,
        mobile: null,
        status: null
      }
      var obj = {
          redeemId: data.id,
          batchId: "",
          channelId: ""
      }
      this.obj = obj
      this.look(obj)
    },
    look(item,filter){
      this.loading2 = true
      this.lookEditDialog = true
      var data = {}
      data.redeemId = item.redeemId
      if(item.batchId){
        data.batchId = item.batchId
      }
      if(item.channelId){
        data.channelId = item.channelId
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
      if(!(this.dialogList.channelId == null)){
        data.channelId = this.dialogList.channelId
      }
    //   if(this.dialogList.time && this.dialogList.time[0] && this.dialogList.time[1]) {
    //     data.startTime = this.dialogList.time[0]
    //     data.endTime = this.dialogList.time[1]
    //   }
      data.pageNum = this.dialog.current_page
      data.pageSize = this.dialog.per_page
      listRedeemCode(data).then(res=>{
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
      var { status } = this.dialogList
        if(status == null){
          status = ""
        }
      window.location.href = `${baseUrl}/wash/redeem/exportRedeemCode?redeemId=${this.obj.redeemId}&batchId=${item.id}&channelId=${item.channelId}&status=${status}`
    },
    exportDataList() {
      window.location.href = `https://dot-bucket.oss-cn-shenzhen.aliyuncs.com/static/couponexceldemo.xlsx`;
    },
    exportData2(obj){
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
        window.location.href = `${baseUrl}/wash/redeem/exportRedeemCode?redeemId=${this.obj.redeemId}&batchId=${this.obj.batchId}&channelId=${this.obj.channelId}&status=${status}`
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
          console.log(id);
          if(bl){
            recoveryRedeemCode({ids: id}).then(res=>{
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
            deleteRedeemCode({ids: id}).then(res=>{
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
            data.redeemId = this.itemId
            generateRedeemCode(data).then(res=>{
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
    apiList4Select(){
      list4Select().then(res=>{
          if(res.code == 200){
            this.channelList = res.data
          }else{
            this.$message(res.msg)
          }
      })
    },
    audit(item){
      this.itemId = item.id
      this.centerDialogVisible = true
      this.apiList4Select()
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
    apiFindIproductInfos(){
        findIproductInfos().then(res=>{
            if(res.code == 200){
                this.findIproductInfosList = res.data
            }else{
                this.$message(res.msg)
            }
        })
    },
    newlyIncreased(){
      this.apiGetProduct() 
      this.apiFindIproductInfos()
      this.itemPicker = "有效期："
      this.editDialog = true
      this.period = false
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
            recoveryRedeemById({id: id}).then(res=>{
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
            deleteRedeemById({id: id}).then(res=>{
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
    forceUpdate(){
      this.$forceUpdate()
    },
    compile(item){
      this.apiGetProduct() 
      this.apiFindIproductInfos()
      this.itemPicker = "有效期结束："
      this.editDialog = true
      this.period = true
      var obj = Object.assign(this.itemObj,item)
      if(obj.validType == 1){
        obj.validUnit = String(obj.validUnit)
      }
      if(obj.ppid){
        obj.checkboxList = [2]
      }else if(obj.cpid){
        obj.checkboxList = [1]
        obj.cpid =  String(obj.cpid)
      }else{
        obj.checkboxList = []
      }
      this.itemObj = obj
      if(item.effect && item.expire){
        this.itemObj.time = [item.effect , item.expire]
        this.expire = item.expire
      }
    },
    itemEditDialog(){
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
                var data = {}
                data.title = this.itemObj.title
                data.brief = this.itemObj.brief
                data.description = this.itemObj.description
                if(this.itemObj.checkboxList && this.itemObj.checkboxList[0] === 1){
                  data.cpid  = this.itemObj.cpid
                }else if(this.itemObj.checkboxList && this.itemObj.checkboxList[0] === 2){
                  data.ppid  = this.itemObj.ppid
                }
                data.validType = this.itemObj.validType
              if(this.itemObj.id){
                if(this.itemObj.validType === 1){
                    data.validNum = this.itemObj.validNum
                    data.validUnit = this.itemObj.validUnit
                }else{
                    data.effect = this.itemObj.effect
                    data.expire = this.itemObj.expire
                }
                data.id = this.itemObj.id
                updateRedeem(data).then(res=>{
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
                if(this.itemObj.validType === 1){
                    data.validNum = this.itemObj.validNum
                    data.validUnit = this.itemObj.validUnit
                }else{
                    data.effect = this.itemObj.time[0]
                    data.expire = this.itemObj.time[1]
                }
                addRedeem(data).then(res=>{
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
          checkboxList: [],
          time:[],
          validUnit: "3",
          content: ""
      }
      this.getData()
      this.expire = ""
    },
    close2(){
      this.dialogList = {
        code: null,
        status: null,
        mobile: null,
        channelId: null
      }
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
          formData.append('redeemId', this.obj.redeemId)
          if(this.obj.channelId){
            formData.append('channelId', this.obj.channelId)
          }
          formData.append('remark', this.comment)
          bindRedeemCodeToMobile(formData).then(res => {
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
      listRedeem(data).then(res=>{
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
          })
          this.data.data = res.data
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
        status: null
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
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
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
