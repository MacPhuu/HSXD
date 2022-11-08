<!--
Cách sử dụng component TlDialog
Tạo
<tl-dialog
  ref='dialog'
  title='Tiêu đề của dialog'
  dialogid='dialog-user'
  @parrent-callback='callbackFromChild'>
    Bên trong là các slot element (Các component để hiển thị lên dialog)
</tl-dialog>
callbackFromChild là một method, được viết ở component cha
async callbackFromChild(e) {}
Khi bấm submit, tl-dialog sẽ gọi emit parrent-callback, tương ứng gọi hàm callbackFromChild ở component cha
với dữ liệu { action: this.dialogid + '-' + 'submit' } - trong trường hợp này là { action: 'dialog-user-submit' }
Ở hàm callbackFromChild, check nếu e.action === (this.dialogid + '-' + 'submit') thì xử lý tiếp
-->

<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :closeOnClickModal="false" :closeOnPressEscape="false">
    <slot/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="updateShowDialog(false)">Đóng</el-button>
      <el-button type="primary" @click="handleSubmit()"> Xác nhận </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "TlDialog",
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  watch: {
    dialogVisible() {
      this.visibleChange()
    },
  },
  methods: {
    // Khi submit form
    async handleSubmit() {
      await this.parrentCallBack('submit')

      // this.updateShowDialog(false)
    },

    // emit callback dữ liệu về cho parrent
    async parrentCallBack(action, data) {
      let ac = action
      if (this.dialogid) {
        ac = this.dialogid + "-" + action
      }

      this.$emit("parrent-callback", {
        action: ac,
        data,
      })
    },

    // Cập nhật trạng thái ẩn hiện dialog
    updateShowDialog(visibility) {
      this.dialogVisible = visibility
    },

    // Khi thay đổi trạng thái ẩn hiện thì truyền về cho parrent biết
    async visibleChange() {
      this.parrentCallBack("visibility", this.dialogVisible)
    },
  },
}
</script>
