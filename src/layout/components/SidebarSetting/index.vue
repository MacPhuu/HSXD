<template>
  <div :class="[{'has-logo':showLogo}, 'menu-setting']">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        unique-opened
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;">
          <b>Cài đặt</b>
        </div>
        <div
          v-for="route in routes"
          :key="route.title"
          :class="[{ 'active': route.isActive }, 'menu-item-setting']"
          @click="handleSelectRoute(route)"
        >
          <span class="icon-menu-item"><svg-icon :icon-class="route.icon" /></span>
          <span class="title" style="padding-left: 0">{{ route.title }}</span>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './../Sidebar/Logo'
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'

export default {
  name: 'SidebarSetting',
  components: { Logo },
  data() {
    return {
      routes: [
        {
          title: 'Tài khoản',
          icon: 'Account3',
          isActive: false,
          path: '/setting/account'
        },
        {
          title: 'Thành viên',
          icon: 'Team',
          isActive: false,
          path: '/setting/member'
        },
        {
          title: 'Chữ ký điện tử',
          icon: 'Image',
          isActive: false,
          path: '/setting/electronic-signature'
        },
        {
          title: 'Chữ ký số',
          icon: '_Signature',
          isActive: false,
          path: '/setting/digital-signature'
        },
        {
          title: 'Bảo mật',
          icon: 'Lock',
          isActive: false,
          path: '/setting/security'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      // return !this.sidebar.opened
      return false
    }
  },
  watch: {
    $route(route) {
      this.routes.forEach(i => {
        i.isActive = route.fullPath === i.path
      })
    }
  },
  mounted() {
    this.routes.forEach(route => {
      if (route.path === this.$route.path) {
        route.isActive = true
      }
    })
  },
  methods: {
    handleSelectRoute(route) {
      route.isActive = true
      this.$router.push(route.path)
    }
  }
}
</script>

<style lang="scss">
  .menu-setting {
   .icon-menu-item {
     display: flex !important;
     align-items: center !important;
     justify-content: center !important;
   }

    .menu-item-setting {
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

      &:hover, &.active {
        background: #f3f4f6 !important;
      }

      .title {
        color: #6a7181;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        font-weight: 600;
        font-size: 0.9rem;
      }
    }
  }
  @media only screen and (min-width : 320px) and (max-width : 568px) {
    .sidebar-scrollbar{
      top:150px
    }
   }
</style>
