<template>
  <div class="sheet-wrapper">
    <el-row style="margin-bottom: 12px">
      <el-col :span="8">
        <el-button size="small" type="primary" :loading="loadingSubmit" @click="saveData">Lưu</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addTab">Thêm đợt</el-button>
      </el-col>
      <el-col :xl="10" :lg="16" style="float: right">
        <el-row :gutter="15">
          <el-col :span="6">
            <span v-if="queryResult.length" class="result-text">Tìm thấy {{ queryResult.length }} kết quả</span>
          </el-col>
          <el-col :span="queryResult.length ? 18 : 24">
            <el-input id="searchField" v-model="searchValue" prefix-icon="el-icon-search" size="small"
                      placeholder="Nhập từ khóa cần tìm kiếm" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="sheet-table" v-loading="loadingSheet">
      <el-row class="toolbar" type="flex" align="center">
        <span class="group-btn">
          <span class="toolbar-btn" @click="handleSetStyle('bold')"><svg-icon icon-class="bold" /></span>
          <span class="toolbar-btn" @click="handleSetStyle('italic')"><svg-icon icon-class="italic" /></span>
          <span class="toolbar-btn" @click="handleSetStyle('highlight-yellow')"><svg-icon
            icon-class="fill-color" /></span>
          <span class="toolbar-btn" @click="handleSetStyle('border-all')"><svg-icon icon-class="border-all" /></span>
          <span class="toolbar-btn" @click="undo"><svg-icon icon-class="undo" /></span>
          <span class="toolbar-btn" @click="redo"><svg-icon icon-class="redo" /></span>
        </span>
      </el-row>
      <hot-table ref="hotTable" :data="currentData" :settings="settings" />
    </div>
    <el-tabs :active-name="activeTab" tab-position="bottom" :closable="timeList.length > 1" @tab-click="onChangeTab"
             @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item, idx) in timeList"
        :key="'time-' + idx"
        :name="idx + ''"
        :label="`Đợt ${idx + 1}`"
      />
    </el-tabs>

    <el-dialog
      title="Tài liệu của tôi"
      :visible.sync="dialogLink"
    >
      <file-list @selectFile="selectFile" @selectFolder="selectFolder" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLink = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleSubmitInsertLink"
        >
          Thêm đường dẫn tới đây
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Cấu hình cột cố định"
      :visible.sync="dialogSetting"
      width="30%"
    >
      <label style="margin-bottom: 5px; display: block">Số cột cố định</label>
      <el-input v-model="columnFreezeCount" type="number" placeholder="Nhập số cột muốn cố định" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSetting = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleSubmitFreezeColumn"
        >
          Lưu
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import CategoryAPI from '@/api/categoryApi'
import FileList from '@/views/sheet/file'
import config from '@/utils/config'

export default {
  name: 'SheetCategory',
  components: {
    FileList,
    HotTable
  },
  props: {
    folderId: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    },
    searchProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      categoryTypeMap: config.categoryType,
      queryResult: 0,
      searchValue: '',
      folderLink: {},
      loadingSheet: false,
      loadingSubmit: false,
      loadingTree: false,
      treeFolder: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentData: [new Array(14)],
      timeList: [],
      activeTab: '0',
      dialogLink: false,
      dialogSetting: false,
      columnFreezeCount: 0,
      hotRef: null,
      settings: {
        search: true,
        colHeaders: true,
        rowHeaders: true,
        width: '100%',
        height: 'auto',
        manualColumnFreeze: true,
        fixedRowsTop: 3,
        // fixedColumnsLeft: 2,
        height: 'calc(100vh - 245px)',
        rowHeights: 50,
        colWidths: 180,
        manualColumnResize: true,
        licenseKey: 'non-commercial-and-evaluation',
        outsideClickDeselects: false,
        selectionMode: 'multiple', // 'single', 'range' or 'multiple',
        afterChange: () => {
          if (this.hotRef) {
            // update data
          }
        },
        contextMenu: {
          items: {
            'alignment': {},
            'mergeCells': {},
            'freeze_column_custom': {
              name: 'Cố định cột',
              callback: (name, position) => {
                this.freezeColumn(position)
              }
            },
            'separator1': Handsontable.plugins.ContextMenu.SEPARATOR,
            'row_above': {
              name: 'Thêm hàng trên'
            },
            'row_below': {
              name: 'Thêm hàng dưới'
            },
            'col_left': {
              name: 'Thêm cột trái'
            },
            'col_right': {
              name: 'Thêm cột phải'
            },
            'remove_row': {
              name: 'Xóa hàng'
            },
            'clear_column': {
              name: 'Xóa cột'
            },
            'source_material': {
              name: 'Xem nguồn gốc vật liệu',
              callback: (name, position) => {
                this.viewSourceMaterial(position)
              }
            },
            'separator2': Handsontable.plugins.ContextMenu.SEPARATOR,
            'insert_link': {
              name: 'Chèn link',
              callback: (name, position) => {
                this.insertLink(position)
              }
            }
          }
        },
        renderer: 'html'
      }
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    freezeColumn() {
      this.dialogSetting = true
      this.columnFreezeCount = this.timeList[+this.activeTab].fixedColumnsLeft || this.columnFreezeCount
    },
    handleSubmitFreezeColumn() {
      this.settings.fixedColumnsLeft = this.columnFreezeCount
      this.hotRef.updateSettings(this.settings)
      this.hotRef.render()
      this.hotRef.resumeRender()
      this.dialogSetting = false

      this.saveData()
    },
    async selectFile(file) {
      this.folderLink.link = `/document/file/${file._id}`
    },
    async selectFolder(folder) {
      const { _id, name } = folder
      this.folderLink.link = `/document/files/child/${_id}?folderName=${name}&viewType=1`
    },
    undo() {
      this.hotRef.undo()
    },
    redo() {
      this.hotRef.redo()
    },
    handleSetStyle(className) {
      const selected = this.hotRef.getSelected() || []

      this.hotRef.suspendRender()

      let currentRowIndex = null
      let currentColumnIndex = null

      for (let index = 0; index < selected.length; index += 1) {
        const [row1, column1, row2, column2] = selected[index]
        const startRow = Math.max(Math.min(row1, row2), 0)
        const endRow = Math.max(row1, row2)
        const startCol = Math.max(Math.min(column1, column2), 0)
        const endCol = Math.max(column1, column2)

        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
          for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
            currentColumnIndex = columnIndex
            currentRowIndex = rowIndex

            const cellMeta = this.hotRef.getCellMeta(rowIndex, columnIndex)
            const currentClassName = cellMeta.className || ''
            if (currentClassName && currentClassName.includes(className)) {
              const newClassName = currentClassName.split(className)
              this.hotRef.setCellMeta(rowIndex, columnIndex, 'className', newClassName.join(''))
            } else {
              this.hotRef.setCellMeta(rowIndex, columnIndex, 'className', `${currentClassName} ${className}`)
            }
          }
        }
      }

      this.hotRef.render()
      this.hotRef.resumeRender()
    },
    handleSearch() {
      const searchField = document.getElementById('searchField')

      Handsontable.dom.addEvent(searchField, 'keyup', (event) => {
        // get the `Search` plugin's instance
        const search = this.hotRef.getPlugin('search')
        // use the `Search` plugin's `query()` method
        this.queryResult = search.query(this.searchValue)
        this.hotRef.render()
      })
    },
    async getCategory() {
      this.hotRef = this.$refs.hotTable.hotInstance
      this.handleSearch()

      const params = {
        type: this.type
      }
      if (this.folderId) {
        params.folderId = this.folderId
      }

      try {
        this.loadingSheet = true
        const { data } = await CategoryAPI.get(params)
        this.loadingSheet = false

        if(data && data.length) {
          this.settings.fixedColumnsLeft = data[0].fixedColumnsLeft || this.columnFreezeCount
        }

        switch (this.type) {
          case this.categoryTypeMap.MATERIAL:
            this.settings.mergeCells = [
              { row: 0, col: 0, rowspan: 2, colspan: 1 },
              { row: 0, col: 1, rowspan: 2, colspan: 1 },
              { row: 0, col: 2, rowspan: 2, colspan: 1 },
              { row: 0, col: 3, rowspan: 2, colspan: 1 },
              { row: 0, col: 4, rowspan: 1, colspan: 3 },
              { row: 0, col: 7, rowspan: 2, colspan: 1 },
              { row: 0, col: 8, rowspan: 2, colspan: 1 },
              { row: 0, col: 9, rowspan: 1, colspan: 2 },
              { row: 0, col: 11, rowspan: 2, colspan: 1 },
              { row: 0, col: 12, rowspan: 2, colspan: 1 },
              { row: 0, col: 13, rowspan: 2, colspan: 1 },
              // { row: 0, col: 14, rowspan: 2, colspan: 1 }
            ]

            if (data && data.length) {
              this.timeList = data
            } else {
              this.timeList = [
                {
                  data: [
                    ['STT', 'TÊN VẬT LIỆU', 'NGÀY NHẬP', 'KHỐI LƯỢNG', 'CHỨNG CHỈ', '', '', 'PHIẾU XUẤT XỨ', 'CHỨNG NHẬN HỢP QUỸ', 'THÍ NGHIỆM MẪU (HIỆN TRƯỜNG)', '', 'BIÊN BẢN NGHIỆM THU (Số hiệu biên bản, ngày nghiệm thu)', "GHI CHÚ", 'ĐỢT THANH TOÁN'],
                    ['', '', '', '', 'XUẤT XỨ (CO)', 'CHẤT LƯỢNG (CQ)', 'Test Report', '', '', 'BIÊN BẢN LẤY MẪU', 'KẾT QUẢ TN', '', '', ''],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                  ]
                }
              ]

              this.timeList.forEach(item => {
                for (let i = 0; i < 100; i++) {
                  item.data.push(new Array(14))
                }
              })
            }
            break
          case this.categoryTypeMap.TASK:
            this.settings.mergeCells = [
              { row: 0, col: 0, rowspan: 2, colspan: 1 },
              { row: 0, col: 1, rowspan: 2, colspan: 1 },
              { row: 0, col: 2, rowspan: 2, colspan: 1 },
              { row: 0, col: 3, rowspan: 2, colspan: 1 },
              { row: 0, col: 4, rowspan: 2, colspan: 1 },
              { row: 0, col: 5, rowspan: 1, colspan: 2 },
              { row: 0, col: 6, rowspan: 2, colspan: 1 },
              { row: 0, col: 7, rowspan: 2, colspan: 1 },
              { row: 0, col: 8, rowspan: 2, colspan: 1 },
              { row: 0, col: 9, rowspan: 2, colspan: 1 }
            ]

            delete this.settings.contextMenu.items.source_material

            if (data && data.length) {
              this.timeList = data
            } else {
              this.timeList = [
                {
                  data: [
                    ['STT', 'TÊN CÔNG VIỆC', 'SỐ BIÊN BẢN', 'PHIẾU YÊU CẦU NT', 'PHIẾU KIỂM TRA (Nếu có)', 'Nghiệm thu công việc', '', "GHI CHÚ", 'ĐỢT THANH TOÁN'],
                    ['', '', '', '', '', 'Nội bộ', 'A-B', '', ''],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9]
                  ]
                }
              ]
              this.timeList.forEach(item => {
                for (let i = 0; i < 100; i++) {
                  item.data.push(new Array(9))
                }
              })
            }
            break
          case this.categoryTypeMap.SOURCE_MATERIAL:
            this.settings.mergeCells = [
              { row: 0, col: 0, rowspan: 2, colspan: 1 },
              { row: 0, col: 1, rowspan: 2, colspan: 1 },
              { row: 0, col: 2, rowspan: 2, colspan: 1 },
              { row: 0, col: 3, rowspan: 1, colspan: 6 },
              { row: 0, col: 9, rowspan: 2, colspan: 1 },
              { row: 0, col: 10, rowspan: 2, colspan: 1 },
              { row: 0, col: 11, rowspan: 2, colspan: 1 },
              { row: 0, col: 12, rowspan: 2, colspan: 1 },
              { row: 0, col: 13, rowspan: 2, colspan: 1 }
            ]

            delete this.settings.contextMenu.items.source_material

            if (data && data.length) {
              this.timeList = data
            } else {
              this.timeList = [
                {
                  data: [
                    ['STT', 'Tên vật tư-vật liệu', 'Catalog,e', 'CĂN CỨ PHÁP LÝ', '', '', '', '', '', 'Chủng loại Nguồn gốc-xuất xứ', 'Đề xuất', 'Chấp thuận', "Trình duyệt mẫu", 'Ghi chú'],
                    ['', '', '', 'Hồ sơ trúng thầu', 'Hợp đồng', 'PLHĐ_1', 'PLHĐ_2', 'PLHĐ_3', 'PLHĐ_4', '', '', '', '', ''],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                  ]
                }
              ]
              this.timeList.forEach(item => {
                for (let i = 0; i < 100; i++) {
                  item.data.push(new Array(14))
                }
              })
            }

            break
        }

        this.currentData = this.timeList[0].data
        this.hotRef.loadData(this.currentData)
        this.hotRef.updateSettings(this.settings)
        this.hotRef.render()
        this.hotRef.resumeRender()

        if (this.timeList[0].meta) {
          this.timeList[0].meta.forEach(item => {
            this.hotRef.setCellMeta(item.row, item.col, 'className', item.className || '')
          })
        } else {
          this.timeList[0].meta = this.hotRef.getCellsMeta().map(item => {
            if (item.row < 3) {
              item.className = 'bold highlight-yellow border-all'
            }

            return item
          })
          this.timeList[0].meta.forEach(item => {
            this.hotRef.setCellMeta(item.row, item.col, 'className', item.className || '')
          })
          this.hotRef.setCellMeta(2, 13, 'className', 'bold highlight-yellow border-all')
        }

        this.hotRef.render()
        this.hotRef.resumeRender()

        if (this.searchProp) {
          this.searchValue = this.searchProp
          const search = this.hotRef.getPlugin('search')
          // use the `Search` plugin's `query()` method
          this.queryResult = search.query(this.searchProp)
          const cellFirst = this.queryResult[0]
          const { row, col } = cellFirst
          this.hotRef.selectCell(row, col, row, col, true, true)
        }
      } catch (err) {
        this.loadingSheet = false
      }
    },
    async saveData() {
      // lưu meta cell
      const meta = this.hotRef.getCellsMeta()
      this.timeList[+this.activeTab].meta = meta
      this.timeList[+this.activeTab].fixedColumnsLeft = this.settings.fixedColumnsLeft

      const dataSubmit = {
        data: this.timeList,
        type: this.type
      }

      if (this.folderId) {
        dataSubmit.folderId = this.folderId
      }

      try {
        this.loadingSubmit = true
        await CategoryAPI.save(dataSubmit)
        this.$message.closeAll()
        this.$message.success('Đã lưu')

        this.$emit('updateCategory')
        this.loadingSubmit = false
      } catch (err) {
        this.loadingSubmit = false
      }
    },
    handleSubmitInsertLink() {
      const { row, col, link } = this.folderLink
      this.hotRef.setDataAtCell(row, col, `<a href="${link}" target="_blank" style="text-decoration: underline">Link tài liệu</a>`)
      this.dialogLink = false
    },
    addTab() {
      let data = []
      switch (this.type) {
        case this.categoryTypeMap.TASK:
          data = [
            ['STT', 'TÊN CÔNG VIỆC', 'SỐ BIÊN BẢN', 'PHIẾU YÊU CẦU NT', 'PHIẾU KIỂM TRA (Nếu có)', 'Nghiệm thu công việc', '', "GHI CHÚ", 'ĐỢT THANH TOÁN'],
            ['', '', '', '', '', 'Nội bộ', 'A-B', '', ''],
            [1, 2, 3, 4, 5, 6, 7, 8, 9]
          ]
          for (let i = 0; i < 100; i++) {
            data.push(new Array(9))
          }
          break
        case this.categoryTypeMap.MATERIAL:
          data = [
            ['STT', 'TÊN VẬT LIỆU', 'NGÀY NHẬP', 'KHỐI LƯỢNG', 'CHỨNG CHỈ', '', '', 'PHIẾU XUẤT XỨ', 'CHỨNG NHẬN HỢP QUỸ', 'THÍ NGHIỆM MẪU (HIỆN TRƯỜNG)', '', 'BIÊN BẢN NGHIỆM THU (Số hiệu biên bản, ngày nghiệm thu)', "GHI CHÚ", 'ĐỢT THANH TOÁN'],
            ['', '', '', '', 'XUẤT XỨ (CO)', 'CHẤT LƯỢNG (CQ)', 'Test Report', '', '', 'BIÊN BẢN LẤY MẪU', 'KẾT QUẢ TN', '', '', ''],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
          ]
          for (let i = 0; i < 100; i++) {
            data.push(new Array(14))
          }
          break
        case this.categoryTypeMap.SOURCE_MATERIAL:
          data = [
            ['STT', 'Tên vật tư-vật liệu', 'Catalog,e', 'CĂN CỨ PHÁP LÝ', '', '', '', '', '', 'Chủng loại Nguồn gốc-xuất xứ', 'Đề xuất', 'Chấp thuận', "Trình duyệt mẫu", 'Ghi chú'],
            ['', '', '', 'Hồ sơ trúng thầu', 'Hợp đồng', 'PLHĐ_1', 'PLHĐ_2', 'PLHĐ_3', 'PLHĐ_4', '', '', '', '', ''],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
          ]
          for (let i = 0; i < 100; i++) {
            data.push(new Array(14))
          }
          break
      }

      this.hotRef.suspendRender()
      this.hotRef.loadData(data)
      this.hotRef.render()
      this.hotRef.resumeRender()

      const meta = this.hotRef.getCellsMeta()?.map(item => {
        if (item.row < 3) {
          item.className = 'bold highlight-yellow border-all'
        }
        return item
      })

      this.timeList.push({
        data,
        meta
      })
      this.onChangeTab({ index: this.timeList.length - 1 })
    },
    removeTab(tabIndex) {
      this.timeList.splice(+tabIndex, 1)
      const currentIndex = tabIndex - 1
      this.submitChangeTab(currentIndex)
    },
    submitChangeTab(index) {
      this.activeTab = index.toString()
      this.hotRef.suspendRender()
      this.currentData = this.timeList[index].data
      this.settings.fixedColumnsLeft = this.timeList[index].fixedColumnsLeft || 0
      this.hotRef.loadData(this.currentData)
      this.timeList[index]?.meta?.forEach(item => {
        this.hotRef.setCellMeta(item.row, item.col, 'className', item.className || '')
      })
      this.hotRef.updateSettings(this.settings)
      this.hotRef.render()
      this.hotRef.resumeRender()
    },
    onChangeTab(tab) {
      const index = +tab.index
      this.submitChangeTab(index)
    },
    insertLink(position) {
      this.dialogLink = true
      const { start: { row, col }, end } = position[0]
      this.folderLink.row = row
      this.folderLink.col = col
    },
    viewSourceMaterial(position) {
      const { start: { row, col }, end } = position[0]
      const cell = this.hotRef.getCell(row, col)
      this.$emit('viewSourceMaterial', cell.innerText)
    },
    handleGetData() {
      const data = this.hotRef.getSourceData()
    }
  }
}
</script>

<style lang="scss">
.sheet-wrapper {
  .result-text {
    display: inline-block;
    color: #8492a6;
    font-size: .9rem;
    line-height: 32px;
  }

  .bold {
    font-weight: bold;
  }

  .italic {
    font-style: italic;
  }

  .highlight-yellow {
    background: #eeee27;
  }

  .border-all {
    border-color: #000;
    //border: 1px solid;
  }

  .toolbar {
    height: 38px;
    padding: 6px;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
  }

  .group-btn {
    display: flex;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
  }

  .toolbar-btn {
    font-size: 20px;
    width: 24px;
    height: 24px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;

    &:hover {
      background: #f3f4f6;
    }
  }

  .sheet-table {
    width: 100%;
    min-height: calc(100vh - 207px);
    max-height: calc(100vh - 207px);
    overflow: auto;
  }

  .htCore {
    tbody {
      tr:nth-child(1), tr:nth-child(2), tr:nth-child(3) {
        td {
          //font-weight: bold;
          //background: #eeee27 !important;
          //border-color: #000;
        }
      }
    }
  }

  .colHeader {
    font-weight: 600;
  }

  .relative {
    //background: #eeee27;
    //height: 40px;
    //display: flex;
    //align-items: center;
    //justify-content: center;
    //word-break: break-word;
  }

  .c-red {
    background: red
  }
}
</style>
