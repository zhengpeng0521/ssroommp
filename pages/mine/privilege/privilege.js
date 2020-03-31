// pages/mine/privilege/privilege.js
const app = getApp()
const util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 0,
    showPopup: false,
    showDialog: false,
    cardTaskItem: [], //任务列表
    freeFrag: 0,
    welfareAwardItemList:[], //可领取的优惠券列表
    ticketList: [],
    welfare: {},
    ruleDialog: false,
    ruleDesc: '',
    ruleTitle: '规则说明',
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.active) { 
      this.getTicket()
      // this.setData({
      //   active:1
      // })
    }
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
    const userInfo = wx.getStorageSync('g_userInfo')
    this.userInfo = userInfo
    if (userInfo.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
    } else { 
      this.getCardTask()
    }
  },
  //获取任务列表
  getCardTask: function() { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/queryCardTask';
    util.http(url, {}).then(res => { 
      const { freeFrag, cardTaskItem } = res
      
      cardTaskItem.forEach(item => { 
        item.text = '查 看'
        if (item.taskType == '11') {
          item.text = '去预约'
        } else if (item.taskType == '12') { 
          item.text = '去分享'
        }
      })
      this.setData({
        freeFrag,
        cardTaskItem
      })
    })
  },
  //获取需要兑换的卡券
  getCardTicket: function () { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/queryCardTicket';
    return util.http(url, {})
  },
  //获取拥有的特权券
  getTicket: function () { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/queryTicket';
    util.http(url, {}).then(res => { 
      if (res.errorCode == 9000) { 
        const ticketList = util.formatCouponData(res.ticketList);
        this.setData({
          ticketList,
          active:1
        })
      }
    })
  },
  drawTask: function () { 
    const url = app.globalData.urlBase + 'spread/mp/cardTask/drawTask';
    return util.http(url, {})
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
  // 领取优惠券
  takeCoupon: function () { 
    wx.showToast({
      title: '开发中，敬请期待！',
      icon: 'none',
    });
    // if (this.data.cardTaskItem.length == 0) { 
    //   wx.showToast({
    //     title: '任务已过期',
    //     icon: 'none',
    //   });
    //   return;
    // }
    // wx.showLoading({
    //   title: '加载中',
    // })
    // this.getCardTicket().then(res => {
    //   const welfareAwardItemList = util.formatCouponData(res.welfareAwardItemList)

    //   this.setData({
    //     welfareAwardItemList,
    //     showPopup:true
    //   })
    //   wx.hideLoading()
    // }).catch(() => {
    //   wx.hideLoading()
    // })
  },
  
  handleClose: function () { 
    this.setData({
      showPopup:false
    })
  },
  
  handleTake: function (e) {
    console.log(e)
    const id = e.detail.id
    const item = e.detail.item
    const url = app.globalData.urlBase + 'spread/mp/cardTask/drawWelfareAward';
    const params = {
      welfareId: id,
      taskType: 11
    }
    wx.showModal({
      title: '提示',
      content: `确认消耗${item.requireFrag}惠豆兑换【${item.title}】吗？`,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if(result.confirm){
          util.http(url, params).then(res => { 
            if (res.errorCode == 9000) {
              this.getCardTask()
              this.setData({
                welfare:res,
                showDialog:true
              })
            } else { 
              wx.showToast({
                title: res.errorMessage,
                icon: 'none',
              });
            }
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    
    
    
  },
  handleView: function (e) { 
    let ruleId = e.detail.rule
    const scope = e.detail.scope || e.currentTarget.dataset.scope
    
    if (!ruleId) { //领取成功时点击使用会员券
      ruleId = e.currentTarget.dataset.rule
    }
    let url = `/pages/index/index-more/index-more?ruleId=${ruleId}`
    if (scope == 9) { 
      url = `/pages/index/card/card`
    }
    wx.navigateTo({
      url
    });

  },
  closeDialog: function () { 
    this.setData({
      showDialog:false
    })
  },

  tabChange: function (e) { 
    if (e.detail == 1) { 
      this.getTicket()
    }
  },
  viewRule: function (e) { 
    let ruleDesc = e.currentTarget.dataset.desc
    const ruleTitle = e.currentTarget.dataset.title ? e.currentTarget.dataset.title : '规则说明'
    let showRule = false
    if (ruleDesc) { 
      ruleDesc = ruleDesc.split('\n')
      showRule = true
    }
    this.setData({
      ruleDialog:true,
      ruleDesc,
      ruleTitle,
      showRule
    })
  },
  closeRuleDialog: function () { 
    this.setData({
      ruleDialog:false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onNavTo: function (e) { 
    const dataset = e.currentTarget.dataset
    const task = dataset.task
    const taskName = dataset.name
    let url = ''
    switch (task) {
      case '11':
         url = '/pages/index/index-more/index-more?typeNum=103'
        break;
      case '12':
          // url = '/pages/mine/share/share?taskName=' + taskName
          url = `/pages/mine/share/share?taskName=${taskName}&shareCustId=${this.userInfo.custId}`
        break;
      default:
          url = '/pages/index/index-more/index-more?typeNum=103'
        break;
    }
    wx.navigateTo({
      url
    });
  },
  // _formatData(array) { 
  //   let tmp = []
  //   array.forEach((item, index) => {
  //     const desc = item.requireFrag?`消耗${item.requireFrag}惠豆`:''
  //     const obj = {
  //       customerWelfareId: item.customerWelfareId,
  //       welfareId: item.welfareId,
  //       title: item.welfareName,
  //       desc: desc,
  //       expireTime: item.expireTime,
  //       ruleId: item.ruleId,
  //       welfareType: item.welfareType,
  //       status: item.status ? item.status : 1,
  //       goodsScope: item.goodsScope
  //     }
  //     tmp.push(obj)
  //   })
  //   return tmp
  // }
})
