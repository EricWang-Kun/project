<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <img src="./logo_index.png" alt srcset />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码"></el-input>
        </el-form-item>
        <el-form-item prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" :loading="isActive"
           :disabled="isActive" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      isActive: false,
      ctaObj: null,
      loginForm: {
        mobile: '18034250529', // 手机号码
        code: '246810', // 校验码
        xieyi: true // 协议
      },
      loginFormRules: {
        // 校验字段: [{ 规则 }, { 规则 }, { 规则 }]
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [
          // { validator: 校验函数 }
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // 表单域校验成功
        if (valid) {
          this.isActive = true
          // A. axios获得极验初始校验信息
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // 服务器端返回极验的请求秘钥信息
              let { data } = result.data
              window.initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind'
              }, captchaObj => {
                captchaObj.onReady(() => {
                  this.isActive = false
                  captchaObj.verify()
                }).onSuccess(() => {
                  this.loginAct()
                }).onError(() => {
                  // your code
                })
              })
            })
            .catch(err => {
              return this.$message.error('获得极验初始校验信息错误：' + err)
            })

          // B. 账号真实校验，登录后台
          // this.loginAct()
        }
      })
    },
    // 校验账号真实性，登录后台
    loginAct () {
      // 账号真实性校验
      var pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 客户端记录用户的信息
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
            // 进入后台系统
            this.$router.push('/home')
          }
        })
        .catch(err => {
          return this.$message.error('用户名或密码错误' + err)
        })
    }
  }
}

</script>

<style>
.login-container {
  height: 100%;
  background-color: gray;
  background-image: url("./login_bg.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 410px;
  height: 345px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  width: 75%;
}
</style>
