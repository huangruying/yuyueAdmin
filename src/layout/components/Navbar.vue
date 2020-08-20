<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="modification">
            <span style="display:block;">修改资料</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改资料"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" style="width: 100%;" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="原密码" style="width: 100%;" prop="password">
          <el-input v-model="formData.password" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" style="width: 100%;" prop="newPassword">
          <el-input v-model="formData.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { userupdatePwd } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data(){
    return {
      dialogVisible: false,
      userid: "",
      formData: {
        username: "",
        password: "",
        newPassword: ""
      },
      rules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      var res = await this.$store.dispatch('user/logout')
       this.$message({
         message: '退出登录成功！',
         type: 'success'
       })
       this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // if(res.code == '200'){
      //   this.$message({
      //     message: '退出登录成功！',
      //     type: 'success'
      //   })
      //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // }else{
      //   this.$message({
      //     message: '退出失败！',
      //     type: 'error'
      //   })
      // }
    },
    modification(){
        var data = localStorage.getItem('data')
        var data = JSON.parse(data)
        this.userid = data.id
        this.formData.username = data.name
        this.dialogVisible = true
    },
    async submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.id = this.userid
          userupdatePwd(this.formData).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: "修改成功！"
              })
              this.$store.dispatch('user/logout')
              this.$router.push('/login')
            }else{
              this.$message(res.msg)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
