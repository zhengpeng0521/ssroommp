// pages/recordedLesson/benefit-details/benefit-details.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    amountDetail: {},
    active: 1,
    listLoading: true,
    ruleDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.benefitType = 1
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.queryDetailOverview()
    this.queryBenefitDetails().then(res => {
      this.setData({
        list: res.results
      })
    })

  },
  onViewRule() {
    this.setData({
      ruleDialog:!this.data.ruleDialog
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

  },
  queryDetailOverview() {
    const url = app.globalData.urlBase + "spread/mp/drp/benefit/queryDetailOverview"
    util.http(url, {}).then(res => {
      if (res.errorCode == 9000) {
        this.setData({
          amountDetail: res
        })
      }
    })
  },
  /**
   * 分销商收益明细
   */
  queryBenefitDetails() {
    this.setData({
      listLoading: true
    })
    const url = app.globalData.urlBase + "spread/mp/drp/benefit/queryBenefitDatils"
    const params = {
      benefitType: this.benefitType,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    return util.http(url, params)
  },
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    this.benefitType = index
    this.pageIndex = 0;
    this.setData({
      active: index
    })
    this.queryBenefitDetails().then(res => {
      this.setData({
        list: res.results
      })
    })
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
    if (!this.hasMoreData) {
      this.setData({
        listLoading: false
      })
      return false
    }
    this.pageIndex++;
    this.queryBenefitDetails().then(res=>{
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        list: this.data.list.concat(res.results),
        listLoading: false
      })
    });
  },
})
