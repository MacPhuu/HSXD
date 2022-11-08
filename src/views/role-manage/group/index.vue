<template>
  <div class="page-container page-content">
    <table-pagination ref="tableData" :url="url" :is-search-date-range="false">
      <template slot="action">
        <el-button type="primary" size="small" @click="toggleCreateGroup">
          Thêm mới
        </el-button>
      </template>

      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          fit
          border
          :data="scope.tableData"
          width="100%"
        >
          <el-table-column
            label="STT"
            align="center"
            width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tên" prop="title" min-width="300">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Nhóm quyền" prop="roles" min-width="300">
            <template slot-scope="scope">
              <el-tag
                v-for="item in scope.row.roles"
                :key="item._id"
                style="display: block; margin-left: 0; margin-top: 10px; width: fit-content"
              >
                {{ item.title }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="Thao tác"
            align="center"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="handleEditGroup(scope.row)">
              </el-button>
              <el-popconfirm
                style="margin-left: 5px"
                title="Bạn có chắc chắn xóa?"
                cancel-button-text="Hủy"
                confirm-button-text="Đồng ý"
                @confirm="handleDeleteGroup(scope.row)">
                <el-button
                  slot="reference"
                  icon="el-icon-delete"
                  type="danger"
                  size="mini">
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>

    <el-dialog custom-class="dialog-form" title="Quản lý nhóm quyền" :visible.sync="dialogGroupVisible"
               :closeOnClickModal="false" :closeOnPressEscape="false"
    >
      <el-form label-position="top">
        <el-form-item label="Tên" prop="title">
          <el-input v-model="group.title"></el-input>
        </el-form-item>
        <el-form-item label="Vai trò" prop="roles">
          <el-select v-model="group.roles" multiple filterable>
            <el-option
              v-for="(role, idx) in roles"
              :key="role._id"
              :value="role._id"
              :label="role.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="activated">
          <el-switch v-model="group.activated" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" style="width: 100%" />
        </el-form-item>

        <div class="submit-btn-row">
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Xác nhận</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TablePagination from '../../../components/TablePagination/index'
import config from '../../../utils/config'
import groupAPI from '../../../api/auth/group'
import roleAPI from '@/api/auth/role'

export default {
  name: 'Group',
  components: { TablePagination },
  data() {
    return {
      url: `${config.api.auth}/group`,
      dialogGroupVisible: false,
      group: {
        activated: 1
      },
      roles: [],
      formType: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await roleAPI.get({ perPage: 1000 })
      this.roles = res.data
    },
    toggleCreateGroup() {
      this.dialogGroupVisible = true
      this.formType = 'create'
      this.group = {
        activated: 1
      }
    },
    toggleResourceForm() {

    },
    handleEditGroup(data) {
      this.dialogGroupVisible = true
      this.formType = 'edit'
      this.group = {
        ...data,
        roles: data.roles?.map(role => role._id) || []
      }
    },
    async handleDeleteGroup(data) {
      await groupAPI.delete(data._id)
      this.$refs.tableData.refreshData()
    },
    async handleSubmit() {
      const { ...otherParams } = this.group

      const dataSubmit = {
        ...otherParams
      }

      switch (this.formType) {
        case 'create':
          await groupAPI.create(dataSubmit)
          break
        case 'edit':
          await groupAPI.update(dataSubmit._id, dataSubmit)
          break
        default:
          break
      }

      this.$refs.tableData.refreshData()
      this.dialogGroupVisible = false
    },
    handleCancel() {
      this.dialogGroupVisible = false
    }
  }
}
</script>

<style lang="scss" src="../index.scss"></style>
