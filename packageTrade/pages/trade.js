// pages/trade/trade.js
var app = getApp();
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    inviteDialogBool: false,
    filePath: '',
    userLevel: 0,
    custId: '',
    deposit: 0,
    earnings: 0,
    saveMoney: 0,
    teamNum: 0,
    upgradeRules: [],
    enterLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTabBar().setData({
      active: 'trade'
    })
    let g_userInfo = wx.getStorageSync('g_userInfo')
    this.setData({
      userInfo: g_userInfo,
      isLoading: true
    });
    let url = app.globalData.urlBase + '/spread/mp/auth/session';
    util.http(url, {}).then(this.updateUser)
  },
  updateUser: function(res) {
    wx.setStorageSync('g_userInfo', res)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let url = app.globalData.urlBase + '/spread/mp/money/findMember';
    util.http(url, {}).then(this.detalData)

  },
  detalData: function(data) {
    // 1掌柜 2 主管 3 经理 data.currentLevel  spreadAmount
    let percent = (data.spreadAmount / data.directorAmount).toFixed(2) > 1 ?
      '1' : (data.spreadAmount / data.directorAmount).toFixed(2);
    let percent2 = (data.spreadNum / data.directorNum).toFixed(2) > 1 ?
      '1' : (data.spreadNum / data.directorNum).toFixed(2);
    let finalPercent = percent2 > percent ? percent2 : percent;
    let userInfo = wx.getStorageSync('g_userInfo');
    this.setData({
      userLevel: userInfo.vipLevel,
      percent: finalPercent * 100,
      upgradeRules: [{
        'text': '团队累计向普通用户分享销售品台商品' + data.directorAmount + '元(含会员卡）',
          id: 0
        },
        {
          'text': '团队累计推荐' + data.directorNum + '个普通用户成为掌柜',
          id: 1
        }
      ]
    });
    let url = app.globalData.urlBase + '/spread/mp/money/myEarnings'
    util.http(url, {}).then(this.detalIconData)
  },
  detalIconData: function(res) {
    this.setData({
      deposit: res.deposit,
      earnings: res.earnings,
      saveMoney: res.saveMoney,
      teamNum: res.teamNum,
      enterLoading:false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },
  px2rpx: function(val) {
    const screenWidth = wx.getSystemInfoSync().screenWidth
    return (screenWidth / 750) * val
  },
  inviteDialogShow: function() {
    this.setData({
      inviteDialogBool: true
    })
  },
  hidePoster: function() {
    this.setData({
      inviteDialogBool: false
    })
  },
  navigateToMyTeam: function(e) {
    let currentLevel = wx.getStorageSync('g_userInfo').currentLevel;
    if (currentLevel <= 1) {
      wx.showModal({
        title: '您这个等级暂时没有团队',
        content: '努力升为主管，即可享受更多销售返现',
        showCancel: false,
        confirmColor: '#FF9436'
      })
    } else {
      wx.navigateTo({
        url: '/pages/trade/my-team/my-team',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
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
    console.log('用户分享')
    return {
      title: '分享标题',
      desc: '分享内容',
      path: 'pages/index/ticket/ticket-detail/ticket-detail?id=123' // 路径，传递参数到指定页面。
    }
  }
})