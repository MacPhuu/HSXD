module.exports = [
  {
    url: '/vue-admin-template/vung',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/vung',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Vùng 1", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Vùng 2", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Vùng 3", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Vùng 4", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/vung/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/vung/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
