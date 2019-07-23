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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false,    // 控制是否打开picker
    firstColumn: [],  // 显示在第一列的数据
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
      // this.setData({
      //   lastValue: this.data.tempValue,
      //   choosedData: this._getChoosedDataById(this.data.tempValue)
      // })
      this.triggerEvent('sure', this.data.choosedData)
      this._closePicker()
    },

    /**
     * 打开picker
     */
    _openPicker() {
      // this._setDefault(this.data.lastValue)
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
    }
  }
})
