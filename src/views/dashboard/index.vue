<template>
<!-- <div id="myCharts" ref="myCharts" class="myCharts"></div> -->
  <div class="dashboard-container">
    
    <!-- :style="{backgroundImage:`url(${srcImg})` -->
    <div class="dashboard-text">欢迎来到愉悦超级管理后台~</div>
  </div>
</template>

<script>
// import echarts from 'echarts'
// import 'echarts/map/js/world.js'
// import 'echarts-gl'
export default {
  name: 'indexDashboard',
  computed: {
  },
  data(){
    return{
      // srcImg: require('http://img2.imgtn.bdimg.com/it/u=1977934261,2101514239&fm=26&gp=0.jpg')
    }
  },
  destoryed(){
    // this.myCharts.clear()
  },
  mounted(){
    // "https://echarts.apache.org/examples/data-gl/asset/world.topo.bathy.200401.jpg"
    // "https://echarts.apache.org/examples/data-gl/asset/starfield.jpg"
    // "https://echarts.apache.org/examples/data-gl/asset/pisa.hdr"
    // const myCharts = echarts.init(this.$refs.myCharts);
    // let options = {
    //     backgroundColor: '#000',
    //     globe: {
    //         baseTexture: require("../../assets/image/world.topo.bathy.200401.jpg"),
    //         heightTexture: require("../../assets/image/world.topo.bathy.200401.jpg"),
    //         displacementScale: 0.04,
    //         shading: 'realistic',
    //         environment: require("../../assets/image/starfield.jpg"),
    //         realisticMaterial: {
    //             roughness: 0.9
    //         },
    //         postEffect: {
    //             enable: true
    //         },
    //         light: {
    //             main: {
    //                 intensity: 5,
    //                 shadow: true
    //             },
    //             ambientCubemap: {
    //                 // texture: require("../../assets/image/pisa.hdr"),
    //                 diffuseIntensity: 0.2
    //             }
    //         }
    //     }
    // };
    // myCharts.setOption(options);
  }
}
</script>

<style lang="scss" scoped>
.myCharts{
  height: calc(100vh - 50px);
  width: 100%;
}
.dashboard {
  &-container {
    width: 100%;
    height: calc(100vh - 50px);
    padding: 30px; // 背景图
    // background: url("../../assets/iconImg/homePage.jpg");
    // background-size: cover;
    // background-size: 100% auto;
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
  }
  &-text {
    font-size: 1.5rem;
    line-height: 46px;
  }
}
</style>

