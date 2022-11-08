<template>
  <div class="inbox-page" v-loading="loading">
    <div class="header-action">
      <div v-if="currentFile._id">
        <button-icon icon="Download" @click="handleDownloadFile(currentFile)">Tải xuống</button-icon>
        <button-icon v-if="currentFile.state === config.fileStatus.PENDING" icon="_Signature" @click="handleSign(currentFile)">Ký tài liệu</button-icon>
      </div>
      <div v-else>
        <button-icon icon="_Add" @click="handleRequest">Tạo yêu cầu mới</button-icon>
      </div>

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
          <h3 v-if="resultFilter" style="margin: 0; padding: 0 5px; font-weight: 600; line-height: 32px">Tất cả {{ resultFilter < 10 ? `0${resultFilter}` : resultFilter }} kết quả</h3>
          <h3 v-else style="margin: 0; padding: 0 5px; font-weight: 600; line-height: 32px">{{ title }}</h3>
        </el-col>
        <el-col :span="8" style="text-align: right; display: flex">
          <el-input
            v-model="searchQuery"
            prefix-icon="el-icon-search"
            size="small"
            clearable
            placeholder=" Nhập từ khóa cần tìm kiếm"
            @input="onInputSearch"
          />
          <el-popover trigger="click" placement="bottom">
            <div>
              <el-radio-group v-model="filterDocument" @change="onFilterDocument" style="display: flex; flex-direction: column">
                <el-radio :label="1" style="margin: 5px 0">Tất cả tài liệu</el-radio>
                <el-radio :label="2" style="margin: 5px 0">Tài liệu của tôi</el-radio>
                <el-radio :label="3" style="margin: 5px 0">Tài liệu của thành viên</el-radio>
              </el-radio-group>
            </div>
            <span slot="reference" class="icon-filter">
              <svg-icon icon-class="Filter" />
            </span>
          </el-popover>
        </el-col>
      </el-row>
      <div v-if="tableData.length">
        <div v-if="viewType === config.viewType.LIST">
          <el-table
            fit
            height="calc(100vh - 260px)"
            :data="pagedTableData"
            style="width: 100%"
            highlight-current-row>
            <el-table-column prop="name" label="Yêu cầu" min-width="500" class-name="selectable-cell" fixed sortable>
              <template slot-scope="scope">
                <div
                  v-if="scope.row.metaType === metaType.FOLDER"
                  :title="scope.row.name"
                  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >
                  <el-checkbox v-model="scope.row.isActive" class="checkbox-select" @change="val => onSelectFile(scope.row, val)" />
                  <svg-icon class="icon-svg" icon-class="FolderItem" style="font-size:18px; margin-right: 5px"></svg-icon>
                  <el-button type="text" style="color: #606266" @click="gotoDetail(scope.row)">
                    {{ scope.row.name }}
                  </el-button>
                </div>
                <div
                  v-else-if="scope.row.metaType === metaType.FILE"
                  :title="scope.row.name"
                  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >
                  <el-checkbox v-model="scope.row.isActive" class="checkbox-select" @change="val => onSelectFile(scope.row, val)" />
                  <svg-icon v-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
                  <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
                  <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>
                  <span style="cursor: pointer; font-weight: 600" @click="gotoDetail(scope.row)">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="folderId" label="Thư mục" min-width="150" sortable>
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
            <el-table-column prop="createdAt" label="Cập nhật" min-width="120" sortable>
              <template slot-scope="scope">
                <span>{{ getTimeRelative(scope.row.updatedAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="Tag" width="180" sortable>
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.tags && scope.row.tags.length > 1"
                  placement="right"
                  trigger="hover">
                  <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
                  <div
                    v-for="tag in scope.row.tags"
                    key="tag._id"
                  >
                    <el-tag type="info" size="small" style="margin-bottom: 5px; height: 26px">
                      {{tag.name}}
                    </el-tag>
                  </div>
                  <span slot="reference">
                  <el-tag style="height: 26px"
                    size="mini"
                    type="info"
                    v-if="scope.row.tags && scope.row.tags.length"
                  >
                    {{scope.row.tags[0].name}}
                  </el-tag>
                  <span v-else>-</span>
                  <span class="quanity-tag"  v-if="scope.row.tags.length > 1">+{{ scope.row.tags.length - 1 }}</span>
                </span>
                </el-popover>
                <el-tag
                  v-else-if="scope.row.tags && scope.row.tags.length === 1"
                  size="mini"
                  type="info"
                  style="height: 26px"
                >
                  {{scope.row.tags[0].name}}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="Trạng thái" min-width="120" sortable>
              <template slot-scope="scope">
              <span>
                <span class="icon-status" :style="{ background: stateConfig[scope.row.state].color }"></span>
                <span class="title-status" :style="{ color: stateConfig[scope.row.state].color }">{{ stateConfig[scope.row.state].title }}</span>
              </span>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="Kích thước" width="150" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.size >= 0 ? getFileSize(scope.row.size) : "-" }}</span>
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
                <!--              <span-->
                <!--                v-if="scope.row.metaType===metaType.FILE"-->
                <!--                class="btn-table"-->
                <!--                @click="handleDigitizing(scope.row)"-->
                <!--              >-->
                <!--                <svg-icon icon-class="Key" />-->
                <!--              </span>-->
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end" style="margin-top: 20px">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="tableData.length"
              hide-on-single-page
              @current-change="setPage"
            >
            </el-pagination>
          </el-row>
        </div>
        <div v-else-if="viewType === config.viewType.GRID" class="grid-box-container">
          <div class="grid-box">
            <div
              v-for="item in tableData"
              :key="item._id"
              :class="[{ 'is-active': item.isActive }, 'grid-item']"
              @click="gotoDetail(item)"
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
        <svg-icon icon-class="Inbox" style="font-size: 120px" />
        <h4 style="margin: 5px 0">Danh sách trống</h4>
        <p style="color: #97a8be; margin: 5px 0 15px;">Hãy bắt đầu bằng cách tạo một yêu cầu mới</p>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleRequest">Tạo mới</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon'
import ButtonDropdown from '@/components/ButtonDropdown'
import config from '@/utils/config'
import moment from "moment";
import InboxApi from "@/api/inboxApi";
import { getUserInfo } from "@/utils/auth";
import {humanFileSize} from "@/utils";
import TagAPI from '@/api/tagApi'
moment.locale('vi')

export default {
  name: 'Inbox',
  components: { ButtonDropdown, ButtonIcon },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      config,
      resultFilter: 0,
      userInfo: getUserInfo(),
      loading: false,
      title: 'Tất cả tài liệu',
      status: this.$route.params.status,
      viewType: config.viewType.LIST,
      searchQuery: '',
      searchTagQuery: '',
      tags: [],
      filterDocument: 1,
      tableData: [],
      currentFile: {},
      metaType: {
        FOLDER: 1,
        FILE: 2
      },
      stateConfig: [
        {
          title: 'Tất cả',
          status: config.fileStatus.TOTAL,
          color: 'rgb(7, 47, 98)',
          isActive: false
        },
        {
          title: 'Đang chờ',
          status: config.fileStatus.PENDING,
          color: 'rgb(31, 78, 218)',
          isActive: false
        },
        {
          title: 'Hoàn thành',
          status: config.fileStatus.COMPLETE,
          color: 'rgb(5, 151, 106)',
          isActive: false
        },
        {
          title: 'Từ chối',
          status: config.fileStatus.REJECT,
          color: 'rgb(214, 60, 60)',
          isActive: false
        },
        {
          title: 'Thu hồi',
          status: config.fileStatus.RETRIEVAL,
          color: 'rgb(247, 158, 12)',
          isActive: false
        }
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if(route.query.status) {
          const fileStatus = +route.query.status
          this.setTitle(fileStatus)
          this.getData()
        }
      },
      immediate: true
    }
  },
  computed: {
    pagedTableData() {
      return this.tableData.slice(this.pageSize * this.currentPage - this.pageSize, this.pageSize * this.currentPage)
    }
  },
  mounted() {
    this.getTags()
  },
  methods: {
    setPage(val) {
      this.page = val
    },
    stringToSlug(str) {
      const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
      const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], 'gi'), to[i])
      }

      str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9 \-]/g, '')
        .replace(/-+/g, '')

      return str
    },
    async getTags() {
      this.tags = await TagAPI.getList()
    },
    async onInputSearch(value) {
      if(value) {
        this.tableData = this.tableData.filter(item => {
          const slug = this.stringToSlug(item.name)
          const query = this.stringToSlug(value)
          return slug.includes(query)
        })
        this.resultFilter = this.tableData.length
      } else {
        this.getData()
      }
    },
    onFilterDocument(filter) {
      this.getData(filter)
    },
    async getData(filter) {
      const state = +this.$route.query.status
      const query = {
        state,
        filter: filter || this.filterDocument
      }
      if(state === config.fileStatus.TOTAL) {
        delete query.state
      }

      try {
        this.loading = true
        const { data } = await InboxApi.get(query)
        this.loading = false
        this.tableData = data?.map(item => {
          return {
            _id: item._id,
            fileId: item.digitalDocuments[0]?.fileId?._id,
            folderId: item.digitalDocuments[0]?.fileId?.folderId,
            name: item.digitalDocuments[0]?.fileId?.name,
            path: item.digitalDocuments[0]?.fileId?.path,
            size: item.digitalDocuments[0]?.fileId?.size,
            tags: item.digitalDocuments[0]?.fileId?.tags,
            state: item.state,
            isActive: false,
            metaType: this.metaType.FILE,
            updatedAt: item.updatedAt,
            pathPdfs: item.pathPdfs
            // userSign: item.receiver?.find(u => u.userId._id === this.userInfo.userId) || {}
          }
        })
        this.resultFilter = 0
      } catch (err) {
        this.loading = false
      }
    },
    setTitle(fileStatus) {
      if(fileStatus) {
        switch (fileStatus) {
          case config.fileStatus.PENDING:
            this.title = 'Tài liệu đang chờ'
            break
          case config.fileStatus.COMPLETE:
            this.title = 'Tài liệu hoàn thành'
            break
          case config.fileStatus.REJECT:
            this.title = 'Tài liệu từ chối'
            break
          case config.fileStatus.RETRIEVAL:
            this.title = 'Tài liệu đã thu hồi'
            break
          default:
            this.title = 'Tất cả tài liệu'
            break
        }
      }
    },
    handleRequest() {
      this.$router.push('/document/sign')
    },
    handleViewList() {
      this.viewType = config.viewType.LIST
    },
    handleViewGrid() {
      this.viewType = config.viewType.GRID
    },
    onClickOption(event, item) {
      event.stopPropagation()
    },
    handleSelectionFile(item) {
      console.log(item)
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
    fileType(fileName) {
      if(fileName) {
        const [name, type] = fileName?.split('.')
        return type
      }
      return ''
    },
    formatDate(t) {
      return moment.unix(t).format("DD/MM/YYYY HH:mm:ss")
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
      const path = file?.pathPdfs[0]?.pathPdf
      const uri = `${config.api.download}/${path}`
      this.downloadURI(uri, file.name)
    },
    handleSign(file) {
      const pathPdf = file?.pathPdfs[0]?.pathPdf
      this.$router.push(`/document/file/${file.fileId}?state=${file.state}&signRequestId=${file._id}&pathPdf=${pathPdf}`)
    },
    gotoDetail(file) {
      const pathPdf = file?.pathPdfs[0]?.pathPdf
      this.$router.push(`/document/file/${file.fileId}?state=${file.state}&signRequestId=${file._id}&pathPdf=${pathPdf}`)
    },
    getFileSize(value) {
      const fileDetecter = humanFileSize()
      return fileDetecter(value * 1000)
    }
  }
}
</script>

<style lang="scss">
  .inbox-page {
    .option-select-tag {
      &.selected {

      }
    }
    .quanity-tag {
      font-size: 11px;
      color: #aaa;
      font-weight: bold;
      margin-left: 2px;
    }
    .blank-page {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 60px;
      flex-direction: column;
      height: calc(100vh - 203px);
    }

    .icon-filter {
      margin-left: 10px;
      vertical-align: middle;
      width: 32px;
      height: 32px;
      padding-top: 7px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      border-radius: 5px;

      &:hover, &:active, &:focus {
        background: #f1f3f5;
      }
    }

    .checkbox-select {
      vertical-align: text-bottom;
      margin-right: 8px;
      //display: none;
    }

    .icon-status {
      vertical-align: middle;
      width: 8px !important;
      height: 8px !important;
      border-radius: 50%;
      position: absolute;
      display: inline-block;
      top: 21px;
    }

    .title-status {
      margin-left: 15px;
      //font-size: 0.9rem;
    }

    .cell {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .heading-container {
      margin-bottom: 15px;
    }
  }
</style>
