module.exports = [
  {
    url: '/vue-admin-template/nganhchinh',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nganhchinh',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Bưu chính - Viễn thông", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "Cao su", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Công nghiệp tàu thủy", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Công nghiệp", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 5, ten: "Dầu khí", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 6, ten: "Dệt may", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 7, ten: "Dịch vụ", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 8, ten: "Đường sắt", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 9, ten: "Điện lực", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 10, ten: "Giao thông vận tải", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 11, ten: "Giáo dục và đào tạo", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 12, ten: "Ngân hàng", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 13, ten: "Nông nghiệp", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 14, ten: "Hàng Hải", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 15, ten: "Than - Khoáng sản", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 16, ten: "Thương mại", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 17, ten: "Xây dựng", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 18, ten: "Y tế", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 19, ten: "Khác", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/nganhchinh/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nganhchinh/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
