// pages/subpageMine/pages/my-team/my-team.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:0,
    pageSize:10,
    listLoading:true,
    spread:{},
    teamNum:{},
    teamData:[],
    spreadLevel:'1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.spreadLevel='1'
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.setData({
      spread:app.globalData.spreadLevel
    })
    this.getTeamNum().then((res) => {
      this.setData({
        teamNum: res,
      })
    });

    this.getTeamData().then((res) => {
      this.setData({
        teamData: res.results,
        listLoading: false
      })
    });

  },

  /* 获取团队人员数量 */
  getTeamNum:function(){
    let params = { }
    const url = app.globalData.urlBase + '/spread/mp/drp/benefit/queryTeamOverview'
    return util.http(url, params)
  },

  /* 获取团队人员信息 */
  getTeamData:function(){
    this.setData({
      listLoading:true
    })
    let params = {
      spreadLevel:this.spreadLevel,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    const url = app.globalData.urlBase + '/spread/mp/drp/benefit/queryTeam'
    return util.http(url, params)
  },


  /* 切换tab控制显隐 */
  changeTab: function (e) {
    this.pageIndex = 0
    this.pageSize = 10
    this.spreadLevel = e.currentTarget.dataset.level;
    this.setData({
      spreadLevel: this.spreadLevel
    })
    this.getTeamData().then((res) => {
      this.setData({
        teamData: res.results,
        listLoading: false
      })
    });
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
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getTeamData().then(res => {
      const { results } = res
      this.setData({
        teamData: results,
        listLoading: false
      })
      wx.stopPullDownRefresh()
    })
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
    this.getTeamData().then(res => {
      console.log("加载更多", res);
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        teamData: this.data.teamData.concat(res.results),
        listLoading: false
      })
    });
  },


})
