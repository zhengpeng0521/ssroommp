var app = getApp()
var util = require("../../../../utils/util")
import Card from "../../../../utils/playcard-template.js"
// pages/index/ticket/ticket-detail/ticket-detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userCommentData: [],
    shopData: [],
    ticketDetailData: [],
    isLoading: true,
    evaluationCount: "",
    averageScore: "",
    isCollect: false,
    indexOfCurrentDevice: null,
    indexOfCurrentAddress: null,
    indexOfCurrentBtn: null,
    indexOfCurrentComment: null,
    testhtml: "",
    inviteDialogBool: false,
    leftDay: "00",
    leftHours: "00",
    leftMinute: "00",
    leftSeconds: "00",
    tempFilePath: "",
    generateComplete: false,
    posterData: {},
    buyTxt: "立即预约",
    posterrConfig: {},
    shareVisitFlag: "",
    playCardTitle: '',

    commentData: [], //评论数据
    btnClick: true,
    showCard:false, //显示会员卡窗口
    withCard:[],
    withoutCard:[],

    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("ticket分享进来的options----------", options)
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      let url = app.globalData.urlBase + "/spread/mp/goods/parseShareInfo"
      const data = {
        unlimitedQRCode: scene
      }
      util.http(url, data).then(res => {
        if (res.errorCode === 9000) {
          this.options = res
          this.haveSuperCard(this.options.goodsId)
          this.visitShareGoods(res.spuId)
        } else {
          wx.showToast({
            title: res.errorMessage,
            icon: "warn",
            duration: 2000
          })
        }
      })
    } else {
      this.options = options
      this.visitShareGoods(options.goodsId)
    }
    this.goodsId = options.goodsId
    this.getCommentData()
    this.btnState = false
  },

  /* 获取商品评论 */

  getCommentData() {
    const url = app.globalData.urlBase + 'spread/mp/evaluate/findGoodsEvaluate'
    const params = {
      goodsSpuId: this.goodsId,
      type: '2'
    }
    util.http(url, params).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          commentData: res.results
        })
      }
    })
  },

  /* 访问分享商品 */

  visitShareGoods: function (spuId) {
    let url = app.globalData.urlBase + "/spread/mp/sensors/visitShareGoods"
    util.http(url, {
      spuId: spuId
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("访问分享------------res", res)
        this.setData({
          shareVisitFlag: res.visitFlag
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // options包含了门店shopId，门票ticketId，类型type
    let optionsObj = this.options

    this.options = optionsObj
    if (optionsObj.q) {
      let objDataSte = util.parse_url(decodeURIComponent(optionsObj.q))
      this.options = objDataSte
    }
    if (wx.getStorageSync("token") === "") {
      // var promise = new Promise((resolve, reject) => {
      //   wx.login({
      //     success: res => {
      //       console.info("wx.login成功:", res)
      //       resolve(res.code)
      //     },
      //     fail: res => {
      //       console.info(" wx.login失败：", res)
      //     }
      //   })
      // })
      var promise = util.loginByCode()
      promise
        // .then(util.asyncGetUserInfo) //除注册页面，其他不需要用户授权
        //以下是三行抽取为loginByCode()
        // .then(util.postUserInfo)
        // .then(util.processToken)
        // .then(util.processAuthMess)
        .then(this.allDataPost)
    } else {
      this.allDataPost()
    }
    this.setAniation()
  },

  allDataPost: function () {
    let param1, url1
    param1 = {
      spuId: this.options.goodsId
    }
    // url1 = app.globalData.urlBase + "spread/mp/goods/findOne"
    url1 = app.globalData.urlBase + "spread/mp/drp/goods/findOne"
    // 门票相关数据
    util.http(url1, param1).then(this.processTicketDetailData)
    const url = app.globalData.urlBase + "spread/mp/goods/findCustomerCardInfo"
    util.http(url, param1).then(this.getVipCard)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      indexOfCurrentDevice: null,
      indexOfCurrentAddress: null,
      indexOfCurrentBtn: null,
      indexOfCurrentComment: null
    })
    // clearInterval(this.coutDownInterval)
    clearInterval(this.timeInterval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.buriedPointEnd()
    // clearInterval(this.coutDownInterval)
    clearInterval(this.timeInterval)
  },
  /*浏览商品*/
  buriedPointStart: function (spuId) {
    let url = app.globalData.urlBase + "/spread/mp/sensors/visitGoods",
      _this = this
    util.http(url, {
      spuId: spuId
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("浏览获取------------res", res)
        _this.visitFlag = res.visitFlag
      }
    })
  },
  /*离开页面*/
  buriedPointEnd: function () {
    let url = app.globalData.urlBase + "spread/mp/sensors/leaveGoods",
      _this = this
    util.http(url, {
      spuId: this.data.ticketDetailData.spuId,
      visitFlag: this.data.shareVisitFlag ?
        this.data.shareVisitFlag : this.visitFlag
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("离开分享页面------------")
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let url = app.globalData.urlBase + "/spread/mp/sensors/shareGoods"
    util.http(url, {
      spuId: this.data.ticketDetailData.spuId
    })
    // this.options
    let userInfo = wx.getStorageSync("g_userInfo")
    let params = {
      custId: userInfo.custId,
      ...this.options
    }
    return {
      path: "pages/index/ticket/ticket-detail/ticket-detail" +
        util.stringifyParams(params),
      title: userInfo.nickname +
        "超值推荐" +
        this.data.ticketDetailData.spuName,
      imageUrl: this.data.ticketDetailData.cover +
        "?p=image/format,jpg/quality,q_75/resize,l_300"
    }
  },

  setAniation: function () {
    var animationUp = wx.createAnimation({
      timingFunction: "ease-in-out"
    })
    this.animationUp = animationUp
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
  processTicketDetailData: function (data) {
    console.log("门票详细信息--------------", data)
    if(data.errorCode == 9000){
      let backNotice = util.handleStringToArr(data.refundNotice, "<br/>")
      let useNotice = util.handleStringToArr(data.useNotice, "<br/>")
      let bookNotice = util.handleStringToArr(data.buyNotice, "<br/>")
      let leftDay, leftHours, leftMinute, leftSeconds
      let imgs = util.handleStringToArr(data.imgs, ",")
      // if (data.showCountDown == 1) {
      //   clearInterval(this.coutDownInterval)
      //   this.coutDownInterval = setInterval(() => {
      //     let nowTime = new Date().getTime()
      //     let leftTime = data.endTime * 1000 - nowTime
      //     leftDay = util.coutDown(leftTime, "day")
      //     leftHours = util.coutDown(leftTime, "hour")
      //     leftMinute = util.coutDown(leftTime, "minute")
      //     leftSeconds = util.coutDown(leftTime, "seconds")
      //     this.setData({
      //       leftDay,
      //       leftHours,
      //       leftMinute,
      //       leftSeconds
      //     })
      //   }, 1000)
      // }
      if (data.advanceSale == 1) {

        clearInterval(this.timeInterval)
        this.countdown(data.countdown) //需要先执行一次，不然会延迟一秒显示
        this.timeInterval = setInterval(this.countdown, 1000, data.countdown)
        this.setData({
          btnClick: false
        })
      }
      data.saleNumVisible = data.virtualSaleNum * 1 + data.saleNum * 1
      let stockPercent = "100"
      if (data.stockType === 1) {
        let denominator =
          data.stocks * 1 +
          data.virtualSaleNum * 1 +
          data.saleNum * 1,
          molecule = data.stocks
        stockPercent = (molecule / denominator).toFixed(2) * 100
      }
      let isCollect = false
      if (data.favoriteId) {
        this.setData({
          isCollect: true
        })
      }
      let guideArr = []
      if (data.guide) {
        guideArr = JSON.parse(data.guide).tips;
      }
      if (data.chapterItems) {
        this.list = data.chapterItems
        this.getList()
      }
      //accessAppointFlag true 预约型  false 购买型
      // let buyTxt = null,
      let userInfo = wx.getStorageSync('g_userInfo');
      // if (!data.accessAppointFlag) {
      //   buyTxt = "立即购买"
      // } else {
      //   buyTxt = "立即预约"
      // }

      this.setData({
        userInfo: userInfo,
        // buyTxt: buyTxt
      })
      let parseData = {
        ...data,
        ...{
          backNotice,
          bookNotice,
          useNotice,
          imgs,
          stockPercent,
          guideArr
        }
      }
      this.favoriteId = data.favoriteId
      this.buriedPointStart(parseData.spuId)
      //获取会员卡
      // this.getVipCard(data.cardItemList)
      this.setData({
        ticketDetailData: parseData,
        isLoading: false
      })
    }else{
      wx.showModal({
        title: '提示',
        content: data.errorMessage,
        showCancel: false,
        success:function(res){
          wx.switchTab({
            url: '/pages/tabBar/index/index'
          })
        }
      });
    }
  },

  processShopData: function (data) {
    console.info(data)
    this.data2 = true
    this.stopLoading()
    this.setData({
      shopData: data
    })
  },
  //倒计时
  countdown(timestamp) {
    const timeObj = util.formatCountDown(timestamp);
    if (this.checkTime(timeObj)) { //
      this.btnState = true;
    }
    this.setData({
      timeObj,
      btnClick: this.btnState
    })
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

  onPhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.ticketDetailData.tel
    })
    return
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

  // 跳转店铺详情页面
  onNavToShopDetail: function () {
    let lat = this.data.shopData.lat
    let lng = this.data.shopData.lng
    let shopId = this.data.ticketDetailData.shopId
    this.setData({
      indexOfCurrentDevice: true
    })
    setTimeout(() => {
      wx.navigateTo({
        url: "shop-detail/shop-detail?shopId=" + shopId
      })
    }, 100)
  },
  generatePoster: function () {
    //
  },
  onImgOK: function (e) {
    this.imagePath = e.detail.path
  },
  naviToPlayCard: function () {
    let params = util.stringifyParams({
      skuId: this.data.ticketDetailData.skuId,
      spuId: this.data.ticketDetailData.vipSpuId
    })
    wx.navigateTo({
      url: '/pages/index/playcard/playcard' + params,
    })
  },
  // 立即开通
  clickCard: function(e) {
    let id = '1161988530013704192' // 教育卡id
    wx.navigateTo({
      url: '/pages/index/playcard/playcard?spuId='+ id,
    })
  },
  /*跳转分享页面*/
  inviteDialogShow: function () {

    
    // @deprecated 0.8
    // let url = app.globalData.urlBase + '/spread/mp/mine/hasVipCard';
    // util.http(url, {
    //   vipSpuId: this.data.ticketDetailData.vipSpuId
    // }).then(res => {
    //   if (res.errorCode === 9000) {
    //     if (res.hasVipCard) {
    //       this.continueShate();
    //     } else {
    //       this.setData({
    //         inviteDialogBool: true
    //       })
    //     }
    //   } else {

    //   }
    // })
  },
  /*继续分享*/
  continueShate: function () {
    let params
    if (this.data.ticketDetailData.isEquity) {
      params = this.data.ticketDetailData.vipSpuId
    } else {
      params = this.data.ticketDetailData.spuId
    }
    wx.navigateTo({
      url: "/components/share-poster/share-poster?spuId=" +
        params +
        "&goodsId=" +
        this.options.goodsId
    })

  },
  /*隐藏分享*/
  hidePoster: function () {
    this.setData({
      inviteDialogBool: false
    })
  },
  /*返回首页*/
  handleBack: function () {
    wx.switchTab({
      url: "/pages/tabBar/index/index"
    })
  },
  checkTime(obj) {
    if (obj.day == '00' && obj.hou == '00' && obj.min == '00' && obj.sec == '00') {
      return true
    }
    return false
  },
  handleClose(){
    this.setData({
      showCard:false
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
          // this.list[0].checked = true
        }
        this.setData({
          list: this.list
        })
      }
    }
  },
  selectVideo(outsideIndex, insideIndex) {
    // this.list[outsideIndex].checked = true
    // this.list[outsideIndex].videoInfo[insideIndex].checked = true
    this.setData({
      videoUrl: this.list[outsideIndex].videoInfo[insideIndex].videoUrl,
      uploadTime: this.list[outsideIndex].videoInfo[insideIndex].uploadTime,
      userName: this.list[outsideIndex].videoInfo[insideIndex].userName,
      videoName: this.list[outsideIndex].videoInfo[insideIndex].videoName,
      // describe: this.list[outsideIndex].videoInfo[insideIndex].videoDesc,
      list: this.list
    })
    // if (this.list[outsideIndex].videoInfo[insideIndex].videoDesc.length >= this.data.describeNum) {
    //   this.describeSlice = this.list[outsideIndex].videoInfo[insideIndex].videoDesc.slice(0, this.data.describeNum)
    //   this.setData({
    //     describeNow: this.list[outsideIndex].videoInfo[insideIndex].videoDesc.slice(0, this.data.describeNum)
    //   })
    // } else {
    //   this.setData({
    //     describeNow: this.list[outsideIndex].videoInfo[insideIndex].videoDesc
    //   })
    // }
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
    // this.list[this.index.section].videoInfo[this.index.class].checked = !this.list[this.index.section].videoInfo[this.index.class].checked
    this.index.section = sectionIdx
    this.index.class = classIdx

     // 开始当前视频
    //  this.list[sectionIdx].videoInfo[classIdx].checked = true
     this.selectVideo(sectionIdx, classIdx)
     wx.createVideoContext('video').play()
     this.setData({
      list : this.list
    })
  }
})
