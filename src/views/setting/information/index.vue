<template>
  <div style="overflow: hidden; height: 100vh">
    <el-form
      :style="{
          width: windowWidth <= 992 ? '100%' : '520px',
          height: windowWidth <= 992 ? '100vh' : 'unset',
          marginTop: windowWidth <= 992 ? '0px' : '10vh',
          borderRadius: windowWidth <= 992 ? '0px' : '5px',
        }">
      <div>
            <span class="el-dialog__title">
          Thông tin dự án
          <span style="cursor: pointer" @click="handleEditProject">
            <svg-icon icon-class="Edit" />
          </span>
        </span>
      </div>
      <div v-if="isEditProject">
        <el-form ref="form" :model="projectForm" label-position="top">
          <el-form-item label="Tên dự án" prop="name">
            <el-input v-model="projectForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Nhà thầu thi công" prop="manager">
            <el-select v-model="projectForm.manager" style="width: 100%">
              <el-option
                v-for="user in users"
                :key="user._id"
                :label="user.name || user.username"
                :value="user._id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Ngày khởi công" prop="createAt">
            <el-date-picker
              v-model="projectForm.startDate"
              type="datetime"
              placeholder="Chọn"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Ngày hoàn thành" prop="createAt">
            <el-date-picker
              v-model="projectForm.endDate"
              type="datetime"
              placeholder="Chọn"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!--      <div v-else class="project-info">-->
      <!--        <el-row class="row-info" :gutter="5">-->
      <!--          <el-col :span="5">-->
      <!--            <span class="label-info">Tên dự án</span>-->
      <!--          </el-col>-->
      <!--          <el-col :span="19">-->
      <!--            <span class="content-info">{{ project.name }}</span>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--        <el-row class="row-info" :gutter="5">-->
      <!--          <el-col :span="5">-->
      <!--            <span class="label-info">Chủ đầu tư</span>-->
      <!--          </el-col>-->
      <!--          <el-col :span="19">-->
      <!--            <span class="content-info">{{ getUserInfo(project.manager).name || getUserInfo(project.manager).username }}</span>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--        <el-row class="row-info" :gutter="5">-->
      <!--          <el-col :span="5">-->
      <!--            <span class="label-info">Ngày khởi công</span>-->
      <!--          </el-col>-->
      <!--          <el-col :span="19">-->
      <!--            <span class="content-info">{{ formatDate(project.startDate, 'DD/MM/YYYY') }}</span>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--        <el-row class="row-info" :gutter="5">-->
      <!--          <el-col :span="5">-->
      <!--            <span class="label-info">Ngày hoàn thành</span>-->
      <!--          </el-col>-->
      <!--          <el-col :span="19">-->
      <!--            <span class="content-info">{{ formatDate(project.startDate, 'DD/MM/YYYY') }}</span>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--      </div>-->

      <el-row v-if="isEditProject" type="flex" justify="end" style="margin-top: 20px">
        <el-button @click="handleCancelProject">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitProject">Lưu</el-button>
      </el-row>
      <el-row v-else type="flex" justify="end" style="margin-top: 20px">
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import defaultSettings from '@/settings'
import logo from '@/assets/images/logo.png'
import moment from "moment"
import ProjectAPI from "@/api/projectApi"

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
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập mật khẩu'))
      } else {
        callback()
      }
    }
    return {
      isEditProject: false,
      projectForm: {},
      title: defaultSettings.title || 'CMS',
      logo,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
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
    this.getProjectInfo()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    formatDate(time, format) {
      return moment.unix(time).format(format)
    },
    async getProjectInfo() {
      this.project = await ProjectAPI.get()
    },
    handleEditProject() {
      this.isEditProject = true
      this.projectForm = {
        ...this.project,
        startDate: new Date(this.project.startDate * 1000),
        endDate: new Date(this.project.endDate * 1000),
      }
    },
    async handleSubmitProject() {
      const dataSubmit = {
        ...this.projectForm,
        startDate: moment(this.project.startDate).unix(),
        endDate: moment(this.project.endDate).unix()
      }
      delete dataSubmit._id
      delete dataSubmit.__v
      await ProjectAPI.update(dataSubmit)
      await this.getProjectInfo()
      this.dialogProject = false
    },
    handleCancelProject() {
      this.isEditProject = false
    },
    onResize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

  }
}
</script>

<style lang="scss">
$bg:#f3f4f6;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    //color: $cursor;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
    }
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  .logo {
    width: 220px;
    height: 210px;
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
$bg:#f3f4f6;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    z-index: 2;
    position: relative;
    width: 1020px;
    max-width: 200%;
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
