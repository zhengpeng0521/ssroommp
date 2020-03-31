// pages/recordedLesson/recruit-poster/recruit-poster.js
const util = require('../../../utils/util')
const app = getApp()
class ImagePoster {
  palette (data) {
    const space = 0
    const deviceWidth = 1242
    const deviceHeight = 2209
    let qrcodeContent = data.shareQrCodeImg
    const left = '120rpx'
    const fontSize = '46rpx'
    const nicknameBottom = 515 - space
    const textBottom = 440 - space
    const text2Bottom = 367 - space
    const codeBottom = 329 - space
    let user = wx.getStorageSync('g_userInfo')
    let nickname = user.nickname
    return ({
      width: `${deviceWidth}rpx`,
      height: `${deviceHeight}rpx`,
      background: '#eeeeee',
      views: [
        {
          type: 'rect',
          css: {
            width: `${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            left: '0rpx',
            top: '0rpx',
            color: '#ffffff'
          }
        },
        {
          type: 'image',
          url: 'http://img.ishanshan.com/gimg/n/20200312/0a1bc0fc9d307c7384444e690072469d?p=image/resize,m_fill,h_2209,w_1242/format,jpg/quality,q_90',
          css: {
            width: `${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            top: '0rpx',
            left: '0rpx',
            mode: 'scaleToFill'
          }
        },
        {
          type: 'text',
          text: `“${nickname}”`,
          css: {
            left: `${left}`,
            fontSize: fontSize,
            bottom: `${nicknameBottom}rpx`,
            height: '44rpx',
            lineHeight: '42rpx',
            color: '#333333',
            padding: '0rpx 10rpx',
            fontWeight: 'bold'
          }
        },
        {
          type: 'text',
          text: '邀请您成为推广达人',
          css: {
            left: `${left}`,
            fontSize: fontSize,
            bottom: `${textBottom}rpx`,
            color: '#333333',
            fontWeight: 'bold'
          }
        },
        {
          type: 'text',
          text: '轻松赚佣金',
          css: {
            left: `${left}`,
            fontSize: fontSize,
            bottom: `${text2Bottom}rpx`,
            color: '#D3361F',
            fontWeight: 'bold'
          }
        },
        {
          type: 'image',
          url: `${qrcodeContent}`,
          css: {
            width: '280rpx',
            height: '280rpx',
            bottom: `${codeBottom}rpx`,
            right: '120rpx',
            borderRadius: '150rpx'
          }
        }

      ]
    })
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
    // 测试数据
    // const res = {
    //   shareQrCodeImg: 'http://img.ishanshan.com/gimg/n/20190819/4e156af769500274c685a0203039a332'
    // }
    // this.setData({
    //   template: new ImagePoster().palette(res)
    // })
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
      path: `/pages/recordedLesson/recruit/recruit?custId=${this.custId}`,
      imageUrl: 'http://img.ishanshan.com/gimg/n/20191230/2e8999d4ba657e94b04cd6cbadf8860a'
    }
  }
})
