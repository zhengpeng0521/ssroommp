// components/carousel-with-index/carousel-with-index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    swiperList: {
      type: Array,
      value: []
    },
    type: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    carouselChange: function(e) {
      let index = e.detail.current + 1;
      this.setData({
        current: index
      })
    }
  }
})