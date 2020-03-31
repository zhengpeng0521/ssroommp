var app = getApp();
var util = require('../../../../utils/util');

var QR = require("../../../../utils/qrCodeGenerate");

// pages/my/my-tickets/my-tickets.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketData: [],
    isShowQrCode: false,
    qrCodeData: {},
    isLoading: true,
    isLoadingMore: false,
    isHaveMoreData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.url = app.globalData.urlBase + '/spread/mp/mine/queryMineTicket';
    util.http(this.url, {}).then(this.processTicketData);
    this.type = options.type;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this;
    util.socketConnect().then(() => {
      wx.onSocketMessage(res => {
        console.log('收到服务器内容：' + res.data);
        if (_this.currentItemIndex != undefined && res.data ==='核销成功！') {
          wx.showModal({
            title: '提示',
            content: '核销成功',
            showCancel: false,
            success(res){
              let index = _this.currentItemIndex,
                listData = _this.data.ticketData;
              listData[index].status = '2'
              _this.setData({
                ticketData: listData,
                isShowQrCode: false
              })
            }
          })
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    util.closeSocketFn();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isHaveMoreData) {
      this.setData({
        isLoadingMore: true
      });
      let param = {
        custId: app.globalData.g_loginState.userId,
        pageIndex: this.data.pageData.pageIndex + 1
      };
      util.http(this.url, param).then((data) => {
        if ((data.data.pageIndex + 1) === data.data.pageCount) {
          this.setData({
            isHaveMoreData: false
          });
        }
        this.setData({
          ticketData: this.data.ticketData.concat(data.results),
          isLoadingMore: false,
          pageData: data.data
        });
      });
    }
  },

  processTicketData: function(data) {
    if (data.data.pageCount <= 1) {
      this.setData({
        isHaveMoreData: false
      });
    }
    this.setData({
      ticketData: data.results,
      isLoading: false,
      pageData: data.data
    });
  },
  possVerifyCode: function(e) {
    // verifyId
    let verifyId = e.currentTarget.dataset.verifyid,
      url = app.globalData.urlBase + '/spread/mp/verify/generateVerifyCode';
    this.currentItemIndex = e.currentTarget.dataset.index;

    util.http(url, {
      verifyId: verifyId,
      verifyType: 1
    }).then(this.onViewQrCode);
  },
  onViewQrCode: function(res) {
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

  onQrCodeHide: function() {
    this.setData({
      isShowQrCode: false
    });
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
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },
  process: function() {

  },
  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log('tempFilePath:', tempFilePath);
      },
      fail: function(res) {
        console.log('canvas绘制失败：', res);
      }
    });
  }


})