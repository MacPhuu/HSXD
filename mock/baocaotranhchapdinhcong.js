module.exports = [
  {
    url: '/vue-admin-template/baocaotranhchapdinhcong',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/baocaotranhchapdinhcong',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          loaiHinhDoanhNghiep: [{
            ten: "Doanh nghiệp nhà nước",
            soVu: 0,
            tyLePhanTram: 0.00
          }, {
            ten: "Doanh nghiệp có vốn đầu tư nước ngoài",
            soVu: 73,
            tyLePhanTram: 85.88
          },
            {
              ten: "Doanh nghiệp dân doanh",
              soVu: 12,
              tyLePhanTram: 14.12
            },
            {
              ten: "Tong",
              soVu: 85,
              tyLePhanTram: null
            },
          ],
          doiTacDauTuNuocNgoai: [
            {
              ten: "Hàn Quốc",
              soVu: 31,
              tyLePhanTram: 42.47
            },
            {
              ten: "Nhật Bản",
              soVu: 6,
              tyLePhanTram: 8.22
            }
          ],
          nganhNgheKinhDoanh: [
            {
              ten: "Ngành dệt may",
              soVu: 35,
              tyLePhanTram: 41.18
            },
            {
              ten: "Ngành giày da",
              soVu: 9,
              tyLePhanTram: 10.59
            },
            {
              ten: "Ngành điện tử",
              soVu: 9,
              tyLePhanTram: 10.59
            },
            {
              ten: "Ngành chế biến gỗ",
              soVu: 9,
              tyLePhanTram: 10.59
            },
            {
              ten: "Tổng",
              soVu: 9,
              tyLePhanTram: 10.59
            }
          ]
        },
      }
    }
  }
]
