<template>
  <div class="list">
        <div v-for="(item,index) in checkBoxList.children" :key="index" class="item_box">
            <div class="item_list" >
              <el-checkbox :label="item.id" @change="changeList(item)">{{item.name}}</el-checkbox>
            </div>
            <custom-list v-if="item.children && item.children.length>0" :checkBoxList="item" :checkBoxListCopy="checkedCities"></custom-list> 
            <!-- <custom-list v-else :checkBoxList="item" :checkBoxListCopy="checkedCities"></custom-list>  -->
        </div>
  </div>
</template>

<script>
import MenuItem from './liSlot'
import bus from '@/utils/bus'
export default {
    name: 'custom-list',
    components: {
        MenuItem
    },
    props: {
        checkBoxList: {
            type: Object,
            default() {
                return {}
            }
        },
        checkBoxListCopy: {
            // 练手用
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed: {
        
    },
    mounted(){
        // console.log(this.checkBoxList);
    },
    watch: {
        
    },
    data(){
        return{
            checkAll: false,
            checkedCities: this.checkBoxListCopy,
            isIndeterminate: true
        }
    },
    methods: {
        changeList(val){
            var obj = this.checkedCities

            if(obj.id === val.pid){
                 if(obj.arr.indexOf(val.pid) === -1){
                     obj.arr.push(val.pid)
                 }
            }else{
                if(obj.children){
                   var objList = this.recursiveAlgorithm(obj.children,val.pid)
                   console.log(objList);
                    //  if(obj.arr.indexOf(objList.pid) === -1){
                    //      obj.arr.push(val.pid)
                    //   } 
                }
            }

            
            
            // bus.$emit('checklist', { arr: obj.arr , id: obj.id})
            bus.$emit('checklist', {id: obj.id})   // 因为做了双向绑定，这一步的事件完全是多余的。仅是为了练手用
        },
        recursiveAlgorithm(data,pid){  // 递归查找当前项在哪里
            var obj = {}
            data.forEach(v=>{
                  if(v.id === pid){
                      obj = v
                      return 
                  }else{
                      if(v.children){
                          this.recursiveAlgorithm(v.children,pid)
                      }
                  }
            })
            return obj
        }
    }
}
</script>

<style lang="less" scoped>
.item_box{
    margin-left: 20px;
}
.flex{
    display: flex;
    align-items: center;
}
.item{
    color: #000;
    background: #000;
    height: 30px;
    width: 30px;
}
.item_list{
    margin: 15px 0;
}
.list{
    margin-left: 20px;
}
</style>