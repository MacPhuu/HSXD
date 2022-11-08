<template>
  <div style="min-height: 100vh">
    <div class="workspace-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :style="{
          width: windowWidth <= 992 ? '100%' : '520px',
          height: windowWidth <= 992 ? '100vh' : 'unset',
          marginTop: windowWidth <= 992 ? '0px' : '10vh',
          borderRadius: windowWidth <= 992 ? '0px' : '5px',
        }"
      >

        <div class="title-container" style="text-align: center;">
          <img class="logo" src="@/assets/images/Logo_Brand.png" alt="">
        </div>
        <h2 class="title-logo">Chào mừng bạn quay trở lại!</h2>
        <p style="color: #6d7485">Chọn công trình để bắt đầu công việc</p>
        <br>
        <br>
        <p><span style="color: #6d7485">Công trình của </span><b>{{ this.$route.query.email }}</b></p>
        <div class="project-list">
          <div
            v-for="item in biddingProjects"
            :key="item._id"
            class="project"
            @click="handleSelectProject(item)"
          >
            <span class="icon-left"><svg-icon icon-class="Building2"/></span>
            <div class="content">
              <div class="title">{{ item.name }}</div>
              <div class="member">{{ item.member }} thành viên</div>
            </div>
            <span class="icon-right">
              <svg-icon icon-class="ArrowRight2"/>
            </span>
          </div>
        </div>
        <el-row type="flex" justify="center">
          <p style="color: #6d7485">Không tìm thấy công trình?
            <el-button @click="handleLogin" type="text">Quay lại đăng nhập</el-button>
          </p>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import config from '@/utils/config'
import logo from '@/assets/images/logo.png'
import ProjectAPI from "@/api/projectApi";

export default {
  name: 'BiddingProject',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Vui lòng nhập Email'))
      } else {
        callback()
      }
    }
    return {
      config,
      token: this.$route.query.token,
      biddingProjects: this.$route.query.biddingProjects ? JSON.parse(this.$route.query.biddingProjects) : [],
      logo,
      loginForm: {
        username: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
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
    handleSelectProject(biddingProject) {
      const data = {
        biddingProjectId: biddingProject._id,
        token: this.token
      }
      localStorage.setItem(config.biddingProjectIdKey, biddingProject._id)
      this.$store.dispatch('user/loginContractor', data).then(async res => {
        const { tokenStep1, username, biddingProjectId } = res
        const projects = await ProjectAPI.getProjectOfBidding(biddingProject._id)
        this.$router.push(`/work-space?token=${tokenStep1}&email=${username}&projects=${JSON.stringify(projects)}&biddingProjectId=${biddingProjectId}`)
        this.loading = false
        this.$message.closeAll()
      }).catch(() => {
        this.loading = false
      })
    },
    onResize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },
    handleSignup() {
      this.$router.push('')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$router.push({ path: this.redirect || '/login' })
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
$bg: #f3f4f6;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .workspace-container .el-input input {
    //color: $cursor;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
    }
  }
}

/* reset element-ui css */
.workspace-container {
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

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }

  .el-form-item {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #f3f4f6;
$dark_gray: #889aa4;
$light_gray: #eee;

.workspace-container {
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

  .project-list {
    margin-bottom: 30px;
  }

  .project {
    padding: 18px 10px;
    height: 66px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: #f9fafc;
    }

    .icon-left {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e4e7ed;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content {
      width: 350px;
      margin-right: 10px;
    }

    .title {
      font-size: 1rem;
      font-weight: 600;
      margin: 5px 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .member {
      font-size: .8rem;
      color: #6d7485;
      margin: 5px 0;
    }

    .icon-right {
    }
  }
}
</style>
