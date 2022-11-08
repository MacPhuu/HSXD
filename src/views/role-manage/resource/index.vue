<template>
  <div class="page-container page-content">
    <table-pagination ref="tableData" :url="url" :is-search-date-range="false">
      <template slot="action">
        <el-button type="primary" size="small" @click="toggleCreateResource">Thêm mới
        </el-button>
      </template>

      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          fit
          border
          stripe
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
          <el-table-column label="Tên" prop="title">
            <template slot-scope="scope">
              <span style="font-weight: bold">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Đường dẫn" prop="path">
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
                @click="handleEditResource(scope.row)">
              </el-button>
              <el-popconfirm
                style="margin-left: 5px"
                title="Bạn có chắc chắn xóa?"
                cancel-button-text="Hủy"
                confirm-button-text="Đồng ý"
                @confirm="handleDeleteResource(scope.row)">
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

    <el-dialog custom-class="dialog-form" title="Quản lý tài nguyên" :visible.sync="dialogResourceVisible"
               :closeOnClickModal="false" :closeOnPressEscape="false"
    >
      <el-form>
        <el-form-item label="Tên" prop="title">
          <el-input v-model="resource.title"></el-input>
        </el-form-item>
        <el-form-item label="Đường dẫn" prop="path">
          <el-input v-model="resource.path"></el-input>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="activated">
          <el-switch v-model="resource.activated" :active-value="1" :inactive-value="0" active-text="Bật" inactive-text="Tắt" style="width: 100%" />
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
  import resoureAPI from '../../../api/auth/resource'
  import config from '../../../utils/config'

  export default {
    name: 'Resource',
    components: { TablePagination },
    data() {
      return {
        url: `${config.api.auth}/resource`,
        dialogResourceVisible: false,
        formType: '',
        resource: {
          activated: 1
        }
      }
    },
    methods: {
      toggleCreateResource() {
        this.dialogResourceVisible = true
        this.formType = 'create'
        this.resource = {
          activated: 1
        }
      },
      handleEditResource(data) {
        this.dialogResourceVisible = true
        this.formType = 'edit'
        this.resource = { ...data }
      },
      async handleDeleteResource(role) {
        const res = await resoureAPI.delete(role._id)
        this.$refs.tableData.refreshData()
      },
      async handleSubmit() {
        const dataSubmit = { ...this.resource }
        const { _id, ...otherParams } = dataSubmit

        switch (this.formType) {
          case 'create':
            await resoureAPI.create(dataSubmit)
            break
          case 'edit':
            await resoureAPI.update(_id, { ...otherParams })
            break
          default:
            break
        }

        this.$refs.tableData.refreshData()
        this.dialogResourceVisible = false
      },
      handleCancel() {
        this.dialogResourceVisible = false
      }
    }
  }
</script>

<style lang="scss" src="./index.scss"></style>
