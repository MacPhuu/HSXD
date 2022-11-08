<template>
  <div class="page-trash" v-loading="loadingPage">
    <div class="header-action">
      <span class="right-action-btn">
        <button-dropdown icon="List">
          <el-dropdown-menu slot="dropdown-menu">
            <el-dropdown-item @click.native="handleViewList">
              <svg-icon v-if="viewType === config.viewType.LIST" icon-class="Check" style="margin-right: 5px" />
              <span :style="{ marginLeft: viewType === config.viewType.LIST ? 'unset' : '19px' }">
                <svg-icon icon-class="List" style="margin-right: 5px" />
                Danh sách
              </span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleViewGrid">
              <svg-icon v-if="viewType === config.viewType.GRID" icon-class="Check" style="margin-right: 5px" />
              <span :style="{ marginLeft: viewType === config.viewType.GRID ? 'unset' : '19px' }">
                <svg-icon icon-class="Grid" style="margin-right: 5px" />
                Lưới
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </button-dropdown>
      </span>
    </div>
    <div class="app-container">
      <el-row class="heading-container" type="flex" justify="space-between">
        <el-col :span="12">
          <h3 style="margin: 0; padding: 0 5px; font-weight: 600; line-height: 32px">Đã xóa</h3>
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-input v-model="searchQuery" prefix-icon="el-icon-search" size="small" placeholder="Nhập từ khóa cần tìm kiếm" />
        </el-col>
      </el-row>
      <div v-if="tableData.length">
        <el-table
          v-if="viewType === config.viewType.LIST"
          fit
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="50"
          />
          <el-table-column prop="phaseName" label="Tên" min-width="200" class-name="selectable-cell">
            <template slot-scope="scope">
              <div
                v-if="scope.row.metaType === metaType.FOLDER"
                :title="scope.row.name"
                style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
              >
                <svg-icon class="icon-svg" icon-class="FolderItem" style="font-size:18px; margin-right: 5px"></svg-icon>
                <el-button type="text" style="color: #606266">
                  {{ scope.row.name }}
                </el-button>
              </div>
              <div
                v-else-if="scope.row.metaType === metaType.FILE"
                :title="scope.row.name"
                style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
              >
                <svg-icon v-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
                <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
                <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>
                <svg-icon v-else class="icon-svg" icon-class="File"></svg-icon>
                <span style="cursor: pointer">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="Kích thước" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.size >= 0 ? getFileSize(scope.row.size) : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="folderId" label="Thư mục" min-width="150">
            <template slot-scope="scope">
              <span
                v-if="scope.row.folderId"
                :title="`${ scope.row.folderId.name}/${ scope.row.name}`"
                style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                {{ scope.row.folderId.name }}/{{ scope.row.name }}
              </span>
              <span
                v-else
                :title="scope.row.name"
                style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="phaseState" label="Ngày tạo" width="150">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="right-action-table" prop="phaseSigned" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <span
                v-if="scope.row.metaType===metaType.FILE"
                class="btn-table"
                @click="handleDownloadFile(scope.row)"
              >
                <svg-icon icon-class="Download" />
              </span>
              <span
                v-if="scope.row.metaType===metaType.FILE"
                slot="reference"
                class="btn-table"
                @click="handleDeleteFile(scope.row)"
              >
                <svg-icon icon-class="Trash" />
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="viewType === config.viewType.GRID" class="grid-box-container">
          <div class="grid-box">
            <div
              v-for="item in tableData"
              :key="item._id"
              :class="[{ 'is-active': item.isActive }, 'grid-item']"
            >
              <el-checkbox class="checkbox-item" @change="value => onSelectFile(item, value)" @click.native="e => e.stopPropagation()" />
              <span class="option-btn-icon" @click="e => onClickOption(e, item)">
                <svg-icon icon-class="ThreedotHorizonal" />
              </span>
              <svg-icon v-if="item.metaType === metaType.FOLDER" icon-class="FolderItem" class-name="file-icon" />
              <svg-icon v-else-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'" class-name="file-icon" icon-class="doc"></svg-icon>
              <svg-icon v-else-if="fileType(item.name) === 'pdf'" class-name="file-icon" icon-class="pdf"></svg-icon>
              <svg-icon v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'" class-name="file-icon" icon-class="xls"></svg-icon>
              <div class="file-name" :title="item.name">{{ item.name }}</div>
              <span class="created-time">{{ getTimeRelative(item.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="blank-page">
        <svg-icon icon-class="TrashEmpty" style="font-size: 100px" />
        <h4 style="margin: 5px 0">Danh sách trống</h4>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDropdown from '@/components/ButtonDropdown'
import config from '@/utils/config'
import FileAPI from "@/api/fileApi";
import moment from "moment";
import {humanFileSize} from "@/utils";

moment.locale('vi')

export default {
  name: 'Trash',
  components: { ButtonDropdown },
  data() {
    return {
      config,
      loadingPage: false,
      searchQuery: undefined,
      viewType: config.viewType.LIST,
      tableData: [],
      metaType: {
        FOLDER: 1,
        FILE: 2
      },
      currentFile: {}
    }
  },
  created() {
    this.loadFile()
  },
  methods: {
    handleSelectionChange() {

    },
    downloadURI(uri, name) {
      const link = document.createElement("a")
      link.download = name
      link.href = uri
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handleDownloadFile(file) {
      const uri = `${config.api.download}/${file.path}`
      this.downloadURI(uri, file.name)
    },
    async handleDeleteFile(file) {
      await FileAPI.delete(file._id)
      this.loadFile()
    },
    onClickOption(event, item) {
      event.stopPropagation()
    },
    handleSelectionFile(item) {
      this.currentFile = { ...item }
    },
    onSelectFile(item, selected) {
      this.tableData.forEach(i => {
        if(i._id !== item._id) {
          i.isActive = false
        }
      })
      item.isActive = selected
      this.currentFile = selected ? { ...item } : {}
    },
    getTimeRelative(unixTS) {
      return unixTS ? moment(unixTS * 1000).fromNow() : ''
    },
    formatDate(t) {
      return moment.unix(t).format("DD/MM/YYYY HH:mm:ss")
    },
    fileType(fileName) {
      const [name, type] = fileName?.split('.')
      return type
    },
    handleViewList() {
      this.viewType = config.viewType.LIST
    },
    handleViewGrid() {
      this.viewType = config.viewType.GRID
    },
    async loadFile() {
      try {
        this.loadingPage = true
        const { data } = await FileAPI.get({ deleted: 1 })
        this.loadingPage = false

        this.tableData = data?.map(item => {
          return {
            ...item,
            isActive: false,
            metaType: this.metaType.FILE
          }
        })
      } catch (err) {
        this.loadingPage = false
      }
    },
    getFileSize(value) {
      const fileDetecter = humanFileSize()
      return fileDetecter(value * 1000)
    }
  }
}
</script>

<style lang="scss">
  .page-trash {
    .blank-page {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 60px;
      flex-direction: column;
      height: calc(100vh - 203px);
    }

    .checkbox-select {
      vertical-align: text-bottom;
      margin-right: 8px;
      //display: none;
    }

    .heading-container {
      margin-bottom: 15px;
    }
  }
</style>
