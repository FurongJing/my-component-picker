//index.js
//获取应用实例

Page({
  data: {
    isShow: false,
    columnsData_00: [['太阳', '月亮', '星星', '地球', '火星']],
    defaultPickerData_00: [1],
    columnsData_01: [['男', '女'], ['已婚', '未婚'], ['在职', '离职']],
    defaultPickerData_01: [0, 1, 0],
    chooseData: [], // 选中的数据
    chooseIndex: "", //选中的索引
    columnsData_02: [
      {
        name: '动物',
        id: 1,
        children: [
          {
            name: '鱼',
            id: 11,
            children: [
              {
                name: '草鱼',
                id: 111
              },
              {
                name: '鲫鱼',
                id: 112
              },
              {
                name: '鲢鱼',
                id: 113
              }
            ]
          },
          {
            name: '蛇',
            id: 12,
            children: [
              {
                name: '蟒蛇',
                id: 121
              },
              {
                name: '眼镜蛇',
                id: 122
              },
              {
                name: '水蛇',
                id: 123
              }
            ]
          }
        ]
      },
      {
        name: '植物',
        id: 2,
        children: [
          {
            name: '树',
            id: 21,
            children: [
              {
                name: '梧桐树',
                id: 211
              },
              {
                name: '银杏树',
                id: 212
              },
              {
                name: '杉树',
                id: 213
              }
            ]
          },
          {
            name: '花',
            id: 22,
            children: [
              {
                name: '玫瑰',
                id: 221
              },
              {
                name: '紫罗兰',
                id: 222
              },
              {
                name: '菊花',
                id: 223
              },
              {
                name: '牡丹',
                id: 224
              }
            ]
          }
        ]
      }
    ],
    defaultPickerData_02: [
      { id: 2 }, { id: 21 }, { id: 213 }
    ]
  },
  // 显示picker
  showPicker: function() {
    this.setData({
      isShow: true
    })
  },
  // 点击取消按钮触发的事件
  cancelPicker: function(e) {
    this.setData({
      isShow: false
    })
  },
  // 点击确定按钮，将选择的数据显示在页面上
  surePicker(e) {
    // e为一个数据，是选中要显示在页面上的值
    // let chooseContent = new Array(index.length).fill(0)
    // for(let i = 0; i < index.length; i++) {
    //   chooseContent[i] = this.data.columnsData[i][index[i]]
    // }
    this.setData({
      isShow: false,
      // chooseIndex: index,
      chooseData: e.detail.value
    })
  },
  surePicker_02(e) {
    this.setData({
      isShow: false,
      chooseData: JSON.stringify(e.detail)
      // chooseIndex: JSON.stringify(e.detail.choosedIndexArr)
    })
  }
})
