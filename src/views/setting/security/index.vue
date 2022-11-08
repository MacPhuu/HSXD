<template>
  <div class="page-setting page-e-sign">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <h4 style="margin: 0; line-height: 40px">Bảo mật</h4>
        <el-card class="card-sign" shadow="none">
          <el-row class="row-sign">
            <el-col :span="20">
              <h5 style="margin: 0 0 10px;">Mật khẩu</h5>
              <span style="color: #97a8be; font-size: .87rem">Thay đổi mật khẩu của bạn bất cứ khi nào bạn nghĩ rằng nó có thể bị xâm phạm</span>
              <br>
            </el-col>
            <hr>
            <el-col :span="4" style="text-align: right">
            </el-col>
          </el-row>
          <hr>
          <el-row class="row-sign">
            <el-col :span="20">
              <span style=" font-size: 0.95rem; color: #6a7181">Lần cuối thay đổi mật khẩu</span>
              <span style=" font-size: 0.95rem; font-weight: 600; margin-left: 15px">{{ formatTime(userInfo.changePasswordAt) }}</span>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="text" @click="changePassword">Đổi mật khẩu</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      class="dialog-pass"
      width="40%"
      title="Đổi mật khẩu"
      :visible.sync="dialogVisible"
    >
      <p style="margin: 0 0 20px 0; line-height: 1.25rem">Chủ động quản lý quyền riêng tư và bảo mật của bạn. Giữ cho mật khẩu của bạn an toàn và luôn được cập nhât.</p>
      <el-form
        ref="passwordForm"
        class="login-form login-container"
        :model="passwordForm"
        :rules="loginRules">
        <el-form-item prop="oldPassword">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="passwordForm.oldPassword"
            :type="passwordType"
            placeholder="Mật khẩu hiện tại"
            name="oldPassword"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleSubmit"
          />
          <span class="show-pwd-icon" @click="showOldPass">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            :key="newPasswordType"
            ref="newPassword"
            v-model="passwordForm.newPassword"
            :type="newPasswordType"
            placeholder="Mật khẩu mới"
            name="newPassword"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleSubmit"
          />
          <span class="show-pwd-icon" @click="showNewPass">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="renewPassword">
          <el-input
            :key="renewPasswordType"
            ref="renewPassword"
            v-model="passwordForm.renewPassword"
            :type="renewPasswordType"
            placeholder="Nhập lại mật khẩu mới"
            name="renewPassword"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleSubmit"
          />
          <span class="show-pwd-icon" @click="showRenewPass">
            <svg-icon :icon-class="renewPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <br>
        <el-row>
          <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleSubmit">Xác nhận</el-button>
        </el-row>
        <br>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import UserAPI from "@/api/auth/user";
import {getUserInfo} from "@/utils/auth";
import moment from 'moment'
moment.locale('vi')

export default {
  name: 'Security',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập mật khẩu hiện tại'))
      } else {
        callback()
      }
    }
    const validatenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập mật khẩu hiện mới'))
      } else {
        callback()
      }
    }
    const validaterenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập lại mật khẩu mới'))
      } else if(value && value !== this.passwordForm.newPassword) {
        callback(new Error('Không đúng với mật khẩu mới đã nhập'))
      } else {
        callback()
      }
    }
    return {
      userInfo: getUserInfo(),
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        renewPassword: '',
      },
      loginRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatenewPassword }],
        renewPassword: [{ required: true, trigger: 'blur', validator: validaterenewPassword }]
      },
      loading: false,
      passwordType: 'password',
      newPasswordType: 'password',
      renewPasswordType: 'password',
      dialogVisible: false,
      activeTab: 'upload'
    }
  },
  methods: {
    formatTime(unix) {
      return unix ? moment(unix * 1000).format('DD/MM/YYYY') : ''
    },
    showOldPass() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showNewPass() {
      if (this.newPasswordType === 'password') {
        this.newPasswordType = ''
      } else {
        this.newPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.newPassword.focus()
      })
    },
    showRenewPass() {
      if (this.renewPasswordType === 'password') {
        this.renewPasswordType = ''
      } else {
        this.renewPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.renewPassword.focus()
      })
    },
    changePassword() {
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.passwordForm.validate(async(valid) => {
        const { newPassword, oldPassword } = this.passwordForm
        const dataSubmit = { newPassword, oldPassword }
        if (valid) {
          await UserAPI.changePassword(dataSubmit)
          this.dialogVisible = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-e-sign {
  .dialog-pass {
    .el-dialog__body {
      border-top: 1px solid #e4e7ed;
    }
  }
  .card-sign {
    .el-card__body {
      padding: 15px;
    }
  }

  .row-sign {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-header {
    background: #f1f3f5;
    padding: 8px 20px;
    margin-top: 10px;
  }

  .dialog-sign {
    .el-dialog__body {
      padding: 0;
    }
  }

  .dialog-content {
    padding: 10px 20px 20px;
  }

  .label-info {
    color: #6a7181;
    font-size: .9rem;
  }

  .content-info {
    font-weight: 600;
    font-size: .9rem;
  }

  .login-container {
    min-height: 100%;
    width: 100%;
    //background-color: $bg;
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
      //color: $dark_gray;
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

    .show-pwd-icon {
      position: absolute;
      right: 10px;
      //top: 7px;
      font-size: 16px;
      //color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .upload-area {
      .el-upload {
        width: 100%;

        .el-upload-dragger {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9fafc;
        }
      }
    }

    .draw-box {
      height: 180px;
      border: 1px dashed #e4e7ed;
      border-radius: 5px;
      background: #f9fafc;
    }
  }
}
</style>
