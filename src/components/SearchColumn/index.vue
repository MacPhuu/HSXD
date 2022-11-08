<template>
  <el-table-column
    sortable
    :label="label"
    :prop="prop"
    :min-width="minWidth"
    :width="width"
    :align="align"
    :header-align="headerAlign"
    :fixed="fixed ? fixed : null"
  >
    <template slot="header" slot-scope="scope">
      <span style="display: inline-block; margin-bottom: 5px">{{ label }}</span>

      <span v-if="!hidden">
        <span v-if="type === 'config'" @click="$event.stopPropagation()">
          <el-select v-model="searchStr" size="mini" filterable clearable @change="onChange">
            <el-option
              v-for="(item) in Object.entries(configObj[propConfig])"
              :key="item[0]"
              :label="item[1]"
              :value="+item[0]"
            />
          </el-select>
        </span>

        <span v-else-if="type === 'tag'" @click="$event.stopPropagation()">
          <el-select v-model="searchStr" size="mini" filterable clearable @change="onChange">
            <el-option
              v-for="(item) in Object.entries(configObj[propSearchConfig])"
              :key="item[0]"
              :label="item[1]"
              :value="+item[0]"
            />
          </el-select>
        </span>

        <span v-else-if="type === 'number'" @click="$event.stopPropagation()">
          <el-select v-model="searchStr" size="mini" filterable clearable @change="onChange">
            <el-option
              v-for="(item) in Object.entries(configObj.numberMap)"
              :key="item[0]"
              :label="item[1]"
              :value="+item[0]"
            />
          </el-select>
        </span>

        <span v-else-if="type === 'arrayObject'" @click="$event.stopPropagation()">
          <el-select v-model="searchStr" multiple size="mini" :loading="loading" loading-text="Đang tải..." filterable collapse-tags clearable @focus="getDataSearch" @change="onFilter">
            <el-option
              v-for="(item, idx) in arrObjSearchList"
              :key="item._id || `search-item-${idx}`"
              :label="item.name"
              :value="dotObj(item, propSearch)"
            />
          </el-select>
        </span>

        <span v-else @click="$event.stopPropagation()">
          <el-input
            v-model="searchStr"
            size="mini"
            placeholder="Nhập để tìm kiếm"
            suffix-icon="el-icon-search"
            :disabled="disabledSearch"
            @input="onChange"
          />
        </span>
      </span>
    </template>
    <template slot-scope="scope">
      <span v-if="isChildren && parentProp">
        <span v-if="type && type === 'object'">{{ scope.row[parentProp][prop] ? (scope.row[parentProp][prop].ten ? scope.row[parentProp][prop].ten : (scope.row[parentProp][prop].tenLoai || scope.row[parentProp][prop][[searchField]] || scope.row[parentProp][prop].username) ) : '' }}</span>
        <span v-else-if="type && type === 'date'">{{ formatTime(scope.row[parentProp][prop], 'DD/MM/YYYY') }}</span>
        <span v-else-if="type && type === 'datetime'">{{ formatTime(scope.row[parentProp][prop], 'DD/MM/YYYY HH:mm:ss') }}</span>
        <span v-else-if="type && type === 'config'">{{ configObj[propConfig][scope.row[parentProp][prop]] }}</span>
        <span v-else-if="type && type === 'slot'">
          <slot name="custom" :scope="scope" />
        </span>
        <span v-else-if="type && type === 'slot2'">
          <slot name="custom2" :scope="scope" />
        </span>
        <span v-else-if="type && type === 'tag'">
          <el-tag :type="configObj[propConfig][scope.row[parentProp][prop]].type" effect="plain">
            {{ configObj[propConfig][scope.row[parentProp][prop]].label }}
          </el-tag>
        </span>
        <span v-else-if="type && type === 'number'">{{ scope.row[parentProp][prop] === 1 ? 'Có' : 'Không' }}</span>
        <span v-else-if="type && type === 'highlight'"><b>{{ scope.row[parentProp][prop] }}</b></span>
        <span v-else>{{ dotObj(scope.row, `${parentProp}.${prop}`) }}</span>
      </span>

      <span v-else>
        <span v-if="type && type === 'stt'">{{ scope.$index + 1 }}</span>
        <span v-else-if="type && type === 'object'">{{ scope.row[prop] ? scope.row[prop][childrenField] : '' }}</span>
        <span v-else-if="type && type === 'date'">{{ formatTime(scope.row[prop], 'DD/MM/YYYY') }}</span>
        <span v-else-if="type && type === 'datetime'">{{ formatTime(scope.row[prop], 'DD/MM/YYYY HH:mm:ss') }}</span>
        <span v-else-if="type && type === 'config'">{{ configObj[propConfig][scope.row[prop]] }}</span>
        <span v-else-if="type && type === 'slot'">
          <slot name="custom" :scope="scope" />
        </span>
        <span v-else-if="type && type === 'slot2'">
          <slot name="custom2" :scope="scope" />
        </span>
        <span v-else-if="type && type === 'tag'">
          <el-tag :type="configObj[propConfig][scope.row[prop]].type" effect="plain">
            {{ configObj[propConfig][scope.row[prop]].label }}
          </el-tag>
        </span>
        <span v-else-if="type && type === 'number'">{{ scope.row[prop] === 1 ? 'Có' : 'Không' }}</span>
        <span v-else-if="type && type === 'highlight'"><b>{{ scope.row[prop] }}</b></span>
        <span v-else-if="type && type === 'image'">
          <span style="display: block; text-align: center">
            <img :src="dotObj(scope.row, prop)" :style="styleObj" />
          </span>
        </span>
        <span v-else-if="type && type === 'array'">
          <el-tag
            v-for="item in dotObj(scope.row, prop)"
            :key="item"
          >
            {{ item }}
          </el-tag>
        </span>
        <span v-else-if="type && type === 'arrayObject'">
          <el-tag
            v-for="(item, idx) in scope.row[prop]"
            :key="'tag-obj-'+idx"
            class="tag-arr"
            effect="plain"
            :title="dotObj(item, propChildren)"
          >
            <el-icon v-if="icon" :name="icon" />
            {{ dotObj(item, propChildren) }}
          </el-tag>
        </span>
        <span v-else>
          <b v-if="isBold">{{ dotObj(scope.row, prop) }}</b>
          <span v-else>{{ dotObj(scope.row, prop) }}</span>
        </span>
      </span>
    </template>
  </el-table-column>
</template>

<script>
import { parseTime } from '@/utils'
import config from '@/utils/config'
import dotProp from 'dot-prop'
import moment from 'moment'
import request from '@/utils/request'

export default {
  name: 'SearchColumn',
  props: {
    type: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    propSearch: {
      type: String,
      default: ''
    },
    childrenField: {
      type: String,
      default: ''
    },
    propChildren: {
      type: String,
      default: ''
    },
    propConfig: {
      type: String,
      default: ''
    },
    propSearchConfig: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    searchField: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    parentProp: {
      type: String,
      default: ''
    },
    fixed: {
      type: String,
      default: ''
    },
    minWidth: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    },
    headerAlign: {
      type: String,
      default: 'left'
    },
    isChildren: {
      type: Boolean,
      default: false
    },
    isSearchLocal: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    disabledSearch: {
      type: Boolean,
      default: false
    },
    isBold: {
      type: Boolean,
      default: false
    },
    searchRemote: {
      type: Function,
      default: () => {
      }
    },
    searchLocal: {
      type: Function,
      default: () => {
      }
    },
    urlGetDataSearch: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      configObj: { ...config },
      searchStr: '',
      arrObjSearchList: [],
      timeout: null,
      loading: false
    }
  },
  methods: {
    async getDataSearch() {
      if(this.urlGetDataSearch && this.arrObjSearchList.length === 0) {
        this.loading = true
        request({
          url: `${this.urlGetDataSearch}?perPage=1000`,
          method: "get",
        })
          .then((res) => {
            this.loading = false
            if (res && res.data) {
              this.arrObjSearchList = res.data
            }
          })
          .catch((err) => {
            this.loading = false
            console.log(err)
          })
      }
    },
    onChange() {
      if (this.type && this.type === 'object' || this.type === 'array' || this.type === 'arrayObject') {
        const searchField = this.searchField || 'ten'
        this.isSearchLocal === true ? this.searchLocal(this.prop + `.${searchField}`, this.searchStr) : this.searchRemote(this.prop + `.${searchField}`, this.searchStr)
      } else {
        this.isSearchLocal === true ? this.searchLocal(this.prop, this.searchStr) : this.searchRemote(this.prop, this.searchStr)
      }
    },
    onFilter(value) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.searchRemote(this.searchField, value.join(','))
      }, 500)
    },
    formatTime(unixTS, format) {
      if(unixTS && unixTS.toString().length > 10) {
        unixTS = Math.floor(unixTS / 1000)
      }
      return unixTS ? moment.unix(unixTS).format(format) : undefined
    },
    dotObj(obj, prop) {
      return dotProp.get(obj, prop)
    }
  }
}
</script>

<style>
.caret-wrapper {
  position: absolute !important;
  top: -5px;
  right: 6px;
}
.tag-arr {
  margin: 5px 0;
  margin-right: 5px;
}
</style>
