<template>
  <div class="page-container page-content nguoi-dung">
    <table-pagination
      ref="tableData"
      :url="url"
      :search-params="searchParams"
      :search-form="searchForm"
      :is-search-date-range="false">
      <template slot="action" slot-scope="{ tableData }">
        <el-button size="small" type="primary" @click="handleCreate">
          Thêm mới
        </el-button>
      </template>
      <template slot="table" slot-scope="scope">
        <el-table
          v-loading="scope.isLoading"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          border
          resizable
          :data="scope.tableData"
          style="width: 100%; overflow-y: auto"
          :height="`calc(100vh - 180px)`"
        >
          <el-table-column
            type="index"
            label="#"
            align="center"
            fixed="left"
            :index="indexMethod"
          />
          <el-table-column
            sortable
            label="Thông tin người dùng"
            prop="username"
            fixed="left"
            min-width="220"
          >
            <template slot-scope="scope">
              <div class="avatar-customer-box">
                <img v-if="scope.row.avatar" class="avatar-customer" :src="scope.row.avatar" alt="avatar-customer">
                <el-icon v-else name="user-solid" class="icon-avatar" />
                <div class="avatar-title-wrap">
                  <div>{{ scope.row.name }}</div>
                  <div>{{ scope.row.username || '' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <template v-for="column in columnsMap">
            <search-column
              :label="column.label"
              :prop="column.prop"
              :min-width="column.minWidth"
              :type="column.type"
              :fixed="column.fixed"
              :searchRemote="handleSearch"
            />
          </template>

          <el-table-column
            fixed="right"
            align="center"
            label="Tác vụ"
            width="180"
          >
            <template slot-scope="val">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(val.row)"
              />
              <el-popconfirm
                style="margin-left: 5px"
                confirm-button-text="Đồng ý"
                cancel-button-text="Hủy"
                title="Bạn có chắc chắn xóa?"
                @confirm="handleDelete(val.$index, val.row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-pagination>
    <nguoi-dung-form
      ref="form"
      :formvalue="formValue"
      :formType="formType"
      @submit-success-event="submitSuccess"
    />
  </div>
</template>

<script>
import TablePagination from '@/components/TablePagination/index'
import NguoiDungForm from './detail/index'
import { handleSearchInTable, parseTime } from '@/utils'
import config from '@/utils/config'
import SearchColumn from '@/components/SearchColumn/index'
import UserAPI from "@/api/auth/user";

export default {
  name: 'NguoiDung',
  components: {
    SearchColumn,
    TablePagination,
    NguoiDungForm,
  },
  data() {
    return {
      url: `${config.api.user}`,
      searchForm: {},
      searchParams: [
        {
          label: 'Tên đăng nhập',
          value: 'username',
        },
        {
          label: 'Họ và tên',
          value: 'name',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Địa chỉ',
          value: 'address',
        }
      ],
      formValue: undefined,
      danhSachDonVi: [],
      formType: 'create',
      fileTypeMap: config.fileType,
      fileType: 1,
      columnsMap: [
        {
          label: 'Họ và tên',
          prop: 'name',
          minWidth: '180'
        },
        {
          label: 'Tên đăng nhập',
          prop: 'username',
          minWidth: '220',
        },
        {
          label: 'Email',
          prop: 'email',
          minWidth: '220'
        },
        {
          label: 'CMT/CCCD',
          prop: 'idCard',
          minWidth: '180'
        },
        {
          label: 'Ngày sinh',
          prop: 'birthday',
          minWidth: '180',
          type: 'date'
        },
        {
          label: 'Địa chỉ',
          prop: 'address',
          minWidth: '180'
        },
        {
          label: 'Số điện thoại',
          prop: 'phoneNumber',
          minWidth: '180'
        },
      ]
    }
  },
  methods: {
    async handleSearch(prop, value) {
      handleSearchInTable(this, prop, value, 'remote')
    },
    indexMethod(index) {
      return index + 1
    },
    // Callback từ dialog
    async callbackFromChild(e) {
      console.log(e)
    },
    // Thêm mới
    async handleCreate() {
      this.formType = 'create'
      this.formValue = { status: 1, avatar: '' }
      this.$refs.form.$refs.dialog.updateShowDialog(true)
    },

    // Edit
    async handleUpdate(row) {
      this.formType = 'edit'

      const res = await UserAPI.getById(row._id)

      this.formValue = {
        ...res,
        roles: res.roles.map(role => role._id),
        birthday: row.birthday ? new Date(row.birthday * 1000) : undefined
      }
      this.$refs.form.$refs.dialog.updateShowDialog(true)
    },

    // Xóa
    handleDelete(index, row) {
      UserAPI.del(row._id)
        .then((res) => {
          this.$refs.tableData.refreshData()
        })
        .catch((err) => console.log(err))
    },

    // Filter
    handleFilterByResult(resultType) {
      if (resultType) {
        this.$refs.tableData.handleFilter({
          ketQuaHienTai: resultType,
        })
      } else {
        this.$refs.tableData.handleFilter()
      }
    },
    // Khi form data submit api success
    async submitSuccess() {
      this.$refs.tableData.refreshData()
    },
    formatTime(timeStamp, format) {
      return parseTime(timeStamp, format)
    }
  },
}
</script>

<style lang="scss">
.avatar-customer-box {
  display: flex;
  align-items: center;

  .avatar-customer {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  .avatar-title-wrap {
    margin-left: 5px;

    div:nth-child(1) {
      font-weight: 600;
    }
  }
}

.icon-avatar {
  text-align: center;
  padding-top: 15px;
  font-size: 18px;
  cursor: pointer;
  height: 50px;
  width: 50px;
  background: #97a8be;
  border-radius: 50%;
  color: #fff;
}
</style>
