<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div id="lt">
        <el-form ref="accountFormRef" :model="accountForm" label-width="100px" :rules="accountFormRules">
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobile">
            <el-input v-model="accountForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop="intro">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="操作：">
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="rt">
  <!--上传头像区域-->
  <el-upload
             action=""
             :show-file-list="false"
             :http-request="httpRequest"
             >
    <img v-if="accountForm.photo" :src="accountForm.photo"
         class="avatar" width="210" height="210">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</div>
      </div>
  </el-card>
</template>

<script>
import bus from '@/utils/bus.js'
export default {
  name: 'Account',
  data () {
    return {
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
        /*
  mobile: [
    { required: true, message: '手机号码必填' },
    { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
  ]
  */
      },
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      }
    }
  },
  created () {
    // 获取账户信息
    this.getAccountInfo()
  },
  methods: {
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
        // 把账户信息赋予给accountForm成员里边
          this.accountForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获得账号信息失败：' + err)
        })
    },
    httpRequest (resource) {
      // FormData收集图片
      let fd = new FormData()
      fd.append('photo', resource.file)
      // axios传递图片到服务器端存储
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 对当前图像进行更新
            this.accountForm.photo = result.data.data.photo
            bus.$emit('upAccountPhoto', result.data.data.photo)

            // 提示成功
            this.$message.success('更新头像成功')
          }
        })
        .catch(err => {
          return this.$message.error('更新头像失败：' + err)
        })
    },
    editAccount () {
      // 表单校验
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          // axios行动了
          // get/post/put/delete
          // put: 修改，修改全部表单
          // patch：修改，修改部分项目
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                bus.$emit('upAccountName', this.accountForm.name)
                // 提示成功
                this.$message.success('修改账号信息成功')
              }
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
  }
  #rt {
    width: 30%;
  }
}
</style>
