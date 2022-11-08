<template>
  <el-dropdown trigger="click">
    <button class="el-dropdown-link button-icon">
      <span v-if="icon" class="icon-system" style="vertical-align: middle">
        <svg-icon :icon-class="icon" />
      </span>
      <slot></slot>
      <i v-if="showCaretDown" class="el-icon-arrow-down el-icon--right"></i>
    </button>
    <slot name="dropdown-menu"></slot>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ButtonDropdown',
  props: {
    icon: {
      type: String,
      default: ''
    },
    showCaretDown: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
}
</script>

<style lang="scss">
.button-icon {
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  background: none;
  font-weight: 500;
  padding: 10px 15px;
  height: 40px !important;
  color: #606266;

  &:focus, &:active {
    font-weight: 600;
    background: rgb(222,236,235);
  }

  .icon-system {
    margin-right: 4px;
    //font-size: 16px;
    vertical-align: middle;
  }
}
</style>
