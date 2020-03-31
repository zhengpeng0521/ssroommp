// pages/index/calendar/calendar.js
import dateUtil from '../../../utils/calendar.js'
var app = getApp()
const util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
    systemInfo: {},
    daysTime: '',
    isLoading: true,
    appointPlans: [],
    appointMonthGroupPlans: [],
    isBlacklist: 0,
    // showArr:[true,true,true],
    showPopup: false,
    showFirstTip: false,
    showConfirm: false,
    couponList: [], //优惠券
    hasFirstAppoint: false, //是否首次预约
    hasWelfare: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.useWelfare = false; //是否使用绿色通道券
    let _this = this;
    this.options = options;

    wx.getSystemInfo({
      success: function (res) {
        let screenWidth = res.windowWidth,
          dayContainerWidth = Math.floor((screenWidth / 7) * 100) / 100;
        _this.setData({
          systemInfo: res,
          dayContainerWidth: dayContainerWidth
        });
      }
    })

    //获取会员福利 设置相关状态提醒
    this.getWelfare()
      .then(this.handleWelfare);
  },
  setAppointPlan: function (res) {
    if (res.errorCode === 9000) {
      if (res.appointMonthGroupPlans.length === 0) {
        this.alertBack('没有库存');
      }
      this.obj = {
        depositAmount: res.depositAmount,
        imgs: res.imgs,
        refundRule: res.refundRule,
        shopAddress: res.shopAddress,
        shopName: res.shopName,
        spuName: this.options.spuName,
        skuId: this.options.skuId,
        
      }
      this.appointAttachRule = res.appointAttachRule;
      this.appointTips = res.appointTips;
      const startTime = res.minStartDay ? res.minStartDay : res.useStartTime
      const endTime = res.maxEndDay ? res.maxEndDay : res.useEndTime
      this.dateFormat(res.appointMonthGroupPlans, startTime, endTime)
      this.setData({
        // startTime: res.minStartDay,
        // endTime: res.maxEndDay,
        startTime,
        endTime,

        // appointPlans: res.appointPlans,
        // appointMonthGroupPlans: res.appointMonthGroupPlans,
        isBlacklist: res.isBlacklist,
        isLoading: false
      })

    } else {
      this.alertBack(res.errorMessage);
    }
  },

  getAppointPlan: function (res) {

    const appointParams = {
      skuId: this.options.skuId,
      vipSpuId: this.options.vipSpuId,
      useWelfare: this.useWelfare
    }
    let url = app.globalData.urlBase + "/spread/mp/goods/findAppointPlan";
    return util.http(url, appointParams).then(this.setAppointPlan)
  },
  handleWelfare: function (res) {
    console.log(res)
    let showConfirm = false,
      showFirstTip = false;
    this.useWelfare = false;
    if (res.errorCode == 9000) {
      if (res.hasFirstAppoint) { //如果有黑名单则不会有首次预约特权和绿色通道
        showFirstTip = true
      } else if (res.hasWelfare) {
        showConfirm = true
      } else {
        this.getAppointPlan()
      }
      const couponList = util.formatCouponData(res.itemList) //此处的welfareId是用户所拥有的券id
      
      this.setData({
        couponList,
        showConfirm,
        showFirstTip
      })
    } else { 
      this.alertBack(res.errorMessage);
    }
  },
  //获取会员福利信息
  getWelfare: function () {
    const url = app.globalData.urlBase + "spread/mp/mine/mineWelfare";
    const params = {
      skuId: this.options.skuId,
      vipSpuId: this.options.vipSpuId
    }
    return util.http(url, params)
  },
  alertBack: function (mess) {
    wx.showModal({
      title: '错误',
      content: mess,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  useFirstAppoint: function () {
    new Promise((resolve, reject) => {
      this.useWelfare = false
      this.setData({
        showFirstTip: false
      })
      resolve()
    }).then(res => {
      this.getAppointPlan().then(this.setAppointPlan)
    })
  },
  onSelect: function (e) {
    const welfareId = e.detail.id
    this.handleOrder(welfareId)
  },
  onClick: function (e) {
    const used = e.currentTarget.dataset.used
    new Promise((resolve, reject) => {
      if (used == 1) {
        this.useWelfare = true
      }
      this.setData({
        showConfirm: false
      })
      resolve()
    }).then(res => {
      this.getAppointPlan()
    })

  },
  // onCancel: function () {
  //   this.setData({
  //     showConfirm: false
  //   })
  // },
  choseDate: function (e) {
    console.log(e)
    let bool = e.detail.available,
      daysTime = e.detail.daystime;
    // let bool = e.currentTarget.dataset.available,
    //   daysTime = e.currentTarget.dataset.daystime;
    if (!bool) {
      return false;
    }
    this.setData({
      daysTime: daysTime
    })
  },
  confimDate: function () {
    
    let chosenDate = this.data.daysTime,
      _this = this;
    if (!chosenDate) {
      wx.showModal({
        content: '请选择日期',
        showCancel: false
      })
      return false;
    }
    if (this.options.accessAppointFlag === '0') {
      wx.showModal({
        title: "温馨提示",
        content: "购买会员卡，才能预约权益商品",
        confirmText: '去购买',
        success(res) {
          if (res.confirm) {
            let params = util.stringifyParams({
              skuId: _this.options.skuId,
              spuId: _this.options.vipSpuId  // 此处为兼容老版本key为vipSpuId更具语义
            })
            wx.navigateTo({
              url: '/pages/index/playcard/playcard' + params,
            })
          }
        }
      })
      return false;
    }
    let url =
      app.globalData.urlBase +
      "/spread/mp/mine/hasAppointOfVipCard";
    wx.showLoading();
    util.http(url, {
      skuId: this.options.skuId,
      vipSpuId:this.options.vipSpuId
    }).then(res => {
      if (res.errorCode === 9000) {
        if (res.hasAppointOfVipCard) {
          wx.showModal({
            title: "温馨提醒",
            content: "您已经预定过相关的订单，未使用前，不可以继续预约",
            confirmText: "查看订单",
            confirmColor: "#02BB00",
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: "/pages/order/order"
                })
              }
            }
          })
        } else {
          if (this.useWelfare) {
            this.setData({
              showPopup: true
            })
          } else { 
            this.handleOrder()
          }
          
        }
      }
      wx.hideLoading();
    })

  },
  handleOrder: function (welfareId) { 
    const chosenDate = this.data.daysTime
    const welfareIdObj = {}
    if (welfareId) { 
      welfareIdObj.welfareId = welfareId
    }
    if (JSON.parse(this.appointAttachRule).length) {
      let params = util.stringifyParams({
        ...this.obj,
        chosenDate: chosenDate,
        appointAttachRule: this.appointAttachRule,
        appointTips: this.appointTips,
        vipSpuId: this.options.vipSpuId,
        ...welfareIdObj
      })
      wx.navigateTo({
        url: '/pages/index/customerForm/customerForm' + params
      })

    } else {
      let params = util.stringifyParams({
        ...this.obj,
        chosenDate: chosenDate,
        vipSpuId: this.options.vipSpuId,
        ...welfareIdObj
      })
      wx.navigateTo({
        url: '/pages/index/reservation/reservation' + params
      })
    }
  },
  handleClose: function () {
    this.setData({
      showPopup: false
    })
  },
  closeTips: function () {
    this.setData({
      showFirstTip: false
    })
    wx.navigateBack({
      delta: 1
    });
  },
  scrollFuc: function () {
    //[7,8,9,10,11,12,13]    4/3 = 1
    // [o,o,o,o,o,o,o,o,o,o,o,o,o,o,]

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  dateFormat(appointMonthGroupPlans, startTime, endTime) {
    const weeks_ch = dateUtil.weeks_ch
    const datearr = this.dateArr(startTime, endTime)
    let dateTime = [];
    datearr.forEach((obj, idx) => {
      const yearMonth = dateUtil.formatTimeToMonth(obj)
      const beginWeek = dateUtil.getDisplayInfo(obj).beginWeek
      const daysArr = dateUtil.getDisplayInfo(obj, appointMonthGroupPlans).daysArr
      dateTime.push({ yearMonth, beginWeek, daysArr })
    })
    this.setData({
      weeks_ch,
      dateTime
    })
  },
  iosToTime(date) {
    var result = date.replace(new RegExp('-', 'g'), '/');
    return result
  },
  //获取月份数组
  dateArr: function (startTime, endTime) {
    var arr = [],
      startTime = new Date(this.iosToTime(startTime)),
      endTime = new Date(this.iosToTime(endTime)),
      nowTime = new Date();
    startTime = startTime.getTime() > nowTime.getTime() ? startTime : nowTime;
    while (endTime.setDate(1) > startTime.setDate(1)) {
      var year = startTime.getFullYear(),
        month = startTime.getMonth();
      if (month > 12) {
        year += 1;
        month = 1;
      } else {
        month += 1;
      }
      arr.push(startTime.getTime());
      startTime.setFullYear(year);
      startTime.setMonth(month);
    }
    return arr;
  },
  // _formatData(array) {
  //   let tmp = []
  //   array.forEach((item, index) => {
  //     const desc = item.requireFrag ? `消耗${item.requireFrag}惠豆` : ''
  //     const obj = {
  //       customerWelfareId: item.customerWelfareId,
  //       welfareId: item.welfareId,
  //       title: item.welfareName,
  //       desc: desc,
  //       expireTime: item.expireTime,
  //       ruleId: item.ruleId,
  //       welfareType: item.welfareType,
  //       status: item.status ? item.status : 1,

  //     }
  //     tmp.push(obj)
  //   })
  //   return tmp
  // }
})