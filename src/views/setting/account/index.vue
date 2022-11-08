<template>
  <div class="page-setting page-setting-account">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="page-setting-account__title">
          <h4>Tài khoản</h4>
        </div>

        <div class="page-setting-account__content">
          <el-card>
            <div class="avatar-wrap">
              <div class="avatar-wrapper">
                <div class="avatar">
                  <span class="account-avatar">
                    <svg-icon icon-class="Account5"/>
                  </span>
                  <div class="dot"></div>
                </div>
                <div class="info-avatar">
                  <div class="content-info">{{ account.name }}</div>
                  <div class="label-info">{{ account.position }}</div>
                </div>
              </div>
              <span style="cursor: pointer" @click="handleEditProject">
                <svg-icon icon-class="Edit"/>
              </span>
            </div>
            <div class="underline-space"></div>
            <div v-if="isEditAccount">
              <el-form ref="form" :model="accountForm" label-position="top">
                <el-form-item label="Họ và tên" prop="name">
                  <el-input type="text" v-model="accountForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                  <el-input type="email" v-model="accountForm.email" disabled clearable></el-input>
                </el-form-item>
                <el-form-item :rules="rules" label="Số điện thoại" prop="phone">
                  <el-input type="text" v-model="accountForm.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="Chức danh" prop="position">
                  <el-input v-model="accountForm.position"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div v-else>
              <el-row class="info">
                <el-col :span="7" class="key-info">
                  <span class="label-info">Họ và tên</span>
                </el-col>
                <el-col :span="17">
                  <span class="content-info">{{ account.name }}</span>
                </el-col>
              </el-row>
              <el-row class="info">
                <el-col :span="7" class="key-info">
                  <span class="label-info">Email</span>
                </el-col>
                <el-col :span="17">
                  <span class="content-info">{{ account.email }}</span>
                </el-col>
              </el-row>
              <el-row class="info">
                <el-col :span="7" class="key-info">
                  <span class="label-info">Số điện thoại</span>
                </el-col>
                <el-col :span="17">
                  <span class="content-info">{{ account.phone }}</span>
                </el-col>
              </el-row>
              <el-row class="info">
                <el-col :span="7" class="key-info">
                  <span class="label-info">Chức danh</span>
                </el-col>
                <el-col :span="17">
                  <span class="content-info">{{ account.position }}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-row v-if="isEditAccount" type="flex" justify="end" style="margin-top: 20px">
            <el-button @click="handleCancelAccount">Hủy</el-button>
            <el-button type="primary" :loading="loadingSubmit" @click="handleSubmitAccount">Lưu thay đổi</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from '@/utils/config'
import { getUserInfo } from '@/utils/auth'
import UserProjectAPI from '@/api/userProject'
import ProjectAPI from '@/api/projectApi'
import moment from 'moment'

export default {
  name: 'Account',
  data () {
    return {
      config,
      loadingSubmit: false,
      userInfo: getUserInfo(),
      accountForm: {},
      isEditAccount: false,
      account: {},
      rules: {
        phone: {
          required: true,
          pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
          message: 'Please input phone',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    role () {

    }
  },
  mounted () {
    this.getUserProjectInfo()
  },
  methods: {
    async getUserProjectInfo () {
      this.account = await UserProjectAPI.get()
    },
    getAccountInfo () {
      this.account = {
        ...this.userInfo
      }
    },
    handleEditProject () {
      this.isEditAccount = true
      this.accountForm = { ...this.account }
    },
    async handleSubmitAccount () {
      this.loadingSubmit = true
      // this.account = { ...this.accountForm }
      // this.isEditAccount = false
      const dataSubmit = {
        ...this.accountForm,
      }
      await UserProjectAPI.update(dataSubmit)
      await this.getUserProjectInfo()
      this.loadingSubmit = false
      this.isEditAccount = false

    },
    handleCancelAccount () {
      this.isEditAccount = false
    }
  }
}
</script>

<style scoped>
.info {
  margin-top: 32px;
  font-size: 14px;
}

.key-info {
  color: #909090;
}

.page-setting-account {

}

.underline-space {
  width: 100%;
  border-color: #909090;
  border-style: solid;
  border-bottom: 1px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.avatar-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}

.info-avatar {
  height: 50px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.avatar {
  width: 50px;
  height: 50px;
  position: relative;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 100%;
  background: rgb(5, 151, 106);
  position: absolute;
  bottom: 2px;
  right: 0px;
}

.label-info {
  color: #6a7181;
  padding: 2px 0;
  font-size: .9rem;
}

.content-info {
  padding: 2px 0;
  font-weight: 600;
}

.account-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #97a8be;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
}
</style>
