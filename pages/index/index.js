//index.js
//获取应用实例

Page({
  data: {
    // isShow_00: false,
    // isShow_01: false,
    // isShow_02: false,

    // columnsData_00: [['太阳', '月亮', '星星', '地球', '火星']],
    // defaultPickerData_00: [2],
    // chooseData_00: [],

    // columnsData_01: [['男', '女'], ['已婚', '未婚'], ['求职', '在职', '离职']],
    // defaultPickerData_01: [0, 1, 0],
    // chooseData_01: [], // 选中的数据
    
    // columnsData_02: [
    //   {
    //     name: '幼儿园',
    //     id: 1,
    //     children: [
    //       {
    //         name: '托班',
    //         id: 11,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 111
    //           }
    //         ]
    //       },
    //       {
    //         name: '小班',
    //         id: 12,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 121
    //           },
    //           {
    //             name: '二班',
    //             id: 122
    //           }
    //         ]
    //       },
    //       {
    //         name: '中班',
    //         id: 13,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 131
    //           },
    //           {
    //             name: '二班',
    //             id: 132
    //           }
    //         ]
    //       },
    //       {
    //         name: '大班',
    //         id: 14,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 141
    //           },
    //           {
    //             name: '二班',
    //             id: 142
    //           },
    //           {
    //             name: '三鱼',
    //             id: 143
    //           }
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     name: '小学',
    //     id: 2,
    //     children: [
    //       {
    //         name: '一年级',
    //         id: 21,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 211
    //           },
    //           {
    //             name: '二班',
    //             id: 212
    //           },
    //           {
    //             name: '三班',
    //             id: 213
    //           }
    //         ]
    //       },
    //       {
    //         name: '二年级',
    //         id: 22,
    //         children: [
    //           {
    //             name: '一班',
    //             id: 221
    //           },
    //           {
    //             name: '二班',
    //             id: 222
    //           },
    //           {
    //             name: '三班',
    //             id: 223
    //           },
    //           {
    //             name: '四班',
    //             id: 224
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     name: '初中',
    //     id: 3,
    //     children: [
    //       {
    //         name: '初一',
    //         id: 31,
    //         children: [
    //           {
    //             name: '1901班',
    //             id: 311
    //           },
    //           {
    //             name: '1902班',
    //             id: 312
    //           },
    //           {
    //             name: '1903班',
    //             id: 313
    //           }
    //         ]
    //       },
    //       {
    //         name: '初二',
    //         id: 32,
    //         children: [
    //           {
    //             name: '1801班',
    //             id: 321
    //           },
    //           {
    //             name: '1802班',
    //             id: 322
    //           },
    //           {
    //             name: '1803班',
    //             id: 323
    //           }
    //         ]
    //       },
    //       {
    //         name: '初三',
    //         id: 33,
    //         children: [
    //           {
    //             name: '1701班',
    //             id: 331
    //           },
    //           {
    //             name: '1702班',
    //             id: 332
    //           },
    //           {
    //             name: '1703班',
    //             id: 333
    //           },
    //           {
    //             name: '1704班',
    //             id: 334
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ],
  
    // defaultPickerData_02: [
    //   { id: 2 }, { id: 21 }, { id: 213 }
    // ],
    // chooseData_02: [], // 选中的数据

    schoolColumn: [
      {
        schoolName: '幼儿园',
        schoolId: 1
      },
      {
        schoolName: '小学',
        schoolId: 2
      },
      {
        schoolName: '初中',
        schoolId: 3
      }
    ],
    gradeColumn: [
      {
        schoolId: 1,
        gradeName: '小班',
        gradeId: 101
      },
      {
        schoolId: 1,
        gradeName: '中班',
        gradeId: 102
      },
      {
        schoolId: '01',
        gradeName: '大班',
        gradeId: 103
      },
      {
        schoolId: 2,
        gradeName: '一年级',
        gradeId: 204
      },
      {
        schoolId: 2,
        gradeName: '二年级',
        gradeId: 205
      },
      {
        schoolId: 3,
        gradeName: '初一',
        gradeId: 301
      },
      {
        schoolId: 3,
        gradeName: '初二',
        gradeId: 302
      },
      {
        schoolId: 3,
        gradeName: '初三',
        gradeId: 303
      }
    ],
    classColumn: [
      {
        className: '不选',
        classId: 9999
      },
      {
        className: '一班',
        classId: 1
      },
      {
        className: '二班',
        classId: 2
      },
      {
        className: '三班',
        classId: 3
      },
      {
        className: '四班',
        classId: 4
      }
    ],
    columns: 3,
    chooseData: [],
    defaultPickerData: [1, 0, 1],
  },
  
  showPicker_03: function () {
    this.setData({
      isShow_03: true
    })
  },
  cancelPicker_03: function (e) {
    this.setData({
      isShow_03: false
    })
  },
  surePicker_03(e) {
    this.setData({
      isShow_03: false,
      chooseData: e.detail
    })
  }
  // 显示picker
  // showPicker_00: function () {
  //   this.setData({
  //     isShow_00: true
  //   })
  // },
  // // 点击取消按钮触发的事件
  // cancelPicker_00: function (e) {
  //   this.setData({
  //     isShow_00: false
  //   })
  // },
  // // 点击确定按钮，将选择的数据显示在页面上
  // surePicker_00(e) {
  //   this.setData({
  //     isShow_00: false,
  //     chooseData_00: e.detail
  //   })
  // },

  // showPicker_01: function () {
  //   this.setData({
  //     isShow_01 : true
  //   })
  // },
  // cancelPicker_01: function (e) {
  //   this.setData({
  //     isShow_01: false
  //   })
  // },
  // surePicker_01(e) {
  //   this.setData({
  //     isShow_01: false,
  //     chooseData_01: e.detail
  //   })
  // },

  // showPicker_02: function () {
  //   this.setData({
  //     isShow_02: true
  //   })
  // },
  // cancelPicker_02: function (e) {
  //   this.setData({
  //     isShow_02: false
  //   })
  // },
  // surePicker_02(e) {
  //   this.setData({
  //     isShow_02: false,
  //     chooseData_02: JSON.stringify(e.detail)
  //   })
  // },
})
