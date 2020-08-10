<template>
  <div class="dashboard-container">
    <!-- :style="{backgroundImage:`url(${srcImg})` -->
    <div class="dashboard-text">欢迎来到愉悦超级管理后台</div>
  </div>
</template>

<script>
export default {
  name: 'indexDashboard',
  computed: {
  },
  data(){
    return{
      // srcImg: require('http://img2.imgtn.bdimg.com/it/u=1977934261,2101514239&fm=26&gp=0.jpg')
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    width: 100%;
    height: calc(100vh - 50px);
    padding: 30px; // 背景图
    background: url("../../assets/iconImg/homePage.jpg");
    // background-size: cover;
    // background-size: 100% auto;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  &-text {
    font-size: 1.5rem;
    line-height: 46px;
  }
}
</style>

