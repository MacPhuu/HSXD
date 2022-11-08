<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <template v-if="levelList.length < 100">
      <el-breadcrumb-item
        v-for="(item, index) in levelList"
        :key="item.path">
        <span v-if="index < levelList.length - 1">
          <a :to="{ path: item.path }" @click.prevent="handleLink(item, index)">
            {{ item.title }}
            <el-popover
              v-if="item.tags && item.tags.length > 1"
              placement="right"
              trigger="hover">
              <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
              <div v-for="tag in item.tags" :key="tag._id">
                <el-tag type="info" size="small" style="margin-bottom: 5px; height: 28px">
                  {{ tag.name }}
                </el-tag>
              </div>
              <span slot="reference">
                <el-tag
                  v-if="index !== 0 && item.tags && item.tags.length "
                  size="mini"
                  type="info"
                  style="margin-left: 5px; height: 25px"
                >
                  {{ item.tags[0] ? item.tags[0].name : "" }}
                </el-tag>
                <span v-if="item.tags.length > 1" class="quanity-tag">+{{ item.tags.length - 1 }} </span>
              </span>
            </el-popover>
            <el-tag
              v-else-if="index !== 0 && item.tags && item.tags.length === 1"
              size="mini"
              type="info"
              style="margin-left: 5px; height: 25px"
            >
              {{ item.tags[0] ? item.tags[0].name : "" }}
            </el-tag>
          </a>
        </span>
        <span v-else>
          {{ item.title }}
          <el-popover v-if="item.tags && item.tags.length > 1" placement="right" trigger="hover">
            <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
            <div v-for="tag in item.tags" :key="tag._id">
              <el-tag type="info" size="small" style="margin-bottom: 5px; height: 28px">
                {{ tag.name }}
              </el-tag>
            </div>
            <span slot="reference">
              <el-tag
                v-if="index !== 0 && item.tags && item.tags.length "
                size="mini"
                type="info"
                style="margin-left: 5px; height: 25px"
              >
                {{ item.tags[0] ? item.tags[0].name : "" }}
              </el-tag>
              <span v-if="item.tags.length > 1" class="quanity-tag">+{{ item.tags.length - 1 }} </span>
            </span>
          </el-popover>
          <el-tag
            v-else-if="index !== 0 && item.tags && item.tags.length === 1"
            size="mini"
            type="info"
            style="margin-left: 5px; height: 25px"
          >
            {{ item.tags[0] ? item.tags[0].name : "" }}
          </el-tag>
        </span>
      </el-breadcrumb-item>
    </template>

    <template v-else>
      <el-breadcrumb-item>
        <span>
          <a :to="{ path: firstItem.path }" @click.prevent="handleLink(firstItem, 0)">
            {{ firstItem.title }}
            <el-popover
              v-if="firstItem.tags && firstItem.tags.length > 1"
              placement="right"
              trigger="hover">
              <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
              <div v-for="tag in firstItem.tags" :key="tag._id">
                <el-tag type="info" size="small" style="margin-bottom: 5px; height: 28px">
                  {{ tag.name }}
                </el-tag>
              </div>
              <span slot="reference">
                <el-tag
                  v-if="firstItem.tags && firstItem.tags.length "
                  size="mini"
                  type="info"
                  style="margin-left: 5px; height: 25px"
                >
                  {{ firstItem.tags[0] ? firstItem.tags[0].name : "" }}
                </el-tag>
                <span v-if="firstItem.tags.length > 1" class="quanity-tag">+{{ firstItem.tags.length - 1 }} </span>
              </span>
            </el-popover>
            <el-tag
              v-else-if="firstItem.tags && firstItem.tags.length === 1"
              size="mini"
              type="info"
              style="margin-left: 5px; height: 25px"
            >
              {{ firstItem.tags[0] ? firstItem.tags[0].name : "" }}
            </el-tag>
          </a>
        </span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-dropdown trigger="click">
          <svg-icon class="button-show-more" icon-class="ThreedotVertical" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(row, idx) in levelListShowMore"
              :key="row.path"
              @click.native="handleLink(row, idx + 1)"
            >
              <svg-icon icon-class="Folder" style="width: 16px; height: 16px; vertical-align: middle" />
              {{ row.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a :to="{ path: firstItem.path }" @click.prevent="handleLink(nearLastItem, levelList.length - 2)">
          {{ nearLastItem.title }}
          <el-popover v-if="nearLastItem.tags && nearLastItem.tags.length > 1" placement="right" trigger="hover">
            <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
            <div v-for="tag in nearLastItem.tags" :key="tag._id">
              <el-tag type="info" size="small" style="margin-bottom: 5px; height: 28px">
                {{ tag.name }}
              </el-tag>
            </div>
            <span slot="reference">
              <el-tag
                v-if="nearLastItem.tags && nearLastItem.tags.length "
                size="mini"
                type="info"
                style="margin-left: 5px; height: 25px"
              >
                {{ nearLastItem.tags[0] ? nearLastItem.tags[0].name : "" }}
              </el-tag>
              <span v-if="nearLastItem.tags.length > 1" class="quanity-tag">+{{ nearLastItem.tags.length - 1 }} </span>
            </span>
          </el-popover>
          <el-tag
            v-else-if="nearLastItem.tags && nearLastItem.tags.length === 1"
            size="mini"
            type="info"
            style="margin-left: 5px; height: 28px"
          >
            {{ nearLastItem.tags[0] ? nearLastItem.tags[0].name : "" }}
          </el-tag>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span>
          {{ lastItem.title }}
          <el-popover v-if="lastItem.tags && lastItem.tags.length > 1" placement="right" trigger="hover">
            <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
            <div v-for="tag in lastItem.tags" :key="tag._id">
              <el-tag type="info" size="small" style="margin-bottom: 5px; height: 28px">
                {{ tag.name }}
              </el-tag>
            </div>
            <span slot="reference">
              <el-tag
                v-if="lastItem.tags && lastItem.tags.length "
                size="mini"
                type="info"
                style="margin-left: 5px; height: 25px"
              >
                {{ lastItem.tags[0] ? lastItem.tags[0].name : "" }}
              </el-tag>
              <span v-if="lastItem.tags.length > 1" class="quanity-tag">+{{ lastItem.tags.length - 1 }} </span>
            </span>
          </el-popover>
          <el-tag
            v-else-if="lastItem.tags && lastItem.tags.length === 1"
            size="mini"
            type="info"
            style="margin-left: 5px; height: 28px"
          >
            {{ lastItem.tags[0] ? lastItem.tags[0].name : "" }}
          </el-tag>
        </span>
      </el-breadcrumb-item>
    </template>

  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BreadcrumbBox',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'levelList'
    ]),
    firstItem() {
      return this.levelList[0]
    },
    lastItem() {
      return this.levelList[this.levelList.length - 1]
    },
    nearLastItem() {
      return this.levelList[this.levelList.length - 2]
    },
    levelListShowMore() {
      return this.levelList.slice(1, this.levelList.length - 2)
    }
  },
  methods: {
    handleLink(item, index) {
      const { path } = item
      if (path) {
        this.$router.push(path)
        const levelList = this.levelList.slice(0, index + 1)
        this.$store.dispatch('route/setBreadcrumb', levelList)
      }
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

.button-show-more {
  width: 32px;
  height: 32px;
  padding: 2px;
  border-radius: 50%;
  font-weight: bold;
  margin: 0 10px;
  vertical-align: middle;

  &:hover, &:active, &:focus {
    background: #f3f4f6;
    cursor: pointer;
  }
}
</style>
