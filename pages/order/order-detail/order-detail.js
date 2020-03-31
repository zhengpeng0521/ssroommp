var app = getApp()
var util = require("../../../utils/util")
var QR = require("../../../utils/qrCodeGenerate");

const score = [
  20,40,60,80,100
]
// pages/order/order-detail/order-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    OrderDetailData: {},
    isLoading: true,
    orderType: 0,
    showCodeBox: false,
    refresh: false,
    tempFilePath:'',

    verificationShow: false, //商家成功核销提示窗口
    clockShow: false, //打卡核销提示窗口
    showTitle: '', // 评论窗口是否显示标题
    successShow: false, //评论成功
    commentShow: false, //评论窗口
    commentContent:'',
    commentRate:5,
    commentUpload: [],
    lon:'',
    lat:'',
    uploadUrl: app.globalData.urlBase + "spread/manage/uploadController/upload",
    commentData:[], //订单评论
    btnLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("order--detail----id", options)
    this.options = options;
    this.imgs = [];
    this.setData({
      orderType: options.orderType
    })
    this.loadData();
  },
  loadData: function() {
    let url = app.globalData.urlBase + "spread/mp/order/findOne"
    let param = {
      orderId: this.options.orderId,
      orderType: this.options.orderType
    }
    util.http(url, param).then(this.processOrderDetailData)
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

  processOrderDetailData: function(data) {
    data.refundRule = util.handleStringToArr(data.refundRule, "<br/>");
    data.attachInfo = JSON.parse(data.attachInfo);
    const userInfo = wx.getStorageSync('g_userInfo');
    const { avatar,nickname } = userInfo;
    const { evaluationInfo } = data;
    let commentData = []
    if(evaluationInfo){
        commentData = [{ ...evaluationInfo, 
        evaluateId: evaluationInfo.evaluationId, 
        custNickName: nickname, 
        createTime: evaluationInfo.evaluationTime, 
        custAvatar: avatar, 
        imgs: evaluationInfo.imgs.split(',') 
      }]
    }
    this.goodsTopType = data.goodsTopType
    this.spuId = data.spuId
    // const commentData = 
    this.setData({
      OrderDetailData: data,
      isLoading: false,
      commentData
    })
  },

  onViewQrCode: function() {
    wx.navigateTo({
      url: "../qr-code/qr-code?purchaseId=" + this.purId
    })
  },

  cancelOrder: function() {
    let _this = this
    let url = app.globalData.urlBase + "saas-ssp/app/purchase/update"
    let param = {
      purchaseId: this.data.OrderDetailData.id,
      status: 3
    }
    util.http(url, param).then(data => {
      console.info("取消支付：", data)
      if (data.errorCode === 9000) {
        _this.getOrderDetailToPaySuccess(
          "/pages/index/ticket/ticket-detail/purchase/unpaid/cancelOrder/cancelOrder"
        )
      } else {
        wx.showToast({
          title: errorMessage,
          icon: "none",
          duration: 1000
        })
      }
    })
  },

  continueToPay: function() {
    // 调统一支付接口
    let url = app.globalData.urlBase + "saas-ssp/app/wx/wapTrade"
    let param = {
      channel: "wx",
      payOrderId: this.data.OrderDetailData.id,
      amount: this.data.OrderDetailData.realPrice,
      custId: app.globalData.g_loginState.userId
    }
    util.http(url, param).then(this.processRepay)
    // 调微信支付
  },

  // 处理支付结果
  processRepay: function(data) {
    console.info("统一支付的返回值data：", data)
    let _this = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packages,
      signType: "MD5",
      paySign: data.paySign,
      success: function(res) {
        console.info("支付成功:", res)
        // 支付成功后修改订单状态
        _this.getOrderDetailToPaySuccess(
          "/pages/index/ticket/ticket-detail/purchase/pay-success/pay-success"
        )
      },
      fail: function(res) {
        console.info("取消支付：", res)
        wx.showToast({
          title: "支付未成功，请重试",
          icon: "none",
          duration: 1000
        })
      }
    })
  },

  // 支付成功后调订单详情，传给支付成功页面
  getOrderDetailToPaySuccess: function(subpageUrl) {
    // 查询商品详情并传递到支付成功页面
    let url2 = app.globalData.urlBase + "saas-ssp/app/purchase/queryDetail"
    let param2 = {
      purId: this.data.OrderDetailData.id,
      shopId: app.globalData.g_shopId,
      custId: app.globalData.g_loginState.userId
    }
    util.http(url2, param2).then(data => {
      let tmp = {}
      tmp.title = data.title
      tmp.oriPrice = data.price
      tmp.goodsNum = data.num
      tmp.discount = data.couponMoney
      tmp.realMoney = data.realPrice
      tmp.purId = this.data.OrderDetailData.id
      tmp.orderDate = data.createTime
      let params = util.stringifyParams(tmp)
      // 跳转到支付成功页面
      wx.redirectTo({
        url: subpageUrl + params
      })
    })
  },
  cancelReservation: function(e) {
    let _this = this,
      orderStatus = e.currentTarget.dataset.status;
    let url = app.globalData.urlBase + '/spread/mp/appoint/inTimecancelTips';

    util.http(url, {
      orderId: this.options.orderId,
      orderType: this.options.orderType
    }).then((res) => {
      if (res.errorCode == '9000') {
        wx.showModal({
          content: res.refundRule,
          cancelText: '我再想想',
          success(res) {
            if (res.confirm) {
              _this.httpCancelReservation();
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
  httpCancelReservation: function() {
    let url = app.globalData.urlBase + '/spread/mp/appoint/cancel';
    util.http(url, {
      appointId: this.options.orderId
    }).then(res => {
      if (res.errorCode === 9000) {
        this.loadData()
        wx.showModal({
          title: '预约已为您取消',
          content: `押金会在${res.refundWaitDay}个工作日内返还于你的微信钱包,根据您的取消预约时间，退还您${res.refundAmount}元的押金`,
          showCancel: false
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
          // wx.showModal({
          //   title: '提示',
          //   content: '核销成功',
          //   showCancel: false,
          //   success(res) {
          //     _this.loadData();
          //     _this.setData({
          //       showCodeBox: false
          //     })
          //   }
          // })
        }
      });
    });
  },
  closeSocket: function() {
    util.closeSocketFn();
  },
  viewVerifyCode: function(e) {
    // verifyId

    let verifyId = e.currentTarget.dataset.id,
      orderType = e.currentTarget.dataset.type,
      url = app.globalData.urlBase + '/spread/mp/verify/generateVerifyCode';
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
    },  10*1000)

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
  //20190917
  /**打卡核销 */
  handleVerification: function(){
    this.setData({
      showTitle:'完成评论以后，可提前退还保证金'
    })
    this.getLocationInfo().then(this.checkLocation).then(res => {
      console.log('定位信息', res)
      const location = util.handleGCJToBaidu(res.latitude, res.longitude);
      console.log('百度定位信息', location)
      this.setData({
        commentShow: true,
        lon: location.longitude,
        lat: location.latitude,
      })
      wx.hideLoading()
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
    });
  },

  checkLocation(res) {
    return new Promise((resolve, reject) => {
      resolve(res)
    });
  },
  //获取位置信息
  getLocationInfo() {
    wx.showLoading({
      title:'数据处理中',
      icon:'loading'
    })
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          resolve(res)
        },
        fail(res) {
          wx.showModal({
            title: '提示',
            content: '打卡核销需要获取你当前的定位',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.userLocation'] === true) {
                      _this.handleVerification();
                    } else {
                      console.log('拒绝授权');
                    }
                  }
                })
              } else if (res.cancel) {
                reject('用户拒绝了');
              }
            }
          })
        }
      });
    });
  },
  //商家扫码核销后显示的评论窗
  verifyComment(){
    this.setData({
      verificationShow: false,
      commentShow: true
    })
  },
  /**显示评论窗口 */
  showComment(){
    this.setData({
      commentShow:true
    })
  },
  handleClose(){
    this.setData({
      commentShow:false,
      clockShow:false,
      successShow:false,
      verificationShow:false
    })
    this.loadData()
    console.log('关闭了')
  },
  /**处理评论逻辑 */
  handleComment() {
    if (this.data.commentContent.trim().length<10){
      wx.showToast({
        title: '评论内容最少10个字',
        icon:'none'
      })
      return;
    }
    if(this.data.commentUpload.length<1){
      wx.showToast({
        title: '照片最少要上传一张',
        icon: 'none'
      })
      return;
    }
    const { commentUpload } = this.data
    let imgs = [];
    commentUpload.map(item=>{
      imgs.push(item.url)
    })
    imgs = imgs.join(',')
    let params = {
      appointId: this.data.OrderDetailData.orderId,
      goodsScore: score[this.data.commentRate-1],
      content: this.data.commentContent,
      imgs
    }
    let url = '';
    if (this.data.OrderDetailData.orderStatus == '4'){
      params = { ...params, lon: this.data.lon, lat: this.data.lat, orderId: this.data.OrderDetailData.orderId,orderType: 2 }
      url = app.globalData.urlBase + 'spread/mp/evaluate/createGoodsEvaluate'
    }else{
      params = { ...params, lon: this.data.lon, lat: this.data.lat }
      url = app.globalData.urlBase + 'spread/mp/appoint/verify'
    }
    console.log('打卡评论请求信息',params);
    this.setData({
      btnLoading:true
    })
    if (this.data.OrderDetailData.evaluateStatus == 1){
      this.requestComment(url, params)
    }else{
      this.requestVerify(url, params)
    }
    
  },
  setBtnLoading(){
    this.setData({
      btnLoading: false
    })
  },
  requestVerify(url, params){
    util.http(url, params).then(res => {
      this.setBtnLoading()
      if (res.errorCode == 9000) { //打卡成功
        this.setData({
          clockShow: true,
          commentShow: false
        })
      } else {
        wx.showModal({
          title: '打卡核销失败',
          content: res.errorMessage,
          showCancel: false
        })
      }
    }).catch(this.setBtnLoading)
  },
  requestComment(url, params){
    util.http(url, params).then(res => {
      if (res.errorCode == 9000) { //评论成功
        this.setData({
          successShow: true,
          commentShow: false
        })
      } else {
        wx.showToast({
          title: res.errorMessage,
        })
      }
    }).finally(this.setBtnLoading)
  },
  getTextValue(e){
    this.setData({
      commentContent: e.detail.value
    })
  },
  getRateValue(e){
    console.log(e)
    this.setData({
      commentRate: e.detail
    })
  },
  uploadSuccess(e){
    console.log(e)
    if(e.detail.file.res.errorCode == 9000){
      const file = {
        uid:e.detail.file.uid,
        url: e.detail.file.res.data.url
      }
      this.imgs.push(file)
      this.setData({
        commentUpload:this.imgs
      })
    } else {
      wx.showToast({
        title: e.detail.file.res.errorMessage
      })
    }
  },
  uploadRemove(e){
    const index = this.imgs.map((item) => item.uid).indexOf(e.detail.file.uid);
    if (index !== -1) {
      this.imgs.splice(index, 1);
      this.setData({
        commentUpload: this.imgs
      })
    }
  },
  uploadBefore(){
    console.log('上传图片前')
    wx.showLoading({
      title:'上传图片中'
    })
  },
  uploadComplete(e){
    console.log('图片上传完成')
    wx.hideLoading()
  },

  navToProduct() { 
    if (this.goodsTopType == 9) {
      wx.navigateTo({
        url: `/pages/index/playcard/playcard?spuId=${this.spuId}`,
      });
    } else { 
      wx.navigateTo({
        url: `/pages/index/ticket/ticket-detail/ticket-detail?goodsId=${this.spuId}`,
      });
    }
    
  },
})
