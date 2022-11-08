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
        <p style="color: #6d7485">Chọn gói thầu để bắt đầu công việc</p>
        <br>
        <br>
        <p><span style="color: #6d7485">Gói thầu của </span><b>{{ this.$route.query.email }}</b></p>
        <div class="project-list">
          <div
            v-for="item in projects"
            :key="item._id"
            class="project"
            @click="handleSelectPackage(item)"
          >
            <span class="icon-left"><svg-icon icon-class="Building2"/></span>
            <div class="content">
              <div class="title">{{ item.name }}</div>
              <div class="member">{{ item.member }} thành viên</div>
            </div>
            <span v-if="checkContractor" class="icon-right" style="margin-right: 10px" @click.stop="handleEditPackage(item)">
              <svg-icon icon-class="Edit"/>
            </span>
<!--            <span v-if="checkContractor" class="icon-right" @click.stop="handleDeletePackage(item)">-->
<!--              <svg-icon icon-class="Trash"/>-->
<!--            </span>-->
            <el-popconfirm
              v-if="checkContractor"
              title="Bạn có chắc chắn xóa?"
              cancel-button-text="Hủy"
              confirm-button-text="Đồng ý"
              @confirm="handleDeletePackage(item)"
              @click.stop="() => {}"
            >
              <svg-icon slot="reference" icon-class="Trash" @click.stop="() => {}" />
            </el-popconfirm>
            <span v-else class="icon-right">
              <svg-icon icon-class="ArrowRight2"/>
            </span>
          </div>
          <el-row v-if="checkContractor" type="flex" style="margin-top: 15px">
            <el-button icon="el-icon-plus" type="text" @click="handleAddPackage">Gói thầu</el-button>
          </el-row>
        </div>
        <el-row type="flex" justify="center">
          <p style="color: #6d7485">Không tìm thấy gói thầu?
            <el-button @click="handleLogin" type="text">Quay lại đăng nhập</el-button>
          </p>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="Thêm gói thầu"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="package_form" :model="packageForm" :rules="rulesCreate">
          <el-form-item label="Gói thầu" :label-width="formLabelWidth" prop="name">
            <el-input v-model="packageForm.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Quản lý" :label-width="formLabelWidth" prop="manager">
            <el-input v-model="packageForm.manager" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="Ngày khởi công" :label-width="formLabelWidth" prop="startDate">
            <el-date-picker v-model="packageForm.startDate" type="date" format="dd/MM/yyyy" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Ngày hoàn thành" :label-width="formLabelWidth" prop="endDate">
            <el-date-picker v-model="packageForm.endDate" type="date" format="dd/MM/yyyy" style="width: 100%" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleSubmitPackage">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import config from '@/utils/config'
import logo from '@/assets/images/logo.png'
import ProjectAPI from "@/api/projectApi";
import moment from "moment";

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
    return {
      config,
      checkContractor: localStorage.getItem(config.checkContractorKey),
      dialogVisible: false,
      token: this.$route.query.token,
      projects: this.$route.query.projects ? JSON.parse(this.$route.query.projects) : [],
      email: this.$route.query.email,
      biddingProjectId: this.$route.query.biddingProjectId,
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
      packageForm: {},
      formType: 'create',
      formLabelWidth: '170px',
      formLabelWidthSmall: '230px',
      rulesCreate: {
        name: [
          {
            required: true,
            message: 'Không được để trống',
            trigger: 'change',
          },
        ],
        manager: [
          {
            required: true,
            trigger: 'change',
            message: 'Không được để trống',
          }
        ],
        startDate: [
          {
            required: true,
            trigger: 'change',
            message: 'Không được để trống',
          }
        ]
      },
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
    console.log('route', JSON.parse(this.$route.query.projects))
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async handleSubmitPackage() {
      switch (this.formType) {
        case "create": {
          const dataSubmit = {
            ...this.packageForm,
            biddingProjectId: this.biddingProjectId,
            startDate: moment(this.packageForm.startDate).unix(),
            endDate: moment(this.packageForm.endDate).unix(),
          }
          await ProjectAPI.createProject(dataSubmit)
          this.projects = await ProjectAPI.getProjectOfBidding(this.biddingProjectId)
          this.dialogVisible = false
          this.$router.push(`/work-space?token=${this.token}&email=${this.email}&projects=${JSON.stringify(this.projects)}&biddingProjectId=${this.biddingProjectId}`)
          break
        }
        case "edit": {
          const dataSubmit = {
            ...this.packageForm,
            biddingProjectId: this.biddingProjectId,
            startDate: moment(this.packageForm.startDate).unix(),
            endDate: moment(this.packageForm.endDate).unix(),
          }
          await ProjectAPI.updateProject(this.packageForm._id, dataSubmit)
          this.projects = await ProjectAPI.getProjectOfBidding(this.biddingProjectId)
          this.dialogVisible = false
          this.$router.push(`/work-space?token=${this.token}&email=${this.email}&projects=${JSON.stringify(this.projects)}&biddingProjectId=${this.biddingProjectId}`)
          break
        }
        default: {
          break
        }
      }
    },
    handleAddPackage() {
      this.packageForm = {}
      this.formType = 'create'
      this.dialogVisible = true
      this.$refs.package_form && this.$refs.package_form.resetFields()
    },
    handleEditPackage(item) {
      this.packageForm = {
        ...item,
        startDate: new Date(item.startDate * 1000),
        endDate: new Date(item.endDate * 1000)
      }
      this.formType = 'edit'
      this.dialogVisible = true
    },
    async handleDeletePackage(project) {
      await ProjectAPI.deleteProject(project._id)
      this.projects = await ProjectAPI.getProjectOfBidding(this.biddingProjectId)
      this.$router.push(`/work-space?token=${this.token}&email=${this.email}&projects=${JSON.stringify(this.projects)}&biddingProjectId=${this.biddingProjectId}`)
    },
    handleSelectPackage(project) {
      const data = {
        projectId: project._id,
        token: this.token
      }
      localStorage.setItem(config.projectIdKey, project._id)
      this.$store.dispatch('user/login', data).then(() => {
        this.$router.push({ path: this.redirect || '/' })
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
          if(this.checkContractor) {
            localStorage.removeItem(config.tokenKey)
            localStorage.removeItem(config.checkContractorKey)
            this.$router.push({ path: this.redirect || '/login' })
          }
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

.el-input--prefix {
  .el-input__inner {
    padding-left: 40px;
  }
}

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
      border-radius: 50%;
      width: 28px;
      height: 28px;
      padding: 2px;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
