// pages/index/reservation/reservation.js
import Dialog from '../../../components/vant/dialog/dialog';
var app = getApp()
const util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsData: [],
    chosenDate: '',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.system = wx.getSystemInfoSync()
    console.log('设备信息',this.system)
    this.params = options;
    this.options = options;
    let chosenDate = new Date(parseInt(options.chosenDate));
    const dialogRefundRule = options.refundRule.split('<br/>');
    this.refundRule = dialogRefundRule.join('\n');
    this.setData({
      dialogRefundRule
    })
    this.setData({
      chosenDate: util.timeFormat('yyyy-MM-dd', chosenDate),
      imgsData: util.handleStringToArr(options.imgs, ","),
      depositAmount: options.depositAmount,
      refundRule: this.refundRule,
      shopAddress: options.shopAddress,
      shopName: options.shopName,
      spuName: options.spuName
    })
  },
  backToChoseDate: function() {
    let number = 1
    if(this.options.middlePage){
      number = 2
    }
    wx.navigateBack({
      delta: number
    })
  },
  reservationPay: function() {
    console.log(this)
    let _this = this,
      text1 = '';
      this.setData({
        show:true
      })
    // wx.showModal({
    //   title: '提示',
    //   content: _this.refundRule,
    //   confirmText: '继续预约',
    //   cancelText: '我再想想',
    //   success(res) {
    //     if (res.confirm) {
    //       _this.beforeCreateOrder();
    //     }
    //   }
    // })
    // Dialog.confirm({
    //   title: '提示',
    //   messageAlign:'left',
    //   message: this.data.refundRule,
    //   className:'custom-content',
    //   confirmButtonText:'继续预约',
    //   cancelButtonText: '我再想想'
    // }).then(() => {
    //   _this.beforeCreateOrder();
    // }).catch(() => {
    //   // on cancel
    // });
  },
  beforeCreateOrder: function() {
    let _this = this;
    this.createOrder().then(res => {
      if (res.errorCode === 9000) {
        _this.params.orderId = res.appointId;
        let url = app.globalData.urlBase + '/spread/mp/appoint/pay';
        util.http(url, {
          appointId: res.appointId
        }).then(this.processPay)
      } else {
        wx.hideLoading({
          success() {
            wx.showModal({
              title: '提示',
              content: res.errorMessage,
              showCancel:false
            })
          }
        });
      }
    })
  },
  createOrder: function() {
    wx.showLoading();
    let appointDay = this.options.chosenDate,
      skuId = this.options.skuId,
      url = app.globalData.urlBase + '/spread/mp/appoint/create';
    return util.http(url, {
      skuId: skuId,
      appointDay: appointDay,
      price: this.options.depositAmount,
      formInfoJson: this.options.formInfoJson,
      vipSpuId: this.options.vipSpuId,
      welfareId:this.options.welfareId
    })
  },
  processPay: function (data) {
    let self = this;
    if (data.errorCode === 9000) {
      this.params.orderType = 2;
      this.params = Object.assign(this.params, data);

      let params = util.stringifyParams(this.params);
      const url = "/pages/index/ticket/ticket-detail/purchase/pay-success/pay-success" + params
      // wx.navigateTo({
      //   url: "pay-success/pay-success" + params
      // });
      // return false;
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.packages,
        signType: data.signType,
        paySign: data.paySign,
        success: function (res) {
          if (self.system && self.system.platform == 'android') {
            wx.showModal({
              title: '提示',
              content: '订单支付成功',
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                wx.reLaunch({
                  url
                })
              }
            });
          } else { 
            wx.reLaunch({
              url
            })
          }
          
        },
        fail: function(res) {
          console.info("取消支付：", res)
          wx.switchTab({
            url: '/pages/order/order'
          })
        }
      })
    } else {
      wx.showToast({
        title: data.errorMessage,
        icon: "none",
        duration: 1000
      })
    }
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
    wx.hideLoading();
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onClose(){
    this.setData({
      show:false
    })
  },
  handleConfirm(){
    this.beforeCreateOrder();
  }
})