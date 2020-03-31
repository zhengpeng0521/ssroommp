// pages/distribution/product-detail/product-detail.js
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

    poster: "",
    qrImg: "",
    template: {},
    posterUrl: "",
    isLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    console.log("ticket分享进来的options----------", options)
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
          spreadLevel:res.spreadLevel
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
        url:`/pages/distribution/poster/poster?spuId=${this.spuId}&title=${this.spuName}`,
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
      let parseData = {
        ...data,
        ...{
          backNotice,
          bookNotice,
          useNotice,
          imgs,
          guideArr
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
      
      
    }
  },
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
      url: `/pages/distribution/payment/payment${params}`,
    });
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
      path: `/pages/distribution/product-detail/product-detail?custId=${this.custId}&goodsId=${this.options.goodsId}`,
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
})
