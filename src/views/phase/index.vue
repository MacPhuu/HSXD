<template>
  <div class="phase-page" v-loading="loadingPage">
    <div class="header-action">
      <button-icon icon="_Add" @click="toggleCreateProject">Thêm Công Việc Mới</button-icon>
    </div>
    <div class="app-container">
      <el-table
        fit
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="Tên" prop="name" align="left" min-width="300" sortable fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.metaType === metaType.PHASE" :title="scope.row.name" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
              <svg-icon icon-class="FolderItem" class-name="icon-svg" />
              <el-button @click="gotoDetail(scope.row)" type="text" style="color:#606266;" v-if="scope.row.metaType===metaType.PHASE">
                {{ scope.row.phaseName }}
              </el-button>
            </div>
            <div v-else-if="scope.row.metaType === metaType.FILE" :title="scope.row.name" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
              <svg-icon v-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
              <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
              <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="Kiểu"
          width="100"
          sortable
        >
          <template slot-scope="scope">
            <div style="display: flex; justify-content: flex-start">
              <div style="display: flex; justify-content: flex-start">
                <div v-if="scope.row.metaType === metaType.PHASE">
                  <span>Công việc</span>
                </div>
                <div v-else-if="scope.row.metaType === metaType.FILE">
                  <span>Tài liệu</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="content"
          label="Nội dung"
          width="250"
        >
        </el-table-column>
        <el-table-column
          align="left"
          sortable
          label="Ngày khởi tạo"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="Người phụ trách"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.manager ? scope.row.manager.name || scope.row.manager.username : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="sign"
          sortable
          label="Đã ký"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="Thao tác"
          align="center"
          width="80"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.metaType === metaType.FILE"
              icon="el-icon-edit"
              type="text"
              @click="handleEdit(scope.row, scope.$index)"
            />
            <el-popconfirm
              style="margin-left: 15px"
              title="Bạn có chắc chắn xóa ?"
              cancel-button-text="Hủy"
              confirm-button-text="Đồng ý"
              @onConfirm="handleDelete(scope.row._id)"
            >
              <el-button
                slot="reference"
                icon="el-icon-delete"
                type="text"
                style="color: #f56c6c"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="phaseForm">
        <el-form-item label="Tên Công Việc" :label-width="formLabelWidth">
          <el-input v-model="phaseForm.phaseName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Ngày bắt đầu" :label-width="formLabelWidth">
          <el-date-picker
            v-model="phaseForm.startDate"
            type="datetime"
            placeholder="Chọn"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Ngày kết thúc" :label-width="formLabelWidth">
          <el-date-picker
            v-model="phaseForm.endDate"
            type="datetime"
            placeholder="Chọn"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Nội dung" :label-width="formLabelWidth">
          <el-input v-model="phaseForm.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Người Quản Lý" :label-width="formLabelWidth">
          <el-select v-model="phaseForm.manager" placeholder="Select">
            <el-option
              v-for="item in users"
              :key="item._id"
              :label="item.name||item.username"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">Đóng</el-button>
        <el-button type="primary" @click="handleSubmit">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import UserAPI from "@/api/auth/user"
import PhaseAPI from "@/api/phaseApi"
import ProjectAPI from "@/api/projectApi"
import moment from "moment"
import ButtonIcon from '@/components/ButtonIcon'

export default {
  components: { ButtonIcon },
  data() {
    return {
      loadingPage: false,
      dialogTitle: 'Thêm công việc mới',
      users: [],
      tableData: [],
      phaseForm: {
        startDate: new Date(),
        endDate: new Date()
      },
      form: {
        name: "",
        content: "",
        date: "",
        boss: "",
        check: "",
      },
      formType: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      metaType: {
        PHASE: 1,
        FILE: 2
      }
    }
  },
  async mounted() {
    await this.getUsers()
    await this.getPhaseAndFile()
  },
  methods: {
    fileType(fileName) {
      const [name, type] = fileName?.split('.')
      return type
    },
    goBack() {
      this.$router.go(-1)
    },
    toggleViewFile() {
      this.$router.push('/files')
    },
    async getUsers() {
      const { data } = await UserAPI.getAll()
      this.users = data
    },
    gotoDetail(row){
      const path = `/phases/child/${row._id}?phaseName=${row.phaseName}`
      const levelList = [
        {
          title: 'Quản lý công việc',
          path: '/phases',
        },
        {
          title: row.phaseName,
          path,
        }
      ]
      this.$store.dispatch('route/setBreadcrumb', levelList)
      this.$router.push(path)
    },
    formatDate(t) {
      return moment.unix(t).format("DD/MM/YYYY HH:mm:ss")
    },
    async getPhaseAndFile() {
      try {
        this.loadingPage = true
        const arr = []
        const data = await ProjectAPI.getPhaseAndFile({})
        this.loadingPage = false
        const { files, phases } = data
        phases.forEach(i => {
          i.metaType = this.metaType.PHASE
          arr.push(i)
        })
        files.forEach(i => {
          i.metaType = this.metaType.FILE
          arr.push(i)
        })
        this.tableData = arr
      } catch (err) {
        this.loadingPage = false
      }

    },
    toggleCreateProject() {
      this.dialogTitle = 'Thêm công việc mới'
      this.dialogFormVisible = true
      this.formType = 'create'
      this.form.type = 'folder'
    },
    toggleCreateDocument() {
      this.dialogFormVisible = true
      this.formType = 'create'
      this.form.type = 'file'
    },
    handleVatlieu() {
      this.$router.push('/form/index')
    },
    handleViewSupplier() {
      this.$router.push(`/supplier`)
    },
    handleEdit(data) {
      this.dialogTitle = 'Cập nhật công việc'
      this.dialogFormVisible = true
      this.formType = "edit"
      this.phaseForm = {
        ...data,
        startDate: new Date(data.startDate * 1000),
        endDate: new Date(data.endDate * 1000),
        manager: data.manager._id
      }
    },
    async handleDelete(id) {
      await PhaseAPI.delete(id)
      await this.getPhaseAndFile()
    },
    async handleSubmit() {
      switch (this.formType) {
        case "create": {
          const dataSubmit = {
            ...this.phaseForm,
            startDate: Math.floor(this.phaseForm.startDate.getTime() / 1000),
            endDate: Math.floor(this.phaseForm.endDate.getTime() / 1000)
          }
          await PhaseAPI.create(dataSubmit)
          await this.getPhaseAndFile()
          break
        }
        case "edit": {
          const dataSubmit = {
            ...this.phaseForm,
            startDate: Math.floor(this.phaseForm.startDate.getTime() / 1000),
            endDate: Math.floor(this.phaseForm.endDate.getTime() / 1000)
          }
          await PhaseAPI.update(this.phaseForm._id, dataSubmit)
          await this.getPhaseAndFile()
          break
        }
        default:
          break
      }
      this.form = {
        name: "",
        unit: "",
        price: "",
        supplier: "",
      }
      this.dialogFormVisible = false
    },
    handleCancle() {
      this.dialogFormVisible = false
      this.form = {
        name: "",
        unit: "",
        price: "",
        supplier: "",
      }
    },
    handleClose(done) {
      this.$confirm("Are you sure to close this dialog?")
        .then((_) => {
          done()
        })
        .catch((_) => {
        })
    },
  },
}
</script>

<style lang="scss">
.phase-page {
  .cell-overflow {
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    overflow: hidden;
  }
}
</style>
