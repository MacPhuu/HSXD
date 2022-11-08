module.exports = [
  {
    url: '/vue-admin-template/donvi',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/donvi',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Xí nghiệp may 10", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Tổng công ty sông Đà", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Công ty may Việt Nam xuất khẩu", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Công ty khoáng sản Quảng Ninh", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/donvi/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/donvi/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
