<template>
  <div style="min-height: 100vh">
    <div class="project-container">
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
          <h3 class="title-logo">Bắt đầu công việc với</h3>
        </div>
        <h2 class="title-logo" style="color: rgb(29,78,215); font-weight: 600">Dong Do Project</h2>
        <p style="color: #6a7181; line-height: 1.25rem">Vui lòng nhập Email để bắt đầu dự án</p>
        <br>
        <br>
        <el-form-item style="display: none" prop="none">
          <el-input />
        </el-form-item>
        <el-form-item prop="username" label="Email">
          <el-input
            key="username"
            ref="username"
            v-model="loginForm.username"
            type="text"
            placeholder="Nhập Email của bạn"
            name="username"
            tabindex="1"
            auto-complete="on"
            @keyup.enter.native="handleSubmit"
          />
        </el-form-item>

        <el-row>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:15px;" @click.native.prevent="handleSubmit">Tiếp tục</el-button>
        </el-row>
        <br>
      </el-form>
    </div>
  </div>
</template>

<script>

import ProjectAPI from "@/api/projectApi";

export default {
  name: 'Welcome',
  data() {
    const validateEmail = (rule, value, callback) => {
      if(!value) {
        callback(new Error('Yêu cầu nhập Email'))
      } else if (value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
        callback(new Error('Vui lòng nhập đúng định dạng Email'))
      } else {
        callback()
      }
    }
    return {
      token: this.$route.query.token,
      loginForm: {},
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateEmail }],
      },
      loading: false,
      emailType: 'password',
      redirect: undefined,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    }
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect
    //   },
    //   immediate: true
    // }
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
    handleSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const response = await ProjectAPI.loginStep1({
              username: this.loginForm.username,
              token: this.token
            })
            this.loading = false
            this.$message.closeAll()

            const { isRegister, loginToken } = response

            this.$router.push(`/setup-password?loginToken=${loginToken}&isRegister=${isRegister}`)
          } catch (err) {
            this.loading = false
          }
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
  .project-container .el-input input {
    //color: $cursor;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #fff inset !important;
    }
  }
}

/* reset element-ui css */
.project-container {
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

.project-container {
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
}
</style>
