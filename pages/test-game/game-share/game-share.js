// pages/test-game/game-share/game-share.js
const util = require('../../../utils/util')
const app = getApp()
class ImagePoster {
  palette(data) {
    let deviceWidth = wx.getSystemInfoSync().screenWidth * 2
    let deviceHeight = deviceWidth * 1.22
    let qrcodeContent = data.shareQrCodeImg
    let user = wx.getStorageSync("g_userInfo")
    const avatar = user.avatar
    console.log('user',user)
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
          url: 'https://img.ishanshan.com/gimg/n/20200206/52dd2ba678ea5707a7b66ca31f304d84',
          css: {
            width: `${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            top: "0rpx",
            left: "0rpx",
            mode: "scaleToFill"
          },
        },
        {
          type: 'image',
          url: `${avatar}`,
          css: {
            width: '127rpx',
            height: '127rpx',
            top: `250rpx`,
            left: `${deviceWidth/2}rpx`,
            align:'center',
            borderWidth: '10rpx',
            borderColor:'#FFDEB3',
            borderRadius:'80rpx'
          },
        },
        {
          type: 'text',
          text: `10道题，测测你有多了解我`,
          css: {
            width:`${deviceWidth}rpx`,
            textAlign:'center',
            fontSize: '28rpx',
            top: `420rpx`,
            color: '#FEDDB3'
          }
        },
        {
          type: 'text',
          text: `${data.amount}元`,
          css: {
            width:`${deviceWidth}rpx`,
            textAlign:'center',
            fontSize: '60rpx',
            fontWeight:'bold',
            top: `500rpx`,
            color: '#FFE23C'
          }
        },
        {
          type: 'image',
          url: `${qrcodeContent}`,
          css: {
            width: '160rpx',
            height: '160rpx',
            bottom: `100rpx`,
            left: `${deviceWidth / 2}rpx`,
            align:'center',
            borderRadius:'80rpx'
          },
        },
        {
          type: 'text',
          text: `长按识别二维码，答题领红包`,
          css: {
            width:`${deviceWidth}rpx`,
            textAlign:'center',
            fontSize: '24rpx',
            bottom: `50rpx`,
            color: '#FEDDB3'
          }
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
    console.log(options)
    this.amount = options.amount
    const user = wx.getStorageSync("g_userInfo")
    this.options.topicMaker = user.custId
    wx.showLoading({
      title: '正在生成海报...',
      mask: true
    });
    const url = app.globalData.urlBase + "spread/mp/goods/shareInfo"
    const data = {
      // pathType: 13,
      pathType: 13,
      identity: this.options.id
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        res.amount = this.options.amount
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
    console.log(e)
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
          content: "保存图片成功",
          showCancel: false,
        })
      },
      fail: function(res) {
        console.log(res)

        wx.getSetting({
          success (res) {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) { 
              wx.showModal({
                title: '提示',
                content: '保存海报需要访问你的相册',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum'] === true) {
                          // this.startLoadData()
                        } else {
                          wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success () {
            
                            }
                          })
                        }
                      },
                      fail(err) { 
                        console.log(err)
                      }
                    })
                  } else if (res.cancel) {
                    
                  }
                }
              })
            }
            // res.authSetting = {
            //   "scope.userInfo": true,
            //   "scope.userLocation": true
            // }
          }
        })
        
        
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
      title: `战“疫”队友`,
      path: `/pages/test-game/enter-share/enter-share?topicMaker=${this.options.topicMaker}&topicId=${this.options.id}`
    }
  }
})
