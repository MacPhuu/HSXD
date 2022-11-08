const domain = process.env['VUE_APP_BASE_API'] || 'https://api.hsclso.vn/customer-backend'
// const domain = process.env['VUE_APP_BASE_API'] || 'http://192.168.16.106:8004'
const domainAuth = process.env['VUE_APP_AUTH_API'] || 'https://api.hsclso.vn/customer-authorization'
// const domainAuth = process.env['VUE_APP_AUTH_API'] || 'http://192.168.16.106:8002'
const domainUpload = process.env['VUE_APP_UPLOAD_API'] || 'https://api.hsclso.vn/customer-upload'
// const domainUpload = process.env['VUE_APP_UPLOAD_API'] || 'http://192.168.0.110:8000'

const config = {
  userKey: 'userinfo',
  tokenKey: 'access-token',
  permissionKey: 'permission',
  projectKey: 'projects',
  biddingProjectKey: 'biddingProjects',
  projectIdKey: 'projectId',
  biddingProjectIdKey: 'biddingProjectId',
  checkContractorKey: 'checkContractor',
  api: {
    base: domain,
    auth: `${domainAuth}`,
    upload: `${domainUpload}/upload`,
    download: `${domainUpload}`,
    downloadMultiFile: `${domain}`,
    user: `${domainAuth}/user`,
    member: `${domain}/member`,
    project: `${domain}/project`,
    phase: `${domain}/phase`,
    supplier: `${domain}/supplier`,
    file: `${domain}/file`,
    digitalDocument: `${domain}/digitalDocument`,
    folder: `${domain}/folder`,
    fileAndFolder: `${domain}/folder/list`,
    signRequest: `${domain}/signRequest`,
    sign: `${domain}/sign`,
    inbox: `${domain}/inbox`,
    tag: `${domain}/tag`,
    search: `${domain}/search`,
    userProject: `${domainAuth}/userproject`,
    roleFolder: `${domain}/roleFolder`,
    category: `${domain}/category`,
    categoryV2: `${domain}/managecategory`,
    categoryDetail: `${domain}/categorydetail`
  },
  categoryType: {
    MATERIAL: 1,
    TASK: 2,
    SOURCE_MATERIAL: 3
  },
  role: {
    MANAGER: 1,
    MEMBER: 2
  },
  roleMap: {
    1: 'Quản lý',
    2: 'Thành viên'
  },
  httpCode: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    TOKEN_EXPIRED: 409,
    UNKNOWN_ERROR: 520,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    ADMIN_REQUIRE: 406
  },
  signType: {
    SIGN: 1,
    APPROVE: 2
  },
  fileStatus: {
    TOTAL: 99,
    PENDING: 1,
    COMPLETE: 2,
    REJECT: 3,
    RETRIEVAL: 4
  },
  viewType: {
    LIST: 1,
    GRID: 2,
  },
  fileType: {
    FILE: 1,
    LINK: 2
  },
  statuses: [
    {
      value: 5,
      label: 'Tất cả'
    },
    {
      value: 6,
      label: 'Chưa số hóa'
    },
    {
      value: 1,
      label: 'Đang chờ'
    },
    {
      value: 2,
      label: 'Hoàn thành'
    },
    {
      value: 3,
      label: 'Từ chối'
    },
    {
      value: 4,
      label: 'Thu hồi'
    }
  ],
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
    }
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
  fileTypeMap: {
    1: 'File',
    2: 'Link'
  },
  numberMap: {
    1: 'Có',
    0: 'Không'
  },
  genderMap: {
    0: "Nam",
    1: "Nữ"
  },
  statusColorMap: {
    total: "info",
    complete: "success",
    processing: "primary",
    expire: "danger",
    warning: "warning"
  },
  localKeys: {
    fields: "FIELDS_CONFIG"
  },
  methodAPI: ['get', 'post', 'put', 'delete'],
  stateConfig: [
    {
      title: 'Tất cả',
      status: 99,
      color: 'rgb(7, 47, 98)',
      isActive: false
    },
    {
      title: 'Đang chờ',
      status: 1,
      color: 'rgb(31, 78, 218)',
      isActive: false
    },
    {
      title: 'Hoàn thành',
      status: 2,
      color: 'rgb(5, 151, 106)',
      isActive: false
    },
    {
      title: 'Từ chối',
      status: 3,
      color: 'rgb(214, 60, 60)',
      isActive: false
    },
    {
      title: 'Thu hồi',
      status: 4,
      color: 'rgb(247, 158, 12)',
      isActive: false
    }
  ]
}

export default config
