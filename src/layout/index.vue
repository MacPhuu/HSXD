<template>
  <div :class="classObj" class="app-wrapper">
<!--    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />-->
    <sidebar id="sidebar" class="sidebar-container hideSidebar" />

    <div id="resizer" />
    <div class="main-container">

      <div :class="{'fixed-header':fixedHeader}">
      <template>
        <navbar />
      </template>
      </div>

      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        // openSidebar: this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'

        hideSidebar: false,
        openSidebar: true,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: false
      }
    }
  },
  mounted() {
    const resizer = document.querySelector("#resizer")
    const sidebar = document.querySelector("#sidebar")

    function resize(e) {
      const size = `${e.x}px`
      sidebar.style.flexBasis = size
    }

    resizer.addEventListener("mousedown", (event) => {
      document.addEventListener("mousemove", resize, false)
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", resize, false)
      }, false)
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .sidebar-container {
    position: relative !important;
    border: none !important;
    min-width: 65px !important;
  }

  .main-container {
    flex-basis: 0;
    flex-grow: 1;
    min-width: 50vw;
    margin-left: 0 !important;
  }

  #resizer {
    flex-basis: 12px;
    cursor: ew-resize;
    position: relative;
    z-index: 2;
    border-right: 1px solid #e4e7ed;
    background: #fff;
    height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    &:hover {
      border-right: 2px solid rgb(29,78,215);
    }
  }

  .app-wrapper {
    display: flex;
    height: 100vh;
  }

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 240px);
    //width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

   .hideSidebar.fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  @media only screen and (min-width : 320px) and (max-width : 568px) {
   .fixed-header {
    width: 100%;
    padding-left: 75px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: width 0.28s;
  }
  .hideSidebar{
    width: calc(100% - 54px)
  }

  }
</style>
