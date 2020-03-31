// components/swiper-special/swiper-special.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    list: {
      type: Array,
      default: []
    },
    currentProp: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    currentHandle: function(e) {
      let current = e.detail.current;
      this.setData({
        current: current
      })
      this.triggerEvent('swiperCurIndexChange', current)
    }
  }
})