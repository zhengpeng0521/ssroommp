// pages/distribution/calendar/calendar.js
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
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this;
    this.options = options;
    // this.options.orderId = "1210873966244192256"
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
    this.getAppointPlan();
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

        startTime,
        endTime,

        isBlacklist: res.isBlacklist,
        isLoading: false
      })

    } else {
      this.alertBack(res.errorMessage);
    }
  },

  getAppointPlan: function (res) {
    const appointParams = {
      orderId: this.options.orderId,
      // orderId: '1211650081762082816'
    }
    let url = app.globalData.urlBase + "spread/mp/drp/order/findDrpAppointPlan";
    return util.http(url, appointParams).then(this.setAppointPlan)
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
  choseDate: function (e) {
    console.log(e)
    let bool = e.detail.available,
      daysTime = e.detail.daystime;

    if (!bool) {
      return false;
    }
    this.setData({
      daysTime: daysTime,
    })
  },
  confimDate: function () {
    
    let chosenDate = this.data.daysTime;
    if (!chosenDate) {
      wx.showModal({
        title:'提示',
        content: '请选择日期',
        showCancel: false
      })
      return false;
    }
    console.log(chosenDate)
    this.setData({
      show: true,
      dateStr: util.parseTime(chosenDate,'{m}月{d}日')
    })
    // wx.showLoading();

  },
  handleConfirm() { 
    // this.getAppointTips()
    this.createOrder().then(res => { 
      wx.hideLoading();
      if (res.errorCode === 9000) {
        wx.redirectTo({
          url: `/pages/distribution/order-detail/order-detail?orderId=${this.options.orderId}`,
        });
      } else { 
        wx.showToast({
          title: res.errorMessage,
          icon: 'none',
        });
      }
    }).catch(err => { 
      wx.hideLoading();
    })
  },

  onClose() { 
    this.setData({
      show:false
    })
  },
  createOrder: function() {
    wx.showLoading();
    const url = app.globalData.urlBase + 'spread/mp/drp/appoint/create';
    return util.http(url, {
      appointDay: this.data.daysTime,
      orderId:this.options.orderId
    })
  },
  getAppointTips() { 
    const url = app.globalData.urlBase + 'spread/mp/drp/appoint/appointTips';
    const params = {
      appointDay: this.data.daysTime,
      orderId:this.options.orderId
    }
    util.http(url, params).then(res => { 
      return new Promise((resolve, reject) => { 
        if (res.errorCode === 9000 && res.appointSpreadTips) { 

        }
      })
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
        appointTips: this.appointTips
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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

})