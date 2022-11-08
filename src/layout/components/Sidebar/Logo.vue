<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="sidebarLogoCollapse" :src="sidebarLogoCollapse" class="sidebar-logo">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <svg-icon icon-class="Logo_White" class="sidebarlogo" /> -->
        <img class="logo" src="@/assets/images/Logo_Brand.png" alt="">
      </router-link>
    </transition>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import logo from '@/assets/images/logo-sidebar.png'
import circleLogo from '@/assets/svg/circle_logo.svg'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaultSettings.title,
      sidebarLogoSrc: logo,
      sidebarLogoCollapse: circleLogo
    }
  }
}
</script>

<style lang="scss">
@import "src/element-variables";
.logo{
  width:109px;
  height:61px;
}
.sidebarlogo {
  width: 160px !important;
  height: 50px !important;
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.logo-label {
  text-align: center;
  margin: 10px 0;
}

.sidebar-logo-container {
  z-index: 999999;
  position: fixed;
  width: 120%;
  height: 50px;
  //line-height: 50px;
  background: #082f63;
  text-align: left;
  overflow: hidden;
  padding-left: 20px;

  &.collapse {
    text-align: center;
    padding-left: 0;
    height: 50px;

    a {
      .sidebar-logo {
        vertical-align: middle;
        margin-top: unset;
        height: 50px;
      }
    }
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 75%;
      height: auto;
      vertical-align: middle;
      object-fit: scale-down;
    }

    & .sidebar-title {
      margin: 0;
      color: #fff;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      position: relative;
      text-align: right;
      font-style: italic;
      font-weight: 400;
      font-size: 0.9rem;
      padding-right: 15px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
@media only screen and (min-width : 320px) and (max-width : 568px) {
    .logo{
      width:51px;
      height:44px;
    }
    .sidebar-logo-container {
  // z-index: 999999;
  position: fixed;
  width: 65px;
  height: 252px;
  //line-height: 50px;
  background: #082f63;
  text-align: left;
  overflow: hidden;
  padding-left: 20px;

  &.collapse {
    text-align: center;
    padding-left: 0;
    height: 50px;

    a {
      .sidebar-logo {
        vertical-align: middle;
        margin-top: unset;
        height: 50px;
      }
    }
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 50%;

    & .sidebar-logo {
      width: 75%;
      height: auto;
      vertical-align: middle;
      object-fit: scale-down;
    }

    & .sidebar-title {
      margin: 0;
      color: #fff;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      position: relative;
      text-align: right;
      font-style: italic;
      font-weight: 400;
      font-size: 0.9rem;
      padding-right: 15px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
    .sidebar-logo-container:hover{
      width: 200px;
    }
  }
</style>
