<template>
  <div>
    <breadcrumb-document v-if="showChild" :level-list="levelList" :handle-link="handleLink" />
    <el-table
      v-if="!showChild"
      v-loading="loadingData"
      fit
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="gotoDetail"
    >
      <el-table-column prop="phaseName" label="Tên">
        <template slot-scope="scope">
          <div
            v-if="scope.row.metaType === metaType.FOLDER"
            :title="scope.row.name"
            style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; display: flex; justify-content: space-between; align-items: center; cursor: pointer"
          >
            <div>
              <svg-icon class="icon-svg" icon-class="FolderItem" style="font-size:18px; margin-right: 5px"></svg-icon>
              <el-button type="text" style="color: #606266" @click="gotoDetail(scope.row)">
                {{ scope.row.name }}
              </el-button>
            </div>
            <svg-icon icon-class="CaretRight" />
          </div>
          <div
            v-else-if="scope.row.metaType === metaType.FILE"
            :title="scope.row.name"
            style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; cursor: pointer"
          >
            <svg-icon v-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class="icon-svg" icon-class="doc"></svg-icon>
            <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class="icon-svg" icon-class="pdf"></svg-icon>
            <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class="icon-svg" icon-class="xls"></svg-icon>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <file-child v-else :key="keyChild" :folder-id="folderId" @updateBreadcrumb="updateBreadcrumb" @selectFile="selectFile" />
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import FolderAPI from '@/api/folder'
import FileChild from '@/views/sign-document/child'
import BreadcrumbDocument from '@/views/sign-document/breadcrumb'

export default {
  name: 'FileList',
  components: { BreadcrumbDocument, FileChild },
  data() {
    return {
      config,
      loadingData: false,
      levelList: [],
      keyChild: 1,
      folderId: undefined,
      showChild: false,
      searchQuery: '',
      tableData: [],
      metaType: {
        FOLDER: 1,
        FILE: 2
      },
    }
  },
  mounted() {
    this.loadFolder()
  },
  methods: {
    selectFile(file) {
      this.$emit('selectFile', file)
    },
    handleLink(item, index) {
      if(item.isParent) {
        this.showChild = false
      } else {
        this.folderId = item.folderId
        this.keyChild++
        this.levelList = this.levelList.slice(0, index + 1)
      }
    },
    updateBreadcrumb(level) {
      this.levelList.push(...level)
    },
    async loadFolder() {
      try {
        this.loadingData = true
        const arr = []
        const data = await FolderAPI.getFileAndFolder()
        this.loadingData = false
        const { folders, files } = data
        folders.forEach(i => {
          arr.push({ ...i, metaType: this.metaType.FOLDER })
        })
        files.forEach(i => {
          if(i.type === config.fileType.FILE) {
            arr.push({ ...i, metaType: this.metaType.FILE })
          }
        })
        this.tableData = arr
      } catch (err) {
        this.loadingData = false
      }
    },
    handleSelectionFile(item) {
    },
    getTimeRelative(unixTS) {
      return unixTS ? moment(unixTS * 1000).fromNow() : ''
    },
    fileType(fileName) {
      const [name, type] = fileName?.split('.')
      return type
    },
    gotoDetail(item) {
      if(item.metaType === this.metaType.FOLDER) {
        this.showChild = true
        this.folderId = item._id
        this.levelList = [
          {
            title: 'Tài liệu của tôi',
            isParent: true,
            folderId: 'root'
          },
          {
            title: item.name,
            folderId: item._id,
            isParent: false
          }
        ]
      } else if(item.metaType === this.metaType.FILE) {
        this.$emit('selectFile', item)
      }
    },
  }
}
</script>

<style scoped>

</style>
