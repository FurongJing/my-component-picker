// components/pickerview/pickerview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 显示pickerview的数据
    schoolColumn: {  // 受教育程度-小学、初中、高中等
      type: Array,
      value: [],
      observer: function (newVal) {
        // 保证传入的数据长度不为0并且传入的数组元素为对象
        let isObject = (typeof ([...newVal]) === 'object')
        if (newVal.length === 0 || !isObject) return;
      }
    },

    gradeColumn: {  // 年级-如初一、初二
      type: Array,
      value: [],
      observer: function (newVal) {
        let isObject = (typeof ([...newVal]) === 'object')
        if (newVal.length === 0 || !isObject) return;
      }
    },

    classColumn: {  // 班级
      type: Array,
      value: [],
      observer: function (newVal) {
        let isObject = (typeof ([...newVal]) === 'object')
        if (newVal.length === 0 || !isObject) return;
      }
    },

    // 设置用户设置的默认初始显示的数据
    defaultPickerData: {
      type: Array,
      value: [],
      observer: function (newVal) {
        if (newVal.length === 0) return;
        this._setDefault(newVal)
      }
    },
    indicatorStyle: String, // 设置选择器中间选中框的样式
    maskStyle: String //设置蒙层的样式
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false,    // 控制是否打开picker
    firstColumn: [],  // 显示在第一列的数据
    secondColumn: [],  // 显示在第二列的数据
    thirdColumn: [],  // 显示在第三列的数据
    isFirstOpen: true, // 默认是第一次打开picker
    choosedData: [], // 用户最终选择的name值
    lastValue: [], // 前一次各个colum的选择的id值
    value: [], // picker-view的value属性,用来指定默认显示的数据
    columns: 0 // 记录picker-view有几列
  },

  lifetimes: {
    // 在组件完全初始化完毕、进入页面节点树后。
    attached: function () {
      /**
       * 根据传入的数据来判断当前有几列
       */
      let { schoolColumn, gradeColumn, classColumn} = this.properties
      if(schoolColumn.length != 0){
        if(gradeColumn.length != 0){
          if (classColumn.length != 0) {
            this.data.columns = 3
          }else{
            this.data.columns = 2
          }
        }else {
          this.data.columns = 1
        }
      }else {
        wx.showModal({
          title: '提示',
          content: '至少需要传入一列数据才能显示pickerview',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } 
      // 将newValue显示到pickerView中
      this._setPickerViewData();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 对pickerview的滚动做监听
     */
    _bindchange(e) {
      let { firstColumn, lastValue, choosedId, columns} = this.data
      // 滚动后的下标数组
      let changeValue = e.detail.value
      let compareIndex = this._getScrollCompareIndex(lastValue, changeValue);

      // 若columns大于1列的话，需要联动前两列的数据
      if(columns > 1) {
        compareIndex = this._getScrollCompareIndex(lastValue, changeValue);

        // 判断是否时候第一列在滚动，若是的话则改变第二列的数据。
        if (compareIndex == 1) {
          // 通过选择的第一列下标获得第一列选择的数据
          let chooseObj = firstColumn[changeValue[0]]
          this.setData({
            secondColumn: this._getMatchColumn(chooseObj, "firstCol")
          })
          changeValue = [changeValue[0], 0, 0]
          this._setDefault(changeValue)
        }
      }

      if (compareIndex == 1) {
        // 通过选择的第一列下标获得第一列选择的数据
        let chooseObj = firstColumn[changeValue[0]]
        this.setData({
          secondColumn: this._getMatchColumn(chooseObj, "firstCol")
        })
        changeValue = [changeValue[0], 0, 0]
        this._setDefault(changeValue)
      }

      this.setData({
        lastValue: changeValue,
        choosedData: this._getChoosedDataById(changeValue)
      })
      this.triggerEvent('Change', this.data.choosedData)
    },

    /**
     * 给picker-view设置初始值
     * @defaultPickerData(Array) 初始显示数据的下标数组
     */
    _setDefault(defaultPickerData) {
      // 保证接收到的初始值为数组，并且数组的长度不为0
      if (Array.isArray(defaultPickerData) && defaultPickerData.length > 0) {
        this.setData({
          value: defaultPickerData
        })
      }
    },

    /**
     * 定义初始的lastVal和tempVal
     */
    _setPickerViewData() {
      let { defaultPickerData, schoolColumn, classColumn} = this.properties
      let columns = this.data.columns
      // 判断是否有设置有默认显示数据
      if (defaultPickerData.length == 0) {
        defaultPickerData = [...new Array(columns).keys()].map(() => 0)
      }

      // 无pickerview默认值，默认第一列选择下标为0的数据
      let gradeColumn = []
      if(columns > 1) {
        gradeColumn = this._getMatchColumn(schoolColumn[defaultPickerData[0]], "firstCol")
      }
      this.setData({
        firstColumn: schoolColumn,
        secondColumn: gradeColumn,
        thirdColumn: classColumn,
        lastValue: defaultPickerData
      })
    },

    /**
     *  根据前一列的已选的数据从下一列的给定的数组中找出相匹配的选择项
     *  @preVal（Object） 前一列选择的数据
     *  @whichCol(String) 哪一列传来的数据,可选项为firstCol,secondCol,thirdCol
     */
    _getMatchColumn(preVal, whichCol) {
      let { schoolColumn, gradeColumn, classColumn } = this.properties

      // 判断是哪一列传来的数据，方便获取下一列数据
      if (whichCol == 'firstCol') {
        let len = gradeColumn.length
        let nextCol = []
        for (let i = 0; i < len; i++) {
          if (gradeColumn[i].schoolId == preVal.schoolId) {
            nextCol.push(gradeColumn[i])
          }
        }
        return nextCol
      }
      return
    },

    /**
     * 获取到用户改变的是第几列的数据，默认第一次改变返回的结果为-1
     * @arr1(Array) 前一次选择的下标数组
     * @arr2(Array) 最新一次选择的下标数组
     */
    _getScrollCompareIndex(arr1, arr2) {
      let tempIndex = -1;
      for (let i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
          tempIndex = i + 1;
          break;
        }
      }
      return tempIndex;
    },

    /**
     * 根据选择的下标来获取选择的value值
     * 若班级不选的话不展示在界面上
     * @chooseArr（Array） 已选择的下标数组
     */
    _getChoosedDataById(chooseArr) {
      let choosedData = "";
      let { firstColumn, secondColumn, thirdColumn, columns} = this.data
      switch (columns) {
        case 1:
          choosedData = firstColumn[chooseArr[0]].schoolName
          return choosedData;
        case 2:
          choosedData = (firstColumn[chooseArr[0]].schoolName) + "," + (secondColumn[chooseArr[1]].gradeName)
          return choosedData
        case 3:
          choosedData = (firstColumn[chooseArr[0]].schoolName) + "," + (secondColumn[chooseArr[1]].gradeName)
          let classId = thirdColumn[chooseArr[2]].classId
          if (classId != 9999) {
            choosedData += "," + thirdColumn[chooseArr[2]].className
          }
          return choosedData;
      }
    }
  }
})
