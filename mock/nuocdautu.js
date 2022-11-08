module.exports = [
  {
    url: '/vue-admin-template/nuocdautu',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nuocdautu',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Hàn Quốc", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Nhật Bản", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Đài Loan", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Trung Quốc", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 5, ten: "Các nước khác", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/nuocdautu/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nuocdautu/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
