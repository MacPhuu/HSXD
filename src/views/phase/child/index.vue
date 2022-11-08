<template>
  <div class="phase-child" v-loading="loadingPage">
    <div class="header-action">
      <button-icon icon="_Add" @click="toggleCreateProject">Thêm Công việc mới</button-icon>
      <button-icon icon="FolderAdd" @click="toggleCreateDocument">Thêm Tài liệu</button-icon>
    </div>
    <div class="breadcrumb-container">
      <breadcrumb-box />
    </div>
    <div class="app-container">
      <el-table stripe :data="tableData" style="width: 100%">
        <el-table-column label="Tên" prop="name" align="left" width="200" sortable fixed>
          <template slot-scope="scope">
            <div v-if="scope.row.metaType === metaType.PHASE" :title="scope.row.name" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
              <svg-icon icon-class="FolderItem" class-name="icon-svg" />
              <el-button
                v-if="scope.row.metaType===metaType.PHASE"
                type="text"
                style="color:#606266;"
                @click="gotoDetail(scope.row)"
              >
                {{ scope.row.phaseName }}
              </el-button>
            </div>
            <div v-else-if="scope.row.metaType === metaType.FILE" :title="scope.row.name" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
              <svg-icon v-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
              <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
              <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>              <span>{{ scope.row.name }}</span>
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
            ></el-button>
            <el-popconfirm
              style="margin-left: 15px"
              title="Bạn có chắc chắn xóa ?"
              cancel-button-text="Hủy"
              confirm-button-text="Đồng ý"
              @onConfirm="handleDelete(scope.$index)"
            >
              <el-button
                slot="reference"
                icon="el-icon-delete"
                type="text"
                style="color: #f56c6c"
              ></el-button>
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

    <el-dialog
      title="Thêm mới tài liệu"
      :visible.sync="dialogDocument"
    >
      <el-checkbox v-model="selectedAll" @change="onSelectAllDocument">Chọn tất cả</el-checkbox>
      <div
        v-for="item in documents"
        :key="item._id"
        style="margin-top: 15px"
      >
        <el-checkbox v-model="item.selected" class="checkbox-custom">
          <span>
            <svg-icon v-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
            <svg-icon v-else-if="fileType(item.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
            <svg-icon v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>            <span :title="item.name">{{ item.name }}</span>
          </span>
        </el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDocument = false">Đóng</el-button>
        <el-button type="primary" @click="handleAddDocument">Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import UserAPI from "@/api/auth/user"
import PhaseAPI from "@/api/phaseApi"
import ProjectAPI from "@/api/projectApi"
import moment from "moment"
import FileAPI from '@/api/fileApi'
import ButtonIcon from '@/components/ButtonIcon'
import BreadcrumbBox from '@/components/BreadcrumbBox'
import { mapGetters } from 'vuex'

export default {
  components: { BreadcrumbBox, ButtonIcon },
  data() {
    return {
      loadingPage: false,
      users: [],
      phaseId: this.$route.params.id,
      phaseName: this.$route.query.phaseName,
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
      dialogTitle: 'Thêm công việc mới',
      dialogFormVisible: false,
      dialogDocument: false,
      selectedAll: false,
      documents: [
        {
          _id: 1,
          name: 'A'
        },
        {
          _id: 2,
          name: 'B'
        }
      ],
      formLabelWidth: "120px",
      metaType: {
        PHASE: 1,
        FILE: 2
      }
    }
  },
  computed: {
    ...mapGetters([
      'levelList'
    ])
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
    handleViewSupplier() {
      // this.$router.push(`/supplier?phaseId=${this.phaseId}`)
      this.$router.push('/supplier')
    },
    onSelectAllDocument(checked) {
      this.documents = this.documents.map(i => {
        i.selected = checked
        return i
      })
    },
    async getDocuments() {
      const data = await FileAPI.get({})
      this.documents = data.map(i => {
        i.selected = false
        return i
      })
    },
    async handleAddDocument() {
      const docs = this.documents.filter(i => i.selected)
      const dataSubmit = {
        phaseId: this.phaseId,
        data: docs.map(i => i._id)
      }
      await FileAPI.addFile(dataSubmit)
      this.dialogDocument = false
      await this.getPhaseAndFile()
    },
    goBack() {
      this.$router.go(-1)
    },
    async getUsers() {
      const { data } = await UserAPI.getAll()
      this.users = data
    },
    gotoDetail(row) {
      const path = `/phases/child/${row._id}?phaseName=${row.phaseName}`
      const levelList = [
        ...this.levelList,
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
        const data = await ProjectAPI.getPhaseAndFile({ parentId: this.phaseId })
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
      this.selectedAll = false
      this.dialogDocument = true
      this.getDocuments()
    },
    handleEdit(data) {
      this.dialogTitle = 'Cập nhật công việc'
      this.dialogFormVisible = true
      this.formType = "edit"
      this.form = { ...data }
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    async handleSubmit() {
      const obj = {
        ...this.phaseForm,
        startDate: Math.floor(this.phaseForm.startDate.getTime() / 1000),
        endDate: Math.floor(this.phaseForm.endDate.getTime() / 1000),
        parentId: this.phaseId
      }
      switch (this.formType) {
        case "create":
          await PhaseAPI.create(obj)
          await this.getPhaseAndFile()
          break
        case "edit":
          break
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
.phase-child {
  .checkbox-custom {
    width: 100%;
    .el-checkbox__label {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      vertical-align: middle;
    }
  }
}
</style>
