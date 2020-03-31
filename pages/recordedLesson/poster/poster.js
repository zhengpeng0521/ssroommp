// pages/recordedLesson/poster/poster.js
var app = getApp()
var util = require("../../../utils/util.js")
import Card from "../../../utils/poster-template.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: "",
    qrImg: "",
    template: {},
    posterUrl: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.spuName = options.title
    wx.setNavigationBarTitle({
      title:options.title + '分享'
    })
    this.spuId = options.spuId
    this.generatePoster()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onImgOK(e) {
    wx.hideLoading();
    if (e.detail.path) {
      this.path = e.detail.path
      this.setData({
        posterUrl: e.detail.path
      })
    }
  },
  generatePoster() {
    wx.showLoading({
      title: '正在生成海报...',
      mask: true
    });
    const url = app.globalData.urlBase + "spread/mp/goods/shareInfo"
    const data = {
      pathType: 11,
      spuId:this.spuId
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          template: new Card().palette(res)
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.errorMessage,
          icon: 'none',
        });
      }
    }).catch(res => {
      wx.hideLoading();
    })
  },
  saveShareImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.path,
      success: function(res) {
        wx.showModal({
          title: "提示",
          content: "保存图片成功"
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  preventScroll() {
    return true;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.spuName}`,
      path: `/pages/recordedLesson/product-detail/product-detail?custId=${this.custId}&goodsId=${this.spuId}`,
      imageUrl: this.posterImg
    }
  }
})
