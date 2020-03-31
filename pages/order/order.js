var app = getApp()
var util = require("../../utils/util")

// pages/order/order.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
    headContent: [{
      text: "全部",
      lineShow: true,
      badge: null,
      index: 0
    },
    {
      text: "待支付",
      lineShow: false,
      badge: null,
      index: 1
    },
    {
      text: "待预约",
      lineShow: false,
      badge: null,
      index: 2
    },
    {
      text: "待核销",
      lineShow: false,
      badge: null,
      index: 4
    },
    {
      text: "已完成",
      lineShow: false,
      badge: null,
      index: 5
    }],
    orderListData: [], //当前数据列表
    drpOrderListData: [],
    allOrderListData: [], //所有的数据列表
    currentIndex: 0,
    isLoading: true,
    isLoadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    this.tabActive = app.globalData.tabActive
    this.setData({
      tabActive:this.tabActive
    })
    app.globalData.tabActive = 0 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    clearInterval(this.unpaidInterval);
    if (wx.getStorageSync('token') === "") {
      var promise = util.loginByCode()
      promise
        .then(this.firstLoadingData)
    } else {
      this.firstLoadingData();
    }
  },

  firstLoadingData: function () {
    this.setData({
      currentIndex: 0
    })
    console.log('第一次加载数据!~~~~~~~~~~')
    if (this.tabActive == 0 || !this.tabActive) {
      this.index = 0
      let url = app.globalData.urlBase + "spread/mp/order/findAll"
      this.url = url
      util.http(url, {
        pageSize: 10,
        pageIndex: 0
      }).then(this.processOrderListData)
    } else { 
      this.queryDprOrder()
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.unpaidInterval)
    this.deleteAllData()
    this.setData({
      isLoading: true
    })
  },
  // 再次打开这个页面清空所有数据
  deleteAllData: function () {
    let obj = {
      headContent: [{
        text: "全部",
        lineShow: true,
        badge: null,
        index: 0
      },
      {
        text: "待支付",
        lineShow: false,
        badge: null,
        index: 1
      },
      {
        text: "待预约",
        lineShow: false,
        badge: null,
        index: 2
      },
      {
        text: "待核销",
        lineShow: false,
        badge: null,
        index: 4
      },
      {
        text: "已完成",
        lineShow: false,
        badge: null,
        index: 5
      }],
      orderListData: [], //当前数据列表
      allOrderListData: [], //所有的数据列表
      currentIndex: 0,
    }
    this.setData(obj)
    this.index = null
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.unpaidInterval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 根据当前索引加载更多数据
    // console.log('底部数据加载出来~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    let _this = this;
    if (this.data.orderListData.data.pageCount != this.data.orderListData.data.pageIndex) {
      this.setData({
        isLoadingMore: true
      })
      let param = {
        pageIndex: this.data.allOrderListData[this.index].data.pageIndex + 1,
        pageSize: 10
      }
      if (this.index > 0) {
        param.orderStatus = this.index - 1
      }
      util.http(this.url, param).then(data => {
        this.data.orderListData.results = this.data.orderListData.results.concat(
          data.results
        )
        this.data.orderListData.data = data.data

        // 如果index是0或1时，有未支付的订单需要倒计时
        if (this.index === 0 || this.index === 1) {
          clearInterval(this.unpaidInterval)
          this.unpaidInterval = setInterval(function () {
            for (let item of _this.data.orderListData.results) {
              if (item.surplusTime) {
                if (item.surplusTime === 1) {
                  _this.firstLoadingData();
                  continue
                }
                item.surplusTime = Number(item.surplusTime) - 1
                item.deadline = util.formatSecondsToTime(
                  item.surplusTime,
                  2
                )
              }
            }
            _this.data.allOrderListData[
              _this.index
            ] = _this.data.orderListData
            _this.setData({
              orderListData: _this.data.orderListData,
              allOrderListData: _this.data.allOrderListData
            })
          }, 1000)
        }

        let currentPageIndex = data.data.pageIndex
        currentPageIndex += 1
        if (currentPageIndex === data.data.pageCount) {
          this.data.orderListData.isHaveMoreData = false
        }

        this.data.allOrderListData[this.index] = this.data.orderListData
        this.setData({
          orderListData: this.data.orderListData,
          isLoadingMore: false,
          allOrderListData: this.data.allOrderListData
        })
      })
    }
  },

  // 处理首次进入页面时load的全部数据
  processOrderListData: function (data) {

    if (data.results.length === 0) {
      this.setData({
        currentIndex: 0,
      })
    }
    this.index = 0
    let _this = this;
    // 将未支付的剩余时间转化成deadline
    data.results.map(item => {
      if (item.surplusTime) {
        item.deadline = util.formatSecondsToTime(item.surplusTime, 2)
      }
    })
    // 给未支付的订单添加倒计时
    clearInterval(this.unpaidInterval)
    this.unpaidInterval = setInterval(function () {
      for (let item of _this.data.orderListData.results) {
        if (item.surplusTime) {
          if (item.surplusTime === 1) {
            // clearInterval(this.unpaidInterval)
            _this.firstLoadingData();
          }
          item.surplusTime = Number(item.surplusTime) - 1
          item.deadline = util.formatSecondsToTime(
            item.surplusTime,
            2
          )
        }
      }
      _this.data.allOrderListData[0] = _this.data.orderListData
      _this.setData({
        orderListData: _this.data.orderListData,
        allOrderListData: _this.data.allOrderListData
      })
    }, 1000)

    // this.data.headContent[1].badge = data.unpaidNum;
    // this.data.headContent[2].badge = data.unusedNum;
    // this.data.headContent[3].badge = data.unevalutionNum;
    // this.data.headContent[4].badge = data.refund;

    if (data.data.pageCount > 1) {
      data.isHaveMoreData = true
    } else {
      data.isHaveMoreData = false
    }
    this.data.allOrderListData[0] = data
    this.setData({
      orderListData: data,
      isLoading: false,
      allOrderListData: this.data.allOrderListData,
      headContent: this.data.headContent
    })
  },

  // 处理tab栏切换
  toogleTab: function (e) {
    clearInterval(this.unpaidInterval)
    let index = e.currentTarget.dataset.index
    this.index = index
    console.log('index-------------', index)
    // 去掉所有tab栏下的线
    for (let i = 0; i < this.data.headContent.length; i++) {
      this.data.headContent[i].lineShow = false
    }
    // 当前tab栏下加线
    if(index === 5 || index === 4) {
      this.data.headContent[index - 1].lineShow = true
    } else {
      this.data.headContent[index].lineShow = true
    }
    // 如果已经加载了tab对应的数据，则不需要重新加载
    if (this.data.allOrderListData[index] && index !== 0 && index !== 1) {
      this.setData({
        headContent: this.data.headContent,
        orderListData: this.data.allOrderListData[index]
      })
      if(index === 4 || index === 5) {
        this.setData({
          currentIndex: index - 1
        })
      } else {
        this.setData({
          currentIndex: index,
        })
      }
    }
    // 因为1待付款会在当前页面进行付款，所以需要重新加载0和1的数据
    else if (index === 0) {
      this.firstLoadingData()
    } else {
      this.getTabData()
    }
  },

  // 请求另外的数据源
  getTabData: function () {
    let param = {
      pageIndex: 0,
      pageSize: 10
    }
    if (this.index > 0) {
      param.orderStatus = this.index - 1
    }
    console.log("1111111111切换tab传入的params--------", param.orderStatus)
    util.http(this.url, param).then(data => {
      // console.log("2222222获取的tabs-----------另外的资源", data)


      if (this.unpaidInterval) clearInterval(this.unpaidInterval)
      if (data.data.pageCount > 1) {
        data.isHaveMoreData = true
      } else {
        data.isHaveMoreData = false
      }
      // 待支付的剩余时间，并将剩余时间转化成deadline
      if (this.index === 1) {
        data.results.map(item => {
          if (item.surplusTime) {
            item.surplusTime = Number(item.surplusTime)
            item.deadline = util.formatSecondsToTime(
              item.surplusTime,
              2
            )
          }
        })
      }
      this.data.allOrderListData[this.index] = data
      this.setData({
        headContent: this.data.headContent,
        orderListData: data,
        allOrderListData: this.data.allOrderListData
      })
      if(this.index === 4 || this.index === 5) {
        this.setData({
          currentIndex: this.index - 1,
        })
      } else {
        this.setData({
          currentIndex: this.index,
        })
      }
      if (this.index === 1) {
        clearInterval(this.unpaidInterval);
        this.unpaidInterval = setInterval(() => {
          for (let item of data.results) {
            if (item.surplusTime) {
              if (item.surplusTime === 1) {
                this.firstLoadingData();
                continue
              }
              item.surplusTime -= 1
              item.deadline = util.formatSecondsToTime(
                item.surplusTime,
                2
              )
            }
          }
          this.data.allOrderListData[this.index] = data
          this.setData({
            orderListData: data,
            allOrderListData: this.data.allOrderListData
          })
        }, 1000)

      }
    })
  },

  // 查看二维码
  onViewQrCode: function () {
    // let purchaseId = e.currentTarget.dataset.id;
    wx.switchTab({
      url: "../../pages/mine/mine"
    })
  },

  // 打开订单详情
  onOpenOrderDetail: function (e) {
    console.log("打开------订单详情-----------e", e)
    let id = e.currentTarget.dataset.id
    let orderType = e.currentTarget.dataset.ordertype
    let obj = {
      orderId: id, //普通订单/积分商城
      orderType
    }
    let param = util.stringifyParams(obj)
    let index = e.currentTarget.dataset.index
    this.data.orderListData.results[index].animateOfBtn = true
    this.setData({
      orderListData: this.data.orderListData
    })

    let orderStatus = e.currentTarget.dataset.status
    let amount = e.currentTarget.dataset.amount
    if (orderStatus === "0") {
      if (orderType === '1') {
        this.onContinuePay(e)
      }
      if (orderType === '2') {
        this.onContinueReserve(e)
      }
    } else {
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/order/order-detail/order-detail" + param
        })
        this.data.orderListData.results[index].animateOfBtn = false
        this.setData({
          orderListData: this.data.orderListData
        })
      }, 100)
    }
  },
  onOpenSpreadOrder(e) {
    let id = e.currentTarget.dataset.id
    let orderType = e.currentTarget.dataset.ordertype
    let obj = {
      orderId: id, //普通订单/积分商城
      orderType
    }
    let params = util.stringifyParams(obj)
    let index = e.currentTarget.dataset.index
    let orderStatus = e.currentTarget.dataset.status
    if (orderStatus === "0") {
      this.onDrpContinuePay(e)
    } else {
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/recordedLesson/order-detail/order-detail" + params
        })
        this.data.orderListData.results[index].animateOfBtn = false
        this.setData({
          orderListData: this.data.orderListData
        })
      }, 100)
    }
  },
  /**
   * 分销商品继续支付订单
   * @param {*} e 
   */
  onDrpContinuePay: function (e) {
    this.searchId = e.currentTarget.dataset.id
    this.params = {}
    // 调统一支付接口
    let url = app.globalData.urlBase + "spread/mp/drp/order/pay"
    let param = {
      orderId: e.currentTarget.dataset.id,
      amount: e.currentTarget.dataset.amount
    }
    util.http(url, param).then(this.processDprRepay)
    // 调微信支付
  },
  /**
   * 关闭分销商品订单
   */
  closeDprOrder(e) { 
    const dataset = e.currentTarget.dataset
    const id = dataset.id
    let url = app.globalData.urlBase + "spread/mp/drp/order/close"
    let param = {
      orderId: id
    }
    util.http(url, param).then(res => {
      let msg = res.errorMessage
      if (res.errorCode === 9000) {
        this.getTabData()
        msg = '订单取消成功'
      }
      wx.showToast({
        title: msg,
        icon: 'none',
      });
    })
  },
  //继续预约接口
  onContinueReserve: function (e) {
    this.searchId = e.currentTarget.dataset.id
    this.orderType = 2;
    let url = app.globalData.urlBase + '/spread/mp/appoint/pay';
    util.http(url, {
      appointId: e.currentTarget.dataset.id
    }).then(this.processRepay)
  },

  // 继续支付按钮
  onContinuePay: function (e) {
    console.log("单点继续支付按钮调用---------------", e)
    this.searchId = e.currentTarget.dataset.id
    this.orderType = 1;
    this.params = {}
    // 调统一支付接口
    let url = app.globalData.urlBase + "spread/mp/pay/payCreate"
    let param = {
      payOrderId: e.currentTarget.dataset.id,
      amount: e.currentTarget.dataset.amount
    }
    util.http(url, param).then(this.processRepay)
    // 调微信支付
  },
  
  // 处理支付结果
  processRepay: function (data) {
    let _this = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packages,
      signType: "MD5",
      paySign: data.paySign,
      success: function (res) {
        // 支付成功后修改订单状态
        _this.getOrderDetailToPaySuccess()
      },
      fail: function (res) {
        wx.showToast({
          title: "支付未成功，请重试",
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  // 支付成功后调订单详情，传给支付成功页面
  getOrderDetailToPaySuccess: function () {
    // 查询商品详情并传递到支付成功页面
    let url2 = app.globalData.urlBase + "spread/mp/order/findOne"
    let param2 = {
      orderId: this.searchId,
      orderType: this.orderType
    }
    util.http(url2, param2).then(data => {
      let tmp = {}
      tmp.goodsName = data.goodsName
      tmp.price = data.orderTotalAmount
      tmp.goodsNum = data.count
      tmp.totalDeductAmount = data.deductShouldAmount
      tmp.realMoney = data.orderAmount
      tmp.orderId = data.orderId
      tmp.orderType = this.orderType;
      let params = util.stringifyParams(tmp)
      // 跳转到支付成功页面
      wx.navigateTo({
        url: "/pages/index/ticket/ticket-detail/purchase/pay-success/pay-success" +
          params
      })
    })
  },
  // 处理分销支付结果
  processDprRepay: function (data) {
    let _this = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packages,
      signType: "MD5",
      paySign: data.paySign,
      success: function (res) {
        // 支付成功后修改订单状态
        _this.getDprOrderToPaySuccess()
      },
      fail: function (res) {
        wx.showToast({
          title: "支付未成功，请重试",
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  getDprOrderToPaySuccess: function () {
    // 查询商品详情并传递到支付成功页面
    let url2 = app.globalData.urlBase + "spread/mp/drp/order/findOne"
    let param2 = {
      orderId: this.searchId || '1240556954582110208',
    }
    util.http(url2, param2).then(data => {
      let tmp = {}
      tmp.goodsName = data.goodsName
      tmp.price = data.orderTotalAmount
      tmp.goodsNum = data.count
      tmp.totalDeductAmount = data.deductShouldAmount
      tmp.realMoney = data.orderAmount
      tmp.orderId = data.orderId
      tmp.goodsId = data.spuId
      let params = util.stringifyParams(tmp)
      // 跳转到支付成功页面
      wx.navigateTo({
        url: "/pages/recordedLesson/payment-success/payment-success" +
        params
      })
    })
  },
  handleCloseOrder: function (e) {
    const dataset = e.currentTarget.dataset
    const id = dataset.id
    const orderType = dataset.type

    let url = app.globalData.urlBase + "spread/mp/appoint/close"
    let param = {
      appointId: id
    }
    if (orderType == "1") {
      url = app.globalData.urlBase + "spread/mp/order/close"
      param = {
        orderId: id
      }
    }

    util.http(url, param).then(res => {
      let msg = res.errorMessage
      if (res.errorCode === 9000) {
        this.getTabData()
        msg = '订单取消成功'
      }
      wx.showToast({
        title: msg,
        icon: 'none',
      });
    })
  },
  // 以下是分销逻辑
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      tabActive: index
    })
    this.tabActive = index
    wx.pageScrollTo({
      scrollTop:0
    })
    if (index == 0) {
      this.firstLoadingData()
    } else {
      this.queryDprOrder()
    }

  },
  queryDprOrder() {
    const url = app.globalData.urlBase + "spread/mp/drp/order/findAll"
    this.url = url
    const params = {
      pageIndex: 0,
      pageSize: 10
    }
    util.http(url, params).then(this.processOrderListData)
  },
  selectAppointDay(e) { 
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recordedLesson/calendar/calendar?orderId=${orderId}`,
    });
  }
})
