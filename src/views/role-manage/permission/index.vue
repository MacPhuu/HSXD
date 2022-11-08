<template>
  <div class="page-container page-content">
    <table-pagination ref="tableData" :url="url" :is-search-date-range="false">
      <template slot="action">
        <el-button type="primary" size="small" @click="toggleCreatePermission">
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
          <el-table-column label="Tên" prop="title" width="300">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Phương thức">
            <template slot-scope="scope">
              <el-checkbox label="Đọc" :value="scope.row.read" :true-label="1" :false-label="0"></el-checkbox>
              <el-checkbox label="Thêm mới" :value="scope.row.create" :true-label="1" :false-label="0"></el-checkbox>
              <el-checkbox label="Chỉnh sửa" :value="scope.row.update" :true-label="1" :false-label="0"></el-checkbox>
              <el-checkbox label="Xóa" :value="scope.row.delete" :true-label="1" :false-label="0"></el-checkbox>
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
                @click="handleEditPermission(scope.row)">
              </el-button>
              <el-popconfirm
                style="margin-left: 5px"
                title="Bạn có chắc chắn xóa?"
                cancel-button-text="Hủy"
                confirm-button-text="Đồng ý"
                @confirm="handleDeletePermission(scope.row)">
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

    <el-dialog custom-class="dialog-form" title="Quản lý quyền hạn" :visible.sync="dialogPermissionVisible"
               :closeOnClickModal="false" :closeOnPressEscape="false"
    >
      <el-form label-position="top">
        <el-form-item label="Tên" prop="title">
          <el-input v-model="permission.title"></el-input>
        </el-form-item>
        <el-form-item label="Tài nguyên" prop="resource">
          <el-select v-model="permission.resources" multiple style="width: 100%">
            <el-option
              v-for="(resource, idx) in resources"
              :key="resource._id"
              :label="resource.title"
              :value="resource._id"
            >
              <span style="float: left">{{ resource.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px">{{ resource.path }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Phương thức">
          <div class="checkbox-group">
            <el-checkbox v-model="permission.read" label="Đọc" :true-label="1" :false-label="0"></el-checkbox>
            <el-checkbox v-model="permission.create" label="Thêm mới" :true-label="1" :false-label="0"></el-checkbox>
            <el-checkbox v-model="permission.update" label="Chỉnh sửa" :true-label="1" :false-label="0"></el-checkbox>
            <el-checkbox v-model="permission.delete" label="Xóa" :true-label="1" :false-label="0"></el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="activated">
          <el-switch v-model="permission.activated" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" style="width: 100%" />
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
  import resoureAPI from '../../../api/auth/resource'
  import permissionAPI from '../../../api/auth/permission'

  export default {
    name: 'Permission',
    components: { TablePagination },
    data() {
      return {
        url: `${config.api.auth}/permission`,
        dialogPermissionVisible: false,
        permission: {
          activated: 1
        },
        resources: [],
        formType: ''
      }
    },
    created() {
      this.getResourceList()
    },
    methods: {
      async getResourceList() {
        const res = await resoureAPI.get({ perPage: 1000 })
        this.resources = res.data
      },
      toggleCreatePermission() {
        this.dialogPermissionVisible = true
        this.formType = 'create'
        this.permission = {
          activated: 1
        }
      },
      toggleResourceForm() {

      },
      handleEditPermission(data) {
        this.dialogPermissionVisible = true
        this.formType = 'edit'
        this.permission = { ...data }
      },
      async handleDeletePermission(data) {
        await permissionAPI.delete(data._id)
        this.$refs.tableData.refreshData()
      },
      async handleSubmit() {
        const { create, read, update, delete: deleteParam, ...otherParams } = this.permission

        const dataSubmit = {
          ...otherParams,
          create: create || 0,
          read: read || 0,
          update: update || 0,
          delete: deleteParam || 0
        }

        switch (this.formType) {
          case 'create':
            await permissionAPI.create(dataSubmit)
            break
          case 'edit':
            await permissionAPI.update(dataSubmit._id, dataSubmit)
            break
          default:
            break
        }

        this.$refs.tableData.refreshData()
        this.dialogPermissionVisible = false
      },
      handleCancel() {
        this.dialogPermissionVisible = false
      }
    }
  }
</script>

<style lang="scss" src="../index.scss"></style>
