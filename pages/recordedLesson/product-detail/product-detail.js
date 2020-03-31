// pages/recordedLesson/product-detail/product-detail.js
const util = require('../../../utils/util')
const app = getApp()
import Card from "../../../utils/poster-template.js"
const shareInfoUrl = app.globalData.urlBase + "spread/mp/goods/shareInfo"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showDialog: false,
    actions: [
      {
        key:1,
        name: '直接发送给朋友',
        openType: 'share'
      },
      {
        key:2,
        name: '生成海报保存分享'
      },
    ],
    headContent: [
      {
        text: "课程详情",
        lineShow: true,
        index: 0
      },
      {
        text: "课程目录",
        lineShow: false,
        index: 1
      },
      {
        text: "课程说明",
        lineShow: false,
        index: 2
      },
      {
        text: "机构信息",
        lineShow: false,
        index: 3
      }
    ],
    currentIndex: 0, //当前选中的tab
    poster: "",
    qrImg: "",
    template: {},
    posterUrl: "",
    isLoading:true,
    list: [],

    showCard:false, //显示会员卡窗口
    withCard:[],
    withoutCard:[],
    isTabShow: false, // 是否显示tab
    videoPause: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
  },

  onPageScroll(e) {
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('.tips').boundingClientRect( rect => {
        if(rect) {
          this.detailHeight = rect.height
        }
      }).exec()
    },0)
    console.info('e.scrollTop', e.scrollTop)
    if(e.scrollTop > 0) {
      this.setData({
        isTabShow: true
      })
      this.tabHeightArr = [this.detailHeight, this.videoContentHeight, this.lessonInfoHeight, this.orgInfoHeight]
      this.getCurrentShow(e.scrollTop, this.tabHeightArr)
    }else {
      this.setData({
        isTabShow: false
      })
    }
  },
  // 根据滚动获取当前展示位置
  getCurrentShow(scrollTop, a) {
    const system = wx.getSystemInfoSync()
    let deviceHeight = system.screenHeight
    let sum = 0
    for(let i=0; i<a.length;i++) {
      sum= sum+a[i]
      if(scrollTop<=sum) {
        if((sum-scrollTop)/deviceHeight>(1/5)){
          this.currentIndex = i
          this.getCurrentTab()
        }else{
          this.currentIndex = i + 1
          this.getCurrentTab()
        }
        break;
      }
    }
  },
  // 当前所在的tab项
  getCurrentTab() {
    for (let i = 0; i < this.data.headContent.length; i++) {
      this.data.headContent[i].lineShow = false
    }
    this.data.headContent[this.currentIndex].lineShow = true
    this.setData({
      headContent: this.data.headContent,
      currentIndex: this.currentIndex
    })
  },
  // 处理tab栏切换
  toogleTab: function (e) {
    let index = e.currentTarget.dataset.index
    // 去掉所有tab栏下的线
    for (let i = 0; i < this.data.headContent.length; i++) {
      this.data.headContent[i].lineShow = false
    }
    this.data.headContent[index].lineShow = true
    this.setData({
      headContent: this.data.headContent,
      currentIndex: index
    })
    if(wx.pageScrollTo) {

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  parseShareInfo() {
    if (this.options.scene) {
      const scene = decodeURIComponent(this.options.scene)
      let url = app.globalData.urlBase + "spread/mp/goods/parseShareInfo"
      const data = {
        unlimitedQRCode: scene
      }
      util.http(url, data).then(res => {
        if (res.errorCode === 9000) {
          const opt = {
            custId: res.custId,
            goodsId: res.spuId
          }
          this.options = opt
          this.getProduct()
        } else {
          wx.showToast({
            title: res.errorMessage,
            icon: "warn",
            duration: 2000
          })
        }
      })
    } else {
      this.getProduct()
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const url = app.globalData.urlBase + "/spread/mp/auth/session"
    util.http(url, {}).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          spreadLevel:res.spreadLevel,
          vipLevel: res.vipLevel
        })
      }
    })
    if (wx.getStorageSync("token") === "") {
      var promise = util.loginByCode()
      promise
        .then(this.parseShareInfo)
    } else {
      this.parseShareInfo()
    }
    this.setAnimation()
  },

  toggleActionSheet() {
    this.setData({
      show: !this.data.show
    })
  },
  handleSelect(event) {
    const key = event.detail.key
    this.setData({ show: false });
    if (key == 2) { // 生成海报
      wx.navigateTo({
        url:`/pages/recordedLesson/poster/poster?spuId=${this.spuId}&title=${this.spuName}`,
      });
      // wx.showLoading({
      //   title: '正在生成海报...',
      //   mask: true
      // });
      // this.generatePoster()

    }
  },
  generatePoster() {
    const data = {
      pathType: 11,
      spuId:this.spuId
    }
    util.http(shareInfoUrl, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          template: new Card().palette(res)
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.errorMessage,
          icon: 'none',
        });
      }
    }).catch(res => {
      wx.hideLoading();
    })
  },
  /**
   * 获取商品详细信息
   */
  getProduct() {
    const param = {
      spuId: this.options.goodsId
    }
    const url = app.globalData.urlBase + "spread/mp/drp/goods/findOne"
    util.http(url, param).then(this.handleProductData)
    const url1 = app.globalData.urlBase + "spread/mp/goods/findCustomerCardInfo"
    util.http(url1, param).then(this.getVipCard)
  },
  getVipCard: function(data){
    const cardList = data.cardItemList
    let withoutCard = []
    let withCard = []
    cardList && cardList.forEach((item)=>{
      if(item.existFlag){
        withCard.push(item)
      }else{
        withoutCard.push(item)
      }
    })
    this.setData({
      withCard,
      withoutCard
    })
  },
  handleProductData(data) {
    if (data.errorCode == 9000) {
      this.spuId = data.spuId
      let backNotice = util.handleStringToArr(data.refundNotice, "<br/>")
      let useNotice = util.handleStringToArr(data.useNotice, "<br/>")
      let bookNotice = util.handleStringToArr(data.buyNotice, "<br/>")
      let imgs = util.handleStringToArr(data.imgs, ",")
      let guideArr = []
      if (data.guide) {
        guideArr = JSON.parse(data.guide).tips;
      }
      if (data.chapterItems) {
        this.list = data.chapterItems
        this.getList()
      }
      let parseData = {
        ...data,
        ...{
          backNotice,
          bookNotice,
          useNotice,
          imgs,
          guideArr,
        }
      }
      if (data.favoriteId) {
        this.setData({
          isCollect: true
        })
      }
      const user = wx.getStorageSync("g_userInfo")
      this.custId = user.custId
      this.spuName = data.spuName
      this.posterImg = data.posterImg
      this.setData({
        ticketDetailData: parseData,
        isLoading: false,
      })
      setTimeout(() => {
        const query = wx.createSelectorQuery()
        query.select('.head').boundingClientRect( rect => {
          this.headHeight = rect.height
          this.setData({
            headHeight: this.headHeight
          })
        }).exec()
        query.select('.footer').boundingClientRect( rect => {
          this.footHeight = rect.height
        }).exec()
        query.select('.video_content').boundingClientRect( rect => {
          if(rect) {
            this.videoContentHeight = rect.height
          }
        }).exec()
        query.select('.lesson-intro').boundingClientRect( rect => {
          if(rect) {
            this.lessonInfoHeight = rect.height
          }
        }).exec()
        query.select('.org-info').boundingClientRect( rect => {
          if(rect) {
            this.orgInfoHeight = rect.height
          }
        }).exec()
      }, 0)
    }
  },
  checkTime(obj) {
    if (obj.day == '00' && obj.hou == '00' && obj.min == '00' && obj.sec == '00') {
      return true
    }
    return false
  },
  // 立即预约
  onShowCard: function () {
    if (this.data.timeObj && !this.checkTime(this.data.timeObj)) {
      console.log('eeee')
      wx.showModal({
        title:'提示',
        content: `商品${this.data.timeObj.day}天${this.data.timeObj.hou}小时${this.data.timeObj.min}分后可预约，敬请期待`,
        showCancel: false,
      });

      return false
    }
    this.setData({
      showCard: true
    })
  },
  handleClose(){
    this.setData({
      showCard:false
    })
  },
  // 立即购买
  handleBuy() {
    const user = wx.getStorageSync("g_userInfo")
    if (user.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return;
    }
    const paramsObj = {
      ...this.options,
      spuId: this.data.ticketDetailData.spuId,
      skuId: this.data.ticketDetailData.skuId,
      spuName: this.data.ticketDetailData.spuName,
      cover: this.data.ticketDetailData.cover,
      price: this.data.ticketDetailData.price,
      oriPrice: this.data.ticketDetailData.oriPrice,
      teamBenefit: this.data.ticketDetailData.teamBenefit,
      selfBenefit: this.data.ticketDetailData.selfBenefit,
      accessAppointFlag: this.data.ticketDetailData.accessAppointFlag, // true 预约型 false 购买型
      buyNeedAttach: this.data.ticketDetailData.buyNeedAttach,
      buyAttachRule: this.data.ticketDetailData.buyAttachRule
    }
    const params = util.stringifyParams(paramsObj)
    wx.navigateTo({
      url: `/pages/recordedLesson/payment/payment${params}`,
    });
  },
  onPurchase: function (e) {
    console.log(e)
    const vipSpuId = e.currentTarget.dataset.id
    let flag = e.currentTarget.dataset.flag //是否拥有该会员卡
    if (!flag) flag = '0'
    let userInfo = wx.getStorageSync("g_userInfo"),
      _this = this;
    setTimeout(() => {
      if (e.currentTarget.dataset.reserve) {
        wx.navigateTo({
          url: "../../calendar/calendar?skuId=" +
            this.data.ticketDetailData.skuId +
            "&spuName=" +
            this.data.ticketDetailData.spuName +
            "&cover=" +
            this.data.ticketDetailData.cover +
            "&spuId=" +
            this.data.ticketDetailData.vipSpuId +
            "&vipSpuId=" +
            vipSpuId +
            "&accessAppointFlag=" + flag
        })
      }
    }, 100)
  },
  /* 会员免费 */
  memberCardClick: function() {
    let id =  this.data.ticketDetailData.spuId
    wx.navigateTo({
      url: '/pages/index/playcard/playcard?spuId=' + id,
    })
    // expiretime = e.currentTarget.dataset.expiretime;
    // if (expiretime) {
    //   wx.navigateTo({
    //     url: '/pages/index/playcard/playcard?spuId=' + id,
    //   })
    // }
  },
  // 立即开通
  clickCard: function(e) {
    let id = '1161988530013704192' // 教育卡id
    wx.navigateTo({
      url: '/pages/index/playcard/playcard?spuId='+ id,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.spuName}`,
      path: `/pages/recordedLesson/product-detail/product-detail?custId=${this.custId}&goodsId=${this.options.goodsId}`,
      imageUrl: this.posterImg
    }
  },
  onPhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.ticketDetailData.tel
    })
    return
  },
  handleBack() {
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    });
  },
  onOpenMap: function () {
    this.setData({
      indexOfCurrentAddress: true
    })
    setTimeout(() => {
      wx.openLocation({
        latitude: Number(this.data.shopData.lat),
        longitude: Number(this.data.shopData.lng),
        scale: 15,
        name: this.data.shopData.shopName,
        address: this.data.shopData.shopAddress,
        fail: function (res) {
          console.log(res)
        }
      })
    }, 100)
  },
  // 跳转店铺详情页面
  onNavToShopDetail: function () {
    let shopId = this.data.ticketDetailData.shopId
    this.setData({
      indexOfCurrentDevice: true
    })
    wx.navigateTo({
      url: `/pages/index/ticket/ticket-detail/shop-detail/shop-detail?shopId=${shopId}`
    })
  },
  setAnimation: function () {
    var animationUp = wx.createAnimation({
      timingFunction: "ease-in-out"
    })
    this.animationUp = animationUp
  },
  // 收藏门票
  onCollectTicket: function () {
    // 判断收藏是否处理完毕
    if (this.collecting && this.collecting === true) return
    this.collecting = true
    let url = app.globalData.urlBase + "/spread/mp/mine/collect"
    let param = {
      shopId: this.data.ticketDetailData.shopId,
      spuId: this.data.ticketDetailData.spuId
    }
    if (this.favoriteId) {
      param.favoriteId = this.favoriteId
    }
    util.http(url, param).then(this.processCollectTicket)
  },
  // 处理收藏动画
  processCollectTicket: function (data) {
    if (data.errorCode === 9000) {
      this.favoriteId = data.favoriteId
      this.setData({
        isCollect: !this.data.isCollect
      })
      wx.showToast({
        title: this.data.isCollect ? "收藏成功" : "取消成功",
        duration: 1000,
        icon: "success"
      })
      this.animationUp.scale(2).step()
      this.setData({
        animationUp: this.animationUp.export()
      })
      setTimeout(
        function () {
          this.animationUp.scale(1).step()
          this.collecting = false
          this.setData({
            animationUp: this.animationUp.export()
          })
        }.bind(this),
        300
      )
    }
  },

  onClickHide() {
    this.setData({ showDialog: false });
  },
  //加载分享页面完成
  onImgOK: function (e) {
    wx.hideLoading();
    if (e.detail.path) {
      this.path = e.detail.path
      this.setData({ showDialog: true });
      this.setData({
        posterUrl: e.detail.path
      })
    }
  },
  saveShareImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.path,
      success: function(res) {
        wx.showModal({
          title: "提示",
          content: "保存图片成功"
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  getList() {
    let flag = false
    if(this.list && this.list.length > 0) {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].checked = false
        if (this.list[i].videoInfo) {
          for (var j = 0; j < this.list[i].videoInfo.length; j++) {
            this.list[i].videoInfo[j].checked = false
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
      if (!flag) {
        this.setData({
          videoShow: false
        })
        if(this.list && this.list.length > 0) {
          this.list[0].checked = true
        }
        this.setData({
          list: this.list
        })
      }
    }
  },
  selectVideo(outsideIndex, insideIndex) {
    this.list[outsideIndex].checked = true
    this.list[outsideIndex].videoInfo[insideIndex].checked = true
    this.setData({
      videoUrl: this.list[outsideIndex].videoInfo[insideIndex].videoUrl,
      uploadTime: this.list[outsideIndex].videoInfo[insideIndex].uploadTime,
      userName: this.list[outsideIndex].videoInfo[insideIndex].userName,
      videoName: this.list[outsideIndex].videoInfo[insideIndex].videoName,
      describe: this.list[outsideIndex].videoInfo[insideIndex].videoDesc,
      list: this.list
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
    this.list[idx].checked = !this.list[idx].checked
    this.setData({
      list : this.list
    })
  },
  /* 视频选择 */
  toggleVideo:function(e){
    let sectionIdx = e.currentTarget.dataset.sectionindex
    let classIdx = e.currentTarget.dataset.classindex
     // 暂停上个视频
    this.list[this.index.section].videoInfo[this.index.class].checked = !this.list[this.index.section].videoInfo[this.index.class].checked
    this.index.section = sectionIdx
    this.index.class = classIdx

     // 开始当前视频
     this.list[sectionIdx].videoInfo[classIdx].checked = true
     this.selectVideo(sectionIdx, classIdx)
     wx.createVideoContext('video').play()
     this.setData({
      list : this.list
    })
  }
})
