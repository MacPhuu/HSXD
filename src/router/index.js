import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import LayoutSetting from '@/layout/LayoutSetting'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/signup',
    component: () => import('@/views/login/signup'),
    hidden: true,
  },
  {
    path: '/forgot-password',
    component: () => import('@/views/forgot-pass'),
    hidden: true,
  },
  {
    path: '/verify-code',
    component: () => import('@/views/forgot-pass/verify-code'),
    hidden: true,
  },
  {
    path: '/reset-password',
    component: () => import('@/views/forgot-pass/reset-password'),
    hidden: true,
  },
  {
    path: '/setup-password',
    component: () => import('@/views/login/setup-password'),
    hidden: true,
  },
  {
    path: '/project',
    component: () => import('@/views/login/project'),
    hidden: true,
  },
  {
    path: '/bidding-project',
    component: () => import('@/views/login/bidding-project'),
    hidden: true,
  },
  {
    path: '/work-space',
    component: () => import('@/views/login/workspace'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/document-diagram',
    component: () => import('@/views/document-diagram/share'),
    hidden: true,
  },

  {
    path: '/table',
    component: () => import('@/views/table/index'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/document/files',
    children: [{
      path: 'dashboard',
      name: 'Trang chủ',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Trang chủ', icon: 'el-icon-s-home' },
      hidden: true
    }]
  },

  // {
  //   path: '/manage',
  //   component: Layout,
  //   meta: { title: 'Quản lý hệ thống', icon: 'el-icon-setting' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'Người dùng',
  //       component: () => import('@/views/system/user/index'),
  //       meta: { title: 'Người dùng', icon: 'el-icon-user-solid' }
  //     },
  //     {
  //       path: 'role-manage',
  //       name: 'Role',
  //       component: () => import('@/views/role-manage/index'),
  //       meta: { title: 'Phân quyền', icon: 'el-icon-s-check' },
  //       children: [
  //         {
  //           path: 'resource',
  //           name: 'Resource',
  //           component: () => import('@/views/role-manage/resource/index'),
  //           meta: { title: 'Tài nguyên', icon: 'el-icon-s-cooperation' }
  //         },
  //         {
  //           path: 'permission',
  //           name: 'Permission',
  //           component: () => import('@/views/role-manage/permission/index'),
  //           meta: { title: 'Quyền hạn', icon: 'el-icon-s-finance' }
  //         },
  //         {
  //           path: 'role',
  //           name: 'Role',
  //           component: () => import('@/views/role-manage/role/index'),
  //           meta: { title: 'Phân vai', icon: 'el-icon-s-custom' }
  //         },
  //         {
  //           path: 'group',
  //           name: 'Group',
  //           component: () => import('@/views/role-manage/group/index'),
  //           meta: { title: 'Nhóm quyền', icon: 'el-icon-s-custom' }
  //         }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: "/phases",
  //   children: [
  //     {
  //       path: 'phases',
  //       name: 'Quản lý công việc',
  //       meta: { title: 'Quản lý Công việc', icon: 'el-icon-menu' },
  //       component: () => import('@/views/phase/index'),
  //     },
  //     {
  //       path: 'phases/child/:id',
  //       name: 'Công việc',
  //       component: () => import('@/views/phase/child/index'),
  //       hidden: true
  //     }
  //   ]
  // },

  {
    path: '/document',
    component: Layout,
    children: [
      {
        path: 'files',
        name: 'Form',
        component: () => import('@/views/files/index'),
        meta: { title: 'Tài liệu của tôi', icon: 'Folder' },
        hidden: true
      },
      {
        path: 'files/child/:id',
        name: 'Thư mục',
        component: () => import('@/views/files/child/index'),
        hidden: true,
      },
      {
        path: 'file/:id',
        name: 'File chi tiết',
        component: () => import('@/views/files/detail/index'),
        hidden: true,
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    children: [
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/material/index'),
        meta: { title: 'Danh mục', icon: 'Folder' },
        hidden: true
      },
      {
        path: 'category/:id',
        name: 'Category Child',
        component: () => import('@/views/material/child/index'),
        hidden: true,
      },
      // {
      //   path: 'task',
      //   name: 'Công việc',
      //   component: () => import('@/views/task/index'),
      //   meta: { title: 'Quản lý công việc', icon: 'Folder' },
      //   hidden: true
      // },
      // {
      //   path: 'task/child/:id',
      //   name: 'Công việc con',
      //   component: () => import('@/views/task/child/index'),
      //   hidden: true,
      // },
      // {
      //   path: 'legalRecord',
      //   name: 'Hồ sơ pháp lý',
      //   component: () => import('@/views/legalRecord/index'),
      //   meta: { title: 'Hồ sơ pháp lý', icon: 'Folder' },
      //   hidden: true
      // },
      // {
      //   path: 'legalRecord/child/:id',
      //   name: 'Hồ sơ pháp lý con',
      //   component: () => import('@/views/legalRecord/child/index'),
      //   hidden: true,
      // },
    ]
  },

  {
    path: '/trash',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Trash',
        component: () => import('@/views/trash/index'),
        meta: { title: 'Đã xóa', icon: 'Trash' }
      }
    ]
  },

  {
    path: '/document',
    component: Layout,
    children: [
      {
        path: 'sign',
        name: 'Inbox',
        component: () => import('@/views/sign-document/index'),
        meta: { title: 'Ký tài liệu', icon: '_Signature' },
        hidden: true
      }
    ]
  },

  {
    path: '/inbox',
    component: Layout,
    children: [
      {
        path: 'file',
        name: 'Inbox',
        component: () => import('@/views/inbox/index'),
        hidden: true
      }
    ]
  },

  {
    path: '/sheet',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Sheet',
        component: () => import('@/views/sheet/index'),
        hidden: true
      }
    ]
  },

  {
    path: '/setting',
    component: LayoutSetting,
    children: [
      {
        path: 'electronic-signature',
        name: 'test',
        component: () => import('@/views/setting/electronic-signature/index'),
        hidden: true
      },
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/setting/member/index'),
        hidden: true
      },
      {
        path: 'security',
        name: 'Security',
        component: () => import('@/views/setting/security/index'),
        hidden: true
      },
      {
        path: 'digital-signature',
        name: 'Digital Signature',
        component: () => import('@/views/setting/digital-signature/index'),
        hidden: true
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/setting/account/index'),
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
