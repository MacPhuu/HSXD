<template>
  <div class="page-container page-content page-email-form">
    <h3>Mẫu email</h3>
    <el-card shadow="none">
      <el-form :model="form" :rules="ruleForm" ref="emailForm" label-position="top">
        <el-form-item label="Nội dung" prop="noiDung">
          <el-input v-model="form.noiDung" type="textarea" :autosize="{ minRows: 4 }" />
        </el-form-item>
        <el-form-item label="Tần suất gửi" prop="tanSuatGui">
          <el-input v-model="form.tanSuatGui" :min="0" controls-position="right" type="number"
                    placeholder="Nhập số tháng" style="width: 300px">
            <template slot="append">tháng gửi 1 lần</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Thời gian gửi" prop="thoiGianGui">
          <el-select v-model="form.thoiGianGui" placeholder="Chọn ngày" style="width: 300px">
            <el-option
              v-for="(item, idx) in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]"
              :key="idx"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="handleCancel">Hủy bỏ</el-button>
        <el-button type="primary" @click="handleSubmit">Lưu</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import MailAPI from '@/api/MailApi'
import config from '@/utils/config'

export default {
  name: 'EmailForm',
  data() {
    return {
      form: {
        noiDung: ''
      },
      emailCategoryType: config.emailCategoryType,
      ruleForm: {
        noiDung: [
          {
            required: true,
            message: 'Yêu cầu nhập nội dung email',
            trigger: 'blur',
          }
        ]
      }
    }
  },
  async created() {
    const pathSplit = this.$route.fullPath.split('/')
    const path = pathSplit[1]
    let type = undefined
    switch (path) {
      case 'danh-muc-thoa-uoc':
        type = this.emailCategoryType.THOA_UOC
        break
      case 'tranh-chap-dinh-cong2':
        type = this.emailCategoryType.TTDC
        break
      case 'tu-van-phap-luat2':
        type = this.emailCategoryType.TVPL
        break
      default:
        break
    }

    const res = await MailAPI.get({
      type,
      emailType: config.emailType.auto
    })

    if(res && res.data && res.data.length > 0) {
      this.form = res.data[0]
    } else {
      this.form = {
        noiDung: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      const dataSubmit = {
        ...this.form,
        tanSuatGui: +this.form.tanSuatGui,
        thoiGianGui: +this.form.thoiGianGui,
        emailType: config.emailType.auto
      }

      const pathSplit = this.$route.fullPath.split('/')
      const path = pathSplit[1]

      switch (path) {
        case 'danh-muc-thoa-uoc':
          dataSubmit.type = this.emailCategoryType.THOA_UOC
          break
        case 'tranh-chap-dinh-cong2':
          dataSubmit.type = this.emailCategoryType.TTDC
          break
        case 'tu-van-phap-luat2':
          dataSubmit.type = this.emailCategoryType.TVPL
          break
        default:
          break
      }

      this.$refs[`emailForm`].validate(async (valid) => {
        if(valid) {
          if(this.form._id) {
            const res = await MailAPI.update(this.form._id, dataSubmit)
          } else {
            const res = await MailAPI.send(dataSubmit)
          }
        } else {
          return false
        }
      })

    },
    handleCancel() {
      this.form = {}
    }
  }
}
</script>

<style lang="scss">
  .page-email-form {
    .el-form-item__label {
      padding-bottom: 0 !important;
    }
  }
</style>
