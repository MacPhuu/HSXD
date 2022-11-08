<template>
  <div class="page-setting page-member">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="header-bar">
          <h4 style="display: inline-block; margin: 5px 0; line-height: 40px">Thành viên</h4>
          <el-button type="text" icon="el-icon-plus" style="float: right" @click="addMember">Thêm thành viên</el-button>
        </div>
        <el-card shadow="none">
          <el-table
            v-loading="loading"
            fit
            :data="members"
          >
            <el-table-column label="Tên" prop="name" sortable fixed min-width="180">
              <template slot-scope="scope">
                <span class="title-hightlight">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Email" sortable prop="email" min-width="200" />
            <el-table-column label="Đơn vị" sortable prop="group" min-width="160" />
            <el-table-column label="Chức danh" sortable prop="position" min-width="160" />
            <el-table-column label="Thao tác" align="center" width="120" fixed="right" class-name="right-action-table">
              <template slot-scope="scope">
                <span class="btn-table" @click="editMember(scope.row)">
                  <svg-icon icon-class="Edit" />
                </span>
                <el-popconfirm
                  class="btn-table"
                  title="Bạn có chắc chắn xóa?"
                  cancel-button-text="Hủy"
                  confirm-button-text="Đồng ý"
                  @confirm="deleteMember(scope.row._id)"
                >
                  <span slot="reference" class="btn-table">
                    <svg-icon icon-class="Trash" />
                  </span>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :title="formTitle"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" label-position="top" size="small" :rules="ruleForm">
        <el-form-item label="Họ và Tên" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" :disabled="formType === 'edit'" />
        </el-form-item>
        <el-form-item label="Đơn vị" prop="group">
          <el-input v-model="form.group" />
        </el-form-item>
        <el-form-item label="Chức danh" prop="position">
          <el-input v-model="form.position" />
        </el-form-item>
        <el-form-item label="Phân quyền" prop="role">
          <el-radio-group  v-model="form.role">
            <el-radio
              v-for="item in Object.entries(config.roleMap)"
              :key="'role' + item[0]"
              :label="+item[0]"
              style="display: flex; flex-direction: row ;align-items: center"
            >
              {{ item[1] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button size="small" @click="dialogVisible = false">Hủy</el-button>
        <el-button size="small" type="primary" @click="handleSubmitMember">Tiếp tục</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import MemberAPI from "@/api/memberApi";
import config from "@/utils/config";

export default {
  name: 'Member',
  data() {
    return {
      config,
      loading: false,
      dialogVisible:false,
      members: [],
      form: {},
      formType: 'create',
      formTitle: '',
      ruleForm: {
        email: { required: true, trigger: 'blur', message: 'Yêu cầu nhập Email' }
      }
    }
  },
  created() {
    this.getMembers()
  },
  methods: {
    async getMembers() {
      try {
        this.loading = true
        const { data } = await MemberAPI.get({ perPage: 10000 })
        this.loading = false
        this.members = data?.map(member => {
          const { role, userId, _id, name, group, position } = member
          return {
            _id,
            name,
            group,
            position,
            role,
            email: userId.username
          }
        })
      } catch (err) {
        this.loading = false
      }
    },
    addMember() {
      this.form = {
        role: config.role.MEMBER
      }
      this.formTitle = 'Thêm mới'
      this.formType = 'create'
      this.dialogVisible = true
    },
    editMember(data) {
      this.form = { ...data }
      this.formTitle = 'Cập nhật'
      this.formType = 'edit'
      this.dialogVisible = true
    },
    async deleteMember(id) {
      await MemberAPI.delete(id)
      await this.getMembers()
    },
    async handleSubmitMember() {
      const { _id: memberId, ...other } = this.form
      const dataSubmit = { ...other }
      switch (this.formType) {
        case "create":
          await MemberAPI.create(dataSubmit)
          this.dialogVisible = false
          break
        case "edit":
          await MemberAPI.update(memberId, dataSubmit)
          this.dialogVisible = false
          break
        default:
          break
      }
      await this.getMembers()
    }
  }
}
</script>

<style lang="scss">
  .page-member {
    .title-hightlight {
      font-size: .9rem;
      font-weight: 600;
    }
  }
  .el-input--small{
    input{
      height: 37px !important;
    }
  }
</style>
