<template>
  <div :class="[{ 'active': isActive }, 'menu-item-inbox']">
    <span class="icon-status1"><svg-icon style="margin-right: 5px !important; padding-bottom: 0px !important;" icon-class="ListCheck"></svg-icon></span>
    <span class="title1">{{ title }}</span>
    <span class="count1">
      <svg-icon style="margin: 0 !important; padding-bottom: 0px !important;" icon-class="VerticalMove"></svg-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'CategoryItem',
  props: {
    title: String,
    isActive: {
      type: Boolean,
      default: false
    },
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

    .title1 {
      color: #6a7181;
      padding-left: 0px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .count1 {
      position: absolute;
      right: 10px;
      width: 16px !important;
      font-weight: 400 !important;
      color: #6a7181;
      cursor: move;
    }
  }
</style>
