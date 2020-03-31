// pages/mine/video-detail/video-detail.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    videoTopHeight: 0,
    videoTitleHeight: 0,
    videoShow: true,
    index: {
      section: 0,
      class: 0,
    },
    videoPause: false,
    videoUrl :'', // 视频地址
    createTime: '', //更新时间
    creater: '', // 创建人
    videoName: '', // 视频名称
    describe: '', // 视频描述
    describeNow: '',
    describeNum: 44, // 描述字数
    describeSlice: '',
    banner:'', // 没有视频的banner
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info('options', options)
    this.getList()
    this.setData({
      banner: options.url,
    })
    this.options = options
  },
   /**
   * 获取视频详细信息
   */
  getVideoDetail() {
    const params = {
      spuId: this.options.id || '111',
      shopId: this.options.shopId || '0',
      tenantId: this.options.tenantId ||'0'
    }
    const url = app.globalData.urlBase + "spread/mp/drp/video/queryMineVideoInfo"
    return util.http(url, params)
  },
  getList() {
    let flag = false
    this.getVideoDetail().then(res => {
      if(res.errorCode === 9000) {
        this.setData({
          list: res.chapterItems
        })
        if(this.data.list && this.data.list.length > 0) {
          for (var i = 0; i < this.data.list.length; i++) {
            this.data.list[i].checked = false
            if (this.data.list[i].videoInfo) {
              for (var j = 0; j < this.data.list[i].videoInfo.length; j++) {
                this.data.list[i].videoInfo[j].checked = false
                if (!flag) {
                  flag = true
                  this.selectVideo(i, j)
                  this.index = {
                    section : i,
                    class: j
                  }
                }
              }
            }
          }
        }
        if (!flag) {
          this.setData({
            videoShow: false
          })
          if(this.data.list && this.data.list.length > 0) {
            this.data.list[0].checked = true
            this.setData({
              list: this.data.list
            })
          }
        }
      }
      this.setData({
        isLoading : false
      })
      setTimeout(() => {
        const query = wx.createSelectorQuery()
        query.select('.video_top').boundingClientRect( rect => {
          this.setData({
            videoTitleHeight: rect.height + 10
          })
          query.select('.bottom').boundingClientRect( rect1 => {
            this.setData({
              videoTopHeight: rect.height + 55 + rect1.height
            })
          }).exec()
        }).exec()
      }, 0)
    })
  },
  selectVideo(outsideIndex, insideIndex) {
    this.data.list[outsideIndex].checked = true
    this.data.list[outsideIndex].videoInfo[insideIndex].checked = true
    this.setData({
      videoUrl: this.data.list[outsideIndex].videoInfo[insideIndex].videoUrl,
      createTime: this.data.list[outsideIndex].videoInfo[insideIndex].createTime,
      creater: this.data.list[outsideIndex].videoInfo[insideIndex].creater,
      videoName: this.data.list[outsideIndex].videoInfo[insideIndex].videoName,
      list: this.data.list
    })
  },
  playVideo() {
    this.setData({
      videoPause: false
    })
  },
  pauseVideo() {
    this.setData({
      videoPause: true
    })
  },
  videoPlay() {
    wx.createVideoContext('video').play()
  },
  /* 章节选择 */
  toggleSection:function(e){
    let idx= e.currentTarget.dataset.sectionindex;
    this.data.list[idx].checked = !this.data.list[idx].checked
    this.setData({
      list : this.data.list
    })
  },
  /* 视频选择 */
  toggleVideo:function(e){
    let sectionIdx = e.currentTarget.dataset.sectionindex
    let classIdx = e.currentTarget.dataset.classindex
     // 暂停上个视频
    this.data.list[this.index.section].videoInfo[this.index.class].checked = !this.data.list[this.index.section].videoInfo[this.index.class].checked
    this.index.section = sectionIdx
    this.index.class = classIdx

     // 开始当前视频
     this.data.list[sectionIdx].videoInfo[classIdx].checked = true
     this.selectVideo(sectionIdx, classIdx)
     wx.createVideoContext('video').play()
     this.setData({
      list : this.data.list
    })
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('.video_top').boundingClientRect( rect => {
        this.setData({
          videoTitleHeight: rect.height + 10
        })
        query.select('.bottom').boundingClientRect( rect1 => {
          this.setData({
            videoTopHeight: rect.height + 55 + rect1.height
          })
        }).exec()
      }).exec()
      // query.select('.video_top').boundingClientRect( rect => {
      //   this.setData({
      //     videoTopHeight: rect.height + 10
      //   })
      // }).exec()
    }, 0)
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

  }
})
