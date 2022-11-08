<template>
  <div :class="[{ 'active': isActive }, 'menu-item-inbox']">
    <span class="icon-status" :style="{ background: iconColor }"></span>
    <span class="title">{{ title }}</span>
    <span class="count">{{ count }}</span>
  </div>
</template>

<script>
export default {
  name: 'InboxItem',
  props: {
    iconColor: String,
    title: String,
    isActive: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
.menu-item-inbox {
  position: relative;
  display: flex;
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  color: #303133;
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
  -webkit-transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  user-select: none;

  &:hover, &.active {
    background: #f3f4f6 !important;
  }

  .title {
    color: #6a7181;
    padding-left: 20px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .icon-status {
    vertical-align: middle;
    width: 8px !important;
    height: 8px !important;
    border-radius: 50%;
    position: absolute;
    left: 20px;
    margin-top: 25px;
  }

  .count {
    position: absolute;
    right: 10px;
    width: 16px !important;
    font-weight: 400 !important;
    color: #6a7181;
  }
}
</style>
