<template>
  <div class="search-container">
    <el-select
      v-if="searchQuery === '#' || searchQuery.toLowerCase() === 'tag'"
      ref="selectTagInput"
      v-model="searchTagQuery"
      class="select-tag-input"
      size="small"
      clearable
      filterable
      no-match-text=" "
      @input="onInputSearchTag"
    >
      <span slot="prefix">
        <el-icon name="search" />
        Tag:
      </span>
      <el-option-group label="Tags">
        <el-option
          v-for="(tag, idx) in tags"
          :key="'tag-select' + tag._id"
          :label="tag.name"
          :value="tag._id"
        >
          <el-tag size="small" type="info">{{ tag.name }}</el-tag>
        </el-option>
      </el-option-group>
    </el-select>
    <el-input
      v-else
      v-model="searchQuery"
      prefix-icon="el-icon-search"
      clearable
      placeholder="Nhập từ khóa cần tìm kiếm"
      @input="onInputSearch"
    />
  </div>
</template>

<script>
export default {
  name: "Search"
}
</script>

<style scoped>

</style>
