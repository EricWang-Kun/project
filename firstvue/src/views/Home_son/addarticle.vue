<template>
    <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addForm" :model="addForm" label-width="120px"  :rules="addFormRules">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
          <quillEditor v-model="addForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面：">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
               <li class="uploadbox" v-for="item in covernum" :key="item"  @click="showDialog(item)">
                <span>点击图标选择图片</span>
                <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt="" />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="频道" prop="channel_id">
              <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
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
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleAdd',
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
      addFormRules: {
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
      addForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      }
    }
  },
  created () {
    this.getImageList()
  },
  computed: {
    // 设计当前图片"选择框"个数
    covernum () {
      if (this.addForm.cover.type >= 0) {
        return this.addForm.cover.type
      }
      return 0
    }
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
        this.addForm.cover.images[this.xu] = this.materialUrl
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
      this.addForm.channel_id = val
    },
    // 获取频道列表数据
    addarticle (flag) {
      // 表单校验
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 把被添加的文章信息通过axios传递给服务器端存储
          // axios发起post请求的时候，不仅可以传递post数据还可以传递get请求字符串信息
          // this.$http.post(地址,post数据,get请求字符串信息)
          var pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章发布成功')
              this.$router.push('/article')
            })
            .catch(err => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
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
