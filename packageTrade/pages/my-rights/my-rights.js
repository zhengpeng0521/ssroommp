// pages/order/my-rights/my-rights.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    myRights: [{
        id: 0,
        'icon': 'icon-rights-1',
        'title': '自购省钱',
        'desc': '自己购买商品享超低会员折扣价 '
      },
      {
        id: 1,
        'icon': 'icon-rights-2',
        'title': '分享奖励',
        'desc': '向普通用户分享商品，获得会员价差的超额佣金'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('g_userInfo');
    this.setData({
      userInfo: userInfo
    })
    let url = app.globalData.urlBase + '/spread/mp/money/deductPercent';
    util.http(url, {}).then(this.dealtData)
  },
  dealtData: function(res) {
    let userInfo = wx.getStorageSync('g_userInfo');
    let myRights = this.data.myRights;
    let teamLevelOne = res.teamLevelOne * 100,
      teamLevelTwo = res.teamLevelTwo * 100,
      teamLevelThree = res.teamLevelThree * 100,
      trainLevelOne = res.trainLevelOne * 100,
      trainLevelTwo = res.trainLevelTwo * 100,
      trainLevelThree = res.trainLevelThree * 100;

    let arr = [];
    if (userInfo.currentLevel === 1) {
      arr = [{
        id: 2,
        'icon': 'icon-rights-3',
        'title': '培训收益',
        'desc': 'A直接将普通用户推荐成为掌柜，获得' + trainLevelOne + '%培训收益佣金'
      }]
    }
    if (userInfo.currentLevel === 2) {
      arr = [{
          id: 2,
          'icon': 'icon-rights-3',
          'title': '团队奖励',
          'desc': 'A团队直属掌柜购买商品，获得' + trainLevelOne + '%销售收益佣金\nB团队直属主管购买商品，获得' + trainLevelOne + '% 销售收益佣金\nC团队直属主管的下级掌柜购买商品，获得' + teamLevelTwo + '% 销售收益佣金\n D团队直属掌柜的下级掌柜购买商品，获得' + teamLevelTwo + '% 销售收益佣金\nE团队直属主管的下级主管购买商品，获得' + teamLevelTwo + '% 销售收益佣金'
        },
        {
          id: 3,
          'icon': 'icon-rights-3',
          'title': '培训奖励',
          'desc': 'A直接将普通用户推荐成为掌柜，获得' + trainLevelOne + '%培训收益佣金\nB团队直属掌柜将普通用户推荐成为新掌柜，获得' + trainLevelTwo + '% 培训收益佣金\nC团队直属主管将普通用户推荐成为新掌柜，获得' + trainLevelTwo + '% 培训收益佣金\nD团队直属主管的下级掌柜将普通用户推荐成为新掌柜，获得' + trainLevelThree + '% 培训收益佣金\nE团队直属掌柜的下级掌柜将普通用户推荐成为新掌柜，获得' + trainLevelThree + '% 培训收益佣金\nF团队直属主管的下级主管将普通用户推荐成为新掌柜，获得' + trainLevelThree + '% 培训收益佣金\n'
        }
      ]
    }
    if (userInfo.currentLevel === 3) {
      arr = [{
          id: 2,
          'icon': 'icon-rights-3',
          'title': '团队奖励',
          'desc': 'A团队直属掌柜购买商品，获得20%销售收益佣金\nB团队直属主管购买商品，获得20% 销售收益佣金\nC团队直属主管的下级掌柜购买商品，获得10% 销售收益佣金\nD团队直属掌柜的下级掌柜购买商品，获得10% 销售收益佣金\nE团队直属主管的下级主管购买商品，获得10% 销售收益佣金'
        },
        {
          id: 3,
          'icon': 'icon-rights-3',
          'title': '培训奖励',
          'desc': 'A直接将普通用户推荐成为掌柜，获得70%培训收益佣金\nB团队直属掌柜将普通用户推荐成为新掌柜，获得20% 培训收益佣金\nC团队直属主管将普通用户推荐成为新掌柜，获得20% 培训收益佣金\nD团队直属主管的下级掌柜将普通用户推荐成为新掌柜，获得10% 培训收益佣金\nE团队直属掌柜的下级掌柜将普通用户推荐成为新掌柜，获得10% 培训收益佣金\nF团队直属主管的下级主管将普通用户推荐成为新掌柜，获得10% 培训收益佣金\n'
        }
      ]
    }

    this.setData({
      myRights: myRights.concat(arr)
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