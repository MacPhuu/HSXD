<template>
  <div class="page-container page-content">
    <table-pagination ref="tableData" :url="url" :is-search-date-range="false">
      <template slot="action">
        <el-button type="primary" size="small" @click="toggleCreateRole">Thêm mới
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
          <el-table-column label="Tên" prop="title" width="250">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Quyền hạn">
            <template slot-scope="scope">
              <el-tag
                v-for="(permission, idx) in renderPermissionList(scope.row.permissions)"
                :key="permission._id">
                {{ permission.title }}
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
                @click="handleEditRole(scope.row)">
              </el-button>
              <el-popconfirm
                style="margin-left: 5px"
                title="Bạn có chắc chắn xóa?"
                cancel-button-text="Hủy"
                confirm-button-text="Đồng ý"
                @confirm="handleDeleteRole(scope.row)">
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

    <el-dialog custom-class="dialog-form" title="Quản lý phân vai" :visible.sync="dialogRoleVisible"
               :closeOnClickModal="false" :closeOnPressEscape="false"
    >
      <el-form label-position="top">
        <el-form-item label="Tên" prop="title">
          <el-input v-model="role.title"></el-input>
        </el-form-item>
        <el-form-item label="Quyền hạn">
          <el-select v-model="role.permissions" multiple filterable style="width: 100%">
            <el-option
              v-for="(permission, idx) in permissions"
              :key="permission._id"
              :label="permission.title"
              :value="permission._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="activated">
          <el-switch v-model="role.activated" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" style="width: 100%" />
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
  import roleAPI from '../../../api/auth/role'
  import permissionAPI from '../../../api/auth/permission'

  export default {
    name: 'Role',
    components: { TablePagination },
    data() {
      return {
        url: `${config.api.auth}/role`,
        formType: '',
        dialogRoleVisible: false,
        role: {
          activated: 1
        },
        permissions: []
      }
    },
    created() {
      this.getPermissionList()
    },
    methods: {
      async getPermissionList() {
        const res = await permissionAPI.get({ perPage: 1000 })
        this.permissions = res.data
      },
      toggleCreateRole() {
        this.dialogRoleVisible = true
        this.formType = 'create'
        this.role = {
          activated: 1
        }
      },
      handleEditRole(role) {
        this.dialogRoleVisible = true
        this.formType = 'edit'
        this.role = { ...role }
      },
      async handleDeleteRole(role) {
        await roleAPI.delete(role._id)
        this.$refs.tableData.refreshData()
      },
      async handleSubmit() {
        const dataSubmit = { ...this.role }
        switch (this.formType) {
          case 'create':
            await roleAPI.create(dataSubmit)
            break
          case 'edit':
            await roleAPI.update(dataSubmit._id, dataSubmit)
            break
          default:
            break
        }
        this.$refs.tableData.refreshData()
        this.dialogRoleVisible = false
      },
      handleCancel() {
        this.dialogRoleVisible = false
      },
      renderPermissionList(permissionIds) {
        const permissionList = []
        this.permissions.map(permission => {
          permissionIds.map(id => {
            if(permission._id === id) {
              permissionList.push(permission)
            }
          })
        })
        return permissionList
      }
    }
  }
</script>

<style lang="scss" src="../index.scss"></style>
