module.exports = [
  {
    url: '/vue-admin-template/nganhnghe',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nganhnghe',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [
          { _id: 1, ten: "Sx, gia công màn hình cảm ứng đt, mtb", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 2, ten: "In lụa, chuyên gia công phụ liệu giày", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 3, ten: "Sx linh kiện điện tử", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 4, ten: "Sx giày da", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 5, ten: "Sx mặt kính bảo vệ đồng hồ, đt, mt và các sp khác của samsung", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 6, ten: "Xuất nhập khẩu thủy hải sản", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 7, ten: "May balo, túi xách", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 8, ten: "Sx Bóng đèn", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 9, ten: "Sx đồ chơi trẻ em", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 10, ten: "Sx, gia công giày dép xuất khẩu", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 11, ten: "Chế biến thủy hải sản", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 12, ten: "Sx vali, túi xách", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 13, ten: "Sx, gia công nguyên vật liệu phục vụ ngành giày da", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 14, ten: "Sx sp nhựa plastic", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 15, ten: "Sx sắt, gang thép", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 16, ten: "Sx, gia công sp may mặc xuất khẩu", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 17, ten: "Sx đồ may mặc", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 18, ten: "Sx đồ gỗ", status: 1, ngayKhoiTao: 1602748920314 },
          { _id: 19, ten: "Sx, gia công da giả", status: 1, ngayKhoiTao: 1602748920314 },
        ]
      }
    }
  },

  {
    url: '/vue-admin-template/nganhnghe/:id',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/nganhnghe/:id',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
