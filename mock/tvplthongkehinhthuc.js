module.exports = [
  {
    url: '/vue-admin-template/tvplhinhthuc',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/tvplhinhthuc',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ma: "TVPL - Hình thức tổ chức - Tháng 1", donvi: "Samsung Bắc Ninh", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ma: "TVPL - Hình thức tổ chức - Tháng 1", donvi: "Dệt may 10", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ma: "TVPL - Hình thức tổ chức - Tháng 1", donvi: "Canon Sóc Sơn", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ma: "TVPL - Hình thức tổ chức - Tháng 1", donvi: "Gang thép Thái Nguyên", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/tvplhinhthuc/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/tvplhinhthuc/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
