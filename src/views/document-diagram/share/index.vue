<template>
<div class="share-page">
  <el-button type="text" @click="handleShare">
    <span class="svg-container">
      <svg-icon icon-class="Add" />
      Chia sẻ
    </span>
  </el-button>

  <el-dialog
    :visible.sync="shareDialogVisible"
    width="60%"
  >
    <span slot="title" style="font-weight: 500;">Chia sẻ thư mục</span>
    <el-row class="current-folder">
      <el-col :span="24">
        <div style="display: flex;justify-content: start;align-items: center;">
          <div class="svg-folder-container" style="padding: 0 10px;font-size: 30px;">
            <svg-icon icon-class="FolderItem"></svg-icon>
          </div>
          <div class="folder-content">
            <div class="folder-name">{{ folder.folderName }}</div>
            <span>{{ folder.folderSize }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="current-folder">
      <el-row>Chia sẻ</el-row>
      <el-row>
        <el-col :span="7">Ai có thể truy cập vào mục này:</el-col>
        <el-col :span="6">
          <el-select class="share-people" v-model="roleFolder.folderSharePermission">
            <el-option
              v-for="sharePermission in sharePermissions"
              :key="'s' + sharePermission.value"
              :label="sharePermission.label"
              :value="sharePermission.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-select v-model="roleFolder.email" class="select-custom">
            <el-option
              v-for="user in members"
              :key="'u' + user.email"
              :label="user.email"
              :value="user.email"
            >
            </el-option>
            <el-select
              v-model="roleFolder.folderEditPermission"
              size="small"
              slot="prefix"
              placeholder="Lựa chọn"
              class="select-role-user"
            >
              <el-option
                v-for="editPermission in editPermissions"
                :key="'p' + editPermission.value"
                :label="editPermission.label"
                :value="editPermission.value"
              />
            </el-select>
          </el-select>
        </el-col>
        <el-col :span="4">
          <div v-if="isShared">
            <el-button type="primary">Xác nhận</el-button>
          </div>
          <div v-else>
            <el-button type="info">Xác nhận</el-button>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <svg-icon icon-class="Link"></svg-icon>
      <span>Sao chép đường liên kết</span>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      folder: {
        email: 'chrishoang@cavn.vn',
        folderName: 'Thư mục tự do',
        folderSize: '115MB',
        folderSharePermission: '1',
        folderEditPermission: '1'
      },
      editPermissions: [
        {
          value: '1',
          label: 'Có thể xem'
        },
        {
          value: '2',
          label: 'Có thể chỉnh sửa'
        }
      ],
      sharePermissions: [
        {
          value: '1',
          label: 'Một mình tôi'
        },
        {
          value: '2',
          label: 'Chỉ những người được thêm'
        },
        {
          value: '3',
          label: 'Bất kỳ ai có đường liên kết'
        }
      ],
      isShared: false,
      shareDialogVisible: false,
      members: [
        {
          index: '1',
          name: 'Chris Hoang',
          email: 'chrishoang@cavn.vn',
          avatar: '',
          isCreated: true,
          editPermission: 'Có thể chỉnh sửa'
        },
        {
          index: '2',
          name: 'Chris Hoang',
          email: 'chrishoang2@cavn.vn',
          avatar: '',
          isCreated: false,
          editPermission: 'Có thể xem'
        },
        {
          index: '3',
          name: 'Chris Hoang',
          email: 'chrishoang3@cavn.vn',
          avatar: '',
          isCreated: false,
          editPermission: 'Có thể chỉnh sửa'
        }
      ]
    }
  },
  methods: {
    handleShare() {
      this.shareDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
$bg:#f3f4f6;
$dark_gray:#889aa4;
$light_gray:#eee;

.share-page {
  .select-custom {
    .el-input {
      input {
        padding-left: 10px;
      }
      .el-input__prefix {
        //left: 75%;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }
  .select-role-user {
    width: 150px;
    .el-input {
      padding-left: 0px;
      input {
        border: none;
        //padding-left: 10px;
        //text-align: right;
      }
      .el-input__suffix {
        display: block !important;
      }
    }
  }
  .share-people {
    //width: 150px;
    .el-input {
      padding-left: 0px;
      input {
        border: none;
        //padding-left: 10px;
        //text-align: right;
      }
      .el-input__suffix {
        display: block !important;
      }
    }
  }
  .svg-container {
    padding: 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .current-folder {
    padding: 0 0 12px 0;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__body {
    padding: 12px 10px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #ebeef5 !important;
  }
}

</style>
