// pages/mine/share/share.js

const app = getApp()
const util = require("../../../utils/util")
const taskType = '12'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    shareWelfareAwardList: [],
    teamUserList: [],
    usedTeamUserList: [],
    openSelf: true,
    showModal: false,
    ruleId: '',
    ruleDialog: false,
    system: 'ios',
    nav: '',
    canDraw: false //是否已领券
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages()
    if (pages.length == 1) { 
      this.setData({
        nav:'nav-disabled'
      })
    }
    console.log(pages)
    this.taskName = options.taskName
    this.shareCustId = options.shareCustId

    const system = wx.getSystemInfoSync()
    if (system && system.platform == 'android' || system.platform == 'Android') { 
      this.setData({
        system:'android'
      })
    }
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: "/pages/index/get-auth/get-auth?type=userInfo"
    //       });
    //     }
    //   }
    // })
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
    // const obj = wx.getMenuButtonBoundingClientRect() //
    this.userInfo = wx.getStorageSync('g_userInfo')
    // if (this.userInfo.registStatus === 0) {
    //   wx.navigateTo({
    //     url: '/pages/mine/bind-mobile/bind-mobile'
    //   });
    // } 
    const { nickname,avatar } = this.userInfo
      this.setData({
        userInfo: {
          nickname,
          avatar
        }
      })
      this.openTask()
      .then(this.handleShare)
      .then(this.getData)
      // if (this.shareCustId) {
      //   this.openTask()
      //     .then(this.handleShare)
      //     .then(this.getData)
      // } else { 
      //   this.getData()
      // }
  },
  openTask() { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/openTask'
    const params = {
      shareCustId:this.shareCustId,
      taskType // 活动类型：12-分享任务
    }
    return util.http(url,params)
  },
  handleShare(res) { 
    return new Promise(resolve => {
      if (res.errorCode === 9000) {
        let taskRule = res.taskRule
        if(taskRule) taskRule = taskRule.split('\n')
        this.setData({
          openSelf: res.openSelf,
          userInfo: {
            nickname:res.nickName,
            avatar: res.avatar
          },
          openWelfareList: res.openWelfareList,
          canDraw: res.canDraw,
          taskRule
        })
        if (res.openSelf) {
          resolve(res)
        }
      } else { 
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            wx.switchTab({
              url: '/pages/tabBar/index/index'
            })
          }
        });
      }
      
    })
  },
  getData(){
    const url = app.globalData.urlBase + 'spread/mp/cardTask/queryShareTask'
    util.http(url, { taskType }).then(res => { 
      const { teamUserList,usedTeamUserList,shareWelfareAwardList } = res
      this.setData({
        teamUserList,
        usedTeamUserList,
        openWelfareList:shareWelfareAwardList
      })
    })
  },
  takeCoupon(e) { 
    const canDraw = e.currentTarget.dataset.can
    if (!canDraw) { 
      // wx.showToast({
      //   title: '您已领过该券了',
      //   icon: 'none'
      // });
      wx.navigateTo({
        url: `/pages/mine/privilege/privilege?active=1`,
      });
      return
    }
    let userInfo = wx.getStorageSync("g_userInfo")
    if (userInfo.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return
    }
    const url = app.globalData.urlBase + 'spread/mp/cardTask/drawTaskTicket' 
    const params = {
      shareCustId: this.shareCustId,
      taskType
    }
    util.http(url, params).then(res => { 
      if (res.errorCode === 9000) {
        this.setData({
          showModal: true,
          ruleId:res.ruleId
        })
      } else { 
        wx.showToast({
          title: res.errorMessage,
          icon: 'none'
        });
      }
    })
  },
  showRule() { 
    this.setData({
      ruleDialog: true
    })
  },
  closeRuleDialog() { 
    this.setData({
      ruleDialog: false
    })
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
  handleBuy: function (e) { 
    const ruleId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/mine/privilege/privilege?active=1`,
    });
  },
  closeDialog: function () { 
    this.setData({
      showModal:false
    })
  },
  handleBack: function (e) { 
    wx.navigateBack({
      delta: 1
    })
  },
  handleHome: function (e) { 
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '乐学畅享,尽在闪闪课堂送你购卡减免礼券快来和我一起成为闪闪课堂小达人吧',
      path:`pages/mine/share/share?shareCustId=${this.userInfo.custId}&taskName=${this.taskName}`
    }
  }
})
