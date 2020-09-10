<template>
  <div class="Tree">
      <div>
        <p class="text_color">新增菜单会在该菜单子级添加页面。若没有子级，则该菜单会自动生成子级菜单页面，原菜单会变成折叠状态</p>
        <el-button type="primary" icon="el-icon-plus" round @click="appendOne">新增1级菜单</el-button>
        <el-tree
            :data="dataChildren"
            default-expand-all
            highlight-current
            leafOnly
            node-key="id"
            :props="defaultProps"
            ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    circle
                    @click="() => append(data)">
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="() => edit(data)"></el-button>
                <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                    @click="() => remove(node, data)">
                </el-button>
                </span>
            </span>
        </el-tree>
      </div>
      <el-dialog
        :title="dialogText"
        :visible.sync="dialogVisible"
        @close="close"
        width="30%">
        <el-form :model="objList" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="菜单名称" prop="name">
                <el-input type="text" v-model="objList.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单编码" prop="code">
                <el-input type="text" v-model="objList.code"></el-input>
            </el-form-item>
            <el-form-item label="url文件名" prop="path">
                <el-input type="text" v-model="objList.path"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { findTreeMenus } from '@/api/authorityList'
import { addOrUpdatePerm, delPerm } from '@/api/Tree'
export default {
    data(){
        return{
            dialogText: "",
            menuId: "",
            dataChildren: [],
            objList: {},
            dialogVisible: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            rules: {
                name: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
                code: [{required: true, message: '请输入菜单编码', trigger: 'blur'}],
                path: [
                    {required: true, message: '请输入url文件名', trigger: 'blur'},
                    {pattern: /^[a-zA-Z]+$/ ,message: '文件名不合法'}
                ]
            }
        }
    },
    mounted(){
        this.getList()
    },
    methods: {
        getList(){
            findTreeMenus().then(res=>{
                var data = res.data
                this.dataChildren = data
            })
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var data = {}
                    if(this.menuId){
                        data.id = this.menuId
                        data.pid = this.objList.pid
                    }else{
                        data.pid = this.objList.id
                    }
                    data.name = this.objList.name
                    data.code = this.objList.code
                    data.path = "/" + this.objList.path
                    addOrUpdatePerm(data).then(res=>{
                        if(res.code == 200){
                            this.$message({
                                type: "success",
                                message: "操作成功！"
                            })
                            this.dialogVisible = false
                        }else{
                            this.$message.error(res.mag)
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        appendOne(){
            this.dialogText = "新增1级菜单"
            this.dialogVisible = true
            this.objList = {
                name: "",
                code: "",
                id: -1
            }
        },
        append(data) {
            this.dialogText = "新增菜单"
            this.dialogVisible = true
            this.objList = {
                name: "",
                code: "",
                id: data.id,
                pid: data.pid
            }
        },
        edit(data){
            this.dialogText = "编辑菜单"
            this.dialogVisible = true
            this.objList = data
            this.menuId = data.id
        },
        remove(node, data) {
            this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    delPerm({id: data.id}).then(res=>{
                        if(res.code == 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getList()
                        }else{
                            this.$message(res.msg)
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })       
            })
        },
        close(){
            this.$refs['ruleForm'].resetFields();
            this.menuId = ""
            this.objList = {}
            this.getList()
        }
    }
}
</script>

<style scoped lang="less">
/deep/.el-tree-node__content{
    height: 38px;
}
.text_color{
    color: #f00;
}
.Tree{
    >div{
        margin: 20px 50px;
    }
}
</style>