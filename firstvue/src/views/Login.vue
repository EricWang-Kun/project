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
          <el-button style="width:100%" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请无条件遵守规矩'));
    }
    return {
      loginForm: {
        mobile: '18034250529', // 手机号码
        code: '050499', // 校验码
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
    this.$refs.loginFormRef.validate(vaild=>{
        if(vaild)
    })
      this.$router.push('/home')
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
