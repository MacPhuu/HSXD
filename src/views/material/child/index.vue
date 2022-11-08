<template>
  <div class="page-view">
    <div class="header-action">
      <div v-if="isSetting">
        <button-icon icon="Close" @click="handleCancel">Hủy</button-icon>
        <button-icon v-if="isChanged" icon="Check" @click="saveSetting">Lưu thay đổi</button-icon>
      </div>
      <div v-else>
        <button-icon icon="_Add" @click="addRow">Thêm mới</button-icon>
        <button-icon icon="Edit" @click="handleSetting">Thiết lập</button-icon>
      </div>
    </div>
    <div class="page-content">
      <table-dynamic
        ref="dynamicTable"
        is-child
        :category-id="categoryId"
        :is-setting="isSetting"
        :dialog-visible="dialogVisible"
        :form-type="formType"
        @closeDialog="closeDialog"
        @onSubmit="handleSubmit"
        @onEditRow="onEditRow"
        @onDeleteRow="onDeleteRow"
        @updateDetailId="updateDetailId"
        @tableChange="isChanged=true"
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
      isChanged: false,
      isSetting: false,
      dialogVisible: false,
      formType: 'create',
      currentRow: {},
      categoryId: null,
      detailId: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.categoryId = route.params.id
      },
      immediate: true
    },
  },
  methods: {
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
      await this.$refs.dynamicTable.getData(this.categoryId)
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
    }
  }
}
</script>

<style lang="scss">
@media only screen and (min-width : 320px) and (max-width : 568px) {
  .page-content{
    overflow: scroll;
  }
}
</style>
