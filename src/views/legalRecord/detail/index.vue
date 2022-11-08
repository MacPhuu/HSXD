<template>
  <div class="page-file-detail">
    <div class="header-toolbar">
      <span class="title">{{ file.name }}</span>

      <el-popover
        v-if="file.tags && file.tags.length"
        placement="right"
        trigger="hover">
        <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
        <div v-for="tag in file.tags" :key="tag._id">
          <el-tag type="info" size="small" style="margin-bottom: 10px">
            {{ tag.name }}
          </el-tag>
        </div>
        <span slot="reference">
          <el-tag
            size="small"
            type="info"
          >
            {{ file.tags.length > 0 ? file.tags[0].name : "-" }}
          </el-tag>
          <span v-if="file.tags.length > 1" class="quanity-tag">+{{ file.tags.length - 1 }} </span>
        </span>
      </el-popover>
      <span class="toolbar-btn">
        <span v-if="fileState" class="file-status" :style="{ color: (fileStatus[fileState] || {}).color }">
          <span class="icon-status" :style="{ background: (fileStatus[fileState] || {}).color }"></span>
          {{ (fileStatus[fileState] || {}).title }}
        </span>
        <span class="icon-info icon-button" @click="handleViewInfo">
          <svg-icon icon-class="Information2"/>
        </span>
        <span class="icon-close icon-button" @click="$router.go(-1)">
          <svg-icon icon-class="Close"/>
        </span>
      </span>
    </div>
    <div
      class="header-action"
      v-loading="loadingSign"
      element-loading-text="Đang tiến hành"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, .9)"
    >
      <button-icon icon="Download" @click="handleDownloadFile">Tải xuống</button-icon>
      <button-icon icon="Tag" @click="handleAssignTag">Gắn tag</button-icon>
      <el-popconfirm
        title="Bạn có chắc chắn xóa?"
        cancel-button-text="Hủy"
        confirm-button-text="Đồng ý"
        @confirm="handleDelete(file)"
      >
        <button-icon slot="reference" icon="Trash">Xóa</button-icon>
      </el-popconfirm>
      <button-icon v-if="userSignData.permission !== config.signType.SIGN" icon="Key" @click="handleDigitizing(file)">
        Số hóa
      </button-icon>
      <button-icon
        v-if="userSignData.permission === config.signType.SIGN&&fileState === config.fileStatus.PENDING"
        icon="_Signature"
        style="border-left: 1px solid #e4e7ed"
        @click="handleSign"
      >
        Ký bằng USB Token
      </button-icon>
      <button-icon
        v-if="userSignData.permission === config.signType.APPROVE && fileState === config.fileStatus.PENDING"
        icon="_Signature"
        style="border-left: 1px solid #e4e7ed;color: rgb(5, 151, 106)"
        @click="handleApprove"
      >
        Phê duyệt
      </button-icon>
      <button-icon
        v-if="+fileState === config.fileStatus.PENDING"
        icon="Reject"
        style="border-left: 1px solid #e4e7ed;color:rgb(214, 60, 60)"
        @click="handleReject"
      >
        Từ chối
      </button-icon>
      <!--      <button-dropdown-->
      <!--        v-if="userSignData.permission === config.signType.APPROVE && fileState === config.fileStatus.PENDING"-->
      <!--      >-->
      <!--        Phê duyệt-->
      <!--        <el-dropdown-menu slot="dropdown-menu">-->
      <!--          <el-dropdown-item @click.native="handleApprove">-->
      <!--            <svg-icon icon-class="Check" style="margin-right: 5px"/>-->
      <!--            Duyệt-->
      <!--          </el-dropdown-item>-->
      <!--          <el-dropdown-item @click.native="handleReject">-->
      <!--            <svg-icon icon-class="Reject" style="margin-right: 5px"/>-->
      <!--            Từ chối-->
      <!--          </el-dropdown-item>-->
      <!--        </el-dropdown-menu>-->
      <!--      </button-dropdown>-->
    </div>
    <div class="file-viewer">
      <PDFViewer
        v-if="urlPDF"
        :key="keyPDF"
        ref="pdfViewer"
        :path="`${publicPath}webviewer`"
        :url="urlPDF"
        :custom-toolbar="customToolbarViewer"
        read-only
      />
    </div>

    <el-dialog
      class="dialog-info"
      title="Thông tin văn bản"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div class="dialog-toolbar">
        <button-icon icon="Download" @click="handleDownloadFile">Tải xuống</button-icon>
        <button-icon icon="Print">In tài liệu</button-icon>
      </div>
      <div class="dialog-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Thông tin chi tiết" name="info-detail">
            <div class="tab-content">
              <el-row :gutter="50">
                <el-col :span="12">
                  <div class="row-info">
                    <div class="label-info">Tiêu đề Mail</div>
                    <div class="content-info">Yêu cầu ký {{ file.name }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">ID tài liệu</div>
                    <div class="content-info">{{ file._id }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">Ngày tạo</div>
                    <div class="content-info">{{ file.createdAt }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">Ngày gửi</div>
                    <div class="content-info">{{ file.createdAt }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">Người nhận</div>
                    <div class="content-info">{{ file._id }}</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="row-info">
                    <div class="label-info">Tên tài liệu</div>
                    <div class="content-info">{{ file.name }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">Người gửi</div>
                    <div class="content-info">{{ userInfo.name || userInfo.username }}</div>
                  </div>
                  <div class="row-info">
                    <div class="label-info">Trạng thái</div>
                    <div class="content-info" :style="{ color: (fileStatus[fileState] || {}).color }">Đang chờ</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Lịch sử hoạt động" name="activity-log">
            <div class="tab-content">
              <div class="row-log">
                <div class="time"><b>Thời gian</b></div>
                <div class="activity"><b>Hoạt động</b></div>
              </div>
              <div class="row-log">
                <div class="time">
                  <div class="content-info">12/10/2021</div>
                  <div class="label-info">10:20:30 AM</div>
                </div>
                <div class="activity">
                  <div class="content-info">Nguyễn A</div>
                  <div class="label-info">Tạo tài liệu</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <el-dialog
      title="Thông báo"
      :visible.sync="dialogTool"
      width="40%"
    >
      <div style="text-align: center">
        <h3>
          <el-icon name="warning" style="color: #E6A23C"/>
          {{ notifyPlugin }}
        </h3>
        <el-button type="text" icon="el-icon-download" @click="handleDownloadSignPlugin">Tải xuống</el-button>
      </div>
    </el-dialog>

    <!-- Assign Tag for document -->
    <el-dialog
      :visible.sync="createTagDialog"
      width="40%"
      :before-close="beforeCloseDialogTag"
    >
      <span slot="title" style="font-weight: 500;">Gắn tag <i class="el-icon-warning-outline" /></span>
      <el-row>
        <el-select
          v-model="tagList"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Lựa chọn tag hoặc tạo mới"
          class="select-tag-custom"
        >
          <el-option
            v-for="tag in tags"
            :key="'tag-popover' + tag._id"
            :value="tag.name"
            :label="tag.name"
          >
            <span>
              <el-tag type="info" size="small">{{ tag.name }}</el-tag>
            </span>
          </el-option>
        </el-select>
      </el-row>
      <el-row v-if="tags.length === 0" v-loading="loadingTag">
        <el-row class="tag-helper">Gợi ý</el-row>
        <el-row :gutter="10" type="flex" justify="stretch" style="min-height: 200px">
          <el-col>
            <el-tag
              v-for="example in examples"
              :key="example.value"
              type="info"
              size="small"
              :label="example.name"
              :value="example.value"
              class="tag-custom"
            >{{ example.name }}
            </el-tag>
          </el-col>
        </el-row>
      </el-row>
      <el-row v-else>
        <el-row class="tag-helper">Tag đã tạo</el-row>
        <el-row v-loading="loadingTag" style="min-height: 200px;">
          <ul>
            <li
              v-for="tag in tags"
              :key="'tag-created' + tag._id"
              :value="tag._id"
              :label="tag.name"
              class="custom-created-tag"
            >
              <el-tag
                type="info"
                size="small"
                class="tag-custom"
                @click="handleAddTag(tag)"
              >
                {{ tag.name }}
              </el-tag>
              <el-popover
                v-model="tag.showMore"
                placement="bottom"
                width="100"
                class="custom-show-more"
              >
                <span>
                  <el-row>
                    <button-icon icon="Edit" @click="handleEditTag(tag)">Chỉnh sửa</button-icon>
                    <el-dialog
                      title="Chỉnh sửa tag"
                      :visible.sync="dialogTagVisible"
                      width="30%"
                      append-to-body
                    >
                      <el-form
                        :model="tagForm"
                      >
                        <el-form-item label="Tên tag">
                          <el-input v-model="tagForm.name"/>
                        </el-form-item>
                        <el-form-item style="display: none"/>
                      </el-form>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogTagVisible=false">Hủy</el-button>
                        <el-button type="primary" :loading="loadingSubmitTag" @click="handleConfirmEditTag">Xác nhận</el-button>
                      </span>
                    </el-dialog>
                  </el-row>
                  <el-row>
                    <button-icon icon="Trash" @click="handleDeleteTag(tag)">Xóa</button-icon>
                  </el-row>
                </span>
                <el-button slot="reference" type="text" style="transform: rotate(90deg); color: #3a3a3a">
                  <i class="el-icon-more"/>
                </el-button>
              </el-popover>
            </li>
          </ul>
        </el-row>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              size="small"
              style="width: 100%;"
              :loading="loadingSubmitTag"
              @click="handleConfirmAssignTag"
            >
              Xác nhận
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileAPI from '@/api/fileApi'
import config from '@/utils/config'
import ButtonIcon from '@/components/ButtonIcon'
import PDFViewer from '@/components/PDFViewer'
import FolderAPI from "@/api/folder"
import { getUserInfo } from "@/utils/auth"
import SignAPI from "@/api/signApi"
import eventEmitter from '@/utils/eventEmitter'
import { hubConnection } from 'signalr-no-jquery'
import ButtonDropdown from "@/components/ButtonDropdown"
import TagAPI from "@/api/tagApi"

let lastPing = 0
const options = {}
const callBacks = {}
let isConnected = false
const wsUrl = 'http://localhost:19898'
const connection = hubConnection(wsUrl, options)
const hubProxy = connection.createHubProxy('invoiceHub')

hubProxy.on('resCommand', async(message) => {
  // console.log("resCommand", message, typeof message)
  const res = message ? JSON.parse(message) : {}
  const { data, cert, callback: command, Ping } = res
  if (Ping) {
    isConnected = true
    lastPing = Date.now()
    setTimeout(() => {
      if (Date.now() - lastPing > 1100) {
        isConnected = false
      }
    }, 1500)
    return
  }
  if (callBacks[command]) {
    callBacks[command](data, cert)
    delete callBacks[command]
  } else {
    console.log('no callback', command, data)
  }
})

const execCommand = (obj, callback) => {
  if (!isConnected) {
    eventEmitter.emit('notification', {
      message: 'Vui lòng mở phần mềm HDV Plugin hoặc tải xuống và thử lại',
      type: 'warning'
    })
    return console.log('cannot connect')
  }
  const { command } = obj
  console.log("Command", command, obj)
  hubProxy.invoke('execCommand', obj)
  callBacks[command] = callback
}

export default {
  name: 'FileDetail',
  components: { ButtonDropdown, PDFViewer, ButtonIcon },
  data() {
    return {
      config,
      userInfo: getUserInfo(),
      token: localStorage.getItem(config.tokenKey),
      activeTab: 'info-detail',
      fileId: this.$route.params.id,
      fileState: +this.$route.query.state,
      signRequestId: this.$route.query.signRequestId,
      pathPdf: this.$route.query.pathPdf,
      file: {},
      urlPDF: undefined,
      keyPDF: 1,
      fileStatus: {
        1: {
          title: 'Đang chờ',
          color: 'rgb(31, 78, 218)',
        },
        2: {
          title: 'Hoàn thành',
          color: 'rgb(5, 151, 106)',
        },
        3: {
          title: 'Từ chối',
          color: 'rgb(214, 60, 60)',
        },
        4: {
          title: 'Thu hồi',
          color: 'rgb(247, 158, 12)',
        }
      },
      publicPath: process.env.BASE_URL,
      dialogVisible: false,
      loadingSign: false,
      intervalTool: null,
      dialogTool: false,
      notifyPlugin: '',
      userSignData: {},
      canSign: false,
      loadingTag: false,
      examples: [
        {
          value: 1,
          name: 'Quan trọng 1'
        },
        {
          value: 2,
          name: 'Quan trọng 2'
        },
        {
          value: 3,
          name: 'Quan trọng 3'
        }
      ],
      tags: [],
      tagForm: {},
      tagList: [],
      loadingSubmitTag: false,
      dialogTagVisible: false,
      createTagDialog: false,
    }
  },
  created() {
    this.getFile()
    this.checkSign()
  },
  mounted() {
    eventEmitter.on('notification', noti => {
      this.notifyPlugin = noti.message
      this.dialogTool = true
      this.loadingSign = false
    })

    this.intervalTool = setInterval(async() => {
      try {
        hubProxy.invoke('execCommand', {
          "command": "Ping",
          "arg": {}
        })
      } catch (e) {
        connection.start({ JSONP: true })
          .done(() => {
            isConnected = true
            console.log('Now connected, connection ID = ' + connection.id)
          })
          .fail(() => {
            isConnected = false
            console.log('Could not connect')
          })
      }
    }, 1000)
    this.getTags()
  },
  beforeDestroy() {
    clearInterval(this.intervalTool)
  },
  methods: {
    beforeCloseDialogTag(done) {
      done()
    },
    async refreshTagOfCurrentFile() {
      await this.getFile()
      this.tagList = []
      if (this.file.tags.length) {
        this.tagList = this.file.tags.map(i => i.name)
      }
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
    async handleConfirmAssignTag() {
      // add Tag
      const newTags = [...new Set(this.tagList)]
      const idExist = []
      const tagNotExist = []
      newTags.forEach(i => {
        if (this.tagMap[i]) {
          idExist.push(this.tagMap[i])
        } else {
          tagNotExist.push(i)
        }
      })
      if (tagNotExist.length) {
        try {
          this.loadingSubmitTag = true
          const res = await TagAPI.createMany(tagNotExist.map(i => ({ name: i })))
          this.$message.closeAll()
          this.loadingSubmitTag = false
          res.upserted.forEach(i => {
            idExist.push(i._id)
          })
        } catch (err) {
          this.loadingSubmitTag = false
        }
      }
      // Update File
      await FileAPI.updateTag(this.file._id, idExist)
      await this.getFile()
      this.createTagDialog = false
    },
    async handleDeleteTag(tag) {
      try {
        this.loadingSubmitTag = true
        await TagAPI.delete(tag._id)
        this.loadingSubmitTag = false
        // eslint-disable-next-line require-atomic-updates
        tag.showMore = false
        await this.getTags()
        await this.refreshTagOfCurrentFile()
      } catch (err) {
        this.loadingSubmitTag = false
      }
    },
    async handleConfirmEditTag() {
      try {
        this.loadingSubmitTag = true
        await TagAPI.update(this.tagForm.id, {
          ...this.tagForm
        })
        this.loadingSubmitTag = false
        this.dialogTagVisible = false
        this.tagForm.showMore = false
        await this.getTags()
        await this.refreshTagOfCurrentFile()
      } catch (err) {
        this.loadingSubmitTag = false
      }
    },
    async handleEditTag(tagInfo) {
      this.dialogTagVisible = true
      this.tagForm = {
        name: tagInfo.name,
        id: tagInfo._id
      }
    },
    async handleAddTag(tag) {
      const { tags } = this.file
      const tagIds = tags.map(i => i._id)

      if (tagIds.includes(tag._id) || this.tagList.includes(tag.name)) {
        this.$message.closeAll()
        this.$message.error('Tag đã được thêm. Vui lòng chọn tag khác')
        return
      }

      this.tagList.push(tag.name)
    },
    async handleAssignTag() {
      this.createTagDialog = true
      this.tagList = []
      if (this.file.tags.length) {
        this.tagList = this.file.tags.map(i => i.name)
      }
      await this.getTags()
    },
    customToolbarViewer(instance) {
      const { UI } = instance
    },
    async checkSign() {
      if (!this.signRequestId) {
        return
      }
      try {
        const { canSign, data } = await SignAPI.checkSign(this.signRequestId)
        this.canSign = canSign
        this.userSignData = data
      } catch (err) {
        this.$message.closeAll()
      }
    },
    handleDownloadSignPlugin() {
      const routeData = this.$router.resolve({ path: '/hdv_plugin_v4.zip' })
      window.open(routeData.href, '_blank')
    },
    async handleApprove() {
      try {
        this.loadingSign = true
        await SignAPI.approve(this.signRequestId)
        this.$message.closeAll()
        this.loadingSign = false
        this.$router.push('/inbox/file?status=' + config.fileStatus.TOTAL)
        eventEmitter.emit("inboxChange", {})
      } catch (err) {
        this.loadingSign = false
      }
    },
    async handleReject() {
      try {
        this.loadingSign = true
        await SignAPI.reject(this.signRequestId)
        this.$message.closeAll()
        this.loadingSign = false
        this.$router.push('/inbox/file?status=' + config.fileStatus.TOTAL)
        eventEmitter.emit("inboxChange", {})
      } catch (err) {
        this.loadingSign = false
      }
    },
    getPdfName(name) {
      const arr = name.split(".")
      arr.pop()
      return `${arr.join(".")}.pdf`
    },
    async handleSign() {
      if (this.canSign) {
        this.loadingSign = true
        const { permission, signConfig, pathPdfs } = this.userSignData
        const { signLocation, digitalId } = signConfig[0]
        const { x, y, width, height, page } = signLocation
        const signature = {
          rec: {
            llx: x,
            lly: y,
            urx: width,
            ury: height
          },
          pageNumber: page
        }
        this.fileSignData.fileUrlPdf = pathPdfs[0].pathPdf
        const dataSubmit = {
          imageURL: "",
          imageBase64: "",
          ...this.fileSignData,
          ...signature
        }

        const obj = {
          command: 'SignPdf',
          arg: JSON.stringify(dataSubmit)
        }

        execCommand(obj, async(data, cert) => {
          const response = typeof data === 'string' ? JSON.parse(data) : data
          const { URLUpload } = response[0]

          try {
            switch (permission) {
              case config.signType.SIGN: {
                const data = {
                  pathPdfs: [
                    {
                      id: digitalId,
                      pathPdf: URLUpload,
                      name: this.getPdfName(this.file.name)
                    }
                  ]
                }

                await SignAPI.sign(this.signRequestId, data)
                this.$message.closeAll()
                this.$router.push('/inbox/file?status=' + config.fileStatus.TOTAL)
                eventEmitter.emit("inboxChange", {})
                break
              }
              case config.signType.APPROVE: {
                break
              }
              default:
                break
            }
            // this.urlPDF = null
            this.loadingSign = false
          } catch (err) {
            this.loadingSign = false
          }
        })
      }
    },
    async handleDelete(file) {
      await FileAPI.delete(file._id)
      this.$router.go(-1)
    },
    handleDigitizing(file) {
      this.$router.push(`/document/sign?id=${file._id}`)
    },
    handleViewInfo() {
      this.dialogVisible = true
    },
    async getFile() {
      this.file = await FileAPI.getById(this.fileId)
      if (this.pathPdf) {
        this.urlPDF = `${config.api.download}/${this.pathPdf}`
      } else {
        this.urlPDF = `${config.api.download}/${this.file.path}`
      }
      this.fileSignData = {
        basePath: config.api.download,
        token: this.token
      }
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
    handleDownloadFile() {
      const uri = `${config.api.download}/${this.file.path}`
      this.downloadURI(uri, this.file.name)
    }
  }
}
</script>

<style lang="scss">
.page-file-detail {
  /* config tag BEGIN */
  .custom-created-tag {
    position: relative;
    .custom-show-more {
      position: absolute;
      right: 0;
    }
  }

  .tag-custom {
    background-color: #dde1ea;
    color: #3a3a3a;
    cursor: pointer;
    margin-right: 10px;
    margin-top: 10px;
  }

  .select-tag-custom {
    .el-input {
      .el-icon-arrow-up {
        visibility: hidden;
      }
    }
  }

  .tag-helper {
    margin-top: 20px;
    color: #bbbfc8;
  }

  .quanity-tag {
    font-size: 11px;
    color: #aaa;
    font-weight: bold;
    margin-left: 2px;
  }
  /* config tag END */

  .header-toolbar {
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    position: relative;

    .title {
      font-size: .9rem;
      font-weight: 600;
    }
  }

  .toolbar-btn {
    position: absolute;
    right: 15px;
  }

  .file-status {
    margin-right: 20px;
    font-size: .9rem;

    .icon-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      line-height: 40px;
      margin-right: 5px;
    }
  }

  .icon-button {
    cursor: pointer;
    height: 40px;
    width: 40px;
    padding: 9px;

    &:hover {
      background: #f1f3f5;
    }
  }

  .file-viewer {
    height: calc(100vh - 140px);
  }

  .dialog-info {
    .el-dialog__body {
      padding: 0;
    }

    .dialog-toolbar {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      background: #f1f3f5;
    }

    .dialog-content {
      padding: 20px;
    }
  }

  .row-info {
    padding: 10px 0;
  }

  .label-info {
    color: #6a7181;
    font-size: .9rem;
    margin: 7px 0;
  }

  .content-info {
    font-weight: 600;
    font-size: .9rem;
    margin: 7px 0;
  }

  .row-log {
    border-bottom: 1px solid #e4e7ed;
    padding: 12px 0;
    display: flex;
  }

  .time {
    width: 200px;
  }

  .el-tag.el-tag--info {
    margin-left: 5px;
  }
}
</style>
