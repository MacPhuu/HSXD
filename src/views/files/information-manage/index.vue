<template>
  <div class="information-manage-form">
    <el-button @click="handleVisible">Hiển thị</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <span slot="title">Quản lý thông tin</span>
      <el-row>
        <span class="title">Tài liệu</span>
        <span>{{ fileName }}</span>
        <hr class="hr">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      fileName: ''
    }
  },
  methods: {
    handleVisible() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.information-manage-form {
  .el-dialog {
    border-radius: 12px;
    .el-dialog__header {
      font-weight: bold;
      padding-top: 28px;
    }
  }
}
</style>
