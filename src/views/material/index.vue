<template>
  <div class="page-view">
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="40%"
      :modal="true"
      :modal-append-to-body="false"
    >
      <span slot="title" style="font-weight: 500;">Thông tin danh mục</span>
      <el-row class="current-folder">
        <el-form label-position="top" label-width="100px" :model="form">
          <el-form-item>
            <p style="font-weight: bold">Tiêu đề danh mục</p>
            <el-input v-model="form.title" placeholder="Nhập tiêu đề danh mục" />
          </el-form-item>
        </el-form>
      </el-row>
      <!--      <el-row class="current-folder">-->
      <!--        <p style="font-weight: bold">Chia sẻ</p>-->
      <!--        <el-row>-->
      <!--          <div>-->
      <!--            <span style="padding-left: 10px">Ai có thể truy cập vào mục này:</span>-->
      <!--            <el-select v-model="folderSharePermission" class="people-share-select" @change="onChangePermissionShare">-->
      <!--              <el-option-->
      <!--                v-for="sharePermission in sharePermissions"-->
      <!--                :key="'s' + sharePermission.value"-->
      <!--                style="border: none"-->
      <!--                :label="sharePermission.label"-->
      <!--                :value="sharePermission.value"-->
      <!--              />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--          <br>-->
      <!--        </el-row>-->
      <!--        <el-row :gutter="10" style="margin-bottom: 20px">-->
      <!--          <el-col style="margin-left: 5px; width: 100%" :span="20">-->
      <!--            <el-select v-model="memberList" class="select-custom" multiple filterable @change="onChangeMemberShare">-->
      <!--              <el-option-->
      <!--                v-for="user in members"-->
      <!--                :key="'u' + user._id"-->
      <!--                :label="user.name || user.email"-->
      <!--                :value="user._id"-->
      <!--                style="height: 64px; padding-top: 10px; padding-bottm: 10px;"-->
      <!--              >-->
      <!--                <div-->
      <!--                  class="member-container"-->
      <!--                  style="justify-content: center;float: left;display: flex;line-height: 1.5;align-items: center;"-->
      <!--                >-->
      <!--                  <div class="member-avatar" style="margin-right: 15px">-->
      <!--                    <svg-icon icon-class="Account3" style="font-size: 36px" />-->
      <!--                  </div>-->
      <!--                  <div class="member-info">-->
      <!--                    <div class="member-name">{{ user.name }}</div>-->
      <!--                    <div class="member-email">{{ user.email }}</div>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </el-option>-->
      <!--              <el-select-->
      <!--                slot="prefix"-->
      <!--                v-model="currentEditPermission"-->
      <!--                size="small"-->
      <!--                placeholder="Lựa chọn"-->
      <!--                class="select-role-user"-->
      <!--              >-->
      <!--                <el-option-->
      <!--                  v-for="editPermission in editPermissions"-->
      <!--                  :key="'p' + editPermission.value"-->
      <!--                  :label="editPermission.label"-->
      <!--                  :value="editPermission.value"-->
      <!--                />-->
      <!--              </el-select>-->
      <!--            </el-select>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--      </el-row>-->
      <!--      <div class="member-list">-->
      <!--        <div v-if="isOwner" class="member-row owner">-->
      <!--          <div>-->
      <!--            <div class="label-info">{{ ownerFolder.name }}</div>-->
      <!--            <div class="content-info">{{ ownerFolder.email }}</div>-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            <span>Chủ sở hữu</span>-->
      <!--          </div>-->
      <!--        </div>-->

      <!--        <div-->
      <!--          v-for="member in visitorList"-->
      <!--          :key="member._id"-->
      <!--          class="member-row member"-->
      <!--        >-->
      <!--          <div>-->
      <!--            <div class="label-info">{{ member.name }}</div>-->
      <!--            <div class="content-info">{{ member.email }}</div>-->
      <!--          </div>-->
      <!--          <div class="permission-info">-->
      <!--            <el-select-->
      <!--              slot="prefix"-->
      <!--              v-model="member.role"-->
      <!--              size="small"-->
      <!--              placeholder="Lựa chọn"-->
      <!--              class="select-role-user"-->
      <!--              style="right: -10px;"-->
      <!--              @change="handleConfirmChangePermission"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="editPermission in editPermissions"-->
      <!--                :key="'p' + editPermission.value"-->
      <!--                :label="editPermission.label"-->
      <!--                :value="editPermission.value"-->
      <!--              />-->
      <!--              <el-option label="Xóa thành viên" :value="3" @click.native="deleteMemberShare(member)" />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <el-row style="margin-top: 100px; display: flex; justify-content: flex-end ">
        <el-button @click="handleClose">Bỏ qua</el-button>
        <el-button type="primary" @click="handleConfirmCate">Xác nhận</el-button>
      </el-row>
    </el-dialog>
    <div class="header-action">
      <div v-if="isSetting">
        <button-icon icon="Close" @click="handleCancel">Hủy</button-icon>
        <button-icon icon="Check" @click="saveSetting">Lưu thay đổi</button-icon>
      </div>
      <div v-else >
        <button-icon icon="_Add" @click="addRow">Thêm mới</button-icon>
        <button-icon icon="Edit" @click="handleSetting">Thiết lập</button-icon>
        <button-icon v-if="categoryStatus==='0'" icon="Information2" @click="handleEditCategory">Thông tin danh mục</button-icon>
        <el-popconfirm
          v-if="categoryStatus==='0'"
          title="Bạn có chắc chắn xóa?"
          cancel-button-text="Hủy"
          confirm-button-text="Đồng ý"
          @confirm="handleDelCategory"
        >
          <button-icon slot="reference" icon="Trash2" class="category-trash">Xóa danh mục</button-icon>
        </el-popconfirm>
      </div>
    </div>
    <div class="page-content">
      <table-dynamic
        ref="dynamicTable"
        :category-id="categoryId"
        :is-setting="isSetting"
        :dialog-visible="dialogVisible"
        :form-type="formType"
        @closeDialog="closeDialog"
        @onSubmit="handleSubmit"
        @onEditRow="onEditRow"
        @onDeleteRow="onDeleteRow"
        @updateDetailId="updateDetailId"
        @updateDetailDefault="updateDetailDefault"
        @tableChange="handleChange"
      />
    </div>
  </div>
</template>

<script>
import TableDynamic from '@/components/TableDynamic'
import ButtonIcon from '@/components/ButtonIcon'
import CategoryAPIV2 from '@/api/categoryApiV2'

export default {
  components: { ButtonIcon, TableDynamic },
  data() {
    return {
      form: {
        title: '',
      },
      titleA1: '',
      isTitleRoot: false,
      isChanged: false,
      shareDialogVisible: false,
      isSetting: false,
      dialogVisible: false,
      formType: 'create',
      currentRow: {},
      categoryId: null,
      detailId: null,
      categoryStatus: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.categoryId = route.query.id
      },
      immediate: true
    }
  },
  methods: {
    handleChange(val) {
      this.isChanged = true
    },
    async handleDelCategory() {
      await CategoryAPIV2.delete(this.categoryId)
      const { data } = await CategoryAPIV2.get()
      this.$router.push(`/manage/category?id=${data[0]._id}`)
      this.$root.$emit('component1')
    },
    async handleEditCategory() {
      this.shareDialogVisible = true
      const data = await CategoryAPIV2.getByIdv2(this.categoryId)
      this.form.title = data.title
      this.titleA1 = data.title
    },
    async handleGetTitle() {
      const data = await CategoryAPIV2.getByIdv2(this.categoryId)
      this.titleA1 = data.title
    },
    handleClose(){
      this.shareDialogVisible = false
    },
    async handleConfirmCate() {
      const data = {
        ...this.form
      }
      await CategoryAPIV2.editCategory(this.categoryId , data)
      this.shareDialogVisible = false
      this.$root.$emit('component1')
      this.memberList = []
    },
    updateDetailDefault(status) {
      this.categoryStatus = JSON.stringify(status)
    },
    updateDetailId(id) {
      this.detailId = id
    },
    closeDialog() {
      this.dialogVisible = false
    },
    addRow() {
      this.dialogVisible = true
      this.formType = 'create'
    },
    handleSetting() {
      this.isSetting = true
    },
    async saveSetting() {
      await CategoryAPIV2.updateHeader(this.detailId, {
        header: this.$refs.dynamicTable.headerColumn
      })
      this.isSetting = false
      this.isChanged = false
      await this.$refs.dynamicTable.getData(this.categoryId, true)
    },
    handleCancel() {
      this.isSetting = false
      this.$refs.dynamicTable.getData(this.categoryId)
    },
    onEditRow(row) {
      this.currentRow = { ...row }
      this.formType = 'edit'
      this.dialogVisible = true
    },
    async onDeleteRow(row) {
      try {
        await CategoryAPIV2.deleteRecord(this.detailId, row.id)
        await this.$refs.dynamicTable.getData(this.categoryId)
      } catch (err) {
        console.log(err)
      }
    },
    async handleSubmit(data) {
      switch (this.formType) {
        case 'create':
          try {
            await CategoryAPIV2.addRecord(this.detailId, data)
            this.dialogVisible = false
            await this.$refs.dynamicTable.getData(this.categoryId)
          } catch (err) {
            console.log(err)
          }
          break
        case 'edit':
          try {
            await CategoryAPIV2.updateRecord(this.detailId, this.currentRow?.id, data)
            this.dialogVisible = false
            await this.$refs.dynamicTable.getData(this.categoryId)
          } catch (err) {
            console.log(err)
          }
          break
        default:
          break
      }
    },
  }
}
</script>

<style lang="scss">
.category-trash {
  color: red;
}
@media only screen and (min-width : 320px) and (max-width : 568px) {
  // .add{
  //   display: none;
  // }
  .page-content{
    overflow: scroll;
  }
  .header-action{
    padding-top: 40px;
  }
}
</style>
