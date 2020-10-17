<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.name"
          placeholder="请输入车站名称"
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
      <el-table-column label="车站名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车站首字母" prop="fullSpell" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.fullSpell }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车站英文全称" prop="firstSpell" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.firstSpell }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省" prop="province" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区" prop="area" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
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

    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editNewlyDialog"
      width="50%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="车站名称：" prop="name" style="width: 100%">
                  <el-input v-model="itemObj.name" style="width: 300px;" placeholder="请输入车站名称"></el-input>
              </el-form-item>
              <el-form-item label="车站名拼音首字符：" prop="fullSpell" style="width: 100%">
                  <el-input v-model="itemObj.fullSpell" style="width: 300px;" placeholder="请输入车站名拼音首字符"></el-input>
              </el-form-item>
              <el-form-item label="车站名拼音全拼：" prop="firstSpell" style="width: 100%">
                  <el-input v-model="itemObj.firstSpell" style="width: 300px;" placeholder="请输入车站名拼音全拼"></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="status" style="width: 100%">
                  <el-radio-group v-model="itemObj.status">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">正常</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="省:" prop="provinceId" style="width:100%">
                <el-select v-model="itemObj.provinceId" placeholder="请选择省份" @change="changeCity(itemObj.provinceId)" :disabled="disabledCity" style="width: 300px;">
                    <el-option v-for="(item, idx) in areaJson" :key="idx" :label="item.province" :value="item.provinceid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="市:" prop="cityId" style="width:100%">
                <el-select v-model="itemObj.cityId" placeholder="请选择城市" @change="changeCounty(itemObj.cityId)" :disabled="disabledCity" style="width: 300px;">
                    <el-option v-for="(item, idx) in cityList" :key="idx" :label="item.city" :value="item.cityid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区:" prop="areaId" style="width:100%">
                <el-select v-model="itemObj.areaId" placeholder="请选择区/县"  @change="regionChange" :disabled="disabledCity" style="width: 300px;">
                    <el-option v-for="(item, idx) in countyList" :key="idx" :label="item.area" :value="item.areaid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址：" prop="address" style="width: 100%">
                  <el-input type="textarea" :rows="2" v-model="itemObj.address" style="width: 300px;" :disabled="disabledCity" placeholder="请输入详细地址"></el-input>
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
import { ttStationList, addTTStation, delTTStaion, updTTStaion } from '@/api/ticket/stationList'
import Pagination from "@/components/Pagination"
import { findYuyueCityByProvinceid , findYuyueAreasByCityid , findYuyueProvinces } from '@/api/nodeList'  // 省市区数据
import { string } from 'jszip/lib/support'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogTitle: "",
      disabledCity: false,
      editNewlyDialog: false,
      loadingBootm: false,
      loading: false,
      itemArr: [],
      areaJson: [],
      cityList: [],
      countyList: [],
      itemObj: {
        status: 1
      },
      rules: {
          name: [
            { required: true, message: '请输入车站名称', trigger: 'blur' }
          ],
          fullSpell: [
            { required: true, message: '请输入车站首字母', trigger: 'blur' }
          ],
          firstSpell: [
            { required: true, message: '请输入车站英文全称', trigger: 'blur' }
          ],
          // address: [
          //   { required: true, message: '请输入详细地址', trigger: 'blur' }
          // ],
          provinceId: [
              { required: true, message: '请选择省份', trigger: 'blur' }
          ],
          cityId: [
              { required: true, message: '请选择城市', trigger: 'blur' }
          ],
          areaId: [
              { required: true, message: '请选择区/县', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
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
        name: null
      },
    }
  },
  created() {
    this.getData()
    this.ApiAreaJson()
  },
  methods: {
    handleSelectionChange(val) {
        this.itemArr = val
    },
    itemDialog(){
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
              if(this.itemObj.id){
                  var data = {}
                  data.id = this.itemObj.id
                  data.name = this.itemObj.name
                  data.fullSpell = this.itemObj.fullSpell
                  data.firstSpell = this.itemObj.firstSpell
                  data.status = this.itemObj.status
                  updTTStaion(data).then(res=>{
                      this.editNewlyDialog = false
                      this.$message({
                           message: '修改成功！',
                           type: 'success'
                       })
                  })
              }else{
                  addTTStation(this.itemObj).then(res=>{
                  if(res.code == 200){
                      this.editNewlyDialog = false
                      this.$message({
                           message: '新增成功！',
                           type: 'success'
                       })
                  }else{
                      this.$message.error(res.msg)
                  }
              })
              }
          }
        })
    },
    changeCity(id,num){
      findYuyueCityByProvinceid({provinceid: id}).then(res=>{
        this.cityList = res.data
        if(num === 1){
            // 编辑数据初始化
           findYuyueAreasByCityid({cityid: this.itemObj.cityId}).then(res=>{
                this.countyList = res.data
           })  
        }else{
            this.itemObj.cityId = this.cityList[0].cityid
            this.changeCounty(this.itemObj.cityId)
        }
      })
    },
    changeCounty(id){
      findYuyueAreasByCityid({cityid: id}).then(res=>{
        this.countyList = res.data
        this.itemObj.areaId = this.countyList[0].areaid
      })
    },
    regionChange(){
        this.$forceUpdate()
    },
    ApiAreaJson(){
      findYuyueProvinces().then(res=>{
        this.areaJson = res.data
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
          arr.push(v.id)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.id])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delTTStaion({ids: id}).then(res=>{
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
      if (queryList.name) {
        data.name = queryList.name
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
      ttStationList(data).then(res=>{
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
        status: 1
      }
      this.disabledCity = false
      this.loadingBootm = false
      this.getData()
    },
    newly(){
        this.editNewlyDialog = true
        this.dialogTitle = "新增车站"
    },
    compile(item){
        item.cityId = String(item.cityId)
        item.provinceId = String(item.provinceId)
        item.areaId = String(item.areaId)
        this.itemObj = item
        this.editNewlyDialog = true
        this.disabledCity = true
        this.dialogTitle = "编辑车站"
        this.changeCity(item.provinceId,1)
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        name: null
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
