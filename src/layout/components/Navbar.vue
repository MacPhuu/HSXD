<!-- eslint-disable vue/no-unused-components -->
<!-- eslint-disable vue/no-unused-components -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable no-trailing-spaces -->
<template>

  <div class="navbar">
    <!--    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->


    <div class="menu-navbar" v-for="(route, index) in routes" :key="route.title">
      <div :class="[{ 'is-active': route.isActive }, `btn-${index}`,'button-navbar']">

        <el-button
          style="margin-left: 0px"
          size="small"
          type="text"
          @click="redirectNavbar(route.path, `.btn-${index}`, 'button-navbar')"
        >
          <span class="title" style="color: white">{{ route.title }}</span>
        </el-button>
      </div>
    </div>

    <div class="right-menu">
      <span @click="handleViewProject">
        <svg-icon icon-class="Information" class-name="icon-navbar" style="margin-right: 30px" />
      </span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
                   <!-- <span style="font-weight: 600">{{ userInfo.name ? `${userInfo.name} - ` : '' }}{{ userInfo.username }}</span> -->
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar-user" alt="avatar-user">
          <svg-icon v-else icon-class="Account" class-name="icon-navbar" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/setting/account">
            <el-dropdown-item class="account-row">
              <div class="content-info account">{{ userInfo.name }}</div>
              <div class="label-info account">{{ userInfo.username }}</div>
              <svg-icon class-name="icon-caret-right" icon-class="CaretRight" style="justify-content: center;align-items: center" />
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="Home" class-name="icon-dropdown" /> Trang chủ
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="redirectTo('/setting/account')">
            <svg-icon icon-class="Account3" class-name="icon-dropdown" /> Cài đặt tài khoản
          </el-dropdown-item>
          <el-dropdown-item @click.native="redirectTo('/setting/member')">
            <svg-icon icon-class="Team" class-name="icon-dropdown" /> Thành viên
          </el-dropdown-item>
          <el-dropdown-item @click.native="redirectTo('/setting/digital-signature')">
            <svg-icon icon-class="_Signature" class-name="icon-dropdown" /> Cài đặt chữ ký
          </el-dropdown-item>
          <el-dropdown-item @click.native="redirectTo('/setting/security')">
            <svg-icon icon-class="Lock" class-name="icon-dropdown" /> Bảo mật
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              v-if="project.projectUrl"
              v-clipboard:copy="project.projectUrl"
              v-clipboard:success="onCopySuccess"
            >
              <svg-icon icon-class="Link" class-name="icon-dropdown" /> Sao chép link dự án
            </span>
          </el-dropdown-item>
          <!--          <el-dropdown-item @click.native="handleChangePassword">-->
          <!--            Đổi mật khẩu-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Đăng xuất</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <h4 style="float: right; margin-right: 20px" class="title-navbar">
      <svg-icon class-name="icon-project" icon-class="Building" />
      {{ project.name }}
    </h4>

    <el-dialog
      :close-on-click-modal="false"
      :modal="true"
      :modal-append-to-body="false"
      title="Thông tin cá nhân"
      :visible.sync="dialogUserInfo"
    >

      <el-form ref="form" :model="form">
        <div class="avatar-wrap">
          <el-upload
            class="avatar-uploader"
            :action="urlUploadImage"
            :show-file-list="false"
            :auto-upload="true"
            :on-success="onUploadAvatarSuccess"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="thumbnails">
            <i v-else class="el-icon-user-solid avatar-blank" />
            <i class="el-icon-edit-outline avatar-uploader-icon" />
          </el-upload>
        </div>
        <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off" type="email" />
        </el-form-item>
        <el-form-item
          label="Họ và tên"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="CMT/CCCD" :label-width="formLabelWidth" prop="idCard">
          <el-input v-model="form.idCard" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item
          label="Ngày sinh"
          :label-width="formLabelWidth"
          prop="birthday"
        >
          <el-date-picker v-model="form.birthday" format="dd/MM/yyyy" placeholder="Ngày/Tháng/Năm" />
        </el-form-item>
        <el-form-item
          label="Giới tính"
          :label-width="formLabelWidth"
          prop="gender"
        >
          <el-select v-model="form.gender">
            <el-option
              v-for="(gender, idx) in genderMap"
              :key="idx"
              :label="gender[1]"
              :value="+gender[0]"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Địa chỉ" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="Số điện thoại"
          :label-width="formLabelWidth"
          prop="phoneNumber"
        >
          <el-input v-model="form.phoneNumber" autocomplete="off" type="number" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserInfo = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitUserInfo">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :modal="true"
      :modal-append-to-body="false"
      title="Thay đổi mật khẩu"
      :visible.sync="dialogPasswordForm"
    >

      <el-form ref="formPassword" :model="formPassword" :rules="ruleFormPassword">
        <el-form-item
          label="Mật khẩu cũ"
          :label-width="formLabelWidth"
          prop="oldPassword"
        >
          <el-input
            ref="oldPassword"
            :key="oldPasswordType"
            v-model="formPassword.oldPassword"
            :type="oldPasswordType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showOldPwd">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item
          label="Mật khẩu mới"
          :label-width="formLabelWidth"
          prop="newPassword"
        >
          <el-input
            ref="newPassword"
            :key="newPasswordType"
            v-model="formPassword.newPassword"
            :type="newPasswordType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showNewPwd">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item
          label="Xác nhận mật khẩu"
          :label-width="formLabelWidth"
          prop="checkPass"
        >
          <el-input
            ref="checkPass"
            :key="checkPassType"
            v-model="formPassword.checkPass"
            :type="checkPassType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showCheckPass">
            <svg-icon :icon-class="checkPassType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPasswordForm = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitChangePassword">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Thông tin gói thầu"
      class="el-dialog__infor"
      :visible.sync="dialogProject"
      :modal="true"
      :modal-append-to-body="false"
    >
      <span slot="title">
        <span class="el-dialog__title">
          Thông tin gói thầu
          <span style="cursor: pointer" @click="handleEditProject">
            <svg-icon icon-class="Edit" />
          </span>
        </span>
      </span>
      <div v-if="isEditProject">
        <el-form ref="form" :model="projectForm" label-position="top">
          <el-form-item label="Tên gói thầu" prop="name">
            <el-input v-model="projectForm.name" />
          </el-form-item>
          <el-form-item label="Nhà thầu thi công" prop="manager">
            <el-input v-model="projectForm.manager" />
          </el-form-item>
          <el-form-item label="Ngày khởi công" prop="createAt">
            <el-date-picker
              v-model="projectForm.startDate"
              type="date"
              format="dd/MM/yyyy"
              placeholder="Chọn"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="Ngày hoàn thành" prop="createAt">
            <el-date-picker
              v-model="projectForm.endDate"
              type="date"
              format="dd/MM/yyyy"
              placeholder="Chọn"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="project-info">
        <el-row class="row-info" :gutter="5">
          <el-col :span="5">
            <span class="label-info">Tên gói thầu</span>
          </el-col>
          <el-col :span="19">
            <span class="content-info">{{ project.name }}</span>
          </el-col>
        </el-row>
        <el-row class="row-info" :gutter="5">
          <el-col :span="5">
            <span class="label-info">Nhà thầu thi công</span>
          </el-col>
          <el-col :span="19">
            <span class="content-info">{{ project.manager }}</span>
          </el-col>
        </el-row>
        <el-row class="row-info" :gutter="5">
          <el-col :span="5">
            <span class="label-info">Ngày khởi công</span>
          </el-col>
          <el-col :span="19">
            <span class="content-info">{{ formatDate(project.startDate, 'DD/MM/YYYY') }}</span>
          </el-col>
        </el-row>
        <el-row class="row-info" :gutter="5">
          <el-col :span="5">
            <span class="label-info">Ngày hoàn thành</span>
          </el-col>
          <el-col :span="19">
            <span class="content-info">{{ formatDate(project.endDate, 'DD/MM/YYYY') }}</span>
          </el-col>
        </el-row>
      </div>

      <el-row v-if="isEditProject" type="flex" justify="end" style="margin-top: 20px">
        <el-button @click="handleCancelProject">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitProject">Lưu</el-button>
      </el-row>
      <el-row v-else type="flex" justify="end" style="margin-top: 20px">
        <el-button @click="dialogProject = false">Đóng</el-button>
      </el-row>
    </el-dialog>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import config from '@/utils/config'
import UserAPI from '@/api/auth/user'
import ProjectAPI from '@/api/projectApi'
import moment from 'moment'
import ButtonIcon from '@/components/ButtonIcon'
import { getUserInfo } from "@/utils/auth"
import CategoryAPIV2 from "@/api/categoryApiV2"
import ButtonDropdown from '@/components/ButtonDropdown/index.vue'

export default {
  components: {
    ButtonIcon,
    Breadcrumb,
    Hamburger,
    ButtonDropdown
},
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Yêu cầu nhập lại mật khẩu'))
      } else if (value !== this.formPassword.newPassword) {
        callback(new Error('Nhập lại mật khẩu không chính xác'))
      } else {
        callback()
      }
    }

    return {
      linkProject: undefined,
      projectForm: {},
      isEditProject: false,
      dialogProject: false,
      urlUploadImage: `${config.api.upload}/upload`,
      genderMap: config.genderMap,
      userInfo: getUserInfo(),
      dialogUserInfo: false,
      dialogPasswordForm: false,
      formLabelWidth: '150px',
      checked: false,
      oldPasswordType: 'password',
      newPasswordType: 'password',
      checkPassType: 'password',
      formPassword: {

      },
      ruleFormPassword: {
        oldPassword: [
          {
            required: true,
            message: 'Yêu cầu nhập mật khẩu cũ',
            trigger: 'change',
          },
        ],
        newPassword: [
          {
            required: true,
            message: 'Yêu cầu nhập mật khẩu mới',
            trigger: 'change',
          },
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'change' },
        ],
      },
      form: {
        avatar: ''
      },
      project: {},
      state: '',
      routes: [
        {
          title: 'QUẢN LÝ TÀI LIỆU',
          isActive: false,
          path: '/document/files'
        },
        {
          title: 'TÀI LIỆU TRÌNH - DUYỆT KÝ',
          isActive: false,
          path: '/inbox/file?status=99'
        },
        {
          title: 'HỒ SƠ LƯU TRỮ',
          isActive: false,
          path: '/manage/category'
        },
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
  },
  mounted() {
    this.getCategory()
    this.getProjectInfo()
    this.routes.forEach(route => {
      if (this.$route.path.includes(route.path)) {
        route.isActive = true
      }
    })
  },
  methods: {
    async getCategory() {
      const { data } = await CategoryAPIV2.get()
      this.routes.map(item => {
        if (item.path === '/manage/category') {
          item.path = `/manage/category?id=${data[0]._id}`
        }
      })
    },
    handleSelectRoute(route) {
      route.isActive = true
      this.$router.push(route.path)
    },
    onCopySuccess(data) {
      if (data.value) {
        this.$message.closeAll()
        this.$message.success('Đã sao chép link dự án')
      }
    },
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
        ...this.projectForm,dialogProject,
        startDate: moment(this.projectForm.startDate).unix(),
        endDate: moment(this.projectForm.endDate).unix()
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
    handleViewProject() {
      this.projectForm = {
        ...this.project,
        startDate: new Date(this.project.startDate * 1000),
        endDate: new Date(this.project.endDate * 1000),
      }
      this.isEditProject = false
      this.dialogProject = true
    },
    showOldPwd() {
      if (this.oldPasswordType === 'password') {
        this.oldPasswordType = ''
      } else {
        this.oldPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.oldPassword.focus()
      })
    },
    showNewPwd() {
      if (this.newPasswordType === 'password') {
        this.newPasswordType = ''
      } else {
        this.newPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.newPassword.focus()
      })
    },
    showCheckPass() {
      if (this.checkPassType === 'password') {
        this.checkPassType = ''
      } else {
        this.checkPassType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.checkPass.focus()
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async onUploadAvatarSuccess(res) {
      if (res) {
        this.form.avatar = `${config.api.upload}${res.path}`
        this.$message.closeAll()
        this.$message({
          message: res.msg || 'Tải lên thành công',
          type: 'success',
          duration: 3000
        })
      }
    },
    redirectTo(path) {
      this.$router.push(path)
    },
    redirectNavbar(path, className, commonClass) {
      let i
      const btn = document.querySelector(className)
      const btnAll = document.getElementsByClassName(commonClass)
      for (i = 0; i < btnAll.length; i++) {
        btnAll[i].className = btnAll[i].className.replace("is-active", "")
      }
      btn.classList.add('is-active')
      this.$router.push(path)
    },
    handleFolder() {
      this.$router.push('/category/material')
    },
    handleChangePassword() {
      this.dialogPasswordForm = true
      this.formPassword = {}
      this.newPasswordType = 'password'
      this.oldPasswordType = 'password'
      this.checkPassType = 'password'
      this.$refs.formPassword.resetFields()
    },
    async handleEditInfo() {
      this.dialogUserInfo = true
    },
    async handleSubmitUserInfo() {
    },
    async handleSubmitChangePassword() {
      await this.$refs.formPassword.validate(async(valid) => {
        const { newPassword, oldPassword } = this.formPassword
        const dataSubmit = { newPassword, oldPassword }
        if (valid) {
          const res = await UserAPI.changePassword(dataSubmit)
          this.dialogPasswordForm = false
        } else {
          return false
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-navbar {
   float: left;

}

.account {
  font-size: 1.2rem !important;
}

.title-navbar {
  color: white;
  margin: 0;
  padding: 0;
  display: inline-block;
  height: 50px;
  line-height: 50px;
  font-weight: 400;
}
.button-navbar {
  color: white;
  opacity: 0.5;
  margin-left: 12px;
  padding: 0;
  height: 50px;
  line-height: 50px;
}

.is-active {
  opacity: 1;
}

.icon-navbar {
  font-size: 24px;
  cursor: pointer;
}
.show-pwd {
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.avatar-user {
  margin-left: 10px;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
  cursor: pointer;
}

.icon-avatar {
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
  height: 32px;
  width: 32px;
  background: #97a8be;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  padding-top: 5px;
}

.user-dropdown {
  top: 50px !important;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #082f63;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;
    color: #fff;

    &:hover {
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.avatar {
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  .avatar-uploader {
    position: relative !important;

    .el-upload {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #b4bccc;
      position: relative;

      &:hover {
        //border: 1px solid #40a9ff;
        color: #40a9ff;

        .avatar-uploader-icon {
          color: #40a9ff;
        }
      }

      .avatar-blank {
        color: #fff;
        background: #b4bccc;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 60px;
      }

      .avatar-uploader-icon {
        position: absolute;
        bottom: 15px;
        right: 0;
        background: #fff;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #435b71;
      }
    }
  }
}

.dialog-user-info {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1) !important;
}
.project-info {
  .row-info {
    padding: 20px 5px;
    border-bottom: 1px solid #e4e7ed;

    .content-info {
      font-weight: 600;
    }
  }
}
.icon-project {
  font-size: 20px;
  line-height: 50px !important;
  height: 50px !important;
  margin: 0 8px;
  vertical-align: bottom !important;
}
.label-info {
  color: #6a7181;
  font-size: .9rem;
  line-height: 1.25rem;
  padding-right: 10px;
}

.content-info {
  font-weight: 600;
  font-size: .9rem;
  line-height: 1.25rem;
  padding-right: 10px;
}
.account-row {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
  position: relative;

  .icon-caret-right {
    position: absolute;
    top: 24px;
    right: 5px;
  }
}
.icon-dropdown {
  margin-right: 8px;
}

@media only screen and (min-width : 320px) and (max-width : 568px) {
  .navbar{
    height: auto;
    display: flex;
    flex-direction: column;
    left: -10px;
  }
  .right-menu{
  margin-left: 10px;
  }
}

</style>
