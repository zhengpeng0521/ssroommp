// pages/mine/my-video-lesson/my-video-lesson.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headContent: [{
      text: "全部",
      lineShow: true,
      badge: null
    },
    {
      text: "早教启蒙",
      lineShow: false,
      badge: null
    },
    {
      text: "少儿体能",
      lineShow: false,
      badge: null
    },
    {
      text: "审美艺术",
      lineShow: false,
      badge: null
    }],
    listLoading:false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.firstPostList()
  },
  // 我的录播课列表
  getVideoList() {
    this.setData({
      listLoading: true
    })
    let params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    const url = app.globalData.urlBase + 'spread/mp/drp/video/findAll'
    return util.http(url, params)
  },
  // 加载数据
  firstPostList() {
    this.getVideoList().then(res => {
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        list: res.results,
        listLoading: false,
      })
    }).catch(err => {
      this.setData({
        list: [],
        listLoading: false,
      })
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
  // 处理tab栏切换
  toogleTab: function (e) {
    clearInterval(this.unpaidInterval)
    let index = e.currentTarget.dataset.index
    this.index = index
    // 去掉所有tab栏下的线
    for (let i = 0; i < this.data.headContent.length; i++) {
      this.data.headContent[i].lineShow = false
    }
    // 当前tab栏下加线
    this.data.headContent[index].lineShow = true
    this.setData({
      headContent: this.data.headContent,
      currentIndex: index,
    })
    // 如果已经加载了tab对应的数据，则不需要重新加载
    // if (this.data.allOrderListData[index] && index !== 0 && index !== 1) {
    //   this.setData({
    //     headContent: this.data.headContent,
    //     currentIndex: index,
    //     orderListData: this.data.allOrderListData[index]
    //   })

    // }
    // // 因为1待付款会在当前页面进行付款，所以需要重新加载0和1的数据
    // else if (index === 0) {
    //   this.firstLoadingData()
    // } else {
    //   this.getTabData()
    // }
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
    this.hasMoreData = true;
    this.pageIndex = 0;
    this.getVideoList().then(res => {
      if (res.errorCode === 9000) {
        this.hasMoreData = res.results.length === this.pageSize;
        this.setData({
          list: res.results,
          listLoading:false
        })
      }
      wx.stopPullDownRefresh();
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
      return;
    }
    this.pageIndex++;
    this.getVideoList().then(res => {
      const { results } = res
      this.hasMoreData = this.pageSize === results.length
      this.setData({
        list: this.data.list.concat(results),
        listLoading: false
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
