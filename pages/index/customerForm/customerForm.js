// pages/index/customerForm/customerForm.js
var app = getApp()
const util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childInputArr: [],
    normalInputArr: [],
    appointTips: [],
    formArr: [],
    showDialog: false,
    date: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const welfareIdObj = {}
    if (options.welfareId) { 
      welfareIdObj.welfareId = options.welfareId
    }
    this.obj = {
      depositAmount: options.depositAmount,
      imgs: options.imgs,
      refundRule: options.refundRule,
      shopAddress: options.shopAddress,
      shopName: options.shopName,
      skuId: options.skuId,
      spuName: options.spuName,
      vipSpuId: options.vipSpuId,
      ...welfareIdObj
    };
    this.chosenDate = options.chosenDate;

    let appointAttachRule = JSON.parse(options.appointAttachRule),
      appointTips = JSON.parse(options.appointTips);
    this.appointAttachRule = appointAttachRule;

    // let childInputArr = appointAttachRule.filter(item => {
    //   return item.fieldName === 'idCard2' || item.fieldName === 'name';
    // })
    // let normalInputArr = appointAttachRule.filter(item => {
    //   return item.fieldName !== 'idCard2' && item.fieldName !== 'name';
    // })

    this.setData({
      normalInputArr: appointAttachRule,
      appointTips
    })
  },
  formSubmit: function(e) {
    let formObj = e.detail.value,
      formArr = [],
      plans = this.appointAttachRule;
    this.formObj = formObj;

    for (var i = 0; i < plans.length; i++) {
      for (var key in formObj) {
        if (plans[i].fieldName === key) {
          formArr.push({
            name: plans[i].fieldLabel,
            val: formObj[key]
          })
        }
      }
    }

    let url = app.globalData.urlBase + '/spread/mp/appoint/preCheck';
    util.http(url, {
      vipSpuId: this.obj.vipSpuId,
      skuId: this.obj.skuId,
      formInfoJson: JSON.stringify(formObj)
    }).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          formArr,
          showDialog: true
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
        })
      }
    })
  },
  confirm: function() {
    let params = util.stringifyParams({
      ...this.obj,
      chosenDate: this.chosenDate,
      formInfoJson: JSON.stringify(this.formObj),
      middlePage: this.data.normalInputArr.length>0
    })
    wx.navigateTo({
      url: '/pages/index/reservation/reservation' + params
    })
  },
  closeDialog: function() {
    this.setData({
      showDialog: false
    })
  },
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  dateChange: function(e) {
    let val = e.detail.value,
      name = e.currentTarget.dataset.name,
      date = {
        [name]: val
      };

    this.setData({
      date
    })
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

  }
})