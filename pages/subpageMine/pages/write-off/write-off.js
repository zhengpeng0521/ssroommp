// pages/mine/write-off/write-off.js
var app = getApp();
var util = require('../../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    month: 1,
    day: 1,
    totalCount: 0,
    dateCount: 0,
    active: 1,
    messTitle: '普通订单'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.distributorOrderFlag = false
    let now = util.timeFormat('yyyy-MM-dd', new Date());
    this.now = now
    this.date = util.timeFormat('yyyy-MM-dd', new Date());
    this.changeDate(new Date());
    this.pageIndex = 0;
    this.postListData(now, this.pageIndex).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          list: res.results,
          totalCount: res.totalCount,
          dateCount: res.dateCount
        })
      }
    })
  },
  onReachBottom: function() {
    let _this = this;
    this.pageIndex++;
    this.postListData(this.date, this.pageIndex).then(res => {
      if (res.errorCode == 9000 && res.results.length > 0) {
        this.setData({
          list: this.data.list.concat(res.list)
        })
      }
    })
  },
  changeTab(e) { 
    const index = e.currentTarget.dataset.index
    let messTitle = ''
    if (index == 2) {
      messTitle = '惠选订单'
      this.distributorOrderFlag = true
    } else { 
      messTitle = '普通订单'
      this.distributorOrderFlag = false
    }
    this.setData({
      active: index,
      messTitle
    })
    this.pageIndex = 0;
    this.postListData(this.now, this.pageIndex).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          list: res.results,
          totalCount: res.totalCount,
          dateCount: res.dateCount
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  postListData: function(date, pageIndex) {
    let url = app.globalData.urlBase + '/spread/mp/mine/queryMineVerifyOrder';
    const params = {
      distributorOrderFlag:this.distributorOrderFlag
    }
    return util.http(url, {
      date,
      pageIndex,
      ...params
    });
  },
  bindTimeChange: function(e) {
    this.pageIndex = 0;
    this.changeDate(new Date(e.detail.value))
    this.date = util.timeFormat('yyyy-MM-dd', new Date(e.detail.value));
    this.postListData(e.detail.value, this.pageIndex).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          list: res.results
        })
      }
    });
  },
  changeDate: function(date) {
    this.date = date;
    let month = util.timeFormat('M', date),
      day = util.timeFormat('d', date);
    this.setData({
      month,
      day
    })
  },
  scanCode: function() {
    let that = this
    wx.scanCode({
      success: res => {
        let verifyCode = res.result
        let url =
          app.globalData.urlBase +
          "/spread/mp/verify/handleVerifyCode"
        util.http(url, {
          verifyCode: verifyCode
        }).then(res => {
          if (res.errorCode === 9000) {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000
            })
            that.pageIndex = 0;
            that.postListData(util.timeFormat('yyyy-MM-dd', new Date()), that.pageIndex).then(res => {
              console.log(res);
              if (res.errorCode === 9000) {
                that.setData({
                  list: res.results,
                  totalCount: res.totalCount,
                  dateCount: res.dateCount
                })
              }
            });
          } else {
            wx.showModal({
              title: "核销失败",
              content: "原因：" + res.errorMessage,
              showCancel: false
            })
          }
        })
      },
      fail: res => {},
      complete: res => {}
    })
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

})