<template>
  <div :class="{'has-logo':showLogo}">
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="40%"
      :modal="true"
      :modal-append-to-body="false"
    >
      <span slot="title" style="font-weight: 500;">Thêm mới danh mục</span>
      <el-row class="current-folder">
        <el-form label-position="top" label-width="100px" :model="form">
          <el-form-item>
            <p style="font-weight: bold">Tiêu đề danh mục</p>
            <el-input v-model="form.title" placeholder="Nhập tiêu đề danh mục"/>
          </el-form-item>
        </el-form>
      </el-row>
      <!--      <el-row class="current-folder">-->
      <!--        <p style="font-weight: bold">Chia sẻ</p>-->
      <!--        <el-row>-->
      <!--          <div>-->
      <!--            <span style="padding-left: 10px">Ai có thể truy cập vào mục này:</span>-->
      <!--            <el-select v-model="folderSharePermission" class="people-share-select" @change="onChangePermissionShare">-->
      <!--              <el-option-->
      <!--                v-for="sharePermission in sharePermissions"-->
      <!--                :key="'s' + sharePermission.value"-->
      <!--                style="border: none"-->
      <!--                :label="sharePermission.label"-->
      <!--                :value="sharePermission.value"-->
      <!--              />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--          <br>-->
      <!--        </el-row>-->
      <!--        <el-row :gutter="10" style="margin-bottom: 20px">-->
      <!--          <el-col style="margin-left: 5px; width: 100%" :span="20">-->
      <!--            <el-select v-model="memberList" class="select-custom" multiple filterable @change="onChangeMemberShare">-->
      <!--              <el-option-->
      <!--                v-for="user in members"-->
      <!--                :key="'u' + user._id"-->
      <!--                :label="user.name || user.email"-->
      <!--                :value="user._id"-->
      <!--                style="height: 64px; padding-top: 10px; padding-bottm: 10px;"-->
      <!--              >-->
      <!--                <div-->
      <!--                  class="member-container"-->
      <!--                  style="justify-content: center;float: left;display: flex;line-height: 1.5;align-items: center;"-->
      <!--                >-->
      <!--                  <div class="member-avatar" style="margin-right: 15px">-->
      <!--                    <svg-icon icon-class="Account3" style="font-size: 36px" />-->
      <!--                  </div>-->
      <!--                  <div class="member-info">-->
      <!--                    <div class="member-name">{{ user.name }}</div>-->
      <!--                    <div class="member-email">{{ user.email }}</div>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </el-option>-->
      <!--              <el-select-->
      <!--                slot="prefix"-->
      <!--                v-model="currentEditPermission"-->
      <!--                size="small"-->
      <!--                placeholder="Lựa chọn"-->
      <!--                class="select-role-user"-->
      <!--              >-->
      <!--                <el-option-->
      <!--                  v-for="editPermission in editPermissions"-->
      <!--                  :key="'p' + editPermission.value"-->
      <!--                  :label="editPermission.label"-->
      <!--                  :value="editPermission.value"-->
      <!--                />-->
      <!--              </el-select>-->
      <!--            </el-select>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--      </el-row>-->
      <!--      <div class="member-list">-->
      <!--        <div v-if="isOwner" class="member-row owner">-->
      <!--          <div>-->
      <!--            <div class="label-info">{{ ownerFolder.name }}</div>-->
      <!--            <div class="content-info">{{ ownerFolder.email }}</div>-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            <span>Chủ sở hữu</span>-->
      <!--          </div>-->
      <!--        </div>-->

      <!--        <div-->
      <!--          v-for="member in visitorList"-->
      <!--          :key="member._id"-->
      <!--          class="member-row member"-->
      <!--        >-->
      <!--          <div>-->
      <!--            <div class="label-info">{{ member.name }}</div>-->
      <!--            <div class="content-info">{{ member.email }}</div>-->
      <!--          </div>-->
      <!--          <div class="permission-info">-->
      <!--            <el-select-->
      <!--              slot="prefix"-->
      <!--              v-model="member.role"-->
      <!--              size="small"-->
      <!--              placeholder="Lựa chọn"-->
      <!--              class="select-role-user"-->
      <!--              style="right: -10px;"-->
      <!--              @change="handleConfirmChangePermission"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="editPermission in editPermissions"-->
      <!--                :key="'p' + editPermission.value"-->
      <!--                :label="editPermission.label"-->
      <!--                :value="editPermission.value"-->
      <!--              />-->
      <!--              <el-option label="Xóa thành viên" :value="3" @click.native="deleteMemberShare(member)" />-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <el-row style="margin-top: 100px; display: flex; justify-content: flex-end ">
        <el-button @click="handleClose">Bỏ qua</el-button>
        <el-button type="primary" @click="handleConfirmCate">Xác nhận</el-button>
      </el-row>
    </el-dialog>
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar-scrollbar">
      <el-menu
        v-if="this.$route.name === 'Inbox'"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        unique-opened
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;">
          <b>INBOX</b>
        </div>
        <inbox-item
          v-for="(item, idx) in inboxMenu"
          :key="item.title + idx"
          :title="item.title"
          :icon-color="item.color"
          :count="countData[item.countKey] >=0 ? countData[item.countKey] : '...'"
          :is-active="item.isActive"
          @click.native="redirectInbox(item)"
        />
      </el-menu>
      <div
        v-else-if="this.$route.name === 'Form' || this.$route.name === 'Thư mục' || this.$route.name === 'File chi tiết' || this.$route.name === 'Trash'"
      >
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;"
             @click="$router.push('/document/files')"
        >
          <b>QUẢN LÝ TÀI LIỆU</b>
        </div>
        <el-tree
          ref="treeFolder"
          :data="treeFolder"
          :props="defaultProps"
          accordion
          highlight-current
          @current-change="onChangeNode"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <svg-icon icon-class="Folder" class-name="icon-folder"/>
            <span v-if="data.default" :title="node.label" class="node-label" style="font-weight: bold">{{
                node.label
              }}</span>
            <span v-else :title="node.label" class="node-label">{{ node.label }}</span>
          </span>
        </el-tree>
        <div class="underline-space"/>
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;" @click="handleDeleted">
          <b style="display: flex; align-items: center">
            <svg-icon class="icon-trash" icon-class="Trash"/>
            ĐÃ XÓA</b>
        </div>
      </div>
      <el-menu
        v-else
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        unique-opened
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;">
          <b>TÀI LIỆU LƯU TRỮ</b>
        </div>
        <div class="underline-space"/>
        <draggable
          class="draggable"
          :list="categoryMenu"
          style="max-height: calc(100vh - 180px)"
          @start="dragging = true"
          @end="handleEndDrag"
        >
          <category-item
            v-for="(item, idx) in categoryMenu"
            :key="item.title + idx"
            :title="item.title"
            :is-active="item.active"
            @click.native="handleCategory(item)"
          />
        </draggable>
        <div class="underline-space"/>
        <div class="menu-item-inbox title-menu-inbox" style="background-color: #fff !important;" @click="handleAddCate">
          <b>+ Tạo danh mục mới</b>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import InboxItem from '@/layout/components/Sidebar/InboxItem'
import config from '@/utils/config'
import InboxApi from "@/api/inboxApi"
import eventEmitter from "@/utils/eventEmitter"
import folderIcon from '@/icons/svg/Folder.svg'
import FolderAPI from '@/api/folder'
import CategoryItem from "@/layout/components/Sidebar/CategoryItem"
import ShareAPI from "@/api/shareApi"
import MemberAPI from "@/api/memberApi"
import CategoryAPIV2 from "@/api/categoryApiV2"
import draggable from "vuedraggable"
import TableDynamic from '@/components/TableDynamic'

export default {
  display: "Simple",
  order: 0,
  components: { CategoryItem, InboxItem, SidebarItem, Logo, draggable, TableDynamic },
  data() {
    return {
      form: {
        form: ''
      },
      visitorList: [],
      memberList: [],
      members: [],
      ownerFolder: {},
      isOwner: true,
      sharePermissions: [
        {
          value: 1,
          label: 'Một mình tôi'
        },
        {
          value: 2,
          label: 'Chỉ những người được thêm'
        },
        {
          value: 3,
          label: 'Bất kỳ ai có đường liên kết'
        }
      ],
      folderSharePermission: 3,
      currentEditPermission: 1,
      editPermissions: [
        {
          value: 1,
          label: 'Có thể xem'
        },
        {
          value: 2,
          label: 'Có thể chỉnh sửa'
        }
      ],
      shareDialogVisible: false,
      inboxMenu: [
        {
          title: 'Tất cả',
          status: config.fileStatus.TOTAL,
          color: 'rgb(7, 47, 98)',
          isActive: false,
          countKey: "total"
        },
        {
          title: 'Đang chờ',
          status: config.fileStatus.PENDING,
          color: 'rgb(31, 78, 218)',
          isActive: false,
          countKey: "pending"
        },
        {
          title: 'Hoàn thành',
          status: config.fileStatus.COMPLETE,
          color: 'rgb(5, 151, 106)',
          isActive: false,
          countKey: "completed"
        },
        {
          title: 'Từ chối',
          status: config.fileStatus.REJECT,
          color: 'rgb(214, 60, 60)',
          isActive: false,
          countKey: "reject"
        },
        {
          title: 'Thu hồi',
          status: config.fileStatus.RETRIEVAL,
          color: 'rgb(247, 158, 12)',
          isActive: false,
          countKey: "retrieval"
        }
      ],
      dragging: false,
      categoryMenu: [],
      countData: {},
      treeFolder: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'Inbox') {
          if (this.$route.query.status) {
            this.inboxMenu.forEach(i => {
              i.isActive = i.status === +this.$route.query.status
            })
          }
        } else if (route.name === 'Category' || route.name === 'Category Child') {
          if (this.$route.query.id) {
            this.categoryMenu.forEach(i => {
              if (i._id === this.$route.query.id) {
                i.active = true
              } else {
                i.active = false
              }
            })
          }
        } else {
          this.inboxMenu.forEach(i => {
            i.isActive = false
          })
          this.categoryMenu.forEach(i => {
            i.active = false
          })
        }
      },
      immediate: true
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters([
      'sidebar',
      'levelList'
    ]),
    routes() {
      return this.$router.options.routes
    },
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
    },
    draggingInfo() {
      return this.dragging ? "under drag" : ""
    }
  },
  created() {
    this.getTreeFolder()
  },
  mounted() {
    // if (localStorage.getItem('visited')) {
    //   const data = localStorage.getItem('visited')
    //   this.categoryMenu = JSON.parse(data)
    // }
    this.$root.$on('component1', () => {
      this.getCategory()
    })
    this.getCategory()
    this.getMembers()
    this.getDataInbox()

    eventEmitter.on("inboxChange", async() => {
      this.countData = await InboxApi.getCount()
    })
    eventEmitter.on('treeChange', () => {
      this.getTreeFolder()
    })
  },
  async updated() {
  },
  methods: {
    async getMembers() {
      try {
        const { data } = await MemberAPI.get({ perPage: 10000 })
        this.members = data?.map(member => {
          const { userId: { _id, name, username } } = member
          return {
            _id,
            name,
            email: username
          }
        })
        this.members = this.members.filter(mem => mem._id !== this.ownerFolder._id)
      } catch (err) {

      }
    },
    async deleteMemberShare(member) {
      const resBefore = {}
      const { sp: dataBefore, visitorsParent } = resBefore
      const { visitors } = dataBefore
      const visitorsSubmit = visitors.filter(visitor => visitor.userId._id !== member._id)
      try {
        this.loadingMemberShare = true
        await ShareAPI.updateAndDeleteRoleFolder(this.currentFile._id, visitorsSubmit, { type: dataBefore.type })
        this.loadingMemberShare = false

        const resAfter = await ShareAPI.getById(this.currentFile._id, { type: dataBefore.type })
        const { sp: dataAfter } = resAfter
        const { visitors } = dataAfter
        let visitorsShow = []
        if (visitors.length === 0) {
          const newParent = visitorsParent.map(user => {
            return {
              role: user.role,
              userId: user
            }
          })
          visitorsShow = newParent.filter(user => user.userId._id !== this.ownerFolder._id)
        } else {
          visitorsShow = visitors.filter(user => user.userId._id !== this.ownerFolder._id)
        }
        this.visitorList = visitorsShow.map(user => {
          return {
            ...user.userId,
            role: user.role,
            email: user.userId?.username
          }
        })
      } catch (err) {
        this.loadingMemberShare = false
      }
    },
    async onChangePermissionShare() {
      await ShareAPI.updatePermission(this.currentFile._id, { permission: this.folderSharePermission }, { type: 2 })
    },
    async handleConfirmChangePermission(value) {
      if (value === 3) {
        return
      }
      const visitors = this.visitorList.map(member => {
        return {
          userId: member._id,
          role: member.role
        }
      })

      try {
        this.loadingMemberShare = true
        switch (this.currentFile.metaType) {
          case this.metaType.FOLDER:
            await ShareAPI.updateAndDeleteRoleFolder(this.currentFile._id, visitors, { type: 2 })
            break
          case this.metaType.FILE:
            await ShareAPI.updateAndDeleteRoleFolder(this.currentFile._id, visitors, { type: 1 })
            break
        }
        this.loadingMemberShare = false
      } catch (err) {
        this.loadingMemberShare = false
      }
    },
    onChangeMemberShare(list) {
      this.visitorList.forEach(user => {
        if (list.includes(user._id)) {
          list.splice(list.indexOf(user._id), 1)
          this.$message.closeAll()
          this.$message.error('Thành viên đã được thêm quyền')
        }
      })
    },
    handleAddCate() {
      this.shareDialogVisible = true
      this.form = {
        title: ''
      }
    },
    handleClose() {
      this.memberList = []
      this.shareDialogVisible = false
    },
    async handleConfirmCate() {
      const data = {
        ...this.form
      }
      await CategoryAPIV2.save(data)
      this.shareDialogVisible = false
      await this.addCate()
      await this.getCategory()
      this.memberList = []
    },
    async addCate() {
      const { data } = await CategoryAPIV2.get()
      let details = {}
      details = await CategoryAPIV2.getById(data[data.length - 1]._id)
      this.$emit('updateDetailDefault', details.default)
      this.$router.push(`/manage/category?id=${data[data.length - 1]._id}`)
    },
    async getTreeFolder() {
      this.treeFolder = await FolderAPI.getTreeFolder()
    },
    goToDetail(nodeData, node) {
      const { _id, name, sideMap } = nodeData
      const path = `/document/files/child/${_id}?folderName=${name}&viewType=1`

      if (this.$route.params.id === _id) {
        return
      }

      const sideMapCustom = sideMap.map(i => {
        return {
          title: i.name,
          path: `/document/files/child/${i._id}?folderName=${i.name}&viewType=1`
        }
      })

      const levelList = [
        {
          title: 'Tài liệu của tôi',
          path: '/document/files',
        },
        ...sideMapCustom,
        {
          title: name,
          path: `/document/files/child/${_id}?folderName=${name}&viewType=1`
        }
      ]

      this.$store.dispatch('route/setBreadcrumb', levelList)

      if (path) {
        this.$router.push(path)
      }
    },
    onChangeNode(nodeData, node) {
      this.goToDetail(nodeData, node)
    },
    getDataInbox() {
      setTimeout(async() => {
        this.countData = await InboxApi.getCount()
      }, 2000)
    },
    redirectInbox(item) {
      this.inboxMenu.forEach(i => {
        i.isActive = item.status === i.status
      })
      this.$router.push(`/inbox/file?status=${item.status}`)
    },
    handleCategory(item) {
      this.categoryMenu.forEach(i => {
        if (item._id === i._id) {
          i.active = true
        } else {
          i.active = false
        }
      })
      this.$router.push(`/manage/category?id=${item._id}`)
    },
    async getCategory() {
      const { data } = await CategoryAPIV2.get()
      let dataLocal
      if (localStorage.getItem('visited')) {
        dataLocal = JSON.parse(localStorage.getItem('visited'))
      }

      if ( dataLocal && dataLocal.length > 0) {
        let da = []
        dataLocal.forEach(obj => {
          const a = data.filter(i => i._id.toString() === obj._id.toString())
          if (a && a.length > 0) {
            da.push(a[0])
          }
        })
        const da1 = []
        data.forEach(obj => {
          const a = da.filter(i => i._id.toString() === obj._id.toString())
          if (a && a.length === 0) {
            da1.push(obj)
          }
        })
        da = [...da, ...da1]

        this.categoryMenu = da.map(item => {
          return {
            ...item,
            active: item._id === this.$route.query.id
          }
        })
      } else {
        this.categoryMenu = data.map(item => {
          return {
            ...item,
            active: item._id === this.$route.query.id
          }
        })
      }

    },
    handleEndDrag() {
      this.dragging = false
      const dataStorage = JSON.stringify(this.categoryMenu)
      localStorage.setItem('visited', dataStorage)
    },
    handleDeleted() {
      this.$router.push('/trash/index')
    }
  }
}
</script>

<style lang="scss">
.title-menu-inbox {
  height: 28px !important;
  line-height: 28px !important;
  margin-top: 15px;
  margin-bottom: 5px;
  user-select: none;

  &.is-active {
    background: #fff !important;
  }

  b {
    color: #082f63;
  }

  &:hover {
    background: #fff !important;
  }
}

.el-tree-node {

}

.el-tree-node__label {

}

.el-tree-node__content {
  height: 50px;
  line-height: 50px;
}

.icon-folder {
  margin-right: 5px !important;
}

.node-label {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 70%;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
  user-select: none;
}

.people-share-select {
  width: 240px !important;

  input {
    border: none;
  }
}

.select-custom {
  .el-input {
    input {
      padding-left: 10px;
    }

    .el-input__prefix {
      //left: 80%;
      display: block;
      width: 100%;
      text-align: right;
      padding-right: 10px;
      background: transparent;
    }

    .el-input__suffix {
      display: none;
    }
  }
}

.select-role-user {
  width: 150px;
  z-index: 2;
  top: 5px;
  right: 10px;

  .el-input {
    padding-left: 0px;

    input {
      border: none;
      //padding-left: 10px;
      text-align: right;
    }

    .el-input__suffix {
      display: block !important;

      .el-icon-arrow-up {
        color: black;
      }
    }
  }
}

.underline-space {
  border-width: thin !important;
  width: 100%;
  border-color: #e4e7ed;
  border-style: solid;
  border-bottom: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}

.sidebar-btn:hover {
  background-color: white
}

.button-navbar {
  color: white;
  opacity: 0.2;
  margin: 0;
  padding: 0;
  display: inline-block;
  height: 50px;
  line-height: 50px;
}

.draggable {
  overflow: auto;
}
.icon-trash{
  margin-left : 10px !important;
  padding: 1px !important;
  font-size: 17px !important;
}
@media only screen and (min-width : 320px) and (max-width : 568px) {
  .icon-folder{
    display: none;
  }
  .sidebar-scrollbar{
      top:150px
    }
}

</style>
