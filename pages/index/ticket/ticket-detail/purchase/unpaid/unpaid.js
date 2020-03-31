var app = getApp();
var util = require('../../../../../../utils/util');

// pages/index/ticket/ticket-detail/purchase/unpaid/unpaid.js
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    orderData: {},
    animateOfBtnPay: null,
    animateOfBtnCancel: null
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    this.options = options;
    let timeStamp = options.timeStamp;
    timeStamp = Number(timeStamp) * 1000;
    let orderDate = new Date(timeStamp);
    orderDate = util.timeFormat('yyyy-MM-dd hh:mm:ss', orderDate);
    options.orderDate = orderDate;
    this.setData({
      orderData: options
    });
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

  // 继续支付
  continueToPay: function () {
    this.setData({
      animateOfBtnPay: true
    });
    setTimeout(() => {
      this.setData({
        animateOfBtnPay: false
      });

      let url = app.globalData.urlBase + 'spread/mp/pay/payCreate';
      let param = {
        payOrderId: this.options.orderId,
        amount: this.data.realMoney
      };
      util.http(url, param).then(this.processRepay);
    }, 100);
  },

  // 处理支付结果
  processRepay: function (data) {
    let _this = this;
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.packages,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        let param = util.stringifyParams(_this.options);
        wx.redirectTo({
          url: "/pages/index/ticket/ticket-detail/purchase/pay-success/pay-success" + param
        });
      },
      'fail': function (res) {
        console.info('取消支付：', res);
        wx.showToast({
          title: '支付未成功，请重试',
          icon: 'none',
          duration: 1000
        });
      }
    });
  }
})