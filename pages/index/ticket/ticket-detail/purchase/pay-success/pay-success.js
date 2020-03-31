var app = getApp()
var util = require("../../../../../../utils/util")

// pages/index/ticket/ticket-detail/purchase/pay-success/pay-success.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    animateOfBtn: null,
    goodsName: "",
    price: "",
    memberPrice: "",
    deductAmount: "",
    isVip: false,
    idCard: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.updateSession();
    // options = {
    //   orderId: "1201803669146771456",
    //   orderType: "1"
    // }
    this.options = options //goodsNum
    console.log("付款成功传入的---------options-------", options)
    let url = app.globalData.urlBase + "spread/mp/order/findOne"
    let _this = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      util.http(url, {
        orderId: this.options.orderId,
        orderType: this.options.orderType
      }).then(res => {
        wx.hideLoading();
        console.log("付款成功------------之后卡片详情---------------", res)
        _this.purchaseType = res.goodsTopType
        this.setData({
          orderData: res,
          optionsData: options
        })
        if (res.idCard) {
          this.setData({
            idCard: this.replacepos(res.idCard, 4, 13, "***********")
          })
        }

        //是会员卡
        if (res.goodsTopType === "9") {
          this.setData({
            isVip: true
          })
        } else {
          this.setData({
            isVip: false
          })
        }

      })
    }, 1000)
  },

  replacepos: function(text, start, stop, replacetext) {
    let mystr =
      text.substring(0, start - 1) +
      replacetext +
      text.substring(stop + 1)
    return mystr
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
  onHide: function() {
    this.setData({
      animateOfBtn: null
    })
  },

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
  onNavToOrder: function() {
    //预约订单跳转订单详情
    let params = util.stringifyParams({
      orderId: this.options.orderId,
      orderType: this.options.orderType
    })
    wx.navigateTo({
      url: "/pages/order/order-detail/order-detail" + params
    })
  },
  onNavToIndex:function(e){
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    })
  },
  onNavToPrivilege: function () { 
    wx.navigateTo({
      url: '/pages/mine/privilege/privilege'
    })
  },
  // 跳转到门票/消费卡页面
  onNavToMyTickets: function() {
    let _this = this
    // purchaseType：用户购买类型；4消费卡，6门票,9会员卡
    this.setData({
      animateOfBtn: true
    })
    setTimeout(() => {
      if (this.purchaseType === "1") {
        wx.navigateTo({
          url: "/pages/mine/my-tickets/my-tickets"
        })
      } else if (this.purchaseType === "2") {
        wx.navigateTo({
          url: "/pages/mine/expense-card/expense-card"
        })
      } else if (this.purchaseType === "9") {
        wx.navigateTo({
          url: '/pages/subpageMine/pages/booking-guide/booking-guide?referer=activation',
        })
      }
    }, 100)
  }
})
