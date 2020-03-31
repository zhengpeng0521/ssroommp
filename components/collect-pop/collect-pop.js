// components/collect-pop/collect-pop.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },
  lifetimes: {
    attached: function() {
      let closeCollectPop = wx.getStorageSync('closeCollectPop');
      if (!closeCollectPop) {
        this.setData({
          show: true
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close: function() {
      wx.setStorageSync('closeCollectPop', true)
      this.setData({
        show: false
      })
    }
  }
})