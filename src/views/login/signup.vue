<template>
  <div style="min-height: 100vh">
    <div class="signup-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="top"
        auto-complete="on"
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
        <div class="title-container">
          <h2 class="title-logo">Nhập thông tin liên hệ</h2>
        </div>
        <p style="text-align: center; color: #8b92ab; font-weight: 500; margin-bottom: 40px">Vui lòng để lại thông tin liên hệ để được tư vấn và hỗ trợ nhanh chóng</p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" label="Họ và Tên">
              <el-input
                ref="name"
                v-model="loginForm.name"
                placeholder="Họ và Tên"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phoneNumber" label="Số điện thoại">
              <el-input
                ref="phoneNumber"
                v-model="loginForm.phoneNumber"
                placeholder="Số điện thoại"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="username" label="Email">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Email"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="text" label="Lời nhắn">
          <el-input
            style="height: 400%"
            v-model="loginForm.text"
            placeholder="Nếu bạn có thắc mắc gì hãy cho chúng tôi biết..."
            name="username"
            type="textarea"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-row>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:40px;" @click.native.prevent="handleLogin">Gửi thông tin</el-button>
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import defaultSettings from '@/settings'
import logo from '@/assets/images/logo.png'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Vui lòng nhập Email'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập Họ và Tên'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập Số điện thoại'))
      } else {
        callback()
      }
    }
    return {
      title: defaultSettings.title || 'CMS',
      logo,
      loginForm: {
        username: '',
        name: '',
        phoneNumber: '',
        text: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhone }],
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
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
  .signup-container .el-input input {
    //color: $cursor;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #fff inset !important;
    }
  }
}

/* reset element-ui css */
.signup-container {
  position: relative;
  .logo {
    width: 220px;
    height: 110px;
  }
  .title-logo {
    font-weight: 600;
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

.signup-container {
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
    text-align: center;

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

