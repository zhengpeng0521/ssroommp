// component/contact-info/contact-info.js
var app = getApp()
var util = require("../../utils/util")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ["女", "男"],
    name: "",
    id: "",
    sex: "",
    edit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("编辑联系的详细信息------", options)
    this.options = options
    if (options.isowner === '0') {
      this.setData({
        name: options.name,
        id: options.id,
        edit: false,
        isOwner: options.isOwner
      })
    } else {
      this.setData({
        edit: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  formSubmit: function(e) {
    console.log("form发生了submit事件，携带数据为：", e.detail.value)
    var link = null

    const data = {
      name: e.detail.value.name,
      idCard: e.detail.value.id
    }
    if (!RegExp(/[\u4E00-\u9FA5]+$/).test(e.detail.value.name)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的姓名',
      })
      return false;
    }


    if (this.data.edit) {
      link = "/spread/mp/cust/linkmanCreate"
    } else {
      link = "/spread/mp/cust/linkmanUpdate"
      data.linkmanId = this.options.manId
    }

    let url = app.globalData.urlBase + link
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        wx.showToast({
          title: this.data.edit ?
            "新增购买人成功" : "修改购买人信息成功",
          icon: "success",
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 300)
      } else {
        wx.showModal({
          title: res.errorMessage
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})