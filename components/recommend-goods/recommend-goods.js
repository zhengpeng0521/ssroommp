// components/recommend-goods/recommend-goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    recommendData: [],
    btnTxt: '会员免费'
  },
  lifetimes: {
    attached: function() {
      let list = wx.getStorageSync('recommendList'),
        userInfo = wx.getStorageSync('g_userInfo');
      this.setData({
        recommendData: list,
        btnTxt: userInfo.vipLevel > 1 ? '预约' : '会员免费'
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
