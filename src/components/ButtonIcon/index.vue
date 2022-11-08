<template>
  <button class="button-icon" @click="handleClick">
    <span class="icon-system">
      <svg-icon :icon-class="icon" />
    </span>
    <slot class="button-text"></slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: {
    icon: String
  },
  data() {
    return {
      isActive: false
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
  font-size: 0.8rem;
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
    font-size: 1rem;
    vertical-align: middle;
  }
}
</style>
