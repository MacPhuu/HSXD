<template>
  <div
    class="page-sign-document"
    v-loading="loadingDigital"
    :element-loading-text="`${msgDigital}...`"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, .9)"
  >
    <div class="step-container">
      <span v-if="activeStep > 1" class="back-btn" @click="backStep">
        <svg-icon icon-class="ArrowLeft"/>
      </span>
      <span v-else class="close-btn" @click="handleClose">
        <svg-icon icon-class="Close"/>
      </span>
      <div class="step-main">
        <span :class="[{ 'is-active': activeStep === 1}, 'step-item']">
          <svg-icon icon-class="Upload"/> Tải lên
        </span>
        <span v-if="!signOnlyMe" class="three-dot"/>
        <span v-if="!signOnlyMe" :class="[{ 'is-active': activeStep === 2}, 'step-item']">
          <svg-icon icon-class="Add"/> Thêm người ký
        </span>
        <span class="three-dot"/>
        <span :class="[{ 'is-active': activeStep === 3}, 'step-item']">
          <svg-icon icon-class="_AddField"/> Gán trường ký
        </span>
        <span class="three-dot"/>
        <span :class="[{ 'is-active': activeStep === 4}, 'step-item']">
          <svg-icon icon-class="MailSend"/> {{ signOnlyMe ? 'Xác nhận và ký' : 'Xác nhận và gửi' }}
        </span>
      </div>
      <span class="next-btn" @click="nextStep">
        <svg-icon v-if="activeStep === 3 && signOnlyMe" icon-class="Check2"/>
        <svg-icon v-else-if="activeStep === 4 && !signOnlyMe" icon-class="Check2"/>
        <svg-icon v-else icon-class="ArrowRight"/>
      </span>
    </div>
    <div class="main-page">
      <div v-if="activeStep === 1" class="upload-box">
        <div class="upload-form">
          <div v-if="fileListUploaded.length" class="file-list-uploaded">
            <div><b style="font-size: .9rem; font-weight: 600">Đã tải lên</b></div>
            <div
              v-for="item in fileListUploaded"
              :key="item._id"
              class="file"
            >
              <svg-icon
                v-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'"
                class-name="file-uploaded-icon"
                icon-class="doc"
              />
              <svg-icon
                v-else-if="fileType(item.name) === 'pdf'"
                class-name="file-uploaded-icon"
                icon-class="pdf"
              />
              <svg-icon
                v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'"
                class-name="file-uploaded-icon"
                icon-class="xls"
              />
              <div>
                <div class="content-info">{{ item.name }}</div>
                <div class="label-info">{{ `${item.size.toFixed(2)} Kb` }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <h3 style="margin: 0">Tải lên</h3>
            <el-upload
              class="upload-area"
              drag
              :action="urlUploadFile"
              :headers="headerUpload"
              :file-list="fileList"
              :on-progress="onProgressUploadFile"
              :on-success="onUploadFileSuccess"
              multiple
            >
              <div class="upload-content">
                <svg-icon class="icon-upload-cloud" icon-class="UploadCloud"/>
                <b class="el-upload__text">Kéo và thả tài liệu trực tiếp từ thiết bị của bạn</b>
                <div class="el-upload__text">Định dạng phù hợp .pdf/ .doc/ .docx/ .jpg/ .png</div>
                <div style="margin: 12px 0;"><b>Hoặc</b></div>
                <el-dropdown trigger="click" placement="bottom-start" @command="handleSelectUploadType">
                  <el-button size="small" type="primary" @click="$event => $event.stopPropagation()">
                    Tải lên
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
<!--                    <el-dropdown-item command="device">-->
<!--                      <svg-icon icon-class="Laptop"/>-->
<!--                      Thiết bị-->
<!--                    </el-dropdown-item>-->
                    <el-dropdown-item command="uploaded">
                      <svg-icon icon-class="FolderCheck"/>
                      Đã tải lên
                    </el-dropdown-item>
                    <!--                  <el-dropdown-item><svg-icon icon-class="Dropbox" /> Dropbox</el-dropdown-item>-->
                    <!--                  <el-dropdown-item><svg-icon icon-class="Drive" /> Google Drive</el-dropdown-item>-->
                    <!--                  <el-dropdown-item><svg-icon icon-class="OneDrive" /> OneDrive</el-dropdown-item>-->
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-upload>
            <div class="el-upload__tip" slot="tip" style="font-size: .8rem">Kích thước tối đa: 50MB</div>
          </div>
        </div>
        <div style="text-align: right; width: 600px; margin-top: 10px">
          <el-checkbox v-model="signOnlyMe" @change="onChangeSignOnlyMe">Tôi là người ký duy nhất</el-checkbox>
        </div>
      </div>
      <div v-if="activeStep === 2" class="sign-user-container">
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <h3>Thêm người ký</h3>
            <div class="sign-user-form">
              <div class="step-side">
                <svg-icon icon-class="_Sender" class="icon-step-side"/>
                <div class="divider-bar"></div>
                <svg-icon icon-class="Team" class="icon-step-side"/>
                <div class="divider-bar" style="height: 126px"></div>
              </div>
              <div class="content-form">
                <div class="step-side-item">
                  <div class="label-row">Người gửi</div>
                  <div class="content-row">Nguyễn A</div>
                </div>
                <div class="step-side-item">
                  <div class="label-row two">Người nhận</div>
                </div>
                <draggable
                  :list="receiverList"
                  class="list-group"
                  ghost-class="ghost-card"
                  chosen-class="chosen-card"
                  @start="dragging = true"
                  @end="dragging = false"
                >
                  <div
                    v-for="(user, idx) in receiverList"
                    :key="`u-${idx}`"
                    class="step-side-item card-user"
                    @dragstart="onDragStart(`receiver-${idx}`, user)"
                    @dragend="onDragEnd(`receiver-${idx}`, user)"
                  >
                    <span class="index-card">{{ idx + 1 }}</span>
                    <el-card
                      :id="`receiver-${idx}`"
                      class="card-receiver"
                      shadow="none"
                    >
                      <el-row>
                        <el-col :span="12">
                          <el-form ref="receiverForm" :model="user" size="small" :rules="ruleFormReceiver">
                            <el-form-item prop="name" label="Họ tên">
                              <el-input
                                v-model="user.name"
                                class="input-suffix"
                                placeholder="Tên người nhận"
                              >
                                <el-icon slot="suffix" name="notebook-1" @click.native="addMemberFromContacts" />
                              </el-input>
                            </el-form-item>
                            <el-form-item prop="email" label="Email">
                              <el-input
                                v-model="user.email"
                                suffix-icon="el-icon-message"
                                placeholder="Email người nhận"
                              />
                            </el-form-item>
                            <el-form-item prop="position" label="Chức danh">
                              <el-input v-model="user.position" placeholder="Chức danh"/>
                            </el-form-item>
                          </el-form>
                        </el-col>
                        <el-col :span="12">
                          <el-select v-model="user.permission" size="small" style="width: 150px; float: right">
                            <el-option
                              v-for="item in permissionConfig"
                              :key="item.label"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-card>
                    <span class="close-btn-card" @click="removeReceiver(user, idx)">
                      <svg-icon icon-class="Close2"/>
                    </span>
                  </div>
                </draggable>
                <el-row type="flex" justify="start" style="margin-top: 20px">
                  <div class="btn-icon" @click="addReceiver">
                    <svg-icon icon-class="Add"/>
                    Thêm người nhận
                  </div>
                  <el-button class="btn-text" type="text" @click="addMemberFromContacts">Thêm từ danh bạ</el-button>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="activeStep === 3" class="pdf-viewer">
        <div v-if="signOnlyMe">
          <div
            class="toolbar-sign"
            v-loading="loadingSign"
            element-loading-text="Đang tiến hành"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, .9)"
          >
            <button-icon
              icon="_Signature"
              @click="showConfirmSignOnlyMe"
            >
              Ký bằng USB Token
            </button-icon>
          </div>
          <div
            v-for="user in userListSign"
            :key="user.email"
            style="height: calc(100vh - 130px)"
          >
            <PDFViewer
              v-if="urlPDF"
              :key="keyPDF"
              ref="pdfViewer"
              :path="`${publicPath}webviewer`"
              :url="urlPDF"
              :on-annotation-changed="user.onAnnotationChanged"
              :on-init="user.onInitViewer"
              :custom-toolbar="customToolbarViewer"
            />
          </div>
        </div>
        <div v-else>
          <el-select v-model="selectedUser" placeholder="Chọn người ký">
            <el-option
              v-for="user in userListSign.filter(u => u.permission === 1)"
              :key="user.email"
              :label="user.name || user.email"
              :value="user.email"
            >
              <span style="float: left">{{ user.name || user.email }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ user.email }}</span>
            </el-option>
          </el-select>
          <div
            v-for="user in userListSign"
            :key="user.email"
            v-show="user.email === selectedUser"
            style="height: calc(100vh - 130px)"
          >
            <PDFViewer
              v-if="urlPDF"
              :key="keyPDF"
              ref="pdfViewer"
              :path="`${publicPath}webviewer`"
              :url="urlPDF"
              :on-annotation-changed="user.onAnnotationChanged"
              :on-init="user.onInitViewer"
              :custom-toolbar="customToolbarViewer"
            />
          </div>
          <PDFViewer
            v-if="urlPDF && !selectedUser"
            :key="keyPDF"
            ref="pdfViewer"
            :path="`${publicPath}webviewer`"
            :url="urlPDF"
            style="height: calc(100vh - 130px)"
          />
        </div>
      </div>
      <div v-show="activeStep === 4" class="confirm-send">
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <h3>Xác nhận và gửi</h3>
            <el-row :gutter="100">
              <el-col :span="14">
                <div class="head-form-mail">
                  <div class="label-row">Người gửi</div>
                  <div class="content-row">{{ userInfo.name || userInfo.username }}</div>
                </div>
                <el-form ref="emailForm" class="form-email" :model="mailForm" :rules="ruleFormMail" size="small"
                         label-position="top"
                >
                  <el-form-item label="Tiêu đề Email" prop="title">
                    <el-input v-model="mailForm.title" placeholder="Nhập tiêu đề Email"/>
                  </el-form-item>
                  <el-form-item label="Nội dung Email" prop="content">
                    <el-input type="textarea" v-model="mailForm.content" placeholder="Nhập nội dung"
                              :autosize="{ minRows: 4 }" show-word-limit maxlength="100"
                    />
                  </el-form-item>
                </el-form>
                <div class="file-list-uploaded">
                  <h4>Tài liệu</h4>
                  <div
                    v-for="item in fileListUploaded"
                    :key="item._id"
                    class="file"
                  >
                    <svg-icon
                      v-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'"
                      class-name="file-uploaded-icon"
                      icon-class="doc"
                    />
                    <svg-icon
                      v-else-if="fileType(item.name) === 'pdf'"
                      class-name="file-uploaded-icon"
                      icon-class="pdf"
                    />
                    <svg-icon
                      v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'"
                      class-name="file-uploaded-icon"
                      icon-class="xls"
                    />
                    <div>
                      <div class="content-info">{{ item.name }}</div>
                      <div class="label-info">{{ `${item.size.toFixed(2)} Kb` }}</div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="10" style="float: right">
                <div
                  v-for="(user, idx) in userListSign"
                  :key="`user-card-${idx}`"
                  class="user-mail-container"
                >
                  <span class="stt-card">
                    {{ idx + 1 }}
                  </span>
                  <el-card
                    class="card-user-mail"
                    shadow="none"
                  >
                    <div v-if="user.permission === 1" class="label-row"
                         style="border-bottom: 1px solid #e4e7ed; padding-bottom: 10px"
                    >Người ký
                    </div>
                    <div v-else-if="user.permission === 2" class="label-row"
                         style="border-bottom: 1px solid #e4e7ed; padding-bottom: 10px"
                    >Người phê duyệt
                    </div>
                    <div v-else-if="user.permission === 3" class="label-row"
                         style="border-bottom: 1px solid #e4e7ed; padding-bottom: 10px"
                    >Người nhận bản sao
                    </div>
                    <div class="content-row">{{ user.name }}</div>
                    <div class="label-row">{{ user.email }}</div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div v-if="activeStep === 5">
        <div
          class="page-finish"
          v-loading="loadingRequest"
          element-loading-text="Đang xử lý..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, .9)"
        >
          <div v-if="errorRequest" style="text-align: center">
            <svg-icon icon-class="Fail" style="font-size: 48px"/>
            <p>{{ errorRequest }}</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="Tài liệu của tôi"
      :visible.sync="dialogDocument"
      width="60%"
    >
      <div class="dialog-content">
        <el-input v-model="searchDoc" suffix-icon="el-icon-search" placeholder="Nhập từ khóa cần tìm kiếm"/>
        <file-list @selectFile="selectFile"/>
        <el-row type="flex" justify="end" style="margin-top: 20px">
          <el-button size="small" @click="dialogDocument = false">Hủy</el-button>
          <el-button type="primary" size="small">Tiếp tục</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog
      title="Danh bạ"
      :visible.sync="dialogContact"
      width="60%"
    >
      <div class="dialog-content">
        <el-input v-model="searchMember" size="small" suffix-icon="el-icon-search"
                  placeholder="Nhập từ khóa cần tìm kiếm"
        />
        <el-table
          ref="tableMember"
          v-loading="loadingMember"
          fit
          :data="members"
          @selection-change="handleSelectMember"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column label="Tên" prop="name" sortable fixed>
            <template slot-scope="scope">
              <span class="title-hightlight">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Email" sortable prop="email"/>
          <el-table-column label="Chức danh" sortable prop="position"/>
        </el-table>
        <el-row type="flex" justify="end" style="margin-top: 20px">
          <el-button size="small" @click="dialogContact = false">Hủy</el-button>
          <el-button type="primary" size="small" @click="handleAddMember">Tiếp tục</el-button>
        </el-row>
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

    <el-dialog
      custom-class="dialog-confirm"
      title="Xác nhận và hoàn tất"
      :visible.sync="dialogConfirm"
    >
      <div>
        <h3 style="margin-bottom: 40px">Thông tin chung</h3>
        <el-form ref="formSignOnlyMe" :model="formSignOnlyMe" label-position="top" :rules="ruleFormOnlyMe">
          <el-form-item label="Tiêu đề" prop="title">
            <el-input v-model="formSignOnlyMe.title" />
          </el-form-item>
        </el-form>
        <div class="file-list-uploaded" style="margin-top: 40px">
          <h4>Tài liệu</h4>
          <div
            v-for="item in fileListUploaded"
            :key="item._id"
            class="file"
          >
            <svg-icon
              v-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'"
              class-name="file-uploaded-icon"
              icon-class="doc"
            />
            <svg-icon
              v-else-if="fileType(item.name) === 'pdf'"
              class-name="file-uploaded-icon"
              icon-class="pdf"
            />
            <svg-icon
              v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'"
              class-name="file-uploaded-icon"
              icon-class="xls"
            />
            <div>
              <div class="content-info">{{ item.name }}</div>
              <div class="label-info">{{ `${item.size.toFixed(2)} Kb` }}</div>
            </div>
          </div>
        </div>
        <el-row type="flex" justify="end" style="margin-top: 20px">
          <el-button size="small" @click="dialogConfirm = false">Hủy</el-button>
          <el-button size="small" type="primary" @click="handleSubmitSignOnlyMe">Xác nhận</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PDFViewer from '@/components/PDFViewer'
import config from '@/utils/config'
import FileList from '@/views/sign-document/file'
import FileAPI from "@/api/fileApi"
import SignRequestAPI from "@/api/signRequestApi"
import MemberAPI from "@/api/memberApi"
import { getUserInfo } from "@/utils/auth"
import eventEmitter from "@/utils/eventEmitter"
import ButtonIcon from "@/components/ButtonIcon"
import { hubConnection } from "signalr-no-jquery"
import DigitalDocumentAPI from "@/api/digitalDocumentApi"
import draggable from 'vuedraggable'

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
  name: 'SignDocument',
  components: { ButtonIcon, draggable, FileList, PDFViewer },
  data() {
    const token = localStorage.getItem(config.tokenKey)

    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Yêu cầu nhập Email'))
      } else if (value && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
        callback(new Error('Vui lòng nhập đúng định dạng Email'))
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      urlUploadFile: config.api.upload,
      urlDownloadFile: config.api.download,
      headerUpload: {
        'x-access-token': token
      },
      members: [],
      dialogContact: false,
      userInfo: getUserInfo(),
      loadingMember: false,
      loadingDigital: false,
      loadingUpload: false,
      loadingRequest: false,
      loadingSign: false,
      errorRequest: null,
      msgDigital: '',
      fileId: this.$route.query.id,
      digitalId: null,
      fileListUploaded: [],
      searchDoc: undefined,
      searchMember: undefined,
      dialogDocument: false,
      activeStep: 1,
      keyPDF: 1,
      signOnlyMe: false,
      dialogConfirm: false,
      formSignOnlyMe: {},
      urlUpload: `${config.api.upload}/upload`,
      urlPDF: undefined,
      contract: {},
      publicPath: process.env.BASE_URL,
      viewerIntance: {},
      fileSignData: {
        basePath: config.api.download,
        token
      },
      signature: null,
      imageSignature: null,
      signUserForm: {},
      mailForm: {},
      permissionConfig: [
        {
          label: 'Ký tài liệu',
          value: 1
        },
        {
          label: 'Phê duyệt',
          value: 2
        },
        {
          label: 'Nhận bản sao',
          value: 3
        }
      ],
      selectedMembers: [],
      dragging: false,
      receiverList: [],
      selectedUser: undefined,
      signRequest: {},
      intervalStatus: null,
      ruleFormOnlyMe: {
        title: [
          { required: true, trigger: 'blur', message: 'Vui lòng tiêu đề Email' }
        ]
      },
      ruleFormReceiver: {
        name: [
          { required: true, trigger: 'blur', message: 'Vui lòng nhập Họ tên' }
        ],
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
      },
      ruleFormMail: {
        title: [
          { required: true, trigger: 'blur', message: 'Vui lòng nhập tiêu đề Email' }
        ],
        content: [
          { required: true, trigger: 'blur', message: 'Vui lòng nhập nội dung Email' }
        ],
      },
      intervalTool: null,
      dialogTool: false,
      notifyPlugin: '',
    }
  },
  computed: {
    userListSign() {
      return this.receiverList.map(user => {
        user.onInitViewer = function(instance) {
          user.viewerIntance = instance
        }

        user.onAnnotationChanged = function(annotations, action) {
          const { Core, UI } = user.viewerIntance
          const { annotationManager } = Core
          const annotationList = annotationManager.getAnnotationsList()
          const signatureWidgetList = annotationList.filter(anot => anot.Subject === 'Signature')
          const imageSignatureWidgetList = annotationList.filter(anot => anot.Subject === 'Stamp')
          const signList = [...signatureWidgetList, ...imageSignatureWidgetList]

          if (signList.length > 1) {
            this.$notify.error('Chỉ được thêm tối đa 1 chữ ký.')
            annotationManager.deleteAnnotation(signList[1])
            return
          }

          const imageSignatureList = imageSignatureWidgetList.map(item => {
            return {
              x: item.X,
              y: item.Y,
              width: item.Width,
              height: item.Height,
              page: item.PageNumber,
              imageBase64: item.image.currentSrc
            }
          })
          const signatureList = signatureWidgetList.map(item => {
            return {
              x: item.X,
              y: item.Y,
              width: item.Width,
              height: item.Height,
              page: item.PageNumber
            }
          })
          // this.signature = signatureList[0]
          // this.imageSignature = imageSignatureList[0]
          user.signLocation = signatureList[0] || imageSignatureList[0]
        }
        return user
      })
    }
  },
  created() {
    this.getFileById()
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
  },
  beforeDestroy() {
    clearInterval(this.intervalStatus)
    clearInterval(this.intervalTool)
  },
  methods: {
    handleEndDraggable() {
      //Lưu cấu hình vào localStorage
      localStorage.setItem('listDrag', JSON.stringify(this.receiverList))
      this.dragging = false
    },
  onDragStart(id) {
    const receiverCard = document.getElementById(id)
    receiverCard.classList.add('dragover')
  },
  onDragEnd(id) {
      alert('vao')
      localStorage.setItem('listDrag', JSON.stringify(this.receiverList))
      const receiverCard = document.getElementById(id)
      receiverCard.classList.remove('dragover')
    },
    getPdfName(name) {
      const arr = name.split(".")
      arr.pop()
      return `${arr.join(".")}.pdf`
    },
    handleDownloadSignPlugin() {
      const routeData = this.$router.resolve({ path: '/hdv_plugin_v4.zip' })
      window.open(routeData.href, '_blank')
    },
    handleSubmitSignOnlyMe() {
      this.$refs.formSignOnlyMe.validate(valid => {
        if(valid) {
          this.handleSign()
        }
      })
    },
    async handleSign() {
      const userSign = this.userListSign[0]

      if (!userSign.signLocation) {
        this.$notify.closeAll()
        this.$notify.warning('Vui lòng gán trường ký.')
        return false
      }

      let file = { ...this.fileListUploaded[0] }
      if (!file.digitalId) {
        file = await this.getFileById(file._id)
        this.fileListUploaded = [file]
      }
      const digitalFile = await DigitalDocumentAPI.getById(file.digitalId)
      const { path } = digitalFile

      this.loadingSign = true
      this.fileSignData.fileUrlPdf = path

      const { x, y, width, height, page } = userSign.signLocation
      const signature = {
        rec: {
          llx: x,
          lly: y,
          urx: width,
          ury: height
        },
        pageNumber: page
      }

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
          const data = {
            pathPdfs: [
              {
                id: file.digitalId,
                pathPdf: URLUpload,
                name: this.getPdfName(file.name)
              }
            ],
            digitalDocuments: [file.digitalId],
            receiver: this.userListSign.map(user => {
              const { email, position, permission, signLocation } = user

              return {
                email,
                position,
                permission,
                signConfig: [{
                  digitalId: file.digitalId,
                  signLocation
                }]
              }
            })
          }

          await SignRequestAPI.signOnlyMe(data)
          this.$message.closeAll()
          this.$router.push('/inbox/file?status=' + config.fileStatus.TOTAL)
          eventEmitter.emit("inboxChange", {})
          this.loadingSign = false
        } catch (err) {
          this.loadingSign = false
        }
      })
    },
    async getMembers() {
      try {
        this.loadingMember = true
        const { data } = await MemberAPI.get({ perPage: 10000 })
        this.loadingMember = false
        this.members = data?.map(member => {
          const { role, userId, _id, name, group, position } = member
          return {
            _id,
            name,
            group,
            position,
            role,
            email: userId.username
          }
        })
      } catch (err) {
        this.loadingMember = false
      }
    },
    onChangeSignOnlyMe(checked) {
      if (checked) {
        const selectedUser = {
          name: this.userInfo.name,
          email: this.userInfo.username,
          permission: 1
        }
        if (!this.userInfo.name) {
          delete selectedUser.name
        }
        this.receiverList = [selectedUser]
        this.selectedUser = selectedUser.email
        this.keyPDF++
      } else {
        this.selectedUser = undefined
        this.keyPDF++
      }
    },
    onProgressUploadFile() {
      this.loadingUpload = true
    },
    async onUploadFileSuccess(res) {
      try {
        const file = await FileAPI.create({ ...res, name: res.fileName })
        this.loadingUpload = false
        await this.getFileById(file._id)
      } catch (err) {
        this.loadingUpload = false
      }
    },
    handleAddMember() {
      this.receiverList = [...this.receiverList, ...this.selectedMembers]
      this.dialogContact = false
    },
    handleSelectMember(data) {
      this.selectedMembers = data?.map(i => {
        const member = {
          name: i.name,
          position: i.position,
          email: i.email,
          permission: 1,
        }
        if (!member.name) {
          delete member.name
        }
        if (!member.position) {
          delete member.position
        }
        if (!member.permission) {
          delete member.permission
        }
        return member
      })
    },
    async addMemberFromContacts() {
      this.selectedMembers = []
      this.dialogContact = true
      await this.getMembers()
      this.$refs.tableMember.clearSelection()
    },
    async selectFile(file) {
      this.fileId = file._id
      await this.getFileById(file._id)
      this.keyPDF++
      this.dialogDocument = false
    },
    async getFileById(fileId) {
      fileId = fileId || this.fileId
      if (fileId) {

        const { ok } = await DigitalDocumentAPI.checkRole(fileId)
        if(ok) {
          const file = await FileAPI.getById(fileId)
          if (file.digitalId) {
            // đã số hóa
            this.digitalId = file.digitalId
          } else if (file.isDigitizing) {
            // đang số hóa
            this.getDigitalStatusFile(fileId)
          } else if (!file.digitalId && !file.isDigitizing) {
            // chưa số hóa
            await this.handleDigitizing(fileId)
            this.getDigitalStatusFile(fileId)
          }
          this.fileListUploaded = [file]
          this.urlPDF = `${config.api.download}/${file.path}`
          return file
        } else {
          this.$message.closeAll()
          this.$message.error('Bạn chưa có quyền số hóa tài liệu này.')
          return false
        }

        // const file = await FileAPI.getById(fileId)
        // if (file.digitalId) {
        //   // đã số hóa
        //   this.digitalId = file.digitalId
        // } else if (file.isDigitizing) {
        //   // đang số hóa
        //   this.getDigitalStatusFile(fileId)
        // } else if (!file.digitalId && !file.isDigitizing) {
        //   // chưa số hóa
        //   await this.handleDigitizing(fileId)
        //   this.getDigitalStatusFile(fileId)
        // }
        // this.fileListUploaded = [file]
        // this.urlPDF = `${config.api.download}/${file.path}`
        // return file
      }
    },
    getDigitalStatusFile(fileId) {
      clearInterval(this.intervalStatus)
      this.intervalStatus = setInterval(async() => {
        this.loadingDigital = true
        this.msgDigital = 'File đang được số hóa. Vui lòng chờ trong giây lát'
        const { data } = await FileAPI.getStatusDigital(fileId)
        if (data.isSuccess) {
          this.loadingDigital = false
          clearInterval(this.intervalStatus)
          const file = await FileAPI.getById(fileId)
          this.digitalId = file.digitalId
          return
        }
      }, 2000)
    },
    async handleDigitizing(fileId) {
      this.loadingDigital = true
      try {
        const res = await FileAPI.digitizing(fileId)
        this.msgDigital = res.msg
      } catch (err) {
      }
    },
    fileType(fileName) {
      const [name, type] = fileName?.split('.')
      return type
    },
    handleSelectUploadType(type) {
      switch (type) {
        case 'device':
          break
        case 'uploaded':
          this.dialogDocument = true
          break
        default:
          break
      }
    },
    addReceiver() {
      this.receiverList.push({
        permission: 1
      })
    },
    removeReceiver(item, idx) {
      if (this.receiverList.length === 1) {
        this.$notify.closeAll()
        this.$notify.info('Yêu cầu ít nhất 1 người nhận')
        return false
      } else {
        this.receiverList.splice(this.receiverList.indexOf(item), 1)
      }
    },
    handleClose() {
      this.$router.go(-1)
    },
    handleSubmitRequest() {
      const { title, content } = this.mailForm
      this.signRequest = {
        emailConfig: {
          title,
          content
        },
        digitalDocuments: [this.digitalId],
        receiver: this.userListSign.map(user => {
          const { email, position, permission, signLocation } = user
          return {
            email,
            position,
            permission,
            signConfig: [{
              digitalId: this.digitalId,
              signLocation
            }]
          }
        })
      }

      this.loadingRequest = true
      const res = SignRequestAPI.add(this.signRequest)
        .then(res => {
          this.loadingRequest = false
          this.$message.closeAll()
          this.$message.success('Tạo yêu cầu thành công')
          this.$router.push('/inbox/file?status=' + config.fileStatus.PENDING)
          eventEmitter.emit("inboxChange", {})
        })
        .catch(err => {
          this.loadingRequest = false
          this.errorRequest = 'Có lỗi xảy ra trong quá trình tạo yêu cầu. Vui lòng thử lại'
        })
    },
    nextStep() {
      if (this.activeStep === 1) {
        if (this.fileListUploaded.length === 0) {
          this.$notify.closeAll()
          this.$notify.warning('Vui lòng tải lên tài liệu để tiếp tục.')
          return false
        }
      }
      if (this.activeStep === 2) {
        if (this.receiverList.length === 0) {
          this.$notify.closeAll()
          this.$notify.warning('Vui lòng thêm người nhận để tiếp tục.')
          return false
        }

        let isValid = true
        this.$refs.receiverForm.forEach(form => {
          form.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })

        if (!isValid) {
          return false
        } else {
          const userSigns = this.userListSign.filter(u => u.permission === 1)
          this.selectedUser = userSigns[0].email
        }
      }

      if (this.activeStep === 3) {
        if (this.signOnlyMe) {
          this.showConfirmSignOnlyMe()
          return false
        }
      }

      if (this.activeStep === 4) {
        let isValid = false
        this.$refs.emailForm.validate(valid => {
          if (valid) {
            isValid = true
            this.handleSubmitRequest()
          }
        })
        if (!isValid) {
          return false
        }
      }

      if (this.activeStep < 5) {
        if (this.signOnlyMe && this.activeStep === 1) {
          this.activeStep = this.signOnlyMe ? (this.activeStep + 2) : (this.activeStep + 1)
        } else {
          this.activeStep++
        }
      }
    },
    backStep() {
      if (this.activeStep > 1) {
        if (this.signOnlyMe && this.activeStep === 3) {
          this.activeStep = this.signOnlyMe ? (this.activeStep - 2) : (this.activeStep - 1)
        } else {
          this.activeStep--
        }
      }
    },
    showConfirmSignOnlyMe() {
      const userSign = this.userListSign[0]
      if (!userSign.signLocation) {
        this.$notify.closeAll()
        this.$notify.warning('Vui lòng gán trường ký.')
        return false
      }
      this.dialogConfirm = true
    },
    customToolbarViewer(instance) {
      const { UI } = instance
    },
    onInitViewer(instance) {
      this.viewerIntance = instance
    },
    onAnnotationChanged(annotations, action) {
      const { Core, UI } = this.viewerIntance
      const { annotationManager } = Core
      const annotationList = annotationManager.getAnnotationsList()
      const signatureWidgetList = annotationList.filter(anot => anot.Subject === 'Signature')
      const imageSignatureWidgetList = annotationList.filter(anot => anot.Subject === 'Stamp')
      const signList = [...signatureWidgetList, ...imageSignatureWidgetList]

      if (signList.length > 1) {
        this.$notify.error('Chỉ được thêm tối đa 1 chữ ký.')
        annotationManager.deleteAnnotation(signList[1])
        return
      }

      const imageSignatureList = imageSignatureWidgetList.map(item => {
        return {
          imageBase64: item.image.currentSrc,
          rec: {
            llx: item.X,
            lly: item.Y,
            urx: item.Width,
            ury: item.Height
          },
          pageNumber: item.PageNumber
        }
      })
      const signatureList = signatureWidgetList.map(item => {
        return {
          rec: {
            llx: item.X,
            lly: item.Y,
            urx: item.Width,
            ury: item.Height
          },
          pageNumber: item.PageNumber
        }
      })
      this.signature = signatureList[0]
      this.imageSignature = imageSignatureList[0]
    },
  }
}
</script>

<style lang="scss">
.page-sign-document {
  .ghost-card {
    opacity: 0.5 !important;
    .card-receiver {
      background: aliceblue !important;
    }
  }
  .chosen-card {
    .card-receiver {
    }
  }
  .page-finish {
    height: calc(100vh - 90px);
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;

    p {
      color: #6a7181;
      text-align: center;
    }
  }

  .step-container {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    //position: fixed;
    //top: 050px;
    //z-index: 2;
    //background: #fff;
    //width: calc(100vw - 237px);

    .close-btn {
      position: absolute;
      left: 12px;
      top: 12px;
      cursor: pointer;
    }

    .next-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      background: #0284C7;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .back-btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      background: #0284C7;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .step-main {
    .step-item {
      color: rgb(110, 118, 131);
      font-size: .9rem;
      font-weight: 400;
      outline: none;
      user-select: none;

      &.is-active {
        font-weight: 600;
        color: #303133;
      }
    }
  }

  .three-dot {
    width: 4px;
    height: 4px;
    background: rgb(143, 152, 169);
    border-radius: 50%;
    position: relative;
    vertical-align: middle;
    display: inline-block;
    margin: 0 50px;

    &:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 4px;
      background: rgb(143, 152, 169);
      border-radius: 50%;
      top: 0;
      left: 15px;
    }

    &:after {
      position: absolute;
      content: '';
      width: 4px;
      height: 4px;
      background: rgb(143, 152, 169);
      border-radius: 50%;
      top: 0;
      right: 15px;
    }
  }

  .main-page {
    //background: #f3f4f6;
    background: rgb(249, 250, 252);
    height: calc(100vh - 90px);
    overflow: auto;
    padding: 20px;
  }

  .upload-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    height: calc(100vh - 90px);

    .upload-form {
      margin-top: 50px;
      padding: 24px;
      width: 600px;
      min-height: 380px;
      border-radius: 5px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      background: #fff;
    }
  }

  .icon-upload-cloud {
    font-size: 64px;
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .upload-area {
    margin-top: 20px;

    .el-upload {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .el-upload-dragger {
        width: 100%;
        height: 250px;
      }
    }
  }

  .upload-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;

    .el-upload__text {
      margin: 5px 0;
    }
  }

  .pdf-viewer {
    height: calc(100vh - 90px);
    margin: -20px;
  }

  .toolbar-sign {
    height: 40px;
    text-align: center;
  }

  .sign-user-form {
    display: flex;
  }

  .card-receiver {
    width: 600px;
    margin-top: 20px;
    border-right: 4px solid rgb(194, 222, 234);
    transition: 0s all;
    cursor: move;

    &.dragover {
      border: 2px dashed #082f63;
    }
  }

  .content-form {
    margin-top: 20px;
  }

  .label-row {
    color: rgb(143, 152, 169)
  }

  .label-row.two {
    margin-top: 62px;
  }

  .content-row {
    font-weight: 600;
  }

  .label-row, .content-row {
    margin: 4px 0;
    font-size: .9rem;
  }

  .step-side {
    margin-top: 30px;

    .icon-step-side {
      font-size: 24px;
    }

    .divider-bar {
      height: 40px;
      width: 24px;
      border-left: 2px dashed rgb(195, 205, 224);
      margin-left: 12px;
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }

  .btn-icon {
    padding: 8px 20px;
    height: 36px;
    background: rgb(221, 235, 234);
    cursor: pointer;
  }

  .btn-text {
    margin-left: 15px;
    padding-left: 15px;
    border-left: 1px solid #e4e7ed;
  }

  .card-user {
    display: flex;
    align-items: center;
  }

  .close-btn-card {
    margin-left: 10px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #082f63;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .index-card {
    margin-right: 10px;
    width: 28px;
    padding: 5px;
    height: 28px;
    font-size: .9rem;
    font-weight: 600;
    //background: #e4e7ed;
    background: rgb(222, 236, 235);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .head-form-mail {
    padding: 15px 0;
    border-bottom: 1px solid #e4e7ed;
  }

  .form-email {
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
  }

  .user-mail-container {
    display: flex;
  }

  .stt-card {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(222, 236, 235);
    margin-right: 10px;
  }

  .card-user-mail {
    width: 100%;
    margin-bottom: 20px;

    .el-card__body {
      padding: 12px;
    }
  }

  .file-list-uploaded {
    margin-top: 15px;

    .file {
      padding: 15px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e4e7ed;
    }
  }

  .file-uploaded-icon {
    font-size: 32px;
    margin-right: 15px;
  }

  .label-info {
    color: #6a7181;
    font-size: .75rem;
    padding: 2px 0;
  }

  .content-info {
    padding: 2px 0;
    font-weight: 600;
    font-size: .9rem;
  }
  .input-suffix {
    .el-input__suffix {
      cursor: pointer;
      width: 25px;
    }
  }

  .dialog-confirm {
    .el-dialog__header {
      padding-bottom: 20px;
      border-bottom: 1px solid #e4e7ed;
    }
  }
}
</style>
