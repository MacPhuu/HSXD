<template>
  <div>
    <breadcrumb-document v-if="showChild" :level-list="levelList" :handle-link="handleLink" />
    <div v-if="!folderId" class="filter-box">
      <el-select
        v-if="searchQuery === '#' || searchQuery.toLowerCase() === 'tag'"
        ref="selectTagInput"
        v-model="searchTagQuery"
        class="select-tag-input"
        size="small"
        clearable
        filterable
        no-match-text=" "
        @input="onInputSearchTag"
      >
        <span slot="prefix">
          <el-icon name="search" />
          Tag:
        </span>
        <el-option-group label="Tags">
          <el-option
            v-for="(tag, idx) in tags"
            :key="'tag-select' + tag._id"
            :label="tag.name"
            :value="tag._id"
          >
            <el-tag size="small" type="info">{{ tag.name }}</el-tag>
          </el-option>
        </el-option-group>
      </el-select>
      <el-input
        v-else
        v-model="searchQuery"
        prefix-icon="el-icon-search"
        size="small"
        clearable
        placeholder="Nhập từ khóa cần tìm kiếm"
        @input="onInputSearch"
      />
    </div>
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
              <svg-icon v-if="scope.row.default" class="icon-svg" icon-class="FolderFixed" style="font-size:18px; margin-right: 5px"></svg-icon>
              <svg-icon v-else class="icon-svg" icon-class="FolderFlex" style="font-size:18px; margin-right: 5px"></svg-icon>
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
            <svg-icon v-else class="icon-svg" icon-class="File"></svg-icon>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <file-child v-else :key="keyChild" :folder-id="folderId" @updateBreadcrumb="updateBreadcrumb" @selectFile="selectFile" @selectFolder="selectFolder" />
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import FolderAPI from '@/api/folder'
import FileChild from '@/views/sheet/child'
import BreadcrumbDocument from '@/views/sheet/breadcrumb'
import searchAPI from '@/api/searchApi'
import TagAPI from '@/api/tagApi'

export default {
  name: 'FileList',
  components: { BreadcrumbDocument, FileChild },
  data() {
    return {
      config,
      loadingData: false,
      loadingTag: false,
      levelList: [],
      keyChild: 1,
      folderId: undefined,
      showChild: false,
      searchQuery: '',
      searchTagQuery: '',
      timeoutQuery: null,
      tableData: [],
      tags: [],
      metaType: {
        FOLDER: 1,
        FILE: 2
      },
    }
  },
  mounted() {
    this.loadFolder()
    this.getTags()
  },
  methods: {
    setDataTable(data) {
      const arr = []
      const { folders, files } = data
      folders.forEach(i => {
        arr.push({ ...i, metaType: this.metaType.FOLDER })
      })
      files.forEach(i => {
        if (i.type === config.fileType.FILE) {
          arr.push({ ...i, metaType: this.metaType.FILE })
        }
      })
      this.tableData = arr.map(item => {
        return {
          ...item
        }
      })
    },
    async getTags() {
      try {
        this.loadingTag = true
        const data = await TagAPI.getList()
        this.tags = data.map(tag => {
          tag.showMore = false
          return tag
        })
        this.loadingTag = false
        const tagMap = {}
        this.tags.forEach(i => {
          tagMap[i.name] = i._id
        })
        this.tagMap = tagMap
      } catch (err) {
        this.loadingTag = false
      }
    },
    async onInputSearch(value) {
      if (value === '#' || value.toLowerCase() === 'tag') {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(async() => {
          this.searchTagQuery = value
          await this.getTags()
        }, 1000)
        this.$nextTick(() => {
          this.$refs.selectTagInput && this.$refs.selectTagInput.focus()
        })
        return
      }

      if (value) {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(async() => {
          try {
            this.loadingData = true
            const data = await searchAPI.getAll({ slug: value, folderId: '' })
            this.setDataTable(data)
            this.loadingData = false
          } catch (err) {
            this.loadingData = false
          }
        }, 1000)
      } else {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(() => {
          this.loadFolder()
        }, 1000)
      }
    },
    async onInputSearchTag(value) {
      if (value) {
        try {
          this.loadingData = true
          const data = await searchAPI.getByTag({ id: this.searchTagQuery })
          this.setDataTable(data)
          this.loadingData = false
        } catch (err) {
          this.loadingData = false
        }
      } else {
        this.searchQuery = ''
        this.loadFolder()
      }
    },
    selectFile(file) {
      this.$emit('selectFile', file)
    },
    selectFolder(folder) {
      this.$emit('selectFolder', folder)
    },
    handleLink(item, index) {
      if(item.folderId === 'root') {
        this.folderId = ''
      }
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
        this.$emit('selectFolder', item)
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
        this.$store.dispatch('route/setBreadcrumb', this.levelList)
        this.setBreadcrumbGlobal(item)
      } else if(item.metaType === this.metaType.FILE) {
        this.$emit('selectFile', item)
      }
    },
    setBreadcrumbGlobal(item) {
      const path = `/document/files/child/${item._id}?folderName=${item.name}&viewType=1`

      const levelList = [
        {
          title: 'Tài liệu của tôi',
          path: '/document/files'
        },
        {
          title: item.name,
          path,
          tags: item.tags
        }
      ]
      this.$store.dispatch('route/setBreadcrumb', levelList)
    }
  }
}
</script>

<style scoped>

</style>
