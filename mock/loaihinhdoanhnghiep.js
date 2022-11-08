module.exports = [
  {
    url: '/vue-admin-template/loaihinhdoanhnghiep',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/loaihinhdoanhnghiep',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Doanh nghiệp Nhà nước", status: 1, ngayKhoiTao: 1602748920314 },
          {
            _id: 2,
            ten: "Doanh nghiệp ngoài Nhà nước",
            options: [
              "Công ty TNHH",
              "Công ty cổ phần",
              "Đơn vị sự nghiệp ngoài công lập",
              "Hợp tác xã",
              "Doanh nghiệp khác"
            ],
            status: 1,
            ngayKhoiTao: 1602748920314
          },
          { _id: 3, ten: "Doanh nghiệp có vốn nước ngoài", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/loaihinhdoanhnghiep/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/loaihinhdoanhnghiep/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
