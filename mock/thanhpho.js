module.exports = [
  {
    url: '/vue-admin-template/thanhpho',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/thanhpho',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Hà Nội", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Đà Nẵng", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Hồ Chí Minh", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Nha Trang", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 5, ten: "Quảng Ninh", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/thanhpho/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/thanhpho/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
