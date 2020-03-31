// pages/mine/activation/activation.js
var app = getApp()
var util = require("../../../../utils/util")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardNum: "",
    activeNum: "",
    buyIDNum: "",
    buyName: "",
    checked: false,
    agreed: "",
    showSuccessDialog: false,
    haveCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync("g_userInfo")
    if (userInfo.idCard) {
      this.setData({
        buyName: userInfo.name,
        buyIDNum: userInfo.idCard,
        haveCard: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync("token") === "") {
      var promise = new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            console.info("wx.login成功:", res)
            resolve(res.code)
          },
          fail: res => {
            console.info(" wx.login失败：", res)
          }
        })
      })
      promise
        // .then(util.asyncGetUserInfo)  //TODO 如果没有用户信息 直接进入激活会员卡会报错
        .then(util.postUserInfo)
        .then(util.processToken)
        .then(util.processAuthMess)
        .then(this.prevActivation)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  bindCardNum: function(e) {
    this.setData({
      cardNum: e.detail.value
    })
  },
  bindActiveNum: function(e) {
    this.setData({
      activeNum: e.detail.value
    })
  },
  bindName: function(e) {
    this.setData({
      buyName: e.detail.value
    })
  },
  bindIDNum: function(e) {
    this.setData({
      buyIDNum: e.detail.value
    })
  },
  closeDialog: function() {
    this.setData({
      showSuccessDialog: false
    })
  },
  checkboxChange: function(e) {
    if (e.detail.value.length) {
      this.setData({
        agreed: 1
      })
    } else {
      this.setData({
        agreed: 0
      })
    }
  },
  getVal: function(obj) {
    if (obj) {
      this.setData({
        buyName: obj.name,
        buyIDNum: obj.idCard,
        haveCard: true
      })
    }
  },
  goToMemberAgree: function() {
    wx.navigateTo({
      url: "/pages/index/member-agree/member-agree"
    })
  },
  submit: function() {
    let isVip = wx.getStorageSync("g_userInfo").vipLevel
    if (isVip == 0) {
      wx.showModal({
        title: "提示",
        content: "您必须先注册，才能激活会员卡！",
        showCancel: false,
        success: function() {
          wx.navigateTo({
            url: "/pages/mine/bind-mobile/bind-mobile"
          })
        }
      })
      return
    }
    if (!this.data.agreed) {
      return wx.showModal({
        title: "勾选会员协议",
        content: "如购买本卡即需要您同意会员协议，请进行勾选操作",
        showCancel: false
      })
    }

    let url1 = app.globalData.urlBase + '/spread/mp/plat/makecard/activateTips',
      params = {
        cardNumber: this.data.cardNum,
        activationCode: this.data.activeNum,
        name: this.data.buyName,
        idCard: this.data.buyIDNum,
        agreed: this.data.agreed
      },
      _this = this;

    util.http(url1, params).then(res => {
      if (res.errorCode === 9000) {

        wx.showModal({
          title: '提示',
          content: res.vipSpuName,
          confirmText: '继续激活',
          success(res) {
            if (res.confirm) {
              let url =
                app.globalData.urlBase +
                "/spread/mp/makecard/activateIncrementNumber"
              util.http(url, params).then(res => {
                if (res.errorCode === 9000) {
                  util.updateSession();
                  _this.setData({
                    showSuccessDialog: true
                  })
                } else {
                  wx.showModal({
                    title: res.errorMessage,
                    content: "您可以关注“闪闪课堂会员卡”公众号进行咨询",
                    showCancel: false
                  })
                }
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
          showCancel: false
        })
      }
    })



  },
  navigateToBookingGuide: function() {
    wx.navigateTo({
      url: "/pages/subpageMine/pages/booking-guide/booking-guide?referer=activation"
    })
  },
  choseContact: function() {
    wx.navigateTo({
      url: '/pages/mine/contacts/contacts',
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
