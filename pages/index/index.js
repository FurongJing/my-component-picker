//index.js
//获取应用实例

Page({
  data: {
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
  
  bindChange: function (e) {
    this.setData({
      chooseData: e.detail
    })
  }
})
