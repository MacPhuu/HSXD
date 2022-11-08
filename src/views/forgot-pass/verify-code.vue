<template>
  <div style="min-height: 100vh">
    <div class="verify-code-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="top"
        :style="{
          width: windowWidth <= 992 ? '100%' : '520px',
          height: windowWidth <= 992 ? '100vh' : 'unset',
          marginTop: windowWidth <= 992 ? '0px' : '10vh',
          borderRadius: windowWidth <= 992 ? '0px' : '5px',
        }"
      >

        <div class="title-container">
          <img class="logo" src="@/assets/images/Logo_Brand.png" alt="">
        </div>
        <h3 class="title-logo">Quên mật khẩu</h3>
        <p style="color: #6d7485">Để chắc chắn đó đúng là bạn, chúng tôi đã gửi một mã xác minh đến {{ emailName ? emailName.slice(0, 3).concat('***') : '***' }}@gmail.com.</p>
        <p style="color: #6d7485">Vui lòng kiểm tra.</p>
        <br>
        <br>
        <el-form-item prop="otp" label="Mã xác minh">
          <el-input
            ref="otp"
            v-model.number="loginForm.otp"
            placeholder="Nhập mã xác minh"
            name="otp"
            type="text"
            tabindex="1"
            auto-complete="off"
          />
        </el-form-item>
        <el-row>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:15px;" @click.native.prevent="handleVerify">Tiếp tục</el-button>
        </el-row>
        <br>
        <br>
        <div style="display: flex; justify-content: center">
          <p style="color: #6d7485">Chưa có tài khoản? <el-button @click="handleSignup" type="text">Đăng ký ngay</el-button></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import defaultSettings from '@/settings'
import logo from '@/assets/images/logo.png'
import UserAPI from "@/api/auth/user"

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Vui lòng nhập Mã xác minh'))
      } else {
        callback()
      }
    }
    const username = localStorage.getItem('username')
    return {
      username: username,
      emailName: (username?.split('@') || [])[0],
      title: defaultSettings.title || 'CMS',
      logo,
      loginForm: {
        otp: ''
      },
      loginRules: {
        otp: [
          { required: true, message: 'Vui lòng nhập mã OTP' },
          { type: 'number', message: 'Mã OTP phải là số' }
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },
    handleSignup() {
      this.$router.push('/signup')
    },
    handleVerify() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          await UserAPI.checkOTP({
            username: this.username,
            otp: this.loginForm.otp,
          })
          this.$message.closeAll()
          this.$message.success('Mật khẩu mới đã gửi vào email của bạn. Vui lòng check mail để lấy mật khẩu mới')
          this.$router.push({ path: this.redirect || `/login?redirect=${this.$route.fullPath}` })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#f3f4f6;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .verify-code-container .el-input input {
    //color: $cursor;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #fff inset !important;
    }
  }
}

/* reset element-ui css */
.verify-code-container {
  position: relative;
  .logo {
    width: 220px;
    height: 123px;
  }
  .title-logo {
    span {
      color: #f43f5e;
    }
  }

  .title-content {
    font-weight: 600;
    font-size: 24px;
    color: #435b71;
  }
}
</style>

<style lang="scss" scoped>
$bg:#f3f4f6;
$dark_gray:#889aa4;
$light_gray:#eee;

.verify-code-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    z-index: 2;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 20px;
    margin: 10vh auto;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: #fff;
    border-radius: 5px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      //color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
