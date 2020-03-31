// pages/distribution/recruit-poster/recruit-poster.js
const util = require('../../../utils/util')
const app = getApp()
class ImagePoster {
  palette(data) {
    const space = 180
    let deviceWidth = wx.getSystemInfoSync().screenWidth * 2
    let deviceHeight = deviceWidth * 1.3333
    let qrcodeContent = data.shareQrCodeImg
    let imgHeight = deviceHeight - 300
    const nicknameBottom = 308 - space
    const textBottom = 262 - space
    const rectBottom = 200 - space
    const text2Bottom = 214 - space
    const codeBottom = 204 - space
    let user = wx.getStorageSync("g_userInfo")
    let nickname = user.nickname
    return ({
      width:`${deviceWidth}rpx`,
      height: `${deviceHeight}rpx`,
      background: "#eeeeee",
      views: [
        {
          type: "rect",
          css: {
            width:`${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            left: "0rpx",
            top: "0rpx",
            color: "#ffffff"
          }
        },
        {
          type: 'image',
          // url: `https://img.ishanshan.com/gimg/n/20200110/cd9879db49c20610dc10acb99243f854`,
          url: 'https://img.ishanshan.com/gimg/n/20200108/681f08b5aa945d28b51871266217350b',
          css: {
            width: `${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            top: "0rpx",
            left: "0rpx",
            mode: "scaleToFill"
          },
        },
        {
          type: 'text',
          text: `“${nickname}”`,
          css: {
            left: '230rpx',
            fontSize: '32rpx',
            bottom: `${nicknameBottom}rpx`,
            height:'44rpx',
            lineHeight:'42rpx',
            color: '#ffffff',
            borderRadius:'21rpx',
            background: 'rgba(255,255,255,.4)',
            padding: '0rpx 10rpx',
            fontWeight:'bold'
          }
        },
        {
          type: 'text',
          text: `邀请您成为推广达人`,
          css: {
            left: '230rpx',
            fontSize: '32rpx',
            bottom: `${textBottom}rpx`,
            color: '#ffffff',
            fontWeight:'bold'
          }
        },
        {
          type: "rect",
          css: {
            width:`162rpx`,
            height: `12rpx`,
            left: '230rpx',
            bottom: `${rectBottom}rpx`,
            color:'#5A1F1F'
          }
        },
        {
          type: 'text',
          text: `轻松赚佣金`,
          css: {
            left: '230rpx',
            fontSize: '32rpx',
            bottom: `${text2Bottom}rpx`,
            color: '#ffffff',
            fontWeight:'bold'
          }
        },
        
        {
          type: 'image',
          url: `${qrcodeContent}`,
          css: {
            width: '160rpx',
            height: '160rpx',
            bottom: `${codeBottom}rpx`,
            left: '30rpx',
            borderRadius:'80rpx'
          },
        },
        
      ],
    });
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = wx.getStorageSync("g_userInfo")
    this.custId = user.custId
    wx.showLoading({
      title: '正在生成海报...',
      mask: true
    });
    const url = app.globalData.urlBase + "spread/mp/goods/shareInfo"
    const data = {
      pathType: 12,
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          template: new ImagePoster().palette(res)
        })
      }
    }).catch(err => { 
      wx.hideLoading()
      wx.showToast({
        title: '生成海报失败',
        icon: 'none',
      });
    })
  },
  onImgOK(e) { 
    wx.hideLoading()
    if (e.detail.path) { 
      this.path = e.detail.path
      this.setData({
        posterUrl:this.path
      })
    }  
  },
  downloadPoster() { 
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `达人招募令`,
      path: `/pages/distribution/recruit/recruit?custId=${this.custId}`,
      imageUrl: 'http://img.ishanshan.com/gimg/n/20191230/2e8999d4ba657e94b04cd6cbadf8860a'
    }
  }
})