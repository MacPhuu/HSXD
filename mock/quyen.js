module.exports = [
  {
    url: '/vue-admin-template/quyen',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/quyen',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Quản trị viên", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Quản lý TƯLĐTT", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Quản lý tư vấn pháp luật", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Quản lý tranh chấp đình công", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 5, ten: "Quản lý Hà Nội", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 6, ten: "Quản lý Đà Nẵng", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/quyen/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/quyen/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
