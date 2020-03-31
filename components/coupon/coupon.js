// components/coupon/coupon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value:'normal'
    },
    operateText: {
      type: String,
      value: ''
    },
    item: {
      type: Object,
      value: {},
      // observer: function (newVal) { 

      // }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    operate(e) { 
      const dataset = e.currentTarget.dataset
      this.triggerEvent('operate', dataset)
    },
    onTicket(e) { 
      const dataset = e.currentTarget.dataset
      this.triggerEvent('select', dataset)
    }
  }
})
