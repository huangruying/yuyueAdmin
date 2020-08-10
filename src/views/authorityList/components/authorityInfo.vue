<template>
  <div class="authorityInfo">
        <div v-for="(item,index) in dataList" :key="index">
            <el-checkbox-group v-model="item.arr">
                <div style="margin: 15px 0;">
                    <el-checkbox :label="item.id" border @change="changeList2(dataList)">{{item.name}}</el-checkbox>
                </div>
                <el-checkbox border size="mini" :indeterminate="item.isIndeterminate" v-model="item.bl" @change="handleCheckAllChange(item)" v-if="item.children && item.children.length>1" style="margin-left: 10px;">全选/全不选</el-checkbox>
                <checkList :checkBoxList="item" v-if="item.children" :checkBoxListCopy="item"></checkList>
            </el-checkbox-group>
        </div>
    <!-- <div style="display: none;">{{dataList}}</div> -->
  </div>
</template>

<script>
import checkList from './list'
import bus from '@/utils/bus'
export default {
    components: {
        checkList
    },
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },
    },
    watch: {
    },
    data(){
        return{
            infoList: []
        }
    },
    mounted(){
        bus.$on('checklist', (val) => {
            // 因为做了双向绑定，这一步的事件完全是多余的。仅是为了练手用
           var data = this.dataList
            this.$emit('dataList', { dataList: data })
        });
    },
    computed: {
        dataList: {
            get() {
                return this.list
            },
            set(val) {
                this.$emit('update:list', val)
            }
        }
    },
    methods: {
        changeList2(val){
             this.$emit('dataList', { dataList: val })
        },
         handleCheckAllChange(val) {
             val.arr.map((v,index)=>{
                 if(!v){
                     val.arr.splice(index,1)
                 }
             })
            var arr = []
            this.dataList.map(v=>{
                if(v.id === val.id){
                   v.bl = !v.bl
                   arr.push(val.id)
                   val.children.forEach(i=>{
                       arr.push(i.id)
                       if(i.children){
                         this.infoList = []
                         var arr2 = this.recursion(i.children)
                         arr = arr.concat(arr2)
                       }
                   })
                }
             })
            this.dataList.map(value=>{
                if(value.id === val.id){
                    if(!value.bl){
                        value.isIndeterminate = true
                        value.arr = []
                    }else{
                        value.isIndeterminate = false
                        value.arr = arr
                    }
                }
            })
             this.$emit('dataList', { dataList: this.dataList })
            //  this.dataList = this.dataList
        },
        recursion (data){
            var arr = this.infoList
            data.forEach(v=>{
                arr.push(v.id)
                if(v.children){
                    this.recursion(v.children)
                }
            })
            return arr
        },
        handleCheckedCitiesChange(value) {
            // let checkedCount = value.length;
            // this.checkAll = checkedCount === this.cities.length;
            // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        }
    }
}
</script>

<style lang="less" scoped>
    .btnbox{
        background: #304156;
        display: block;
        color: #fff;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        border-radius: 5px;
        text-align: center;
    }
    // .item_box{
    //     margin-left: 20px;
    // }
    // .flex{
    //     display: flex;
    //     align-items: center;
    // }
    // .item{
    //     color: #000;
    //     background: #000;
    //     height: 30px;
    //     width: 30px;
    // }
    // .item_list{
    //     margin: 15px 0;
    // }
    // .list{
    //     margin-left: 20px;
    // }
</style>