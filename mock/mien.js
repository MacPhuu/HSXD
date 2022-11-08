module.exports = [
  {
    url: '/vue-admin-template/mien',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/mien',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Miền Bắc", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Miền Trung", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Miền Nam", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/mien/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/mien/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
