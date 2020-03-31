// pages/distribution/payment/payment.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    confirmID: false, //确认联系人信息
    name: "", //购买人姓名
    id: "", //购买会员卡id
    idInfo: [],
    attachInfo:[],
    formArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.system = wx.getSystemInfoSync()
    this.params = {
      accessAppointFlag:options.accessAppointFlag
    }
    this.formInfoJson = null // 附加信息
    const idInfo = []
    const attachInfo = []
    if(options.buyAttachRule && options.buyAttachRule!=""){
      this.buyAttachRule = JSON.parse(options.buyAttachRule)
      
      this.buyAttachRule.forEach((item, index) => { 
        if (item.fieldName == 'name' || item.fieldName == 'idCard2') {
          idInfo.push(item)
        } else { 
          attachInfo.push(item)
        }
      })
    }
    
    this.options = options
    const user = wx.getStorageSync("g_userInfo")
    this.setData({
      order: options,
      user,
      idInfo,
      attachInfo
    })
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
    wx.hideLoading();
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

  getVal: function(obj) {
    if (obj) {
      this.setData({
        name: obj.name,
        id: obj.idCard,
        haveId: true
      })
    }
  },
  navigateToContacts: function() {
    wx.navigateTo({
      url: '/pages/mine/contacts/contacts',
    })
  },
  //输入错误
  inputError: function() {
    this.setData({
      confirmID: false
    })
  },
  handleClick() { 
    if (wx.requestSubscribeMessage) {
      this.subscribeMessage()
    } else { 
      this.handleSubmit()
    }
    
  },
  formSubmit: function(e) { 
    if(Object.keys(e.detail.value).length > 0){
      const formObj = e.detail.value
      const formArr = []
      this.formInfoJson = JSON.stringify(e.detail.value)

      for (var i = 0; i < this.buyAttachRule.length; i++) {
        for (var key in formObj) {
          if (this.buyAttachRule[i].fieldName === key) {
            formArr.push({
              name: this.buyAttachRule[i].fieldLabel,
              val: formObj[key]
            })
          }
        }
      }
      this.setData({
        formArr
      })
    }
    this.getOrderTips()
    // this.handleClick()
  },
  handleSubmit() { 
    if (this.options.buyNeedAttach === '1') {  // 需要身份证信息
      // const formInfo = {
      //   idCard2: this.data.id,
      //   name: this.data.name
      // }
      // this.formInfoJson = JSON.stringify(formInfo)
      this.submitOrder()
    } else { 
      this.beforeCreateOrder()
    }
  },
  //弹框确认后提交支付订单
  handleConfirm() {
    // this.handleOrder()
    this.beforeCreateOrder()
  },
  
  /**
   * 订阅消息
   */
  subscribeMessage() { 
    wx.requestSubscribeMessage({
      tmplIds: ['gA0HfhsWK6e4nxE7VKQZ76sS-tQ_f__xakS6vRQnF1g'],
      success:(res)=>{
        console.log('success', res)
        this.handleSubmit()
      },
      fail:(err)=>{
        this.handleSubmit()
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
  // 提交订单
  submitOrder: function () {
    
    if (!this.data.confirmID) {
      return this.setData({
        confirmID: true
      })
    }
  },
  beforeCreateOrder: function() {
    this.createOrder().then(res => {
      if (res.errorCode === 9000) {
        console.log(res)
        this.params.orderId = res.orderId
        const url = app.globalData.urlBase + 'spread/mp/drp/order/pay';
        util.http(url, {
          orderId: res.orderId
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
    const url = app.globalData.urlBase + 'spread/mp/drp/order/create';
    let inviterObj = {}
    if (this.options.custId) { 
      inviterObj = {
        inviter:this.options.custId
      }
    }
    
    return util.http(url, {
      ...inviterObj,
      skuId: this.options.skuId,
      price: this.options.price,
      formInfoJson:this.formInfoJson
    })
  },
  processPay: function (data) {
    console.log(data);
    let self = this;
    if (data.errorCode === 9000) {
      this.params = Object.assign(this.params, data);
      let params = util.stringifyParams(this.params);
      const url = "/pages/distribution/payment-success/payment-success" + params
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
          app.globalData.tabActive = 1 
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
   * 购买型商品下单处理
   */
  handleOrder() { 
    this.getOrderTips();
  },
  /**
   * 分销普通商品购买之前的重要提示
   */
  getOrderTips() { 
    const url = app.globalData.urlBase + 'spread/mp/drp/order/orderTips';
    const params = {
      skuId: this.options.skuId,
      price: this.options.price,
      formInfoJson:this.formInfoJson
    }
    util.http(url, params).then(res => { 
      if (res.errorCode == 9000 && res.spreadTips!='') {
        wx.showModal({
          title: '提示',
          content: res.spreadTips,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              this.handleClick()
            }
          },
          fail: () => { },
          complete: () => { }
        });
      } else { 
        wx.showToast({
          title: res.errorMessage,
          icon: 'none',
        });
      }
    })
  },
  // /**
  //  * 分销预约商品预约之前的重要提示
  //  */
  // getAppointTips() { 
  //   const url = app.globalData.urlBase + 'spread/mp/drp/appoint/appointTips';
  //   const params = {
  //     skuId: this.options.skuId
  //   }
  //   util.http(url, params).then(res => { 
  //     console.log(res)
  //   })
  // },
})