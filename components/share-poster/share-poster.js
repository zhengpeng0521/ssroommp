// components/share-poster/share-poster.js
var app = getApp()
var util = require("../../utils/util.js")
import Card from "../../utils/playcard-template.js"
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
  onLoad: function(options) {
    wx.showLoading({
      title: "海报生成中"
    })

    console.log("分享进来的路径--------", options)
    this.options = options
    let url = app.globalData.urlBase + "spread/mp/goods/shareInfo"
    const data = {
      pathType: 9,
      spuId: this.options.spuId
    }
    //有没有当前会员卡
    return util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
       
        this.setData({
          template: new Card().palette(res)
        })
      }
    })
  },

  openDialog() {
    wx.showModal({
      title: '提示',
      content: '即将打开"闪闪课堂"小程序',
      confirmText: '允许',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../../pages/tabBar/index/index'
          })
        } else if (res.cancel) {
          console.log('用户拒绝了')
        }
      }
    })
  },

  //加载分享页面完成
  onImgOK: function(e) {
    if (e.detail.path) {
      wx.hideLoading()
      this.imagePath = e.detail.path
      this.setData({
        posterUrl: e.detail.path
      })
    }
  },

  //下载二维码图片
  downloadPoster: function() {
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onUnload: function() {
  
    wx.getSavedFileList({
      success(res) {
        if (res.fileList.length > 0) {
          wx.removeSavedFile({
            filePath: res.fileList[0].filePath,
            complete(res) {
              console.log(res)
            }
          })
        
      
        }
      }
    })
  },

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
  onShareAppMessage: function() {
    console.log("点击分享-----------")
    let url = app.globalData.urlBase + "/spread/mp/sensors/shareGoods"
    util.http(url, {
      spuId: this.options.spuId
    })
    // this.options
    let userInfo = wx.getStorageSync("g_userInfo")
    let params = {
      custId: userInfo.custId,
      ...this.options
    }
    // let pathUrl
    // if (this.options.shareType ==="card") {
    //   pathUrl= "pages/index/playcard/playcard" + util.stringifyParams(params),
    // }else{
    //     pathUrl= "pages/index/ticket/ticket-detail/ticket-detail" + util.stringifyParams(params),
    // }
    return {
      path:
        // (this.options.shareType === "card" ?
        "pages/index/playcard/playcard" +
        //   "pages/index/ticket/ticket-detail/ticket-detail") +
        util.stringifyParams(params)

      // title:
      //     userInfo.nickname
      // imageUrl:
      //     this.data.ticketDetailData.cover +
      //     "?p=image/format,jpg/quality,q_75/resize,l_300"
    }
  }
})
