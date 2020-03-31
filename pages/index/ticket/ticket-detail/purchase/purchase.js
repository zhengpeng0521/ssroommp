var app = getApp()
var util = require("../../../../../utils/util")

// pages/index/ticket/ticket-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    confirmID: false, //确认联系人信息
    cover: "", //门票图片
    saleNum: "", //已售数量
    title: "", //门票
    goodsNum: 1, //门票数量
    price: "", //门票原价
    memberPrice: "", //会员价
    totalPrice: "", //小计金额
    realMoney: "", //实付金额
    deductAmount: "",
    reduceAmount:'',//优惠金额
    totalDeductAmount: "",
    type: "",
    isLoading: true,
    animateOfBtnPlus: null,
    animateOfBtnMinus: null,
    animateOfBtnCoupon: null,
    animateOfBtnSubmit: null,
    name: "", //购买人姓名
    id: "", //购买会员卡id
    isVipCard: false, //是否是会员卡购买
    haveId: false,
    /**优惠券相关 */
    showPopup: false,
    coupon:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.system = wx.getSystemInfoSync()
    // options包含了门店shopId，门票ticketId，原价oriPrice，现价realPrice
    console.log("订单支付页面----------", options)
    this.options = options
    let userInfo = wx.getStorageSync("g_userInfo")
    if (userInfo.idCard) {
      this.setData({
        haveId: true,
        name: userInfo.name,
        id: userInfo.idCard
      })
    }
    this.setData({
      price: this.options.price,
      memberPrice: this.options.memberPrice,
      title: this.options.goodsName,
      saleNum: this.options.saleNum,
      cover: this.options.cover,
      deductAmount: this.options.deductAmount,
      type: this.options.goodsType,
      userInfo: userInfo,
      buyType: this.options.buyType,
      reduceAmount: this.options.reduceAmount,
      virtualSaleNum: this.options.virtualSaleNum
    })

    if (this.options.goodsType == 9) {
      this.setData({
        isVipCard: true
      })
    }
    this.imputedRealMoney()

    this.getCoupon() //获取可用优惠券
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
      animateOfBtnPlus: null,
      animateOfBtnMinus: null,
      animateOfBtnCoupon: null,
      animateOfBtnSubmit: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  navigateToContacts: function() {
    wx.navigateTo({
      url: '/pages/mine/contacts/contacts',
    })
  },
  getVal: function(obj) {
    if (obj) {
      this.setData({
        name: obj.name,
        id: obj.idCard,
        haveId: true
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  // 处理输入框边的加减
  tapChangeNum: function(event) {
    var isMinus = event.currentTarget.dataset.minus
    var goodsNum = this.data.goodsNum
    var _this = this
    if (isMinus) {
      this.setData({
        animateOfBtnMinus: true
      })
      setTimeout(() => {
        if (goodsNum === 1) return
        this.setData({
            goodsNum: --goodsNum,
            animateOfBtnMinus: null
          },
          function() {
            _this.imputedRealMoney()
          }
        )
      }, 100)
    } else {
      this.setData({
        animateOfBtnPlus: true
      })
      setTimeout(() => {
        this.setData({
            goodsNum: ++goodsNum,
            animateOfBtnPlus: null
          },
          function() {
            _this.imputedRealMoney()
          }
        )
      }, 100)
    }
  },

  // 计算实付金额
  imputedRealMoney: function() {
    // 使用优惠券前的实付金额
    const isSpreader = wx.getStorageSync("g_userInfo").isSpreader
    let countPrice = 0
    if (isSpreader > 0) {
      countPrice = this.data.memberPrice
    } else {
      countPrice = this.data.price
    }
    let price = parseFloat(this.data.goodsNum) * Number(countPrice)
    let totalDeductAmount =
      parseFloat(this.data.goodsNum) * Number(this.data.deductAmount)
    if (!this.data.reduceAmount) {
      this.setData({
        totalPrice: price.toFixed(2),
        realMoney: price.toFixed(2),
        totalDeductAmount: totalDeductAmount.toFixed(2)
      })
    } else {
      if ((price - this.data.reduceAmount).toFixed(2) <= 0) {
        this.welfareId = ''
        wx.showModal({
          title: '提示',
          content: '减免券的减免金额已超出商品价格，减免券不可用！',
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            this.setData({
              reduceAmount:''
            })
          }
        });
        return
      }
      this.setData({
        totalPrice: price.toFixed(2),
        realMoney: (price-this.data.reduceAmount).toFixed(2),
        totalDeductAmount: totalDeductAmount.toFixed(2)
      })
    }

  },

  // 改变数量的门票点击事件
  iptChangeNum: function(event) {
    var num = event.detail.value
    this.data.goodsNum = Number(num)
    this.imputedRealMoney()
  },
  // 提交订单
  submitOrder: function() {
    if (!this.data.name || !this.data.id) {
      return wx.showToast({
        title: "请输入完成持卡人信息",
        icon: "none",
        duration: 2000
      })
    }

    if (!this.data.confirmID && this.data.isVipCard) {
      return this.setData({
        confirmID: true
      })
    }
    this.setData({
      animateOfBtnSubmit: true
    })
    setTimeout(() => {
      this.setData({
        confirmID: false
      })
      let url = app.globalData.urlBase,
        param = {}

      //shopId  price  inviter   goodsJson
      //shopId  goodsId  price  inviter
      param = {
        shopId: this.options.shopId,
        price: this.data.realMoney
      }
      //goodsJson
      if (this.options.goodsType === "9") {
        url = url + "/spread/mp/order/createSuperCard"
        if(this.welfareId) param.welfareId = this.welfareId
        param.skuId = this.options.goodsId
        param.isAgreed = 1;
        param.formInfoJson = JSON.stringify({
          name: this.data.name,
          idCard: this.data.id
        })
        if (this.options.thirdIdentity){
          param.thirdIdentity=this.options.thirdIdentity
        }
      }
      // if (
      //   this.options.goodsType === "1" ||
      //   this.options.goodsType === "2"
      // ) {
      //   url = url + "/spread/mp/order/create"
      //   param.goodsJson = JSON.stringify([{
      //     goodsId: this.options.goodsId,
      //     count: this.data.goodsNum,
      //     cardType: this.options.goodsType
      //   }])
      // }
      //
      if (this.options.inviter) {
        param.inviter = this.options.inviter
      }
      // 传递给子页面的参数
      this.params = {
        goodsNum: this.data.goodsNum,
        realMoney: this.data.realMoney
      }
      this.params = Object.assign(this.params, this.options)
      // console.log(this.params);
      // wx.navigateTo({
      //   url: "unpaid/unpaid" + util.stringifyParams(this.params)
      // });
      // return false;
      util.http(url, param).then(this.processPayData)
    }, 100)
  },
  processPayData: function(res) {
    if (res.errorCode === 9000) {
      let url = app.globalData.urlBase + "/spread/mp/pay/payCreate",
        param = {
          payOrderId: res.orderId,
          amount: this.data.realMoney
        }
      this.params.orderId = res.orderId

      util.http(url, param).then(this.processPay)
    } else {
      wx.showModal({
        title: "提示",
        content: "创建订单失败(" + res.errorMessage + ")",
        showCancel: false
      })
    }
  },
  // 处理支付

  processPay: function (data) {
    let self = this;
    if (data.errorCode === 9000) {
      this.params.orderType = 1
      this.params = Object.assign(this.params, data)

      let params = util.stringifyParams(this.params)
      const url = "pay-success/pay-success" + params
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
        success: function(res) {
          console.log("传进的数据-----------", params)
          // wx.navigateTo({
          //   url: "pay-success/pay-success" + params
          // })
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
          wx.navigateTo({
            url: "unpaid/unpaid" + params
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
  getCoupon: function () { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/queryGoodsTicket'
    util.http(url, { spuId: this.options.spuId }).then(res => { 
      const coupon = util.formatCouponData(res.goodsTickets)
      this.setData({
        coupon
      })
    })
  },
  selectCoupon: function (e) { 
    this.setData({
      showPopup:true
    })
  },
  handleClose: function () { 
    this.setData({
      showPopup:false
    })
  },
  onSelect: function (e) { 
    const item = e.detail.item
    this.welfareId = item.customerWelfareId
    const reduceAmount = item.reduceAmount
    this.setData({
      reduceAmount,
      showPopup:false
    }, function () { 
      this.imputedRealMoney()
    })
  },
  //输入错误
  inputError: function() {
    this.setData({
      confirmID: false
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindCardInput: function(e) {
    this.setData({
      id: e.detail.value
    })
  },
  buySuperCard() {
    this.submitOrder()
  }
})