<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
    <!-- <el-button type="primary" @click="getHtml">点我获取</el-button> -->
  </div>
</template>

<script>
//   import axios from 'axios'
  import E from 'wangeditor'
  import { dotOssUpload } from '@/api/nodeList'
  export default {
    name: 'editoritem',
    data() {
      return {
        // uploadPath,
        editor: null,
        info_: null
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isClear(val) {
        // 触发清除文本域内容
        if (val) {
          this.editor.txt.clear()
          this.info_ = null
        }
      },
      value: function(value) {
        if (value !== this.editor.txt.html()) {
          this.editor.txt.html(this.value)
        }
      }
      //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    },
    mounted() {
      this.seteditor()
      this.editor.txt.html(this.value)
    },
    methods: {
      getHtml () {
          console.log(this.editor.txt.html())
      },
      seteditor() {
        // http://192.168.2.125:8080/admin/storage/create
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        // console.log(this.editor.config);
        this.editor.config.uploadImgShowBase64 = false // base 64 存储图片，如果这个参数设置为true的话，就不用配置服务器端上传地址
        this.editor.config.showLinkImg = false  //   禁止上传网络图片
        this.editor.config.uploadImgServer = '/api/file/uploadFiles'// 这是服务器端上传图片的接口路径
        this.editor.config.uploadImgHeaders = {'Content-Type': 'multipart/form-data' }// 自定义 header  上传文件格式为file文件，用form-data格式
        this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 6张图片
        this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

        // 配置菜单
        this.editor.config.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo', // 重复
          'fullscreen' // 全屏
        ]

        this.editor.config.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
             console.log(xhr, editor,result)
          },
          success: (xhr, editor, result) => {
            // 图片上传成功回调
            console.log(xhr, editor)
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
            console.log(xhr, editor)
          },
          error: (xhr, editor) => {
            console.log(xhr, editor)
            // 图片上传错误的回调
          }
        }
        // =======================================重点如下：
        // this.editor.config.uploadImgShowBase64 = false 如果这个参数设置true，也就不用下面这些了，
        this.editor.config.customUploadImg = (files, insert) => {
            var formData = new FormData();
            for(var i = 0;i < files.length;i ++) {
                formData.append("file", files[i], files[i].name);      //  多张图片文件都放进一个form-data，有些小伙伴说这里应该这样写：formData.append("file[" + i + "]", files[i], files[i].name)，后端才能拿到完整的图片数组，其实不然，用这个formData.getAll("file")方法恰好拿到数组，或者也可以forEach获取，有很多种办法。
            }
            dotOssUpload(formData).then(res => {
                if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '上传成功！'
                    })
                    insert(res.data)
                }else{
                   this.$message.error('上传失败！');
                   return;
                }
            })
            // axios.post('/api/file/uploadFiles', formData, {     // 上传图片接口
            //       headers: {
            //         'Content-Type': 'multipart/form-data',
            //       },
            // }).then(da => {
            //       console.log(da)
            //       if(da.data.code == 1000){
            //             for(var j=0;j<da.data.data.length;j++){
            //                 insert("http://192.168.0.110:8080" + da.data.data[j].imgUrl);    //  前面这个ip地址是服务器ip，后面的imgUrl是后台返回的图片地址，拼接上就是图片路径
            //             }
            //       }else{
            //             alert(da.data.data.msg);
            //             return;
            //       }
            // })
        };
        // =========================================
        this.editor.config.onchange = (html) => {
          this.info_ = html // 绑定当前逐渐地值
          this.$emit('change', this.info_) // 将内容同步到父组件中
        }
        // 创建富文本编辑器
        this.editor.create()
      }
    }
  }
</script>

<style lang="css">
  .editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
  }
  .toolbar {
    border: 1px solid rgb(148, 147, 147);
  }
  .text {
    border: 1px solid rgb(122, 122, 122);
    min-height: 500px;
  }
</style>