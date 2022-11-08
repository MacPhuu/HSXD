<template>
  <div v-loading="isLoading">
    <div class="header-bar">
      <el-row type="flex" style="align-items: center">
        <el-col :span="16">
          <breadcrumb-document :level-list="levelList" :handle-link="handleLink" />
        </el-col>
        <el-col :span="8" style="text-align: right">
          <el-input v-model="searchStr" class="input-search" placeholder="Nhập từ khóa tìm kiếm" clearable />
        </el-col>
      </el-row>
    </div>
    <el-table
      :key="keyTable"
      class="table-dynamic"
      border
      style="width: 100%; overflow-y: auto"
      height="calc(100vh - 260px)"
      :data="tableData.filter(item => {
        const strObj = Object.values(item).join(' ')
        return !searchStr || stringToSlugTemplate(strObj).toLowerCase().includes(stringToSlugTemplate(searchStr).toLowerCase())
      })"
    >
      <el-table-column
        v-for="(col, index) in headerColumn"
        :key="'col' + index"
        :label="col.label"
        :prop="col.prop"
        :min-width="(col.prop === 'stt' || col.label === 'STT') ? '80' : '200'"
        :width="tableData.length && (col.prop === 'stt' || col.label === 'STT') && '80'"
        align="center"
        :fixed="tableData.length && (col.prop === 'stt' || col.label === 'STT' || index === 1) && 'left'"
      >
        <template slot="header" slot-scope="scope">
          <div>
            <svg-icon
              v-if="col.prop !== 'stt' || col.label !== 'STT'"
              :icon-class="columnTypeIcon[col.type]"
              style="margin-right: 5px"
            />
            {{ col.label }}
            <el-popover
              v-if="isSetting"
              placement="bottom-end"
              width="300"
              :visible-arrow="false"
            >
              <div class="popup-column">
                <div class="hint-text">Tiêu đề</div>
                <div class="b-bottom">
                  <el-input v-model="col.label" />
                </div>
                <div class="hint-text">Định dạng</div>
                <ul class="cl-type-list b-bottom">
                  <li
                    v-for="item in columnTypeMap"
                    :key="item.label"
                    :class="[{ 'active': item.type === col.type }]"
                    @click="onColumnTypeChange('edit', item.type, col)"
                  >
                    <svg-icon :icon-class="item.icon" />
                    {{ item.label }}
                  </li>
                </ul>
                <el-row type="flex" justify="end">
                  <el-button type="text" icon="el-icon-delete" @click="removeColumn(col, index)">Xóa cột</el-button>
                </el-row>
              </div>
              <span slot="reference">
                <el-icon name="caret-bottom" />
              </span>
            </el-popover>
          </div>
        </template>
        <template slot-scope="scope">
          <div v-if="index === 1 && col.type !== columnType.FILE && col.type !== columnType.UPLOAD && !isChild">
            <el-button type="text" @click="goToDetail(`/manage/category/${scope.row.id}?title=${scope.row[col.prop]}&parentTitle=${sitemap}`)">{{ scope.row[col.prop] }}</el-button>
          </div>
          <div v-else>
            <div v-if="col.prop === 'stt' || col.label === 'STT'">{{ scope.row[col.prop] }}</div>
            <div
              v-else-if="col.type === columnType.FILE && scope.row[col.prop]"
              style="display: flex; align-items: flex-start;"
            >
              <el-popover
                placement="bottom"
                trigger="hover"
                max-width="450"
              >
                <div v-for="fileItem in scope.row[col.prop]" style="display: flex; justify-content: space-between; align-items: center">
                  <el-col
                    style="max-width: 400px"
                  >
                    <div
                      style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; cursor: pointer"
                    >
                      <svg-icon
                        v-if="fileType(fileItem.name) === 'docx' || fileType(fileItem.name) === 'doc'"
                        class="icon-svg"
                        icon-class="doc"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'pdf'"
                        class="icon-svg"
                        icon-class="pdf"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'xls' || fileType(fileItem.name) === 'xlsx'"
                        class="icon-svg"
                        icon-class="xls"
                      />
                      <svg-icon v-else class="icon-svg" icon-class="File" />
                      <span @click="goToDetail1(fileItem.viewLink, fileItem.link)">{{ fileItem.name }}</span>
                    </div>
                  </el-col>
                  <!--                  <el-col style="width: 10%; display: flex; justify-content: flex-end">-->
                  <!--                    <el-popover trigger="hover" placement="right" disabled>-->
                  <!--                      &lt;!&ndash;                      <el-row>&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        <el-popconfirm&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        style="margin-left: 5px"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        confirm-button-text="Đồng ý"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        cancel-button-text="Hủy"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        title="Bạn có chắc chắn xóa?"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        @onConfirm="handleDeleteFile(scope.row[col.prop])"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                      >&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        <el-button style="color: black" type="text" slot="reference">Xóa</el-button></el-popconfirm>&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;                        <el-button style="color:black;" type="text" @click="handleDeleteFile(scope.row[col.prop])">Xóa</el-button>&ndash;&gt;-->
                  <!--                      &lt;!&ndash;                      </el-row>&ndash;&gt;-->
                  <!--                      <el-button slot="reference" type="text">-->
                  <!--                        <svg-icon style="margin: 0 !important; padding-bottom: 0px !important;" icon-class="Download" @click="handleDownload(fileItem)" />-->
                  <!--                      </el-button>-->
                  <!--                    </el-popover>-->
                  <!--                  </el-col>-->
                </div>
                <el-tag v-if="scope.row[col.prop].length != 0" slot="reference" type="info" size="small" style="height: 28px">
                  {{ scope.row[col.prop].length }} Tài liệu
                </el-tag>
                <span v-else>-</span>
              </el-popover>
            </div>
            <div
              v-else-if="col.type === columnType.UPLOAD && scope.row[col.prop]"
              style="display: flex; align-items: flex-start;"
            >
              <el-popover
                placement="bottom"
                trigger="hover"
                max-width="500"
              >
                <div v-for="fileItem in scope.row[col.prop]" style="display: flex; justify-content: space-between; align-items: center">
                  <el-col
                    style="max-width: 400px"
                  >
                    <div
                      style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; cursor: pointer"
                    >
                      <svg-icon
                        v-if="fileType(fileItem.name) === 'docx' || fileType(fileItem.name) === 'doc'"
                        class="icon-svg"
                        icon-class="doc"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'pdf'"
                        class="icon-svg"
                        icon-class="pdf"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'xls' || fileType(fileItem.name) === 'xlsx'"
                        class="icon-svg"
                        icon-class="xls"
                      />
                      <svg-icon v-else class="icon-svg" icon-class="File" />
                      <span @click="goToDetail1(fileItem.viewLink, fileItem.link)">{{ fileItem.name }}</span>
                    </div>
                  </el-col>
                  <!--                  <el-col style="width: 10%; display: flex; justify-content: flex-end">-->
                  <!--                    <el-popover trigger="hover" placement="right" disabled>-->
                  <!--                      &lt;!&ndash;                      <el-row>&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        <el-popconfirm&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        style="margin-left: 5px"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        confirm-button-text="Đồng ý"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        cancel-button-text="Hủy"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        title="Bạn có chắc chắn xóa?"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        @onConfirm="handleDeleteFile(scope.row[col.prop])"&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                      >&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;&lt;!&ndash;                        <el-button style="color: black" type="text" slot="reference">Xóa</el-button></el-popconfirm>&ndash;&gt;&ndash;&gt;-->
                  <!--                      &lt;!&ndash;                        <el-button style="color:black;" type="text" @click="handleDeleteFile(scope.row[col.prop])">Xóa</el-button>&ndash;&gt;-->
                  <!--                      &lt;!&ndash;                      </el-row>&ndash;&gt;-->
                  <!--                      <el-button slot="reference" type="text">-->
                  <!--                        <svg-icon style="margin: 0 !important; padding-bottom: 0px !important;" icon-class="Download" @click="handleDownload(fileItem)" />-->
                  <!--                      </el-button>-->
                  <!--                    </el-popover>-->
                  <!--                  </el-col>-->
                </div>
                <el-tag v-if="scope.row[col.prop].length != 0" slot="reference" type="info" size="small" style="height: 28px">
                  {{ scope.row[col.prop].length }} Tài liệu
                </el-tag>
              </el-popover>
            </div>
            <el-link
              v-else-if="col.type === columnType.LINK && scope.row[col.prop]"
              :href="scope.row[col.prop]"
              target="_blank"
            >
              {{ scope.row[col.prop] }}
            </el-link>
            <div v-else>{{ scope.row[col.prop] }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isSetting"
        label-class-name="column-add"
        width="80"
        fixed="right"
        align="center"
      >
        <template slot="header" slot-scope="scope">
          <div>
            <el-popover
              placement="bottom-end"
              width="300"
              :visible-arrow="false"
            >
              <div class="popup-column">
                <div class="hint-text">Tiêu đề</div>
                <div class="b-bottom">
                  <el-input v-model="currentLabel" />
                </div>
                <div class="hint-text">Định dạng</div>
                <ul class="cl-type-list b-bottom">
                  <li
                    v-for="item in columnTypeMap"
                    :key="item.label"
                    :class="[{ 'active': item.active }]"
                    @click="onColumnTypeChange('add', item.type)"
                  >
                    <svg-icon :icon-class="item.icon" style="margin-right: 5px" />
                    {{ item.label }}
                  </li>
                </ul>
                <el-row type="flex" justify="end">
                  <el-button @click="updateKeyTable">Hủy</el-button>
                  <el-button type="primary" @click="addColumn">Xác nhận</el-button>
                </el-row>
              </div>
              <span slot="reference">
                <el-button slot="reference" size="mini" icon="el-icon-plus" type="info" />
              </span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else label="Thao tác" align="center" width="120" fixed="right" class-name="right-action-table">
        <template slot-scope="scope">
          <span class="btn-table" @click="editRow(scope.row)">
            <svg-icon icon-class="Edit" />
          </span>
          <el-popconfirm
            title="Bạn có chắc chắn xóa?"
            cancel-button-text="Hủy"
            confirm-button-text="Đồng ý"
            @confirm="deleteRow(scope.row)"
          >
            <span slot="reference" class="btn-table">
              <svg-icon icon-class="Trash" />
            </span>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end" style="margin-top: 20px">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        hide-on-single-page
        :total="totalPage"
        @current-change="handleCurrentPageChange"
      />
    </el-row>

    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      class="dialog-record"
    >
      <el-row slot="title" type="flex" justify="space-between" style="align-items: baseline;">
        <div class="title">
          <div v-if="formType === 'create'">Thêm mới</div>
          <div v-else>Chỉnh sửa</div>
        </div>
        <div class="btn">
          <el-button @click="onCloseDialog">Hủy</el-button>
          <el-button type="primary" @click="handleSubmit">Tiếp tục</el-button>
        </div>
      </el-row>
      <el-form :key="keyForm" ref="form" :model="form" label-position="top" :rules="ruleForm">
        <el-form-item
          v-for="item in inputList"
          :key="'form-ip' + item.label"
          :prop="item.prop"
        >
          <div v-if="item.type === columnType.TEXT" slot="label">
            <div class="label-title">{{ item.label }}</div>
            <el-input v-model="form[item.prop]" />
          </div>
          <div v-else-if="item.type === columnType.NUMBER" slot="label">
            <div class="label-title">{{ item.label }}</div>
            <el-input-number v-model="form[item.prop]" controls-position="right" style="width: 100%"/>
          </div>
          <div v-else-if="item.type === columnType.DATE" slot="label">
            <div class="label-title">{{ item.label }}</div>
            <el-date-picker
              v-model="form[item.prop]"
              format="dd/MM/yyyy"
              type="date"
              value-format="dd/MM/yyyy"
              placeholder=" Chọn ngày"
              style="width: 100%;"
            />
          </div>
          <div v-else-if="item.type === columnType.LINK">
            <div class="label-title">{{ item.label }}</div>
            <el-input v-model="form[item.prop]" prefix-icon="el-icon-link"/>
          </div>
          <div v-else-if="item.type === columnType.FILE" slot="label">
            <div class="label-record">
              <div class="label-title">{{item.label}}</div>
              <div class="label-btn">
                <el-button class="buttonAtt" style="color: black" size="mini" @click="attachFile(item.prop)">Chọn tệp</el-button>
              </div>
            </div>
            <div v-for="fileItem in form[item.prop]" :key="fileItem.name" class="input-record">
              <el-row type="flex" style="align-items: baseline;">
                <el-col :span="22">
                  <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; cursor: pointer">
                    <svg-icon
                      v-if="fileType(fileItem.name) === 'docx' || fileType(fileItem.name) === 'doc'"
                      class="icon-svg"
                      icon-class="doc"
                    />
                    <svg-icon
                      v-else-if="fileType(fileItem.name) === 'pdf'"
                      class="icon-svg"
                      icon-class="pdf"
                    />
                    <svg-icon
                      v-else-if="fileType(fileItem.name) === 'xls' || fileType(fileItem.name) === 'xlsx'"
                      class="icon-svg"
                      icon-class="xls"
                    />
                    <svg-icon v-else class="icon-svg" icon-class="File" />
                    <span>{{ fileItem.name }}</span>
                  </div>
                </el-col>
                <el-col :span="2">
                  <el-button type="text">
                    <svg-icon icon-class="Download" @click="handleDownload(fileItem)" />
                  </el-button>
                  <el-button type="text">
                    <svg-icon class="icon-trash" icon-class="Trash2" @click="handleDeleteAttack(fileItem, item.prop)" />
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else-if="item.type === columnType.UPLOAD" slot="label">
            <div class="label-record">
              <div class="label-title">{{item.label}}</div>
              <div class="label-btn">
                <el-upload
                  :action="urlUploadFile"
                  :headers="headerUpload"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="handleCheckRole"
                  :on-progress="onProgressUploadFile"
                  :on-success="onUploadFileSuccess"
                  class="upload-block"
                  multiple
                >
                  <span
                    style="font-size: 0.9375em !important; color: black; font-family: sans-serif !important;border: 1px solid #DCDFE6;border-radius: 4px;padding: 8px 20px;"
                    @click="handleClick(item.prop)"
                  >
                    <svg-icon icon-class="UploadCloud" style="margin-right: 5px; font-size: 20px" />
                    Tải lên tệp tin
                  </span>
                </el-upload>
              </div>
            </div>
            <div class="input-record-wrap">
              <div v-for="fileItem in form[item.prop]" :key="fileItem.name" class="input-record-upload">
                <el-row type="flex" style="align-items: baseline;">
                  <el-col :span="22">
                    <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden; cursor: pointer">
                      <svg-icon
                        v-if="fileType(fileItem.name) === 'docx' || fileType(fileItem.name) === 'doc'"
                        class="icon-svg"
                        icon-class="doc"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'pdf'"
                        class="icon-svg"
                        icon-class="pdf"
                      />
                      <svg-icon
                        v-else-if="fileType(fileItem.name) === 'xls' || fileType(fileItem.name) === 'xlsx'"
                        class="icon-svg"
                        icon-class="xls"
                      />
                      <svg-icon v-else class="icon-svg" icon-class="File" />
                      <span>{{ fileItem.name }}</span>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text">
                      <svg-icon icon-class="Download" @click="handleDownload(fileItem)" />
                    </el-button>
                    <el-button type="text">
                      <svg-icon class="icon-trash" icon-class="Trash2" @click="handleDeleteAttack(fileItem, item.prop)" />
                    </el-button>
                  </el-col>
                </el-row>
                <!--              <el-col style="width: 10%; display: flex; justify-content: flex-end">-->
                <!--                <el-button type="text">-->
                <!--                  <svg-icon icon-class="Download" @click="handleDownload(fileItem)" />-->
                <!--                </el-button>-->
                <!--                <el-button type="text">-->
                <!--                  <svg-icon class="icon-trash" icon-class="Trash2" @click="handleDeleteAttack(fileItem, item.prop)" />-->
                <!--                </el-button>-->
                <!--              </el-col>-->
              </div>
            </div>
            <!--            <el-button v-if="form[item.prop]" type="text" @click="deleteAttFile(item.prop)">Xóa tệp</el-button>-->

          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Tài liệu của tôi"
      :visible.sync="dialogLink"
    >
      <file-list @selectFile="selectFile" @selectFolder="selectFolder" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLink = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleSubmitAttachFile"
        >
          Chọn
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Tài liệu của tôi"
      :visible.sync="dialogMove"
      width="50%"
    >
      <el-tree
        ref="treeFolder"
        v-loading="loadingTree"
        :data="treeFolder"
        :props="defaultProps"
        accordion
        highlight-current
        @current-change="onChangeNode"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
        >
          <span v-if="data.default">
            <svg-icon icon-class="FolderFixed" class-name="icon-folder" />
            <span :title="node.label" class="node-label" style="font-weight: bold">{{ node.label }}</span>
          </span>
          <span v-else>
            <svg-icon icon-class="FolderFlex" class-name="icon-folder" />
            <span :title="node.label" class="node-label">{{ node.label }}</span>
          </span>
        </span>
      </el-tree>
      <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;" @click="handleAddCate">
        <b>+ Tạo thư mục mới</b>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMove = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleSubmitMove"
        >Chuyển tới đây</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="40%"
      :modal="true"
      :modal-append-to-body="false"
    >
      <span slot="title" style="font-weight: 500;">Thêm mới thư mục</span>
      <el-row class="current-folder">
        <el-form label-position="top" label-width="100px" :model="formFolder">
          <el-form-item>
            <p style="font-weight: bold">Tiêu đề thư mục</p>
            <el-input v-model="formFolder.name" placeholder="Nhập tiêu đề thư mục" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="margin-top: 100px; display: flex; justify-content: flex-end ">
        <el-button @click="handleClose">Bỏ qua</el-button>
        <el-button type="primary" @click="handleConfirmCate">Xác nhận</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CategoryAPIV2 from '@/api/categoryApiV2'
import { stringToSlug } from '@/utils'
import FileList from '@/views/sheet/file'
import FolderAPI from "@/api/folder"
import FileAPI from "@/api/fileApi"
import eventEmitter from "@/utils/eventEmitter"
import config from "@/utils/config"
import ShareAPI from "@/api/shareApi"
import BreadcrumbDocument from "@/views/sign-document/breadcrumb"

export default {
  name: 'TableDynamic',
  components: { BreadcrumbDocument, FileList },
  props: {
    isChild: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: String,
      default: ''
    },
    isSetting: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: 'create'
    }
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    return {
      shareDialogVisible: false,
      totalPage: 0,
      currentPage: 1,
      deleteatt: false,
      fileResponse: {
        fileName: ''
      },
      fileResponseList: [],
      targetFolderMove: {},
      headerUpload: {
        'x-access-token': token
      },
      urlUploadFile: config.api.upload,
      titleA1: '',
      titleA2: '',
      isLoading: false,
      folderLink: {},
      folderLinkTest: [],
      dialogLink: false,
      dialogMove: false,
      loadingTree: false,
      treeFolder: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputList: [],
      keyForm: 1,
      popoverVisible: false,
      form: {},
      formFolder: {},
      keyTable: null,
      currentLabel: 'Cột mới',
      currentType: 1,
      columnTypeIcon: {
        1: 'Text',
        2: 'Code',
        3: 'Calendar',
        4: 'Link2',
        5: 'PaperClip',
        6: 'Upload'
      },
      columnType: {
        TEXT: 1,
        NUMBER: 2,
        DATE: 3,
        LINK: 4,
        FILE: 5,
        UPLOAD: 6
      },
      ruleForm: {
        name: [{ required: true, trigger: 'change', message: 'Vui lòng nhập tên file' }]
      },
      columnTypeMap: [
        {
          label: 'Text',
          type: 1,
          active: false,
          icon: 'Text'
        },
        {
          label: 'Number',
          type: 2,
          active: false,
          icon: 'Code'
        },
        {
          label: 'Thời gian',
          type: 3,
          active: false,
          icon: 'Calendar'
        },
        {
          label: 'Đường link',
          type: 4,
          active: false,
          icon: 'Link2'
        },
        {
          label: 'Đính kèm file',
          type: 5,
          active: false,
          icon: 'PaperClip'
        },
        {
          label: 'Tải lên',
          type: 6,
          active: false,
          icon: 'Upload'
        }
      ],
      headerColumn: [],
      tableData: [],
      tableDataTemp: [],
      search: '',
      searchStr: '',
      levelList: [],
      sitemap: '',
    }
  },
  // mounted() {
  //   this.$root.$on('component2', () => {
  //     this.getData()
  //   })
  // },
  watch: {
    $route: {
      handler: function(route) {
        let categoryId
        if (this.isChild) {
          categoryId = route.params.id
        } else {
          categoryId = route.query.id
        }
        this.getData(categoryId)
      },
      immediate: true
    },
    isSetting: {
      handler: function(val) {
        this.updateKeyTable()
      },
      immediate: true
    },
    dialogVisible: {
      handler: function(val) {
        if (val) {
          if (this.formType === 'create') {
            this.form = {}
          }
        }
      },
      immediate: true
    },
    headerColumn: {
      handler: function(val) {
        if (JSON.stringify(this.headerColumnClone) !== JSON.stringify(val)) {
          this.$emit('tableChange', val)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleCurrentPageChange(page) {
      const perPage = 10
      const startIndex = (page - 1) * perPage
      const endIndex = (page - 1) * perPage + perPage
      this.tableData = this.tableDataTemp.slice(startIndex, endIndex)
    },
    handleClick(prop) {
      this.currentFieldFile = prop
    },
    async handleCheckRole() {
      const { ok } = await ShareAPI.checkRole({ folderId: this.folderId })
      if (ok) {
        return true
      } else {
        this.$message.error('Không có quyền')
        return Promise.reject(false)
      }
    },
    onProgressUploadFile() {
      this.loadingUpload = true
    },
    onUploadFileSuccess(res) {
      this.fileResponse = {
        ...res,
        name: res.fileName
      }
      this.dialogMove = true
      this.targetFolderMove = {}
      this.getTreeFolder()
      // try {
      //
      //   await FileAPI.create({ ...res, name: res.fileName, type: config.fileType.FILE })
      //   this.loadingUpload = false
      //   await this.loadFolder()
      // } catch (err) {
      //   this.loadingUpload = false
      // }
    },
    async handleSubmitMove() {
      // const { _id, metaType } = this.currentFile
      const res = { ...this.fileResponse }
      try {
        this.loadingTree = true
        this.form[this.currentFieldFile] = this.form[this.currentFieldFile] || []
        const data = await FileAPI.create({ ...res, name: res.name, type: config.fileType.FILE })
        // const file = await FileAPI.getById(data._id)
        // delete file._id
        // delete file.__v
        this.loadingTree = false
        await FileAPI.update(data._id, {
          ...data,
          folderId: this.targetFolderMove._id
        })
        const fileUpload = {
          ...this.fileResponse,
          link: `/document/file/${data._id}`,
          projectId: data.projectId
        }
        this.fileResponse = fileUpload
        this.form[this.currentFieldFile].push(fileUpload)
        this.dialogMove = false
      } catch (err) {
        this.loadingTree = false
      }
    },
    goToDetail(path) {
      this.$router.push(path)
    },
    goToDetail1(viewLink, link) {
      const hasPdf = link.indexOf("undefined")
      if (hasPdf === -1) {
        const routeData = this.$router.resolve(link)
        window.open(routeData.href, '_blank')
      } else {
        const routeData = this.$router.resolve(viewLink)
        window.open(routeData.href, '_blank')
      }
    },
    // goToDetail2(path) {
    //   // const [link, name] = path?.split('/')
    //   const link = `/document/file/${path}`
    //   const routeData = this.$router.resolve(link)
    //   window.open(routeData.href, '_blank')
    // },
    fileType(fileName) {
      const [name, type] = fileName?.split('.')
      return type
    },
    selectFile(file) {
      let pathPdf
      if (file?.digital && file?.digital?.sr && file?.digital?.sr?.pathPdfs[0] && file?.digital?.sr?.pathPdfs[0]?.pathPdf) {
        pathPdf = file?.digital?.sr?.pathPdfs[0]?.pathPdf
      }
      this.folderLink = {
        pathPdf: pathPdf,
        name: file.name,
        viewLink: `/document/file/${file._id}`,
        link: `/document/file/${file._id}?pathPdf=${pathPdf}`,
        projectId: file.projectId,
        path: file.path
      }
    },
    selectFolder(folder) {
      const { _id, name } = folder
      this.folderLink.link = `/document/files/child/${_id}?folderName=${name}&viewType=1`
    },
    attachFile(prop) {
      this.dialogLink = true
      this.currentFieldFile = prop
    },
    handleSubmitAttachFile() {
      this.dialogLink = false
      this.form[this.currentFieldFile] = this.form[this.currentFieldFile] || []
      this.form[this.currentFieldFile].push(this.folderLink)
    },
    async getData(categoryId) {
      try {
        this.isLoading = true
        let details = {}
        if (this.isChild) {
          details = await CategoryAPIV2.getChildById(categoryId)
        } else {
          details = await CategoryAPIV2.getById(categoryId)
        }
        this.isLoading = false
        const { header, data, _id, sitemap, parentId, manageCategoryId } = details
        this.sitemap = sitemap
        this.levelList = [
          {
            title: sitemap,
            path: `/manage/category?id=${_id}`,
            id: _id
          }
        ]

        if (this.isChild) {
          const { title, parentTitle } = this.$route.query
          if (title && parentTitle) {
            this.levelList = [
              {
                title: parentTitle,
                path: `/manage/category?id=${manageCategoryId}`,
                id: manageCategoryId
              },
              {
                title: title,
                path: ''
              }
            ]
          }
        }

        this.$emit('updateDetailId', _id)
        this.$emit('updateDetailDefault', details.default)
        this.headerColumn = header
        this.headerColumnClone = Array.from(header)
        this.inputList = header
        this.tableData = data
        this.tableDataTemp = data
        this.totalPage = data.length

        this.handleCurrentPageChange(this.currentPage)
        this.updateKeyTable()

        /* update rule */
        // this.inputList.forEach(item => {
        //   this.ruleForm[item.prop] = [
        //     { required: true, trigger: 'change', message: 'Không được để trống' }
        //   ]
        // })
      } catch (err) {
        this.isLoading = false
      }
    },
    handleSubmit() {
      const isFormFill = Object.values(this.form).some(i => i)
      if (isFormFill) {
        this.$emit('onSubmit', { data: this.form })
      } else {
        this.$message.closeAll()
        this.$message.error('Vui lòng nhập dữ liệu')
        this.folderLinkTest = []
        this.deleteatt = false
      }
    },
    onCloseDialog() {
      this.$emit('closeDialog')
      this.folderLinkTest = []
      this.deleteatt = false
    },
    editRow(row) {
      this.$emit('onEditRow', row)
      this.form = {
        ...row
      }
    },
    deleteRow(row) {
      this.$emit('onDeleteRow', row)
    },
    onColumnTypeChange(changeType, columnType, col) {
      if (changeType === 'edit') {
        if (this.tableData && this.tableData.length) {
          this.$notify.closeAll()
          this.$notify({
            type: 'warning',
            message: 'Bảng đã có dữ liệu nên không thể thay đổi loại dữ liệu của cột.'
          })
          return false
        }
        col.type = columnType
      } else {
        this.currentType = columnType
        this.columnTypeMap.forEach(item => {
          item.active = item.type === this.currentType
        })
      }
    },
    removeColumn(col, index) {
      // if (col.require) {
      //   this.$notify.closeAll()
      //   this.$notify.warning('Cột mặc định không được phép xóa')
      // } else {
        this.headerColumn.splice(index, 1)
        this.updateKeyTable()
    },
    addColumn() {
      const propList = this.headerColumn.map(col => col.prop)
      const slug = stringToSlug(this.currentLabel)
      const prop = propList.includes(slug) ? `${slug}_${this.makeRandom(10)}` : slug

      this.headerColumn.push({
        label: this.currentLabel,
        type: this.currentType,
        prop,
        require: 0
      })
      this.updateKeyTable()
      this.currentLabel = 'Cột mới'
    },
    updateKeyTable() {
      this.keyTable = this.makeRandom(10)
    },
    makeRandom(length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength))
      }
      return result
    },
    handleMove(prop) {
      this.dialogMove = true
      this.targetFolderMove = {}
      this.currentFieldFile = prop
      this.getTreeFolder()
    },
    async getTreeFolder() {
      try {
        this.loadingTree = true
        this.treeFolder = await FolderAPI.getTreeFolder()
        this.loadingTree = false
      } catch (err) {
        this.loadingTree = false
      }
    },
    onChangeNode(nodeData, node) {
      this.targetFolderMove = nodeData
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
    async handleDownload(file) {
      let uriDL
      if (file.pathPdf) {
        uriDL = `${config.api.download}/${file.pathPdf}`
      } else {
        uriDL = `${config.api.download}/${file.path}`
      }
      // const path = file.link.slice(15)
      //  let categoryId = route.query.id
      // const details = await CategoryAPIV2.getById(categoryId)
      // const uri = `${config.api.download}/${file.projectId}/${file.name}`
      const uri = uriDL.replace('#', '%23')
      this.downloadURI(uri, file.name)
    },
    async handleDeleteFile(file) {
      const path = file.link.slice(15)
      await FileAPI.delete(path)
      // this.form =
      // this.form[this.currentFieldFile] = ''
      // await this.$emit('onSubmit', { data: this.form })
    },
    handleLink(item, index) {
      this.$router.push(item.path)
      this.levelList = this.levelList.slice(0, index + 1)
    },
    stringToSlugTemplate(str) {
      return stringToSlug(str)
    },
    deleteAttFile(prop) {
      this.deleteatt = true
      this.currentFieldFile = prop
      prop = this.currentFieldFile
    },
    handleDeleteAttack(item, prop) {
      this.form[prop].splice(this.form[prop].indexOf(item), 1)
      this.keyForm++
    },
    handleAddCate() {
      this.shareDialogVisible = true
      this.formFolder = {
        name: ''
      }
    },
    async handleConfirmCate() {
      if (this.targetFolderMove === {}) {
        const data = {
          ...this.formFolder
        }
        await FolderAPI.create(data)
        await this.getTreeFolder()
      } else {
        const data = {
          ...this.formFolder,
          folderId: this.targetFolderMove._id
        }
        await FolderAPI.create(data)
        await this.getTreeFolder()
      }
      // await FolderAPI.create(data)
      // await this.getTreeFolder()
      this.shareDialogVisible = false
    },
    handleClose() {
      this.formFolder = {}
      this.shareDialogVisible = false
    },
  }
}
</script>

<style lang="scss">
.dialog-record {
  .title {
    font-size: 1.5em;
    font-weight: 500;
  }

  .el-form-item__label {
    width: 100%;
  }

  .label-title {
    width: 80%;
    font-size: 1.5em;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }

  .label-record {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;

    .label-title {
      width: 80%;
      font-size: 1.5em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .input-record-upload {
    width: 100%;
    align-items: baseline;
  }
  .input-record-wrap {
    display: flex;
    flex-wrap: wrap;
  }
}
.header-bar {
  margin-bottom: 20px;

  .input-search {
    width: 100%;
  }
}
.cl-type-list {
  list-style: none;
  padding-left: 0;
  margin-top: 0;

  li {
    padding: 7px;
    cursor: pointer;

    &:hover, &.active {
      background-color: #F5F7FA;
    }
  }
}

.table-dynamic {
  .column-add {
    div {
      width: unset !important;
    }
  }

  th.is-leaf {
    background-color: rgb(205, 214, 223) !important;
    color: #1f2d3d;
  }

  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .cell {
    div {
      width: 100%;
    }

    span {
      &:hover {
        cursor: pointer;
      }

      float: right;
      display: inline-block;
    }
  }
}

.popup-column {
  //padding: 12px;

  .b-bottom {
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
  }

  .hint-text {
    color: #97a8be;
    padding: 10px 0;
    font-size: 16px;
  }
}
.icon-trash{
  margin-left : 10px !important;
  padding: 1px !important;
  font-size: 17px !important;
}
.buttonAtt{
  span{
    font-size: 15px !important;
  }
}
</style>
