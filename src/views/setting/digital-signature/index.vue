<template>
  <div class="page-setting page-digital-signature">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <div class="page-setting-digital-signature digital-signature__title">
          <h4>Chữ ký số</h4>
        </div>
        <div>
          <el-card class="page-setting-digital-signature">
            <div class="el-card__body">
              <div class="digital-signature__status">
                <svg-icon
                  class-name="icon-phone"
                  icon-class="Phone"
                  style="color: black;font-size: 32px;margin: 12px;" />
                <div class="content">
                  <div class="content-title" style="margin-bottom: 5px">Kết nối Mobile Sign</div>
                  <div v-if="isConnected" style="color: blue">Đã kết nối</div>
                  <div v-else>Chưa kết nối</div>
                </div>
              </div>
              <span
                v-if="isShowInfoConnect"
                style="cursor: pointer"
                @click="handleHiddenInfoConnect"
                class="direction-arrow"
              >
            <i class="el-icon-arrow-down"/>
          </span>
              <span
                v-else
                style="cursor: pointer"
                @click="handleShowInfoConnect"
                class="direction-arrow"
              >
            <i class="el-icon-arrow-right" />
          </span>
            </div>
            <div v-if="isShowInfoConnect" class="digital-signature-content">
              <div v-if="isConnected" class="digital-signature-content__success">
                <hr>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Tên chứng thư</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.name }}</span>
                  </el-col>
                </el-row>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Số seri</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.seri }}</span>
                  </el-col>
                </el-row>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Thiết bị</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.nameDevice }}</span>
                  </el-col>
                </el-row>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">ID Thiết bị</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.idDevice }}</span>
                  </el-col>
                </el-row>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Ngày cấp</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.supplyDate }}</span>
                  </el-col>
                </el-row>
                <el-row class="info">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Ngày hết hạn</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.expirationDate }}</span>
                  </el-col>
                </el-row>
                <el-row class="info" style="margin-bottom: 32px">
                  <el-col :span="7" class="key-info">
                    <span class="label-info">Đơn vị cấp</span>
                  </el-col>
                  <el-col :span="17">
                    <span class="content-info">{{ license.supplyUnit }}</span>
                  </el-col>
                </el-row>
                <hr>
                <div class="disconnect" style="margin-top: 16px">
            <span
              style="cursor: pointer"
              @click="handleDisconnect"
            >
              <svg-icon class-name="broken-link" icon-class="Unlink"/>
              <span style="padding-left: 8px;">Ngắt kết nối</span>
            </span>
                </div>
              </div>
              <div v-else class="digital-signature-content__fail">
                <img src="" alt="Ảnh mã QR">
                <div>Vui lòng quét mã QR để kết nối</div>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card class="page-setting-digital-signature">
            <div class="el-card__body">
              <div class="digital-signature__status">
                <svg-icon class-name="icon-usb" icon-class="Usb" style="font-size: 38px;margin: 12px;" />
                <div class="content">
                  <div class="content-title">Danh sách Chứng thư số</div>
                  <div>02</div>
                </div>
              </div>
              <span
                v-if="isShowConnect"
                style="cursor: pointer"
                @click="handleHiddenConnect"
              >
              <i class="el-icon-arrow-down"/>
              </span>
              <span
                v-else
                style="cursor: pointer"
                @click="handleShowConnect"
              >
                <i class="el-icon-arrow-right" />
              </span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DigitalSignature',
  data() {
    return {
      isShowConnect: false,
      isShowInfoConnect: false,
      isConnected: true,
      license: {
        name: 'Trần Văn Khanh'
      }
    }
  },
  methods: {
    handleShowInfoConnect() {
      this.isShowInfoConnect = true
    },
    handleHiddenInfoConnect() {
      this.isShowInfoConnect = false
    },
    handleDisconnect() {
      this.isShowInfoConnect = false
      this.isConnected = false
    },
    handleHiddenConnect() {

    },
    handleShowConnect() {

    }
  }
}
</script>

<style scoped>
.digital-signature__title {
  color: #202020;
}
.page-digital-signature {

}
.page-setting-digital-signature {
  margin-top: 20px;
}
.digital-signature__status {
  display: flex;
  align-items: center;
}
.el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px;
}
.content {
  font-size: 12px;
  color: #909090;
}
.content-title {
  font-size: 16px;
  font-weight: 500;
  color: #202020;
}
.disconnect {
  color: #F00000;
  font-size: 14px;
}
.info {
  margin-top: 32px;
  font-size: 14px;
}
.key-info {
  color: #909090;
}
.digital-signature-content__fail {
  font-size: 14px;
  color: #909090;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
