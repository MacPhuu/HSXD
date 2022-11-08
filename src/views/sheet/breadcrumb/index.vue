git <template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(item, index) in levelList" :key="item.folderId"
    >
      <a v-if="index < levelList.length - 1" @click.prevent="handleClick(item, index)">{{ item.title }}</a>
      <b v-else>{{ item.title }}</b>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>

export default {
  name: 'BreadcrumbDocument',
  props: {
    levelList: Array,
    handleLink: Function
  },
  methods: {
    handleClick(item, index) {
      this.handleLink(item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
