<template>
  <div class="login-container">
    <div class="login-box">
      <!--
         ref:使得可以获取当前的组件对象，this.$refs.form后期会使用
        :model:属性绑定，和v-model没有关系，收集全部的表单信息，以后后期检验使用
           label-width：表单项目名称宽度
      -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <img src="./logo_index.png" alt="">
        <!--  el-form-item：表单项目组件，每个表单域需要 -->
        <!-- label:设置表单项目名称通过此组件圈选 -->
        <el-form-item prop="mobile">
          <!-- el-input 普通输入框组件 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <!-- 可以通过插槽的方式给input加小图标，
                  slot为prefix是在输入框前面加
                  slot为suffix是在输入框后面加
             -->
            <i slot="prefix" class="iconfont iconshouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-input 普通输入框组件 -->
          <el-input v-model="loginForm.code" placeholder="请输入检验码">
            <i slot="prefix" class="iconfont iconyanzhengma"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()" :loading="isActive" :disabled="isActive">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
import '@/assets/font/iconfont.css'

export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      // rule:检验规则，一般不用
      // value:当前被检验的信息
      // callback():回调函数，检验成功或者失败都需要执行
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      catObj: null,
      isActive: false,
      loginForm: {
        mobile: '13582227163', // 手机号码
        code: '246810', // 检验码
        xieyi: true
      },
      loginRules: {
        mobile: [
          { required: true, message: '请填写手机号码' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号格式不正确' }
        ],
        code: [
          { required: true, message: '请填写检验码' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      }
    }
  },
  // created () {
  //   document.onkeypress = (e) => {
  //     var keycode = document.all ? event.keyCode : e.which
  //     if (keycode === 13) {
  //       this.login()// 登录方法名
  //       return false
  //     }
  //   }
  // },
  methods: {
    login () {
      // 获得form表单组件的语句 this.$refs.loginFormRef
      // console.log(this)k
      // valid 会体现布尔值，表示检验登录是否成功
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          // 判断catObj是否为空，不为空，直接就显示验证码,不在创建dom元素
          if (this.catObj !== null) {
            return this.catObj.verify()
          }
          // A. axios获得极验请求秘钥信息
          this.isActive = true // 放在catObj判断的后面，本地加载很快，不需要等待
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(res => {
              // 服务端返回极验的请求秘钥信息
              // console.log(res)
              let { data } = res.data
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind'
              }, captchaObj => {
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  this.catObj = captchaObj // 已经极验对象赋予给catObj
                  this.isActive = false
                  captchaObj.verify() // 显示验证码
                }).onSuccess(() => {
                  // B.检验账号真实检验，登录后台
                  this.loginAct()
                }).onError(() => {
                  // your code
                })
              })
            })
            .catch(err => {
              return this.$message.err('获取极验初始检验信息：' + err)
            })
        }
      })
    },
    // 检验账号真实性
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            // 客户端记录用户的信息
            window.sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
            this.$router.push({ name: 'home' })
            // console.log(res)
          }
        })
        .catch((err) => {
          // return this.$message.error('用户名或密码错误' + err)
          return this.$message({ type: 'error', message: '用户名或密码错误' + err, duration: 1000 })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('./login_bg.jpg');
  background-size:cover;
  .login-box {
    width: 410px;
    height: 345px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items:center;
    text-align: center;
    img {
      width: 50%;
      margin: 20px auto;
    }
    .el-form {
      width: 75%;

    }
  }
}
</style>
