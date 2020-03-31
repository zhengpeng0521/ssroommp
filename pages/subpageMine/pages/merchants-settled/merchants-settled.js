// pages/subpageMine/pages/merchants-settled/merchants-settled.js
var app = getApp()
var util = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionVal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  bindRegionChange: function(e) {
    let regionVal = e.detail.value;
    this.setData({
      regionVal: regionVal[0] + ',' + regionVal[1] + ',' + regionVal[2]
    })
  },
  confirm: function(e) {
    let params = e.detail.value;
    let cityList = params.cityList.split(',');
    params.province = cityList[0];
    params.city = cityList[1];
    params.district = cityList[2];
    delete params.cityList;
    if (params.name === '') {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false
      })
      return false;
    }
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!reg.test(parseInt(params.mobile))) {
      wx.showModal({
        title: '提示',
        content: '输入正确的手机号',
        showCancel: false
      })
      return false;
    }

    let url = app.globalData.urlBase + '/spread/mp/business/busIntentionSave';
    util.http(url, params).then(res => {
      if (res.errorCode === 9000) {
        wx.showModal({
          title: '提示',
          content: '信息已提交',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
        })
      }
    })
  },
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  callPhone: function(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})