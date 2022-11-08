<!--
Cách sử dụng TlFieldsConfig
Tạo
<tl-fields-config
  :type="1"
  apifieldsconfig="/fieldsConfig"
  localfieldsconfig="THOA_UOC_FIELDS_CONFIG"
  @fields-config-event="callbackFromChild"
/>
type: kiểu quy định loại dữ liệu với api (ví dụ: 1 là fields của user, 2 là fields của văn bản A)
apifieldsconfig: api trả về danh sách fields đã save trên server
localfieldsconfig: Key của localstorage lưu trữ dữ liệu danh sách fields đã save trên client
@fields-config-event="callbackFromChild" Khi bật tắt các trường dữ liệu, event sẽ trả về hàm callbackFromChild của component cha
Ở callbackFromChild, nếu e.action === "FIELDS_CONFIG" thì xử lý ẩn hiện các trường dữ liệu tương ứng
-->
<template>
  <div class="tl-fields-config">
    <el-select
      v-model="selected"
      multiple
      filterable
      placeholder="Chọn trường dữ liệu"
      collapse-tags
    >
      <el-option
        v-for="item in fields"
        :key="item.id"
        :label="item.value"
        :value="item"
      />
    </el-select>
  </div>
</template>
<script>
import FieldsConfigAPI from "../../api/FieldsConfigAPI"
export default {
  name: "TlFieldsConfig",
  // eslint-disable-next-line vue/require-prop-types
  props: ["localfieldsconfig", "apifieldsconfig", "type"],
  data() {
    return {
      selected: [],
      fields: [
        { id: 1, value: "Tên" },
        { id: 2, value: "Mô tả" },
        { id: 3, value: "Trạng thái" },
        { id: 4, value: "Ngày khởi tạo" },
      ],
    }
  },
  watch: {
    selected() {
      localStorage.setItem(
        this.localfieldsconfig,
        JSON.stringify(this.selected)
      )
      this.$emit("fields-config-event", {
        action: "FIELDS_CONFIG",
        data: this.selected,
      })
    },
  },
  created() {
    this.init()
  },

  methods: {
    async init() {
      try {
        try {
          // Lấy tất cả fields từ api
          // gán vào danh sách fields
          const allFields = await FieldsConfigAPI.getAll()
          if (allFields && allFields.data) {
            this.fields = allFields.data
          } else {
            this.fields = undefined // Nếu không có thì gán = undefined
          }
        } catch (err) {
          console.error(err)
          this.fields = undefined // Nếu lỗi thì gán = undefined
        }

        // Lấy dữ liệu fields config đã save trên local
        // Nếu có thì gán vào các fields được select
        const configFromLocal = localStorage.getItem(this.localfieldsconfig)
        if (configFromLocal) {
          this.selected = JSON.parse(configFromLocal)
        } else {
          // Lấy dữ liệu các fields config đã save trên api
          // Nếu có thì gán vào các fields được select
          const fieldsConfig = await FieldsConfigAPI.get(this.apifieldsconfig)
          if (fieldsConfig && fieldsConfig.data) {
            this.selected = fieldsConfig.data
          }
        }
      } catch (err) {
        console.error(err)
        this.selected = undefined
      }
    },
  },
}
</script>
<style lang="scss">
.tl-fields-config {
  margin-bottom: 15px;
}
</style>
