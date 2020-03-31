// pages/mine/my-collections/my-collections.js
var app = getApp()
var util = require("../../../../utils/util")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    templateData: {},
    btnTxt: "会员免费",
    nocollections: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  postList: function() {
    let url = app.globalData.urlBase + "/spread/mp/mine/queryMineCollect"
    util.http(url, {}).then(this.processListData)
  },
  processListData: function(res) {
    if (res.errorCode === 9000) {
      let arr = [],
        tmpArr = res.results
      if (tmpArr) {
        for (var i = 0; i < tmpArr.length; i++) {
          arr[i] = {}
          arr[i].showCountDown = 0
          arr[i].stockType = 0
          arr[i].shopAdd = tmpArr[i].addr
          arr[i].memberPrice = tmpArr[i].memberPrice
          arr[i].price = tmpArr[i].price
          arr[i].cover = tmpArr[i].goodsCover
          arr[i].goodsName = tmpArr[i].goodsName
          arr[i].id = tmpArr[i].goodsId
          arr[i].goodsType = tmpArr[i].goodsType
          arr[i].shopName = tmpArr[i].shopName
          arr[i].vipSpuName = tmpArr[i].vipSpuName
          arr[i].isEquity = tmpArr[i].isEquity
          arr[i].goodsTopType = tmpArr[i].goodsTopType
        }
        this.setData({
          list: arr,
          templateData: {
            recommendData: arr,
            userInfo: wx.getStorageSync("g_userInfo")
          }
        })
      } else {
        this.setData({
          nocollections: true,
          recommendData: []
        })
      }

    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.pageIndex++;
    // this.postList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let userInfo = wx.getStorageSync("g_userInfo")
    if (userInfo.vipLevel > 1) {
      this.setData({
        btnTxt: "预约"
      })
    }
    // this.pageIndex = 0;
    this.postList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})