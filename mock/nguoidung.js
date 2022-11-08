module.exports = [
  {
    url: '/vue-admin-template/nguoidung',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nguoidung',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, tenDangNhap: "tunghs", hoVaTen: "Hồ Sơn Tùng", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, tenDangNhap: "haoht", hoVaTen: "Hoàng Trần Hảo", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, tenDangNhap: "daonc", hoVaTen: "Nguyễn Công Đào", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/nguoidung/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nguoidung/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
