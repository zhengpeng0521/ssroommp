// pages/distribution/order-detail/order-detail.js
const util = require('../../../utils/util')
const QR = require("../../../utils/qrCodeGenerate");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log("order--detail----id", options)
    this.options = options;
    this.imgs = [];
    this.setData({
      orderType: options.orderType
    })
    this.loadData();
    const user = wx.getStorageSync("g_userInfo")
    this.setData({
      user
    })
  },
  loadData: function () {
    let url = app.globalData.urlBase + "spread/mp/drp/order/findOne"
    let param = {
      orderId: this.options.orderId
      // orderId: "1210740637062664192"
    }
    util.http(url, param).then(this.processOrderDetailData)
  },
  processOrderDetailData: function (data) {
    // data.refundRule = util.handleStringToArr(data.refundRule, "<br/>");
    data.buyAttachInfo = JSON.parse(data.buyAttachInfo);
    this.spuId = data.spuId
    this.setData({
      OrderDetailData: data,
      isLoading: false
    })
  },
  viewVerifyCode(e) {
    let verifyId = e.currentTarget.dataset.id,
      orderType = e.currentTarget.dataset.type,
      url = app.globalData.urlBase + 'spread/mp/verify/generateVerifyCode';
    this.currentItemIndex = e.currentTarget.dataset.index;

    util.http(url, {
      verifyId: verifyId,
      verifyType: 1,
      orderType: orderType
    }).then(this.onViewQrCode);


    this.setData({
      showCodeBox: true,
      refresh: false
    })
  },
  onViewQrCode: function(res) {
    setTimeout(() => {
      this.setData({
        refresh: true
      })
      this.closeSocket();
    },  15*1000)

    let qrCodeData = {};
    qrCodeData.verificationCode = res.verifyCode;
    this.setData({
      isShowQrCode: true,
      qrCodeData
    });
    if (qrCodeData.verificationCode != null) {
      this.generateCanvas(qrCodeData.verificationCode);
    } else {
      wx.showToast({
        title: '核销码获取失败，请刷新后重试。如仍无法获取，请联系游乐园解决！',
        icon: 'none',
        duration: 1500
      });
    }
  },
  // canvas二维码实现
  generateCanvas: function(initUrl) {
    let size = this.setCanvasSize(); //动态设置画布大小
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);

  },

  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 400; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      console.info('res.windowWidth/scale', width);
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    this.openSocket();
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },

  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          tempFilePath: tempFilePath
        })
        console.log('tempFilePath:', tempFilePath);
      },
      fail: function(res) {
        console.log('canvas绘制失败：', res);
      }
    });
  },
  hideCodeBox: function() {
    this.closeSocket();
    this.setData({
      showCodeBox: false
    })
  },
  openSocket: function() {
    let _this = this;
    util.socketConnect().then(() => {
      wx.onSocketMessage(res => {
        console.log('收到服务器内容：' + res.data);
        if (res.data === '核销成功！') {
          _this.loadData();
          _this.setData({
            verificationShow:true,
            showCodeBox: false
          })
        }
      });
    });
  },
  closeSocket: function() {
    util.closeSocketFn();
  },
  selectAppointDay(e) { 
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/distribution/calendar/calendar?orderId=${orderId}`,
    });
  },
  verifyConfirm() { 
    this.setData({
      verificationShow:false,
    })
  },
  navToProduct() { 
    wx.navigateTo({
      url: `/pages/distribution/product-detail/product-detail?goodsId=${this.spuId}`,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})