// pages/index/playcard/playcard.js
var app = getApp()
var util = require("../../../utils/util.js")
import Card from "../../../utils/playcard-template"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    angle: "https://img.ishanshan.com/gimg/user/n///1561456221.png",
    target: "https://img.ishanshan.com/gimg/n/20190627/f49ed720fd760073119cf94d7759164a",
    playCardItems: [],
    userInfo: {},
    shareDialogLayout: false,
    inviteDialogBool: false,
    isCustomerDialog: false,
    // systemInfo: "",
    posterData: {},
    superCardIndex: 0,
    swiperIndex: "",
    isSpreader: false, //是否是会员
    current: 0,
    doubleSwitch: false,
    hasSuperCard: false, //拥有畅玩卡
    imgsList: [],
    reduceAmount: 0, //折扣价格
    checkAgrement: "0",
    shareVisitFlag: "", //分享的flag
    cardDetail: "" //会员卡详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("分畅玩卡传进来的options-------scene---", options)
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      let url = app.globalData.urlBase + "spread/mp/goods/parseShareInfo"
      const data = {
        unlimitedQRCode: scene
      }
      util.http(url, data).then(res => {
        if (res.errorCode === 9000) {
          console.log('parseShareInfo', res)

          this.options = res
          this.haveSuperCard(this.options.spuId)
          this.visitShareGoods(res.spuId)
          const scene = wx.getLaunchOptionsSync().scene;
          // this.findqrCodeChannel(scene)  // 去掉第三方渠道优惠逻辑 #todo冗余代码待优化
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
      this.visitShareGoods(options.spuId)
    }
  },
  onShow: function() {
    if (wx.getStorageSync("token") === "") {
      var promise = new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            console.info("wx.login成功:", res)
            resolve(res.code)
          },
          fail: res => {
            console.info(" wx.login失败：", res)
          }
        })
      })

      promise
        // .then(util.asyncGetUserInfo)
        .then(util.postUserInfo)
        .then(util.processToken)
        .then(util.processAuthMess)
        .then(this.dataPost)
    } else {
      this.dataPost()
    }
    console.log('场景之-----', wx.getLaunchOptionsSync())
    const scene = wx.getLaunchOptionsSync().scene;
    if (scene == '1058') {
      console.log('从微信公号进来的文章--appId', wx.getAccountInfoSync())
      const data = {
        thirdIdentity: this.options.appid,
        skuId: this.options.skuId
      }

      // this.findThirdChannel(data) //去掉第三方渠道优惠查询
    }
  },
  dataPost: function() {
    this.haveSuperCard(this.options.spuId).then(this.getPlayCardList)
  },
  // 寻找第三方配置信息
  findThirdChannel: function(data) {
    let url = app.globalData.urlBase + "spread/mp/goods/findThirdChannel"
    util.http(url, data).then(res => {
      console.log('第三方信息-----', res)
      if (res.errorCode === 9000) {
        this.setData({
          reduceAmount: res.thirdReduceAmount
        })
      }
    })
  },

  findqrCodeChannel: function (scene) {
    if (scene == '1047' || scene == '1048' || scene == '1049') {

      if (this.options.identity) {
        
        const query = util.getUrlkey(this.options.identity);
        const data = {
          thirdIdentity: query.appid,
          skuId: query.skuId
        }
        this.options.appid = query.appid
        this.findThirdChannel(data)
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  /*获取畅玩卡列表*/
  getPlayCardList: function() {
    let url = app.globalData.urlBase + "spread/mp/goods/findSuperCard"
    util.http(url, {}).then(this.playcardList)
  },
  // 加载畅玩卡列表
  playcardList: function(res) {
    var _this = this
    if (res.errorCode === 9000) {
      this.setData({
        playCardItems: res.superCardList
      })
      console.log("获取的会员卡详情--------------", res.superCardList, this.options.spuId)
      res.superCardList.forEach((item, index) => {
        if (item.spuId === this.options.spuId) {
          this.options.cardIndex = index
        }
      })
      let imgsArr = []
      res.superCardList[this.options.cardIndex].imgs.split(
        ","
      ).forEach(e => {
        const data = {
          img: e,
          show: false
        }
        imgsArr.push(data)
      })
      console.log('分享长图', imgsArr)

      this.setData({
        imgsList: imgsArr,
        cardDetail: res.superCardList[this.options.cardIndex]
      })
      this.showImg()
    }
  },
  showImg: function() {
    let height = this.data.height // 页面的可视高度
    wx.createSelectorQuery().selectAll('.item').boundingClientRect((ret) => {

      ret.forEach((item, index) => {
        if (item.top <= height) {
          this.data.imgsList[index].show = true // 根据下标改变状态
        }
      })
      this.setData({
        imgsList: this.data.imgsList
      })
    }).exec()
  },

  onPageScroll(e) { // 滚动事件
    this.setData({
      height: e.scrollTop
    })
    this.showImg()
  },

  //是否拥有畅玩卡
  haveSuperCard: function(val) {
    /*0---不是会员*/
    if (
      wx.getStorageSync("g_userInfo") &&
      wx.getStorageSync("g_userInfo").vipLevel > 1
    ) {
      this.setData({
        isSpreader: true
      })
    }

    let url2 = app.globalData.urlBase + "spread/mp/mine/hasVipCard"
    const data = {
      vipSpuId: val || this.options.spuId
    }
    //有没有当前会员卡
    return util.http(url2, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          hasSuperCard: res.hasVipCard
        })
        this.handleDoubleSwitch()
      }
    })
  },
  /*会员有无畅玩卡*/
  handleDoubleSwitch: function() {
    /*是会员但是没有当前这个卡*/
    if (!this.data.hasSuperCard && this.data.isSpreader) {
      this.setData({
        doubleSwitch: true
      })
    }
    /*是会员有卡*/
    if (this.data.hasSuperCard && this.data.isSpreader) {
      this.setData({
        doubleSwitch: false
      })
    }
  },

  //加载分享页面完成
  onImgOK: function(e) {
    this.imagePath = e.detail.path
  },

  //显示分享弹窗
  inviteDialogShow: function(e) {
    console.log("继续分享------------", e)
    if (this.data.isSpreader || e.currentTarget.dataset.btn == 0) {
      //如果是会员
      wx.navigateTo({
        url: "/components/share-poster/share-poster?spuId=" +
          this.data.cardDetail.spuId +
          "&shareType=card"
      })
      this.setData({
        isCustomerDialog: false,
        shareDialogLayout: false
      })
      this.setData({
        inviteDialogBool: true,
        shareDialogLayout: true
      })
    } else {
      this.setData({
        isCustomerDialog: true,
        shareDialogLayout: true
      })
    }
  },
  //隐藏分享
  hidePoster: function() {
    this.setData({
      inviteDialogBool: false,
      shareDialogLayout: false
    })
  },

  checkboxChange: function(e) {
    // this.setData
    let checkVal = e.detail.value[0],
      checkAgrement
    if (checkVal === "0") {
      checkAgrement = "1"
    } else {
      checkAgrement = "0"
    }
    this.setData({
      checkAgrement: checkAgrement
    })
  },
  /*购买畅玩卡*/
  buySuperCard: function() {
    if (wx.getStorageSync("g_userInfo").registStatus === 0) {
      //未注册--跳转注册页
      wx.navigateTo({
        url: "/pages/mine/bind-mobile/bind-mobile"
      })
      return false
    }
    if (this.data.checkAgrement === "0") {
      wx.showModal({
        title: "进行勾选",
        content: "如购买本卡即需要您同意会员协议",
        confirmText: "我知道了",
        showCancel: false
      })
      return false
    }
    if (wx.getStorageSync("g_userInfo").registStatus === 1) {
      let superCardDetail = this.data.cardDetail
      console.log("单个会员卡详情--------------detail", superCardDetail)
      let params =
        "goodsId=" +
        superCardDetail.skuId +
        "&&spuId=" +
        superCardDetail.spuId +
        "&&goodsType=9" +
        "&&cover=" +
        superCardDetail.cover +
        "&&price=" +
        superCardDetail.price +
        "&&memberPrice=" +
        superCardDetail.price +
        "&&goodsName=" +
        superCardDetail.spuName +
        "&&saleNum=1&&deductAmount=0" +
        "&buyType=playcard"

      if (this.options.custId) {
        params = params + "&inviter=" + this.options.custId
      }

      if (this.options.appid) {
        params = params + "&&reduceAmount=" + this.data.reduceAmount +
          "&&thirdIdentity=" + this.options.appid
      }
      wx.navigateTo({
        url: "/pages/index/ticket/ticket-detail/purchase/purchase?" +
          params
      })
    }
  },
  /* 访问分享商品 */

  visitShareGoods: function(spuId) {
    let url = app.globalData.urlBase + "spread/mp/sensors/visitShareGoods"
    util.http(url, {
      spuId: spuId
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("分享------------res", res)
        this.setData({
          shareVisitFlag: res.visitFlag
        })
      }
    })
  },
  /*浏览*/
  buriedPointStart: function(spuId) {
    let url = app.globalData.urlBase + "spread/mp/sensors/visitGoods",
      _this = this
    util.http(url, {
      spuId: spuId
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("浏览---------------res", res)
        _this.visitFlag = res.visitFlag
      }
    })
  },
  /*离开分享页面*/
  buriedPointEnd: function() {
    let url = app.globalData.urlBase + "spread/mp/sensors/leaveGoods",
      _this = this
    util.http(url, {
      spuId: this.options.spuId,
      visitFlag: this.data.shareVisitFlag ?
        this.data.shareVisitFlag : this.visitFlag
    }).then(res => {
      if (res.errorCode === 9000) {
        console.log("离开分享页面------------")
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.buriedPointEnd()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let params = {
      custId: wx.getStorageSync("g_userInfo").custId,
      ...this.options
    }
    return {
      path: "/pages/index/playcard/playcard" + util.stringifyParams(params)
    }
  },
  handleBack: function() {
    let pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.switchTab({
        url: "/pages/tabBar/index/index"
      })
    }
  }
})
