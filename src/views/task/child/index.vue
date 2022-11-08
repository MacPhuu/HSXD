<template>
  <div v-loading="loadingPage" class="file-child-page">
    <div class="header-action">
      <div>
        <button-icon icon="_Add" @click.native="addFolder">Thêm mới</button-icon>
      </div>
      <div>
        <template>
          <!--          <button-icon icon="Add" @click="handleShare(currentFile)">Chia sẻ</button-icon>-->
          <!--          <el-popconfirm-->
          <!--            v-if="currentFile.default !== 1"-->
          <!--            title="Bạn có chắc chắn xóa?"-->
          <!--            cancel-button-text="Hủy"-->
          <!--            confirm-button-text="Đồng ý"-->
          <!--            @confirm="handleDelete(currentFile)"-->
          <!--          >-->
          <!--            <button-icon slot="reference" icon="Trash">Xóa</button-icon>-->
          <!--          </el-popconfirm>-->
          <!--          <button-icon v-if="currentFile.default !== 1" icon="Edit" @click="handleRename">Đổi tên</button-icon>-->
        </template>
      </div>
    </div>
    <div v-if="isCategory" class="category-container">
      <sheet-category :key="keyCategory" :folder-id="folderId" :type="categoryType" :search-prop="searchProp" @updateCategory="getCategory" @viewSourceMaterial="viewSourceMaterial" />
    </div>
    <div v-else>
      <div class="breadcrumb-container">
        <el-row :gutter="20">
          <el-col :span="16">
            <h3 v-if="resultFilter" style="margin: 0; padding: 0 5px; font-weight: 600; line-height: 32px">Tất cả {{ resultFilter < 10 ? `0${resultFilter}` : resultFilter }} kết quả</h3>
            <breadcrumb-box v-else />
          </el-col>
          <el-col :span="8" style="height: 53px; display: flex; align-items: center; padding-right: 20px">
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
              size="small"
              clearable
              placeholder=" Nhập từ khóa cần tìm kiếm"
              @input="onInputSearch"
            />
            <el-popover
              v-model="formFilterVisible"
              placement="bottom"
              width="450"
              trigger="click"
            >
              <el-form
                label-position="top"
                :model="formFilter"
                size="small"
              >
                <el-form-item label="Trạng thái số hóa">
                  <el-select v-model="formFilter.status" placeholder="Tất cả">
                    <el-option
                      v-for="status in statuses"
                      :key="status.value"
                      :label="status.label"
                      :value="status.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Tài liệu">
                  <el-select v-model="formFilter.document" placeholder="Tất cả">
                    <el-option
                      v-for="document in documents"
                      :key="document.value"
                      :label="document.label"
                      :value="document.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Thời gian">
                  <el-select v-model="formFilter.duration" placeholder="Tất cả">
                    <el-option
                      v-for="duration in durations"
                      :key="duration.value"
                      :label="duration.label"
                      :value="duration.value"
                    />
                  </el-select>
                </el-form-item>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="Từ ngày" prop="startAt">
                      <el-date-picker
                        v-model="formFilter.startAt"
                        class="date-input-custom"
                        type="date"
                        size="small"
                        default-value
                        placeholder="Chọn ngày"
                        format="dd/MM/yyyy"
                        style="width: 100%"
                        :disabled="formFilter.duration !== 5"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Đến ngày" prop="endAt">
                      <el-date-picker
                        v-model="formFilter.endAt"
                        class="date-input-custom"
                        size="small"
                        default-value
                        type="date"
                        placeholder="Chọn ngày"
                        format="dd/MM/yyyy"
                        style="width: 100%"
                        :disabled="formFilter.duration !== 5"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row justify="end" type="flex">
                  <el-button size="small" @click="formFilterVisible = false">Bỏ qua</el-button>
                  <el-button size="small" type="primary" :loading="loadingFilter" @click="handleConfirmFilter">Áp dụng</el-button>
                </el-row>
              </el-form>
              <el-button
                slot="reference"
                size="small"
                style="margin-left: 10px;padding: 5px;border: 0;border-radius: 4px;width: 40px; height: 40px"
                @click="handleShowFilter"
              >
                <i class="el-icon-s-operation" style="font-size: 20px;"/>
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div class="page-content">
        <div v-if="!loadingPage && tableData.length" class="table-wrap">
          <el-table
            v-if="viewType === config.viewType.LIST"
            ref="tableData"
            fit
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="onCellMouseEnter"
            @cell-mouse-leave="onCellMouseLeave"
          >
            <el-table-column
              align="center"
              type="selection"
              width="50"
            />
            <el-table-column label="Tên" min-width="450" fixed>
              <template slot-scope="scope">
                <div
                  v-if="scope.row.metaType === metaType.FOLDER"
                  :title="scope.row.name"
                  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >
                  <span style="cursor: pointer" @click="gotoDetail(scope.row)">
                    <svg-icon v-if="scope.row.default" class="icon-svg" icon-class="FolderFixed" />
                    <svg-icon v-else class="icon-svg" icon-class="FolderFlex" />
                    <span>{{ scope.row.name }}</span>
                  </span>
                </div>
                <div
                  v-else-if="scope.row.metaType === metaType.FILE"
                  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >
                  <span style="cursor:pointer;" @click="gotoDetail(scope.row)">
                    <svg-icon v-if="scope.row.metaType === metaType.FOLDER" icon-class="FolderItem" class-name="icon-svg" />
                    <svg-icon v-else-if="fileType(scope.row.name) === 'docx' || fileType(scope.row.name) === 'doc'" class-name="icon-svg" icon-class="doc" />
                    <svg-icon v-else-if="fileType(scope.row.name) === 'pdf'" class-name="icon-svg" icon-class="pdf" />
                    <svg-icon v-else-if="fileType(scope.row.name) === 'xls' || fileType(scope.row.name) === 'xlsx'" class-name="icon-svg" icon-class="xls" />
                    <svg-icon v-else class="icon-svg" icon-class="File" />
                    <span>{{ scope.row.name }}</span>
                  </span>
                </div>
                <div
                  v-else-if="scope.row.metaType === metaType.LINK"
                  :title="scope.row.name"
                  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >
                  <span style="cursor: pointer" @click="gotoDetail(scope.row)">
                    <svg-icon class="icon-svg" icon-class="FileLink" />
                    <span class="file-link">{{ scope.row.name }} <svg-icon icon-class="ExternalLink" /></span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="Cập nhật" width="180">
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.createdAt) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="Tag" width="180">
              <template slot-scope="scope">
                <el-popover
                  v-if="scope.row.tags && scope.row.tags.length > 1"
                  placement="right"
                  trigger="hover"
                >
                  <h4 style="margin: 0 0 10px;">Danh sách Tag</h4>
                  <div v-for="tag in scope.row.tags" key="tag._id">
                    <el-tag type="info" size="small" style="margin-bottom: 10px">
                      {{ tag.name }}
                    </el-tag>
                  </div>
                  <span slot="reference">
                  <el-tag
                    v-if="scope.row.tags && scope.row.tags.length"
                    size="small"
                    type="info"
                    style="cursor: pointer"
                    @click="handleAssignTag(scope.row)"
                  >
                    {{ scope.row.tags[0].name }}
                  </el-tag>
                  <span v-else>-</span>
                  <span v-if="scope.row.tags.length > 1" class="quanity-tag">+{{ scope.row.tags.length - 1 }}</span>
                </span>
                </el-popover>
                <el-tag
                  v-else-if="scope.row.tags && scope.row.tags.length === 1"
                  size="small"
                  type="info"
                  style="cursor: pointer"
                  @click="handleAssignTag(scope.row)"
                >
                  {{ scope.row.tags[0].name }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column prop="size" label="Kích thước" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.metaType === metaType.FILE || scope.row.metaType === metaType.FOLDER">{{ scope.row.size >= 0 ? getFileSize(scope.row.size) : "-" }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="Thao tác" align="center" width="120" fixed="right" class-name="right-action-table">
              <template slot-scope="scope">
              <span class="btn-table" @click="handleEdit(scope.row)">
                <svg-icon icon-class="Edit" />
              </span>
                <el-popconfirm
                  class="btn-table"
                  title="Bạn có chắc chắn xóa?"
                  cancel-button-text="Hủy"
                  confirm-button-text="Đồng ý"
                  @confirm="handleDelete(scope.row._id)"
                >
                <span slot="reference" class="btn-table">
                  <svg-icon icon-class="Trash" />
                </span>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div v-else-if="viewType === config.viewType.GRID" class="grid-box-container">
            <div class="grid-box">
              <div
                v-for="item in tableData"
                :key="item._id"
                :class="[{ 'is-active': item.isActive }, 'grid-item']"
                @click="gotoDetail(item)"
              >
                <el-checkbox class="checkbox-item" @change="value => onSelectFile(item, value)" @click.native="e => e.stopPropagation()" />
                <span class="option-btn-icon">
                <svg-icon icon-class="ThreedotHorizonal" />
              </span>
                <span v-if="item.metaType === metaType.FOLDER">
                <svg-icon v-if="item.default" icon-class="FolderFixed" class-name="file-icon" />
                <svg-icon v-else icon-class="FolderFlex" class-name="file-icon" />
              </span>
                <svg-icon v-else-if="item.metaType === metaType.LINK" class="file-icon" icon-class="FileLink" />
                <svg-icon v-else-if="fileType(item.name) === 'docx' || fileType(item.name) === 'doc'" class-name="file-icon" icon-class="doc" />
                <svg-icon v-else-if="fileType(item.name) === 'pdf'" class-name="file-icon" icon-class="pdf" />
                <svg-icon v-else-if="fileType(item.name) === 'xls' || fileType(item.name) === 'xlsx'" class-name="file-icon" icon-class="xls" />
                <svg-icon v-else class="file-icon" icon-class="File" />
                <div class="file-name" :title="item.name">{{ item.name }}</div>
                <span class="created-time">{{ getTimeRelative(item.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="blank-page">
          <svg-icon icon-class="FileEmpty" style="font-size: 120px" />
          <h4 style="margin: 5px 0">Danh sách trống</h4>
          <p style="margin: 5px 0; color: #97a8be">Hãy bắt đầu bằng cách tải lên một tài liệu hoặc tập tin mới</p>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="60%"
      :before-close="beforeCloseDialog"
    >
      <span slot="title" style="font-weight: 500;">Chia sẻ thư mục <i class="el-icon-warning-outline" /></span>
      <el-row class="current-folder">
        <el-col :span="24">
          <div style="display: flex;justify-content: start;align-items: center;">
            <div class="svg-folder-container" style="padding: 0 10px;font-size: 60px;">
              <div v-if="currentFile.metaType === metaType.FOLDER">
                <svg-icon v-if="currentFile.default" icon-class="FolderItem" />
                <svg-icon v-else icon-class="FolderFlex" />
              </div>
              <div v-else-if="currentFile.metaType === metaType.FILE">
                <svg-icon
                  v-if="fileType(currentFile.name) === 'docx' || fileType(currentFile.name) === 'doc'"
                  icon-class="doc"
                />
                <svg-icon v-else-if="fileType(currentFile.name) === 'pdf'" icon-class="pdf" />
                <svg-icon
                  v-else-if="fileType(currentFile.name) === 'xls' || fileType(currentFile.name) === 'xlsx'"
                  icon-class="xls"
                />
                <svg-icon v-else icon-class="File" />
              </div>
            </div>
            <div class="folder-content">
              <div style="font-weight: bold; margin-bottom: 6px" class="folder-name">{{ currentFile.name }}</div>
              <!--              <span style="color: lightgrey">{{ getFileSize(currentFile.size) }}</span>-->
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="current-folder">
        <h4 style="padding-left: 10px">Chia sẻ</h4>
        <el-row>
          <div>
            <span style="padding-left: 10px">Ai có thể truy cập vào mục này:</span>
            <el-select v-model="folderSharePermission" class="people-share-select" @change="onChangePermissionShare">
              <el-option
                v-for="sharePermission in sharePermissions"
                :key="'s' + sharePermission.value"
                style="border: none"
                :label="sharePermission.label"
                :value="sharePermission.value"
              />
            </el-select>
          </div>
          <br>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 20px">
          <el-col style="margin-left: 5px; width: 82%" :span="20">
            <el-select v-model="memberList" class="select-custom" multiple filterable @change="onChangeMemberShare">
              <el-option
                v-for="user in members"
                :key="'u' + user._id"
                :label="user.name || user.email"
                :value="user._id"
                style="height: 64px; padding-top: 10px; padding-bottm: 10px;"
              >
                <div
                  class="member-container"
                  style="justify-content: center;float: left;display: flex;line-height: 1.5;align-items: center;"
                >
                  <div class="member-avatar" style="margin-right: 15px"><svg-icon icon-class="Account3" style="font-size: 36px" /></div>
                  <div class="member-info">
                    <div class="member-name">{{ user.name }}</div>
                    <div class="member-email">{{ user.email }}</div>
                  </div>
                </div>
              </el-option>
              <el-select
                slot="prefix"
                v-model="currentEditPermission"
                size="small"
                placeholder="Lựa chọn"
                class="select-role-user"
              >
                <el-option
                  v-for="editPermission in editPermissions"
                  :key="'p' + editPermission.value"
                  :label="editPermission.label"
                  :value="editPermission.value"
                />
              </el-select>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="width: 100%" @click="handleSubmitShare">Xác nhận</el-button>
          </el-col>
        </el-row>
      </el-row>
      <!--      <div style="display: flex; justify-content: space-between; margin-left: 10px">-->
      <!--        <div>-->
      <!--          <div style="font-weight: bold; margin-top: 10px">Chris Hoang(bạn)</div>-->
      <!--          <div style="margin-top: 5px; margin-bottom: 10px">chrishoang@cab.vn</div>-->
      <!--        </div>-->
      <!--        <div style="display: flex; align-items: center; margin-right: 25px">-->
      <!--          <p>Chủ sở hữu</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <hr>-->
      <!--      <div style="display: flex; justify-content: space-between; margin-left: 10px">-->
      <!--        <div>-->
      <!--          <div style="font-weight: bold; margin-top: 10px">Chris Hoang(bạn)</div>-->
      <!--          <div style="margin-top: 5px">chrishoang@cab.vn</div>-->
      <!--        </div>-->
      <!--        <div style="display: flex; align-items: center; margin-right: 25px">-->
      <!--          <el-select v-model="folder.folderSharePermission" class="people-share-select">-->
      <!--            <el-option-->
      <!--              v-for="sharePermission in sharePermissions"-->
      <!--              :key="'s' + sharePermission.value"-->
      <!--              style="border: none"-->
      <!--              :label="sharePermission.label"-->
      <!--              :value="sharePermission.value"-->
      <!--            />-->
      <!--          </el-select>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="member-list">
        <div class="member-row owner" v-if="isOwner">
          <div>
            <div class="label-info">{{ ownerFolder.name }}</div>
            <div class="content-info">{{ ownerFolder.email }}</div>
          </div>
          <div>
            <span>Chủ sở hữu</span>
          </div>
        </div>

        <div
          v-for="member in visitorList"
          :key="member._id"
          v-loading="loadingMemberShare"
          class="member-row member"
        >
          <div>
            <div class="label-info">{{ member.name }}</div>
            <div class="content-info">{{ member.email }}</div>
          </div>
          <div class="permission-info">
            <el-select
              slot="prefix"
              v-model="member.role"
              size="small"
              placeholder="Lựa chọn"
              class="select-role-user"
              style="right: -10px;"
              @change="handleConfirmChangePermission"
            >
              <el-option
                v-for="editPermission in editPermissions"
                :key="'p' + editPermission.value"
                :label="editPermission.label"
                :value="editPermission.value"
              />
              <el-option label="Xóa thành viên" :value="3" @click.native="deleteMemberShare(member)" />
            </el-select>
          </div>
        </div>
      </div>
      <el-row style="margin-top: 20px">
        <el-button type="text" size="small">
          <svg-icon icon-class="Link" />
          Sao chép đường liên kết
        </el-button>
      </el-row>
    </el-dialog>

    <el-dialog
      :title="formTypeFolder === 'create' ? 'Thêm mới giai đoạn' : 'Cập nhật giai đoạn'"
      :visible.sync="dialogFolder"
      width="40%"
      :before-close="beforeCloseDialog"
    >
      <el-form ref="formFolder" :model="form" label-position="top" :rules="ruleFormFolder">
        <el-form-item label="Giai đoạn" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Ghi chú" prop="note">
          <el-input v-model="form.note" type="textarea" :rows="3" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFolder = false; beforeCloseDialog(() => {})">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitFolder">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Cập nhật"
      :visible.sync="dialogFile"
      width="40%"
      :before-close="beforeCloseDialog"
    >
      <el-form ref="formFile" :model="formFile" label-position="top" :rules="ruleFormFile">
        <el-form-item label="Tên File" prop="name">
          <el-input v-model="formFile.name" autocomplete="off" @keyup.enter.native="handleSubmitFile" />
        </el-form-item>
        <el-form-item label="Tên File" prop="name" style="display: none">
          <el-input />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFile = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitFile">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="formTypeLink ==='create' ? 'Thêm link mới' : 'Chỉnh sửa link'"
      :visible.sync="dialogLink"
      width="40%"
      :before-close="beforeCloseDialog"
    >
      <el-form ref="formLink" :model="formLink" label-position="top" :rules="ruleFormLink">
        <el-form-item label="Tên link" prop="name">
          <el-input v-model="formLink.name" autocomplete="off" placeholder="Tên link" />
        </el-form-item>
        <el-form-item label="Đường link" prop="path">
          <el-input v-model="formLink.path" autocomplete="off" placeholder="VD: https://file-example.pdf" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLink = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitLink">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="createTagDialog"
      width="40%"
      :before-close="beforeCloseDialog"
    >
      <span slot="title" style="font-weight: 500;">Gắn tag <i class="el-icon-warning-outline" /></span>
      <el-row>
        <el-select
          v-model="tagList"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Lựa chọn tag hoặc tạo mới"
          class="select-tag-custom"
          @input.native="onInputTagSelectForm"
        >
          <el-option
            v-for="tag in tags"
            :key="'tag' + tag._id"
            :value="tag.name"
            :label="tag.name"
          >
            <span>
              <el-tag type="info" size="small">{{ tag.name }}</el-tag>
            </span>
          </el-option>
        </el-select>
      </el-row>
      <el-row v-if="tags.length === 0" v-loading="loadingTag">
        <el-row class="tag-helper">Gợi ý</el-row>
        <el-row :gutter="10" type="flex" justify="stretch" style="min-height: 150px">
          <el-col>
            <el-tag
              v-for="example in examples"
              :key="example.value"
              type="info"
              size="small"
              :label="example.name"
              :value="example.value"
              class="tag-custom"
            >{{ example.name }}
            </el-tag>
          </el-col>
        </el-row>
      </el-row>
      <el-row v-else>
        <el-row class="tag-helper">Tag đã tạo</el-row>
        <el-row v-loading="loadingTag">
          <ul>
            <li
              v-for="tag in tags"
              :key="'tag-created' + tag._id"
              :value="tag._id"
              :label="tag.name"
              class="custom-created-tag"
            >
              <el-tag
                type="info"
                size="small"
                class="tag-custom"
                @click="handleAddTag(tag)"
              >
                {{ tag.name }}
              </el-tag>
              <el-popover
                v-model="tag.showMore"
                placement="bottom"
                width="100"
                class="custom-show-more"
              >
                <span>
                  <el-row>
                    <button-icon icon="Edit" @click="handleEditTag(tag)">Chỉnh sửa</button-icon>
                    <el-dialog
                      title="Chỉnh sửa tag"
                      :visible.sync="dialogTagVisible"
                      width="30%"
                      append-to-body
                    >
                      <el-form
                        :model="tagForm"
                      >
                        <el-form-item label="Tên tag">
                          <el-input v-model="tagForm.name" />
                        </el-form-item>
                        <el-form-item style="display: none" />
                      </el-form>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogTagVisible=false">Hủy</el-button>
                        <el-button type="primary" :loading="loadingSubmitTag" @click="handleConfirmEditTag">Xác nhận</el-button>
                      </span>
                    </el-dialog>
                  </el-row>
                  <el-row>
                    <button-icon icon="Trash" @click="handleDeleteTag(tag)">Xóa</button-icon>
                  </el-row>
                </span>
                <el-button slot="reference" type="text" style="transform: rotate(90deg); color: #3a3a3a">
                  <i class="el-icon-more" />
                </el-button>
              </el-popover>
            </li>
          </ul>
        </el-row>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              size="small"
              style="width: 100%;"
              :loading="loadingSubmitTag"
              @click="handleConfirmAssignTag"
            >
              Xác nhận
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

    <el-dialog
      title="Tài liệu của tôi"
      :visible.sync="dialogMove"
      width="50%"
    >
      <el-tree
        ref="treeFolder"
        v-loading="loadingTree"
        :data="treeFolder"
        :props="defaultProps"
        accordion
        highlight-current
        @current-change="onChangeNode"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
          :style="{
            userSelect: data._id === currentFile._id || data._id === folderId ? 'none !important' : 'unset',
            cursor: data._id === currentFile._id || data._id === folderId ? 'default !important' : 'pointer',
            opacity: data._id === currentFile._id || data._id === folderId ? '0.5' : '1',
          }"
        >
          <span v-if="data.default">
            <svg-icon icon-class="FolderFixed" class-name="icon-folder" />
            <span :title="node.label" class="node-label" style="font-weight: bold">{{ node.label }}</span>
          </span>
          <span v-else>
            <svg-icon icon-class="FolderFlex" class-name="icon-folder" />
            <span :title="node.label" class="node-label">{{ node.label }}</span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMove = false">Hủy</el-button>
        <el-button :disabled="targetFolderMove._id === currentFile._id || targetFolderMove._id === folderId" type="primary" @click="handleSubmitMove">Chuyển tới đây</el-button>
      </span>
    </el-dialog>

    <div v-if="showNotifyUpload" class="notify-upload">
      <div class="header">
        <h4 v-if="isUploading">Đang tải lên</h4>
        <h4 v-else>Đã tải lên</h4>
        <span class="close-btn-notify" @click="closeNotifyUpload">
          <svg-icon icon-class="Close2" />
        </span>
      </div>
      <div class="content">
        <span>
          <svg-icon icon-class="FolderFlex" style="margin-right: 5px; font-size: 16px" />
          <b style="margin-right: 15px">Folder</b>
          <span>{{ countResultUpload }} trong số {{ totalFolderUpload }}</span>
        </span>
        <svg-icon v-if="countResultUpload === totalFolderUpload" icon-class="Check" />
        <el-icon v-else name="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import FolderAPI from '@/api/folder'
import config from '@/utils/config'
import FileAPI from "@/api/fileApi"
import moment from "moment"
import ButtonIcon from '@/components/ButtonIcon'
import BreadcrumbBox from '@/components/BreadcrumbBox'
import { mapGetters } from 'vuex'
import ButtonDropdown from '@/components/ButtonDropdown'
import { humanFileSize } from "@/utils"
import eventEmitter from '@/utils/eventEmitter'
import MemberAPI from '@/api/memberApi'
import TagAPI from "@/api/tagApi"
import searchAPI from '@/api/searchApi'
import ShareAPI from "@/api/shareApi"
import axios from 'axios'
import SheetCategory from '@/views/sheet'
import CategoryAPI from '@/api/categoryApi'
import DownloadAPI from "@/api/downloadApi"
moment.locale('vi')

export default {
  components: { SheetCategory, ButtonDropdown, BreadcrumbBox, ButtonIcon },
  beforeRouteLeave(to, from, next) {
    if (this.isUploading) {
      if (window.confirm('Những thay đổi bạn đã thực hiện có thể không được lưu.')) {
        next()
      }
    } else {
      next()
    }
  },
  data() {
    const token = localStorage.getItem(config.tokenKey)
    const validUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Vui lòng nhập đường link tài liệu'))
      } else if (value && /(https?:\/\/[^\s]+)/g.test(value)) {
        callback()
      } else {
        callback(new Error('Vui lòng nhập đúng định dạng đường link tài liệu'))
      }
    }
    return {
      loadingDownload: false,
      displayUpload: false,
      isOwner: true,
      categoryTask: [],
      categoryMaterial: [],
      categorySourceMaterial: [],
      isCategory: false,
      categoryType: config.categoryType.MATERIAL,
      categoryTypeMap: config.categoryType,
      keyCategory: 1,
      searchProp: '',
      dataRole: {},
      showNotifyUpload: false,
      countResultUpload: 0,
      totalFolderUpload: 0,
      isUploading: false,
      resultFilter: 0,
      loadingTree: false,
      treeFolder: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      selectedList: [],
      selectAll: false,
      examples: [
        {
          value: 1,
          name: 'Quan trọng 1'
        },
        {
          value: 2,
          name: 'Quan trọng 2'
        },
        {
          value: 3,
          name: 'Quan trọng 3'
        }
      ],
      tagInfo: {},
      loadingTag: false,
      loadingFilter: false,
      statuses: [{
        value: 5,
        label: 'Tất cả'
      }, {
        value: 6,
        label: 'Chưa số hóa'
      }, {
        value: 1,
        label: 'Đang chờ'
      }, {
        value: 2,
        label: 'Hoàn thành'
      }, {
        value: 3,
        label: 'Từ chối'
      }, {
        value: 4,
        label: 'Thu hồi'
      }],
      documents: [
        {
          value: 1,
          label: 'Tất cả'
        },
        {
          value: 2,
          label: 'Tài liệu của tôi'
        },
        {
          value: 3,
          label: 'Tài liệu được chia sẻ với tôi'
        },
      ],
      durations: [
        {
          value: 1,
          label: 'Tất cả'
        },
        {
          value: 2,
          label: '1 tháng trước'
        },
        {
          value: 3,
          label: '3 tháng trước'
        },
        {
          value: 4,
          label: '6 tháng trước'
        },
        {
          value: 5,
          label: 'Tùy chọn'
        }
      ],
      formFilter: {
        status: 5,
        document: 1,
        duration: 1,
        startAt: undefined,
        endAt: undefined
      },
      timeoutQuery: null,
      formFilterVisible: false,
      tags: [],
      tagList: [],
      createTagDialog: false,
      formTypeFolder: 'create',
      tagForm: {},
      dialogTagVisible: false,
      loadingSubmitTag: false,
      options: [{
        value: 'Option1',
        label: 'Tất cả'
      }, {
        value: 'Option2',
        label: 'Chưa có hóa'
      }, {
        value: 'Option3',
        label: 'Đang chờ'
      }, {
        value: 'Option4',
        label: 'Hoàn thành'
      }, {
        value: 'Option5',
        label: 'Từ chối'
      }, {
        value: 'Option6',
        label: 'Thu hồi'
      }],
      currentEditPermission: 1,
      folderSharePermission: 3,
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
      isShared: false,
      shareDialogVisible: false,
      loadingMemberShare: false,
      members: [],
      memberList: [],
      visitorList: [],
      ownerFolder: {},
      config,
      searchQuery: '',
      searchTagQuery: '',
      loadingUpload: false,
      loadingPage: false,
      currentFile: {},
      urlUploadFile: config.api.upload,
      headerUpload: {
        'x-access-token': token
      },
      tableData: [],
      dialogFolder: false,
      dialogLink: false,
      dialogFile: false,
      dialogMove: false,
      targetFolderMove: {},
      form: {},
      formLink: {},
      formFile: {},
      formTypeLink: 'create',
      dialogFormVisible: false,
      metaType: {
        FOLDER: 1,
        FILE: 2,
        LINK: 3
      },
      folderId: this.$route.params.id,
      folderName: this.$route.query.folderName,
      viewType: this.$route.query.viewType ? parseInt(this.$route.query.viewType) : config.viewType.LIST,
      stateConfig: config.stateConfig,
      ruleFormLink: {
        name: [{ required: true, trigger: 'change', message: 'Vui lòng nhập tên link' }],
        path: [{ required: true, trigger: 'change', validator: validUrl }]
      },
      ruleFormFolder: {
        name: [{ required: true, trigger: 'change', message: 'Vui lòng nhập tên thư mục' }],
      },
      ruleFormFile: {
        name: [{ required: true, trigger: 'change', message: 'Vui lòng nhập tên file' }],
      }
    }
  },
  computed: {
    ...mapGetters([
      'levelList'
    ])
  },
  created() {
    this.getCategory()
  },
  mounted() {

    this.loadFolder()
    this.getTags()
  },
  methods: {
    async handleDownloadMultiFile() {
      const dataSubmit = this.selectedList
      // eslint-disable-next-line prefer-const
      let fileListSubmit = []; let folderListSubmit = []
      dataSubmit.forEach(data => {
        if (data.metaType === 2) {
          fileListSubmit.push(data._id)
        }
        if (data.metaType === 1) {
          folderListSubmit.push(data._id)
        }
      })
      const listFile = fileListSubmit.join(',')
      const listFolder = folderListSubmit.join(',')
      let cc = {}
      try {
        this.loadingDownload = true
        cc = await DownloadAPI.get({
          listFile,
          listFolder
        })
        this.loadingDownload = false
      } catch (err) {
        this.loadingDownload = false
      }
      const url = window.URL.createObjectURL(new Blob([cc]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `download.zip`) // or any other extension
      document.body.appendChild(link)
      link.click()
    },
    handleCopyMultiFile() {

    },
    viewSourceMaterial(searchValue) {
      this.searchProp = searchValue
      this.categoryType = this.categoryTypeMap.SOURCE_MATERIAL
      this.keyCategory++
    },
    async getCategory() {
      const data = await CategoryAPI.get({ folderId: this.folderId }) || []

      this.categoryTask = data.filter(i => i.type === config.categoryType.TASK) || []
      this.categoryMaterial = data.filter(i => i.type === config.categoryType.MATERIAL) || []
      this.categorySourceMaterial = data.filter(i => i.type === config.categoryType.SOURCE_MATERIAL) || []
    },
    closeNotifyUpload() {
      this.showNotifyUpload = false
      this.countResultUpload = 0
      this.totalFolderUpload = 0
    },
    handleUploadFolder() {
      const inputFolder = document.createElement('input')
      inputFolder.setAttribute('webkitdirectory', '')
      inputFolder.setAttribute('multiple', '')
      inputFolder.setAttribute('type', 'file')
      this.countResultUpload = 0

      inputFolder.addEventListener("change", async event => {
        this.showNotifyUpload = true
        this.isUploading = true
        const { files } = event.target
        const obj = {}

        files.forEach(f => {
          const { webkitRelativePath } = f
          const arr = webkitRelativePath.split("/")
          // bo ten file di
          for (let i = 0; i < arr.length; i++) {
            const currentFolderName = arr[i]
            const currentPath = (arr.slice(0, i + 1)).join("/")
            const parentPath = (arr.slice(0, i)).join("/")
            if (i === arr.length - 1) {
              obj[currentPath] = {
                currentFileName: currentFolderName,
                currentPath,
                parentPath,
                isFile: 1,
                file: f
              }
            } else {
              obj[currentPath] = {
                currentFolderName,
                currentPath,
                parentPath,
                isFile: 0
              }
            }
          }
        })

        const folders = Object.values(obj)
        this.totalFolderUpload = folders.length
        // them folder
        for (const folder of folders) {
          if (folder.isFile) {
            continue
          }
          const dtSubmit = {
            name: folder.currentFolderName
          }
          if (folder.parentPath) {
            const parent = obj[folder.parentPath]
            dtSubmit.folderId = parent._id
          } else {
            // todo: neu ma la folder con thi set folderId o day
            dtSubmit.folderId = this.folderId
          }
          const data = await FolderAPI.create(dtSubmit)
          this.$message.closeAll()
          this.countResultUpload++
          folder._id = data.sp ? data.sp._id : data._id
        }
        // them file
        for (const file of folders) {
          if (!file.isFile) {
            continue
          }
          const dtSubmit = {
            name: file.currentFileName,
            type: config.fileType.FILE
          }
          if (file.parentPath) {
            const parent = obj[file.parentPath]
            dtSubmit.folderId = parent._id
          } else {
            // todo: neu ma la folder con thi set folderId o day
            dtSubmit.folderId = this.folderId
          }

          const formData = new FormData()

          formData.append('name', file.currentFileName)
          formData.append('file', file.file)

          const headerConfig = {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...this.headerUpload
            }
          }

          const fileResponse = await axios.post(config.api.upload, formData, headerConfig)
          await FileAPI.create({
            ...fileResponse.data,
            ...dtSubmit
          })
          this.$message.closeAll()
          this.countResultUpload++
        }

        this.isUploading = false
        this.$message.success('Tải lên thành công')
        this.loadFolder()
      }, false)

      inputFolder.click()
    },
    onInputTagSelectForm(e) {
      const selectTagDom = document.querySelector('.el-select-dropdown.el-popper.is-multiple')
      const tagListView = selectTagDom.querySelectorAll('.el-select-dropdown__item')

      if (tagListView.length > this.tags.length) {
        const tagCreating = tagListView[0]
        tagCreating.innerHTML = `<span>Tạo: <span class="tag-custom el-tag el-tag--info el-tag--small el-tag--light">${e.target.value}</span></span>`
      }
    },
    onCellMouseEnter(row, col, cell) {
      row.showButton = true
    },
    onCellMouseLeave(row, col, cell) {
      row.showButton = false
    },
    handleCancelSelect() {
      this.selectedList = []
      this.$refs.tableData.clearSelection()
    },
    handleSelectionChange(selectedList) {
      if (selectedList.length === 1) {
        this.currentFile = selectedList[0]
        this.selectedList = selectedList
      } else if (selectedList.length > 1) {
        this.selectedList = selectedList
        this.currentFile = {}
      } else {
        this.currentFile = {}
        this.selectedList = []
      }
    },
    onChangeSelectAll(checked) {
      this.selectAll = checked
      this.tableData = this.tableData.map(i => {
        i.isActive = checked
        return i
      })
    },
    async onInputSearch(value) {
      if (value === '#' || value.toLowerCase() === 'tag') {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(async() => {
          this.searchTagQuery = value
          await this.getTags()
        }, 1000)
        this.$nextTick(() => {
          this.$refs.selectTagInput && this.$refs.selectTagInput.focus()
        })
        return
      }

      if (value) {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(async() => {
          try {
            this.loadingPage = true
            const data = await searchAPI.getAll({ slug: value, folderId: this.folderId })
            this.setDataTable(data)
            this.loadingPage = false
          } catch (err) {
            this.loadingPage = false
          }
        }, 1000)
      } else {
        clearTimeout(this.timeoutQuery)
        this.timeoutQuery = setTimeout(() => {
          this.loadFolder()
        }, 1000)
      }
    },
    async onInputSearchTag(value) {
      if (value) {
        try {
          this.loadingPage = true
          const data = await searchAPI.getByTag({ id: this.searchTagQuery, folderId: this.folderId })
          this.setDataTable(data)
          this.loadingPage = false
        } catch (err) {
          this.loadingPage = false
        }
      } else {
        this.searchQuery = ''
        this.loadFolder()
      }
    },
    async handleConfirmFilter() {
      const { startAt, endAt, status, document, duration } = this.formFilter
      let start
      let end
      switch (+duration) {
        case 1: // tất cả
          start = undefined
          end = undefined
          break
        case 2: // 1 tháng trước
          start = moment().add(-1, 'months').unix()
          end = moment().unix()
          break
        case 3: // 3 tháng trước
          start = moment().add(-3, 'months').unix()
          end = moment().unix()
          break
        case 4: // 6 tháng trước
          start = moment().add(-6, 'months').unix()
          end = moment().unix()
          break
        default:
          start = startAt ? moment(startAt).startOf('day').unix() : undefined
          end = endAt ? moment(endAt).endOf('day').unix() : undefined
          break
      }

      if (status === 5 && document === 1 && duration === 1) {
        await this.loadFolder()
        this.formFilterVisible = false
      } else {
        try {
          this.loadingFilter = true
          const data = await searchAPI.getAll({
            folderId: this.folderId,
            slug: this.searchQuery,
            status: status === 5 ? undefined : status,
            document: document === 1 ? undefined : document,
            start,
            end
          })
          this.loadingFilter = false
          this.setDataTable(data)
          this.formFilterVisible = false
        } catch (err) {
          this.loadingFilter = false
        }
      }
    },
    async handleAddTag(tag) {
      const { tags } = this.currentFile
      const tagIds = tags.map(i => i._id)

      if (tagIds.includes(tag._id) || this.tagList.includes(tag.name)) {
        this.$message.closeAll()
        this.$message.error('Tag đã được thêm. Vui lòng chọn tag khác')
        return
      }

      this.tagList.push(tag.name)
    },
    async getMembers() {
      try {
        const { data } = await MemberAPI.get({ perPage: 10000 })
        this.members = data?.map(member => {
          const { userId: { _id, name, username }} = member
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
    beforeCloseDialog(done) {
      this.currentFile = {}
      this.selectedList = []
      this.tableData.forEach(item => {
        item.isActive = false
      })
      this.$refs.tableData.clearSelection()
      done()
    },
    async handleEditTag(tagInfo) {
      this.dialogTagVisible = true
      this.tagForm = {
        name: tagInfo.name,
        id: tagInfo._id
      }
    },
    async refreshTagOfCurrentFile() {
      await this.loadFolder()
      this.currentFile = this.tableData.find(i => i._id === this.currentFile._id)
      this.tagList = []
      if (this.currentFile.tags.length) {
        this.tagList = this.currentFile.tags.map(i => i.name)
      }
    },
    async handleConfirmEditTag() {
      try {
        this.loadingSubmitTag = true
        await TagAPI.update(this.tagForm.id, {
          ...this.tagForm
        })
        this.loadingSubmitTag = false
        this.dialogTagVisible = false
        this.tagForm.showMore = false
        await this.getTags()
        await this.refreshTagOfCurrentFile()
      } catch (err) {
        this.loadingSubmitTag = false
      }
    },
    async handleDeleteTag(tag) {
      try {
        this.loadingSubmitTag = true
        await TagAPI.delete(tag._id)
        this.loadingSubmitTag = false
        // eslint-disable-next-line require-atomic-updates
        tag.showMore = false
        await this.getTags()
        await this.refreshTagOfCurrentFile()
      } catch (err) {
        this.loadingSubmitTag = false
      }
    },
    async getTags() {
      try {
        this.loadingTag = true
        const data = await TagAPI.getList()
        this.tags = data.map(tag => {
          tag.showMore = false
          return tag
        })
        this.loadingTag = false
        const tagMap = {}
        this.tags.forEach(i => {
          tagMap[i.name] = i._id
        })
        this.tagMap = tagMap
      } catch (err) {
        this.loadingTag = false
      }
    },
    async handleAssignTag(currentFile) {
      if(currentFile) {
        this.currentFile = currentFile
      }
      this.createTagDialog = true
      this.tagList = []
      if (this.currentFile.tags.length) {
        this.tagList = this.currentFile.tags.map(i => i.name)
      }
      await this.getTags()
    },
    async handleConfirmAssignTag() {
      // add Tag
      const newTags = [...new Set(this.tagList)]
      const idExist = []
      const tagNotExist = []
      newTags.forEach(i => {
        if (this.tagMap[i]) {
          idExist.push(this.tagMap[i])
        } else {
          tagNotExist.push(i)
        }
      })
      if (tagNotExist.length) {
        try {
          this.loadingSubmitTag = true
          const res = await TagAPI.createMany(tagNotExist.map(i => ({ name: i })))
          this.$message.closeAll()
          this.loadingSubmitTag = false
          res.upserted.forEach(i => {
            idExist.push(i._id)
          })
        } catch (err) {
          this.loadingSubmitTag = false
        }
      }
      // Update Folder
      switch (this.currentFile.metaType) {
        case this.metaType.FOLDER:
          await FolderAPI.updateTag(this.currentFile._id, idExist)
          break
        case this.metaType.FILE:
          await FileAPI.updateTag(this.currentFile._id, idExist)
          break
      }
      this.loadFolder()
      this.currentFile = {}
      this.createTagDialog = false
    },
    handleShowFilter() {
      this.dialogFilterVisible = true
    },
    async handleCheckRole(file) {
      const { ok } = await ShareAPI.checkRole({ folderId: this.folderId })
      if (ok) {
        return true
      } else {
        this.$message.error('Không có quyền')
        return Promise.reject(false)
      }
    },
    async handleShare(row) {
      this.memberList = []
      let resBefore = {}
      switch (row.metaType) {
        case this.metaType.FOLDER:
          resBefore = await ShareAPI.getById(row._id, { type: 2 })
          break
        case this.metaType.FILE:
          resBefore = await ShareAPI.getById(row._id, { type: 1 })
          break
      }
      this.dataRole = resBefore
      const { sp, visitorsParent } = resBefore
      const { permission } = sp
      const { visitors } = sp
      if (row) {
        if ("ownerId" in sp) {
          const { ownerId } = sp
          this.ownerFolder = {
            name: ownerId.name,
            email: ownerId.username,
            _id: ownerId._id
          }
          this.isOwner = true
        } else {
          this.isOwner = false
        }
        this.currentFile = { ...row }
        this.folderSharePermission = permission
        let visitorList = []
        if (visitors.length === 0) {
          const newParent = visitorsParent.map(user => {
            return {
              role: user.role,
              userId: user
            }
          })
          visitorList = newParent.filter(user => user.userId._id !== this.ownerFolder._id)
        } else {
          visitorList = visitors.filter(user => user.userId._id !== this.ownerFolder._id)
        }
        this.visitorList = visitorList.map(user => {
          return {
            ...user.userId,
            role: user.role,
            email: user.userId?.username
          }
        })
      }
      this.shareDialogVisible = true
      this.getMembers()
    },
    onChangeMemberShare(list) {
      this.visitorList.forEach(user => {
        if(list.includes(user._id)) {
          list.splice(list.indexOf(user._id), 1)
          this.$message.closeAll()
          this.$message.error('Thành viên đã được thêm quyền')
        }
      })
    },
    handleDigitizing(item) {
      this.$router.push(`/document/sign?id=${item._id}`)
    },
    async handleSubmitShare() {
      let resBefore = {}
      switch (this.currentFile.metaType) {
        case this.metaType.FOLDER:
          resBefore = await ShareAPI.getById(this.currentFile._id, { type: 2 })
          break
        case this.metaType.FILE:
          resBefore = await ShareAPI.getById(this.currentFile._id, { type: 1 })
          break
      }
      const { sp: dataBefore, visitorsParent } = resBefore
      const newVisitors = this.memberList.map(id => {
        return {
          userId: id,
          role: this.currentEditPermission
        }
      })

      const oldVisitors = visitorsParent.map(user => {
        return {
          userId: user._id,
          role: user.role
        }
      })

      const visitorList = [...newVisitors, ...oldVisitors]
      await ShareAPI.updateMember(this.currentFile._id, visitorList, { type: dataBefore.type })
      this.memberList = []
      const resAfter = await ShareAPI.getById(this.currentFile._id, { type: dataBefore.type })
      const { sp: dataAfter } = resAfter
      this.visitorList = dataAfter.visitors.map(user => {
        return {
          ...user.userId,
          role: user.role,
          email: user.userId?.username
        }
      })
    },
    async deleteMemberShare(member) {
      let resBefore = {}
      switch (this.currentFile.metaType) {
        case this.metaType.FOLDER:
          resBefore = await ShareAPI.getById(this.currentFile._id, { type: 2 })
          break
        case this.metaType.FILE:
          resBefore = await ShareAPI.getById(this.currentFile._id, { type: 1 })
          break
      }
      const { sp: dataBefore, visitorsParent: vParentBefore } = resBefore
      let { visitors: visitorsBefore } = dataBefore

      if (visitorsBefore.length === 0) {
        const newParent = vParentBefore.map(user => {
          return {
            role: user.role,
            userId: user
          }
        })
        visitorsBefore = newParent.filter(user => user.userId._id !== this.ownerFolder._id)
      } else {
        visitorsBefore = visitorsBefore.filter(user => user.userId._id !== this.ownerFolder._id)
      }
      const visitorsSubmit = visitorsBefore.filter(visitor => visitor?.userId?._id !== member._id)

      try {
        this.loadingMemberShare = true
        await ShareAPI.updateAndDeleteRoleFolder(this.currentFile._id, visitorsSubmit, { type: dataBefore.type })
        this.loadingMemberShare = false

        const resAfter = await ShareAPI.getById(this.currentFile._id, { type: dataBefore.type })
        const { sp: dataAfter, visitorsParent: vParentAfter } = resAfter
        let { visitors: visitorsAfter } = dataAfter
        if (visitorsAfter.length === 0) {
          const newParent = vParentAfter.map(user => {
            return {
              role: user.role,
              userId: user
            }
          })
          visitorsAfter = newParent.filter(user => user.userId._id !== this.ownerFolder._id)
        } else {
          visitorsAfter = visitorsAfter.filter(user => user.userId._id !== this.ownerFolder._id)
        }
        this.visitorList = visitorsAfter.map(user => {
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
      switch (this.currentFile.metaType) {
        case this.metaType.FOLDER:
          await ShareAPI.updatePermission(this.currentFile._id, { permission: this.folderSharePermission }, { type: 2 })
          break
        case this.metaType.FILE:
          await ShareAPI.updatePermission(this.currentFile._id, { permission: this.folderSharePermission }, { type: 1 })
          break
      }
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
    async getTreeFolder() {
      try {
        this.loadingTree = true
        this.treeFolder = await FolderAPI.getTreeFolder()
        this.loadingTree = false
      } catch (err) {
        this.loadingTree = false
      }
    },
    handleMove() {
      this.dialogMove = true
      this.targetFolderMove = {}
      this.getTreeFolder()
    },
    async handleSubmitMove() {
      const { _id, metaType } = this.currentFile
      switch (metaType) {
        case this.metaType.FILE:
          try {
            this.loadingTree = true
            const file = await FileAPI.getById(_id)
            delete file._id
            delete file.__v
            await FileAPI.update(_id, {
              ...file,
              tags: file.tags.map(tag => tag._id),
              folderId: this.targetFolderMove._id
            })
            this.loadFolder()
            this.loadingTree = false
            this.dialogMove = false
          } catch (err) {
            this.loadingTree = false
          }
          break
        case this.metaType.FOLDER:
          try {
            this.loadingTree = true
            const folder = await FolderAPI.getById(_id)
            delete folder._id
            delete folder.__v
            await FolderAPI.update(_id, {
              ...folder,
              folderId: this.targetFolderMove._id
            })
            eventEmitter.emit('treeChange')
            this.loadFolder()
            this.loadingTree = false
            this.dialogMove = false
          } catch (err) {
            this.loadingTree = false
          }
          break
      }
    },
    onChangeNode(nodeData, node) {
      this.targetFolderMove = nodeData
    },
    handleSelectionFile(item) {
      this.currentFile = { ...item }
    },
    downloadURI(uri, name) {
      const link = document.createElement("a")
      link.download = name
      link.href = uri
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handleDownloadFile(file) {
      const uri = `${config.api.download}/${file.path}`
      this.downloadURI(uri, file.name)
    },
    handleViewList() {
      this.viewType = config.viewType.LIST
    },
    handleViewGrid() {
      this.viewType = config.viewType.GRID
    },
    onSelectFile(item, selected) {
      this.tableData.forEach(i => {
        if (i._id !== item._id) {
          i.isActive = false
        }
      })
      item.isActive = selected
      this.currentFile = selected ? { ...item } : {}
    },
    getTimeRelative(unixTS) {
      return unixTS ? moment(unixTS * 1000).fromNow() : ''
    },
    fileType(fileName) {
      const arr = fileName?.split('.')
      const type = arr.pop()
      return type
    },
    goBack() {
      this.$router.go(-1)
    },
    gotoDetail(item) {
      // this.folderIdData = item
      switch (item.metaType) {
        case this.metaType.FOLDER: {
          const path = `/document/files/child/${item._id}?folderName=${item.name}&viewType=${this.viewType}`
          const levelList = [
            ...this.levelList,
            {
              title: item.name,
              path: path,
              tags: item.tags
            }
          ]

          this.$store.dispatch('route/setBreadcrumb', levelList)
          this.$router.push(path)
          break
        }
        case this.metaType.FILE:
          this.$router.push(`/document/file/${item._id}`)
          break
        case this.metaType.LINK:
          window.open(item.path, '_blank')
          break
        default:
          break
      }
    },
    addFolder() {
      this.dialogFolder = true
      this.form = {}
      this.$refs.formFolder && this.$refs.formFolder.resetFields()
    },
    addLink() {
      this.formTypeLink = 'create'
      this.formLink = {}
      this.dialogLink = true
      this.$refs.formLink && this.$refs.formLink.resetFields()
    },
    editLink(row) {
      if(row) {
        this.currentFile = { ...row }
      }
      this.formTypeLink = 'edit'
      this.formLink = { ...this.currentFile }
      this.dialogLink = true
    },
    showCategory(type) {
      this.categoryType = type
      this.keyCategory++
      this.isCategory = true
    },
    formatDate(t) {
      return moment.unix(t).format("DD/MM/YYYY")
    },
    handleSubmitLink() {
      this.$refs.formLink.validate(async valid => {
        if (valid) {
          switch (this.formTypeLink) {
            case 'create':
              await FileAPI.create({
                ...this.formLink,
                folderId: this.folderId,
                size: 0,
                type: config.fileType.LINK
              })
              break
            case 'edit':
              await FileAPI.update(this.formLink._id, {
                ...this.formLink
              })
              break
          }
          this.currentFile = {}
          this.dialogLink = false
          eventEmitter.emit('treeChange')
          await this.loadFolder()
        }
      })
    },
    handleSubmitFile() {
      this.$refs.formFile.validate(async valid => {
        const dataSubmit = {
          ...this.formFile,
          name: `${this.formFile.name}.${this.formFile.fileType}`
        }
        delete dataSubmit.__v
        delete dataSubmit._id
        delete dataSubmit.fileType
        if (valid) {
          await FileAPI.update(this.formFile._id, dataSubmit)
          this.dialogFile = false
          await this.loadFolder()
        }
      })
    },
    handleSubmitFolder() {
      this.$refs.formFolder.validate(async valid => {
        if (valid) {
          switch(this.formTypeFolder) {
            case 'create':
              await FolderAPI.create({
                name: this.form.name,
                folderId: this.folderId
              })
              break
            case 'edit': {
              const dataSubmit = {
                ...this.form
              }
              delete dataSubmit.__v
              delete dataSubmit._id
              delete dataSubmit.isActive
              await FolderAPI.update(this.form._id, dataSubmit)
              break
            }
          }
          this.dialogFolder = false
          eventEmitter.emit('treeChange')
          await this.loadFolder()
        }
      })
    },
    async loadFolder() {
      try {
        this.loadingPage = true
        const data = await FolderAPI.getFileAndFolder({ folderId: this.folderId })
        this.loadingPage = false
        this.setDataTable(data)
        this.resultFilter = 0
      } catch (err) {
        this.loadingPage = false
      }
    },
    setDataTable(data) {
      const arr = []
      const { folders, files } = data
      folders.forEach(i => {
        arr.push({ ...i, metaType: this.metaType.FOLDER })
      })
      files.forEach(i => {
        if (i.type === config.fileType.FILE) {
          arr.push({ ...i, metaType: this.metaType.FILE })
        } else if(i.type === config.fileType.LINK) {
          arr.push({ ...i, metaType: this.metaType.LINK })
        }
      })
      this.tableData = arr.map(item => {
        return {
          ...item,
          isActive: false,
          showButton: false
        }
      })
      this.resultFilter = this.tableData.length
      this.selectedList = []
    },
    onProgressUploadFile() {
      this.loadingUpload = true
    },
    async onUploadFileSuccess(res) {
      try {
        await FileAPI.create({ ...res, name: res.fileName, folderId: this.folderId, type: config.fileType.FILE })
        this.loadingUpload = false
        await this.loadFolder()
      } catch (err) {
        this.loadingUpload = false
      }
    },
    async handleRename() {
      const { metaType, _id } = this.currentFile
      switch(metaType) {
        case this.metaType.FILE: {
          this.dialogFile = true
          const file = await FileAPI.getById(_id)
          const arr = file.name.split('.')
          this.formFile = {
            ...file,
            tags: file.tags.map(tag => tag._id),
            fileType: arr.pop()
          }
          break
        }
        case this.metaType.FOLDER: {
          this.dialogFolder = true
          this.formTypeFolder = 'edit'
          const folder = await FolderAPI.getById(_id)
          this.form = {
            ...folder
          }
          break
        }
      }
    },
    async handleDelete(file) {
      switch (file.metaType) {
        case this.metaType.FOLDER:
          await FolderAPI.delete(file._id)
          this.currentFile = {}
          eventEmitter.emit('treeChange')
          break
        default:
          await FileAPI.delete(file._id)
          this.currentFile = {}
          break
      }
      await this.loadFolder()
    },
    getFileSize(value) {
      const fileDetecter = humanFileSize()
      return fileDetecter(value * 1000)
    }
  }
}
</script>

<style lang="scss">
$dark_gray:#889aa4;
.file-child-page {
  position: relative;

  .upload-block {
    .el-upload {
      display: block !important;
      text-align: left !important;
    }
  }

  .category-container {
    padding: 12px;
    max-height: calc(100vh - 90px);
    overflow-y: auto;
  }

  .notify-upload {
    position: absolute;
    right: 20px;
    bottom: 0;
    width: 362px;
    height: 105px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    z-index: 99999;
    -moz-border-radius-topleft: 20px;
    border-radius-topleft: 20px;
    -moz-border-radius-topright: 20px;
    border-radius-topright: 20px;

    .header {
      height: 44px;
      background: #082f63;

      h4 {
        margin: 0;
        padding: 10px 10px;
        color: #f3f4f6;
        float: left;
      }

      .close-btn-notify {
        float: right;
        margin-top: 10px;
        margin-right: 10px;
        cursor: pointer;
      }
    }

    .content {
      height: 51px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
    }
  }

  .table-wrap {
    height: calc(100vh - 203px);
    overflow: auto;
  }
  /* config tag BEGIN */
  .select-tag-input {
    .el-input {
      .el-input__inner {
        padding-left: 55px !important;
        padding-top: 2px !important;
      }
    }
  }

  .quanity-tag {
    font-size: 11px;
    color: #aaa;
    font-weight: bold;
    margin-left: 2px;
  }
  .custom-created-tag {
    position: relative;
    .custom-show-more {
      position: absolute;
      right: 0;
    }
  }

  .select-tag-custom {
    .el-input {
      .el-icon-arrow-up {
        visibility: hidden;
      }
    }
  }

  .tag-helper {
    margin-top: 20px;
    color: #bbbfc8;
  }

  .tag-custom {
    background-color: #dde1ea;
    color: #3a3a3a;
  }

  .tag-custom {
    margin-right: 10px;
    margin-top: 10px;
  }

  .suggest-tag {
    margin-top: 20px;
    min-height: 200px;
  }

  .tag-list-suggest {
    display: flex;

    .el-tag {
      cursor: pointer;
      margin: 0 10px 10px 0;
    }
  }

  .tag-list-created {
    .tag-row {
      margin-bottom: 10px;

      .el-tag {

      }
    }
  }
  /* config tag END */

  /* config share BEGIN */
  .el-dialog__body {
    padding: 12px 10px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #ebeef5 !important;
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

  .people-share-select {
    width: 240px !important;
    input {
      border: none;
    }
  }

  .people-share {
    .el-input {
      padding-left: 0px;

      input {
        border: none;
      }

      .el-input__suffix {
        display: block !important;
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
        //text-align: right;
      }

      .el-input__suffix {
        display: block !important;

        .el-icon-arrow-up {
          color: black;
        }
      }
    }

  }
  .member-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
    padding: 0 10px;
    border-left: 2px solid #082f63;
  }
  .label-info {
    color: #1a1a1a;
    font-weight: 600;
    font-size: .9rem;
    margin: 3px 0;
  }

  .member-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .member-name {
    font-weight: 600;
  }
  /* config share END */

  .icon-status {
    vertical-align: middle;
    width: 8px !important;
    height: 8px !important;
    border-radius: 50%;
    position: absolute;
    display: inline-block;
    top: 21px;
  }

  .title-status {
    margin-left: 15px;
    //font-size: 0.9rem;
  }

  .icon-svg {
    margin-right: 5px;
    font-size: 20px !important;
  }

  .blank-page {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 60px;
    flex-direction: column;
    height: calc(100vh - 203px);
  }

  .checkbox-select {
    vertical-align: text-bottom;
    margin-right: 8px;
    //display: none;
  }
}
.svg-container {
  padding: 10px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.current-folder {
  border: none;
  padding: 0 0 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__body {
  padding: 12px 10px;
}

.el-dialog__header {
  border-bottom: 1px solid #ebeef5 !important;
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
.people-share {
  .el-input {
    padding-left: 0px;

    input {
      border: none;
    }

    .el-input__suffix {
      display: block !important;
    }
  }

  .el-table {
    font-size: 1.1vw !important;
  }
}
</style>
