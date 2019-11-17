<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>修改文章</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--富文本编辑器-->
          <quill-editor v-model="editForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="editForm.cover.type">
            <!--注意：label前边需要设置冒号，表示接受整型的信息-->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <ul>
               <li class="uploadbox" v-for="item in covernum" :key="item"  @click="showDialog(item)">
                <span>点击图标选择图片</span>
                <img v-if="editForm.cover.images[item-1]" :src="editForm.cover.images[item-1]" alt="" />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
               <channel-com @slt="selectHandler" :cid="editForm.channel_id"
               ></channel-com>
         </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
          <el-button @click="editarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" @close="clearImage">
      <!--匿名插槽，设置对话框主体内容-->
      <ul class="clearfix">
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="没有图片" @click="clkImage">
        </li>
      </ul>
      <!--命名插槽，设置对话框底部显示按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入富文本编辑器的css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入编辑器主组件模块(按需导入)
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleEdit',
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      xu: 0,
      materialUrl: '',
      imageList: [],
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      dialogVisible: false,
      // 表单校验规则
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      editForm: {
        title: '', // 标题
        content: '', // 文章内容
        // 封面(1-3张之间)
        cover: {
          // 默认设置为0张图片，不然报错
          type: 0, // 告知是几个图片 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 以数组元素形式存储多个封面图片路径名的
        },
        channel_id: '' // 接受频道信息
      }
    }
  },
  created () {
    this.getArticleByAid()
    this.getImageList()
  },
  methods: {
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      this.materialUrl = '' // 清除图片路径名
    },
    imageOK () {
      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.editForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('咋地，不挑一个再走啊')
      }
    },
    showDialog (n) {
      // 更新xu成员
      this.xu = n - 1
      this.dialogVisible = true // 开启对话框
    },
    clkImage (evt) {
      this.clearImage()
      // 把全部项目的选中标志都去除
      var lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // evt：当前事件对象，设置事件时不要加括号
      // console.log(evt) // MouseEvent
      // evt.target: 触发当前事件的dom节点对象(img)
      evt.target.parentNode.style.border = '3px solid red'
      this.materialUrl = evt.target.src
    },
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获得素材图片列表错误:' + err)
        })
    },
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    // 发表文章
    // flag=true  是存入草稿
    // flag=false  正式发布
    editarticle (flag) {
      // 表单校验
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 表单校验成功
          let pro = this.$http.put(`/articles/${this.aid}`, this.editForm, { params: { draft: flag } })
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                this.$message.success('修改文章成功！')
                // 跳转到列表页面
                this.$router.push('/article')
              }
            })
            .catch(err => {
              return this.$message.error('添加文章失败！：' + err)
            })
        }
      })
    },
    getArticleByAid () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
          // 把文章赋予给editForm里边
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获得文章失败！：' + err)
        })
    }
    // 获得频道列表数据
  },
  computed: {
    aid () {
      console.log(this.$route.params.aid)
      return this.$route.params.aid
    },
    covernum () {
      if (this.editForm.cover.type >= 0) {
        return this.editForm.cover.type
      }
      return 0
    }
  }
}
</script>

<style lang="less" scoped>
/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor{
  height:200px;
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img{
    width: 200px;
    height: 150px;
  }
}
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor:pointer;
  box-sizing:border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.clearfix:before,.clearfix:after{
content: '';
display: block;
clear: both;
}
.clearfix {
  zoom: 1;
}
</style>
