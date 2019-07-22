// components/picker2/picker.js
import { isString, isPlainObject } from './tool';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示Picker
    isShowPicker: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          this._openPicker()
        } else {
          this._closePicker()
        }
      }
    },

    // 设置title
    titleText: {
      type: String,
      value: "自定义标题"
    },

    // 显示pickerview的数据
    schoolColumn: {  // 受教育程度-小学、初中、高中等
      type: Array,
      value: [],
      observer: function (newVal) {
        // 保证传入的数据长度不为0并且传入的数组元素为对象
        let isObject = (typeof ([...newVal]) === 'object')
        if (newVal.length === 0 || !isObject) return;
        
        // 将newValue显示到pickerView中
        this._setPickerViewData();
        // this._setDefault()
      }
    },

    gradeColumn: {  // 年级-如初一、初二
      type: Array,
      value: [],
      observer: function(newVal) {
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
    // 联动的类型："link": scroll间联动  "normal": scroll相互独立
    scrollType: {
      type: String,
      value: "link"
    },
    columns: Number, // picker-view有几列
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
    tempValue: [], // 记录选择器改变后的下标值
    value: [], // picker-view的value属性,用来指定默认显示的数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听取消按钮的点击
     */
    cancelBtn() {
      this.triggerEvent('cancle')
      this._closePicker()
    },
    
    /**
     * 监听确定按钮的点击
     */
    sureBtn() {
      // 第一次打开picker
      if (this.data.isFirstOpen) {
        this.setData({
          isFirstOpen: false,
        })
      } 
      // 需要将当前选择的值记录
      this.setData({
        lastValue: this.data.tempValue,
        choosedData: this._getChoosedDataById(this.data.tempValue)
      })
      this.triggerEvent('sure', this.data.choosedData)
      this._closePicker()
    },

    /**
     * 对pickerview的选择做监听
     */
    _bindchange(e) {
      let { scrollType } = this.properties
      let { firstColumn, lastValue, choosedId, tempValue } = this.data
      let changeValue = e.detail.value
      switch (scrollType) {
        case "link":
          let compareIndex = this._getScrollCompareIndex(tempValue, changeValue);
          this.data.tempValue = changeValue

          // 判断是否时候第一列在滚动，若是的话则改变第二列的数据。
          if (compareIndex == 1) {
            // 通过选择的第一列下标获得第一列选择的数据
            let chooseObj = firstColumn[changeValue[0]]
            this.setData({
              secondColumn: this._getMatchColumn(chooseObj, "firstCol")
            })
            this._setDefault([changeValue[0], 0, 0])
            this.setData({
              tempValue: [changeValue[0], 0, 0]
            })
          }
      }
    },

    /**
     * 打开picker
     */
    _openPicker() {
      this._setDefault(this.data.lastValue)
      this.setData({
        isOpen: true
      })
    },

    /**
     * 关闭picker
     */
    _closePicker() {
      this.setData({
        isOpen: false
      })
    },
    
    /**
     * 定义初始的lastVal和tempVal
     */
    _setPickerViewData() {
      let { defaultPickerData, schoolColumn, classColumn, columns } = this.properties
      // 判断是否有设置有默认显示数据
      if (defaultPickerData.length == 0) {
        defaultPickerData = [...new Array(columns).keys()].map(() => 0)
      }

      // 无pickerview默认值，默认第一列选择下标为0的数据
      let gradeColumn = this._getMatchColumn(schoolColumn[defaultPickerData[0]], "firstCol")
      this.setData({
        firstColumn: schoolColumn,
        secondColumn: gradeColumn, 
        thirdColumn: classColumn,
        lastValue: defaultPickerData,
        tempValue: defaultPickerData
      })
    },
    
    /**
     *  根据前一列的已选的数据从下一列的给定的数组中找出相匹配的选择项
     *  @preVal（Object） 前一列选择的数据
     *  @whichCol(String) 哪一列传来的数据,可选项为firstCol,secondCol,thirdCol
     */
    _getMatchColumn(preVal, whichCol) {
      let {schoolColumn, gradeColumn, classColumn} = this.properties
     
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
     * 给picker-view设置初始值
     * @defaultPickerData(Array) 初始显示数据的下标数组
     */
    _setDefault(defaultPickerData) { 
      let {scrollType} = this.properties
      switch (scrollType) {
        case "link":
          // 保证接收到的默认值为数组，并且数组的长度不为0
          if (Array.isArray(defaultPickerData) && defaultPickerData.length > 0) {
            this.setData({
              value: defaultPickerData
            })
          }
          break;
      }
    },

    /**
     * 根据选择的下标来获取选择的value值
     * 若班级不选的话不展示在界面上
     * @chooseArr（Array） 已选择的下标数组
     */
    _getChoosedDataById(chooseArr) {
      let choosedData = "";
      let { firstColumn, secondColumn, thirdColumn } = this.data
      choosedData = (firstColumn[chooseArr[0]].schoolName) + "," + (secondColumn[chooseArr[1]].gradeName)
      let classId = thirdColumn[chooseArr[2]].classId
      if (classId != 9999) {
        choosedData += "," + thirdColumn[chooseArr[2]].className
      }
      return choosedData
    }
    
  }
})
