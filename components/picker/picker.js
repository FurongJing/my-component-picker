// components/picker/picker.js
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
      observer: function(newVal) {
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
    columnsData: { 
      type: Array,
      value: [],
      observer: function(newVal) {
        // 保证传入的数据长度不为0
        if(newVal.length === 0) return;
        this._setPickerViewData(newVal);
        
        // 将lastValue初始值设置为下边为0的数组
        // let tempArr = [...new Array(newVal.length).keys()].map(() => 0);
        // this.data.lastValue = this.data.tempValue = tempArr;
        this._setDefault()
      }
    },
    // 设置用户设置的默认初始显示的数据
    defaultPickerData: {
      type: Array,
      value: [],
      observer: function (newVal) {
        if (newVal.length === 0 ) return;
        this._setTempData();
        this._setDefault()
      }
    },
    // 联动的类型："link": scroll间联动  "normal": scroll相互独立
    scrollType: {
      type: String,
      value: "normal" 
    },
    // 使用关键字来显示选项
    keyWordOfShow: {
      type: String,
      value: "name"
    },
    indicatorStyle: String, // 设置选择器中间选中框的样式
    maskStyle: String //设置蒙层的样式
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false,    // 控制是否打开picker
    showOptions: [],  // 显示可供选择的数据
    isFirstOpen: true, // 默认是第一次打开picker
    choosedData: [], // 记录当前的选择
    lastValue: [], // 上次各个colum的选择的值
    tempValue: [],
    onlyKey: '',
    value: [], //picker-view的value属性,用来指定默认显示的数据
    listDataTemp: '',
    defaultPickerDataTemp: '',
    isUseKeywordOfShow: false, //是否使用了关键字
    backData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 绑定取消按钮的点击事件
    cancelBtn() {
      this.triggerEvent('cancle')
      this._closePicker()
    },
     // 绑定确定按钮的点击事件
    sureBtn() {
      // 如果是第一次打开picker
      if(this.data.isFirstOpen ) {
        this.setData({
          isFirstOpen: false,
          choosedData: this._getBackDataFromValue(this.data.tempValue)
        })
      }else {
        // 如果不是第一次打开picker-view，需要将当前选择的值记录到
        this.setData({
          lastValue: this.data.tempValue,
          choosedData: this._getBackDataFromValue(this.data.tempValue)
        })
      }
      if (isPlainObject(this.data.choosedData[0])){
        this.setData({
          backData: this.data.choosedData
        })
      }else {
        this.setData({
          backData: this.data.tempValue
        })
      }
      // let choosedValue = this._getChoosedValue(this.data.choosedData)
      this.triggerEvent('sure', this.data.choosedData)
      this._closePicker()
    },
    // pickerview选择改变
    _bindchange(e) {
      let {scrollType} = this.properties
      let {lastValue, choosedData} = this.data
      let changeValue = e.detail.value
      switch (scrollType) {
        case "normal": 
          this.setData({
            tempValue: changeValue
            // choosedData: changeValue
          })
          break;
        case "link": 
          let tempArray = []
          if (changeValue.length > 1) {
            changeValue.slice(0, changeValue.length - 1).reduce((t, c, i) => {
              let v = t[c].children;
              tempArray.push(this._getColumnData(v))
              return v
            }, this.properties.columnsData)
          }
          let showOptions = [this.data.showOptions[0], ...tempArray];

          // 设置各列数据的关联关系
          let compareIndex = this._getScrollCompareIndex(lastValue, changeValue);
          if (compareIndex > -1) {
            let tempI = 1;
            while (changeValue[compareIndex + tempI] !== undefined) {
              changeValue[compareIndex + tempI] = 0;
              tempI++;
            }
          }
          changeValue = this._validate(changeValue);
          this.setData({
            lastValue: changeValue.concat(),
            tempValue: changeValue.concat(),
            showOptions: showOptions,
            value: changeValue
          })
          break;  
      }
    },
    // 打开picker
    _openPicker() {
      let showOptions = this.data.showOptions
      // let defaultPickerData = this.properties.defaultPickerData
      // 若果不是第一次打开，pickerview直接定位到上一次的选择
      if(!this.data.isFirstOpen) {
        if (showOptions.length !== 0 && this.properties.scrollType == "link") {
          this._setDefault(this._computedBackData(this.data.backData))
        }else{
          this._setDefault(this.data.backData)
        }
      } 
      this.setData({
        isOpen: true
      })
    },
    // 隐藏picker
    _closePicker() {
      this.setData({
        isOpen: false
      })
    },
    // 将数据传入pickerview中，并且定义初始的lastValue
    _setPickerViewData(val) {
      let { defaultPickerData, columnsData, scrollType} = this.properties
      this.setData({
        showOptions: val
      })
      // 如果没有设置默认显示的数据,则将lastValue初始为0
      if (scrollType == "normal" && defaultPickerData.length == 0) {
        this.setData({
          lastValue: [...new Array(columnsData.length).keys()].map(() => 0)
        })
      } 
      // 如果设置默认显示的数据,则将lastValue设置为default
      if (defaultPickerData.length > 0){ 
        if (scrollType == "link") {
          this.setData({
            lastValue: this._getBackDataFromValue(defaultPickerData)
          })
        }else {
          this.setData({
            lastValue: defaultPickerData
          })
        }
      }
    },
    // 给picker设置默认值
    _setDefault(inBackData) {
      
      let { columnsData, defaultPickerData, scrollType } = this.properties;
      let { showOptions, lastValue, tempValue, onlyKey } = this.data;
      if (inBackData) {
        defaultPickerData = inBackData;
      }
      let backData = [];
      switch (scrollType) {
        case "normal":
          // 判断columnsData[0][0]是否是一个对象
          if (isPlainObject(showOptions[0][0])) {
            this.setData({
              isUseKeywordOfShow: true
            })
          }
          // Array.isArray() 用于确定传递的值是否是一个 Array 
          // 首先判断用户给出的初始显示的数据是不是数组，并且保证不是空数组
          if (Array.isArray(defaultPickerData) && defaultPickerData.length > 0) {
            backData = showOptions.map((v, i) => v[defaultPickerData[i]]);
            this.data.tempValue = defaultPickerData;
            this.data.lastValue = defaultPickerData;
          } else {
            // 否则的话picker-view显示的数据初始为每一列的第一组值
            backData = showOptions.map((v) => v[0]);  
          }
          this.setData({
            showOptions: showOptions,
            // backData: backData,
            value: defaultPickerData
          })
          break;
        case "link":
          let listData = [];
           //判断defaultPickerData是否有默认值并且数组中的元素为对象
          if (Array.isArray(defaultPickerData) && defaultPickerData.length > 0 && defaultPickerData.every((v, i) => isPlainObject(v))) {
            
            let key = this.data.onlyKey = Object.keys(defaultPickerData[0])[0];
            let arr = [];
            this._getIndexByIdOfObject(columnsData, defaultPickerData, key, arr);
            defaultPickerData = arr; // [0,1,0]
            let tempI = 0;
            do {
              lastValue.push(defaultPickerData[tempI]);
              listData.push(this._getColumnData(columnsData))
              columnsData = columnsData[defaultPickerData[tempI]].children;
              tempI++;
            } while (columnsData)
            backData = listData.map((v, i) => v[defaultPickerData[i]]);
            
          } else { //如果没有默认值或者默认值数组的元素不是对象
            this.data.onlyKey = this.properties.keyWordOfShow || 'name';
            do {
              // 没有默认值的话将lastValue定位到0
              lastValue.push(0);
              listData.push(this._getColumnData(showOptions))
              showOptions = showOptions[0].children;
            } while (showOptions)
            backData = listData.map((v) => v[0]);
          }
          this.setData({
            isUseKeywordOfShow: true,
            showOptions: listData,
            backData,
            tempValue: defaultPickerData,
            lastValue: defaultPickerData
          })
          setTimeout(() => {
            this.setData({
              value: defaultPickerData
            })
          }, 0)
          break;
      }
    },
    // 获取pickerview要显示的数据和用户想要初始显示的数据
    _setTempData() {
      let { defaultPickerData, columnsData } = this.properties;
      this.setData({
        defaultPickerDataTemp: defaultPickerData,
        listDataTemp: columnsData
      })
    },
    // 获取每一列的数组
    _getColumnData(arr) {
      return arr.map((v) => this._fomateObj(v))
    },
    // 获取到对象中除children中的值
    _fomateObj(o) {
      let tempO = {};
      for (let k in o) {
        k !== "children" && (tempO[k] = o[k]);
      }
      return tempO;
    },
    // 获取到用户改变的是第几列的数据，默认第一次改变返回的结果为-1
    _getScrollCompareIndex(arr1, arr2) {
      let tempIndex = -1;
      for (let i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
          tempIndex = i;
          break;
        }
      }
      return tempIndex;
    },
    _validate(val) {
      let { choosedData } = this.data;
      choosedData.forEach((v, i) => {
        if (choosedData[i].length - 1 < val[i]) {
          val[i] = choosedData[i].length - 1;
        }
      })
      this.setData({
        value: val
      })
      return val;
    },
    // 获取backData中name中的值
    _computedBackData(backData) {
      let { scrollType, choosedData } = this.properties;
      let { onlyKey } = this.data;   // name
      if (scrollType === 'normal') {
        return backData.map((v, i) => choosedData[i].findIndex((vv, ii) => this._compareObj(v, vv)))
      } else {
        let t = backData.map((v, i) => {
          let o = {};
          o[onlyKey] = v[onlyKey]
          return o;
        })
        return t
      }
    },
    //根据id获取索引
    _getIndexByIdOfObject(listData, idArr, key, arr) {
      if (!Array.isArray(listData)) return;
      for (let i = 0, len = listData.length; i < len; i++) {
        if (listData[i][key] == idArr[arr.length][key]) {
          arr.push(i)
          return this._getIndexByIdOfObject(listData[i].children, idArr, key, arr)
        }
      }
    },
    // 通过下标来获取对应的值
    _getChoosedValue(valArr) { 
      let showOptions = this.data.showOptions;
      let choosedValue = [];
      let index = 0;
      for(let i = 0; i < valArr.length; i++) {
        index = valArr[i]
        choosedValue[i] = showOptions[i][index].name
      }
      return choosedValue
    },
    _getBackDataFromValue(val) {
      let tempArr = [];
      if (val.length > 0) {
        tempArr = this.data.showOptions.reduce((t, v, i) => {
          return t.concat(v[val[i]])
        }, [])
      } else {
        tempArr = this.data.showOptions.map((v, i) => v[0])
      }
      return tempArr
    },
  }
})
