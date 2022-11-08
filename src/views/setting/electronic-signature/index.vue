<template>
  <div class="page-setting page-e-sign">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <h4 style="margin: 5px 0; line-height: 40px">Chữ ký điện tử</h4>
        <el-card class="card-sign" shadow="none">
          <el-row class="row-sign">
            <el-col :span="20">
              <h5 style="margin: 0 0 10px;">Bạn chưa thiết lập chữ ký</h5>
              <span style="color: #97a8be; font-size: .83rem">Thêm chữ ký của bạn để bắt đầu sử dụng</span>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="text" icon="el-icon-plus" @click="addSignature">Tạo mới</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      class="dialog-sign"
      title="Thiết lập chữ ký điện tử"
      :visible.sync="dialogVisible"
    >
      <div class="dialog-header">
        <span class="label-info" style="margin-right: 10px">Họ và tên</span>
        <span class="content-info"> {{ userInfo.name || userInfo.username }}</span>
      </div>
      <div class="dialog-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Tải lên từ thiết bị" name="upload">
            <div class="tab-content">
              <el-upload
                class="upload-area"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="fileList"
                multiple>
                <div class="upload-content">
                  <b class="el-upload__text">Kéo thả trực tiếp từ thiết bị của bạn</b>
                  <div style="margin: 12px 0;"><span>Hoặc</span></div>
                  <el-button size="small" type="primary">Tải lên</el-button>
                </div>
              </el-upload>
              <div class="el-upload__tip" slot="tip" style="font-size: .8rem; padding: 5px 0">Định dạng hỗ trợ: JPG, PNG với kích thước tối đa: 200KB</div>
            </div>
            <el-row type="flex" justify="end">
              <el-button size="small" @click="dialogVisible = false">Hủy</el-button>
              <el-button size="small" type="primary">Thiết lập</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Vẽ tay" name="draw">
            <div class="draw-box">

            </div>
            <div class="el-upload__tip" style="font-size: .8rem; padding: 5px 0">Vùng vẽ "Chữ ký điện tử"</div>
            <el-row type="flex" justify="end">
              <el-button size="small" @click="dialogVisible = false">Hủy</el-button>
              <el-button size="small" type="primary">Thiết lập</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from '@/utils/config'
import {getUserInfo} from "@/utils/auth";

export default {
  name: 'ElectronicSignature',
  data() {
    return {
      dialogVisible:false,
      activeTab: 'upload',
      userInfo: getUserInfo()
    }
  },
  methods: {
    addSignature() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
  .page-e-sign {
    .card-sign {
      .el-card__body {
        padding: 15px;
      }
    }

    .row-sign {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dialog-header {
      background: #f1f3f5;
      padding: 8px 20px;
      margin-top: 10px;
    }

    .dialog-sign {
      .el-dialog__body {
        padding: 0;
      }
    }

    .dialog-content {
      padding: 10px 20px 20px;
    }

    .label-info {
      color: #6a7181;
      font-size: .9rem;
    }

    .content-info {
      font-weight: 600;
      font-size: .9rem;
    }

    .upload-area {
      .el-upload {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9fafc;
        }
      }
    }

    .draw-box {
      height: 180px;
      border: 1px dashed #e4e7ed;
      border-radius: 5px;
      background: #f9fafc;
    }
  }
</style>
