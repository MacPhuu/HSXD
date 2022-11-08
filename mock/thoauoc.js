module.exports = [
  {
    url: '/vue-admin-template/thoauoc',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/thoauoc',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ma: "TƯLĐTT samsung", donvi: "Samsung Bắc Ninh", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ma: "TƯLĐTT dệt may 10", donvi: "Dệt may 10", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ma: "TƯLĐTT canon", donvi: "Canon Sóc Sơn", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ma: "TƯLĐTT gang thép Thái Nguyên", donvi: "Thái Nguyên", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/thoauoc/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/thoauoc/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
