// pages/distribution/recruit/recruit.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: false,
    agree: '0',
    spread:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pages = getCurrentPages()
    console.log(this.pages)
    this.options = options
    console.log("分享进来的options----------", options)
    
  },
  parseShareInfo() {
    if (this.options.scene) {
      const scene = decodeURIComponent(this.options.scene)
      let url = app.globalData.urlBase + "spread/mp/goods/parseShareInfo"
      const data = {
        unlimitedQRCode: scene
      }
      util.http(url, data).then(res => {
        if (res.errorCode === 9000) {
          const opt = {
            custId: res.custId,
          }
          this.options = opt
        } else {
          wx.showToast({
            title: res.errorMessage,
            icon: "warn",
            duration: 2000
          })
        }
      })
    }
    
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
    if (wx.getStorageSync('token') === "") {
      var promise = util.loginByCode()
      promise
        .then(this.handleProcess)
    } else {
      this.handleProcess()
    }
    
  },
  handleProcess() { 
    const user = wx.getStorageSync("g_userInfo")
    if (user.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return;
    } else { 
      this.parseShareInfo()
    }
    this.setData({
      spreadLevel:user.spreadLevel,
      spread:app.globalData.spreadLevel[user.spreadLevel]
    })
  },
  checkboxChange(e) { 
    this.agree = e.detail.value[0]
  },
  becomeSpread() { 
    let url = app.globalData.urlBase + "spread/mp/drp/mine/becomeSpread"
    const params = {}
    if (this.options.custId) { 
      params.upSpreadId = this.options.custId
      url = app.globalData.urlBase + "spread/mp/drp/mine/invitedSpread"
    }
    console.log('url', url)
    console.log('params',params)
    util.http(url, { ...params }).then(res => { 
      let msg = '未知错误'
      if (res.errorCode == 9000) { 
        msg = '申请成功，请等待审核'
        if (this.options.custId) {
          msg = `恭喜你成为${app.globalData.spreadLevel[1]}`
        } else { 
          if (wx.requestSubscribeMessage) { 
            this.subscribeMessage()
          }
        }
        
      } else { 
        msg = res.errorMessage
        
      }
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (res.errorCode == 9000) {
            if (this.pages.length == 1) {
              wx.switchTab({
                url: '/pages/distribution/index/index'
              })
            } else { 
              wx.navigateBack({
                delta: 1
              })
            }
            
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  },
  subscribeMessage() { 
    wx.requestSubscribeMessage({
      tmplIds: ['4B7HbWmi4SwBo_YQIvCoJSf6Ktqe0ovU_vFc2rNgiBI'],
      success(res) {
        console.log('订阅消息success', res)
      },
      fail(err) {
        //失败
        console.error(err);
        wx.showModal({
          title: '提示',
          content: '打开订阅消息有助于及时接受通知',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log('成功', res)
                },
                fail(res){
                  console.log('失败', res)
                }
              })
            } else if (res.cancel) {
              reject('用户拒绝了');
            }
          }
        })
      }
    })
  },
  handleClick() { 
    if (this.agree === '1') {
      this.becomeSpread()
    } else { 
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '需要勾选《惠吧推广协议》才能成为推广达人',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {

        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    
  },
  navTo(e) { 
    wx.navigateTo({
      url: '/pages/distribution/promotion/promotion',
    });
  },
  navToPoster() { 
    wx.navigateTo({
      url: '/pages/distribution/recruit-poster/recruit-poster',
    });
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

  }
})