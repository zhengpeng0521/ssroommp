// pages/index/index.js
const app = getApp()
const util = require("../../../utils/util")
const segmentData = [
  { id: 1, name: '线下教培', goodsType: 104 },
  { id: 2, name: '线上教培', goodsType:104 }
]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 显示当前城市定位 */
    province: '浙江',
    locationCity: '杭州',
    district: '',
    recommendData: [],
    enterLoading: true,
    listLoading: true,
    templateData: {},
    btnTxt: "会员免费",
    pulldownRefreshBool: false,
    cityNavmenuTop: 0,
    goodsNavmenuTop: 0,
    cityNavFixed: true,
    goodsNavFixed: false,
    citiesArr: [],
    goodsTab: [],
    activeTabIndex: 0,
    goodsListPadTop: 100,
    specialSwiperCurIndex: 1,
    weekNewArr: [],

    /**腰位广告位 */
    adv: [],
    vshow: false,
    /**弹窗广告 */
    dialogAd: null,
    dialogAdShow: false,
    fabFloat: false,
    showNotice: false, //是否显示通知
    current: 0, //当前所在滑块的 index
    bannerCurrent: 0,
    segmentData,
    showOnlineEdu:true //是否显示线上教培
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.noticeFlag = false; //是否显示领取通知的标识
    this.options = options
    util.updateMiniprogram();
    this.cityNavHeight = 40
    this.goodsNavHeight = 46
    this.statusBarHeight = wx.getSystemInfoSync().statusBarHeight
    this.shopModeType = 1 //默认显示线下教培
    this.goodsType = 104
    const query = wx.createSelectorQuery()
    query.select('#cityNav').boundingClientRect()
    query.exec(res => {
      this.setData({
        cityNavHeight:res[0].height
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.firstOfAll();
    if (this.noticeFlag) {
      this.setData({
        showNotice: true
      }, () => {
        setTimeout(() => {
          this.setData({
            noticeClass: 'hide-notice'
          })
        }, 3000)
      })
    }
    // 查询是否需要提示领取优惠券
    this.queryCompletedTask()
    this.observerScroll()
  },
  goodsNameSearch: function(e) {
    let val = e.detail.value;
    this.goodsName = val;
    this.firstPostList();
  },
  /* 获取当前所在城市 */
  postCity: function(e) {
    let url = app.globalData.urlBase + "spread/mp/goods/shopLocation",
      _this = this;
    const location = util.handleGCJToBaidu(e.latitude, e.longitude)
    util.http(url, {
      lat: location.latitude,
      lon: location.longitude
    }).then((res) => {
      let chosenCity = wx.getStorageSync('chosenCity');
      let resProvince = res.province;
      let resCity = res.city;
      if (!_this.province && chosenCity && resCity.indexOf(chosenCity) === -1) {
        wx.showModal({
          title: '提示',
          content: '当前地址和定位地址不一致',
          confirmText: '使用定位',
          cancelText: '继续',
          success(resp) {
            let province = null,
              city = null;
            if (resp.confirm) {
              province = res.province;
              city = res.city;
              wx.setStorageSync('chosenCity', city)
            } else if (resp.cancel) {
              province = _this.province;
              city = chosenCity;
            }
            _this.setData({
              locationCity: city,
              // region: [province, city, '全部']
            })
            _this.firstPostList();
          }
        })
      } else {
        _this.setData({
          locationCity: chosenCity || resCity,
          // region: [_this.province || res.province, chosenCity || resCity, '全部']
        })
        _this.firstPostList();
      }
    })
  },
  firstOfAll: function () {
    this.pageSize = 5
    this.hasMoreData = true
    if (wx.getStorageSync('token') === "") {
      var promise = util.loginByCode()
      promise
        // .then(util.postUserInfo)
        // .then(util.processToken)
        // .then(util.processAuthMess)
        .then(this.postAllData)
    } else {
      this.postAllData()
    }
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#cityNav').boundingClientRect()
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
      that.cityNavHeight = res[0].height
      console.info('res[0].top + res[1].scrollTop', res)
      if (that.data.cityNavmenuTop === 0) {
        that.setData({
          cityNavmenuTop: res[0].top + res[1].scrollTop,
          cityNavHeight:that.cityNavHeight
        })
      }
    });

  },
  postAllData: function () {
    let userInfo = wx.getStorageSync("g_userInfo")
    if (userInfo.vipLevel > 1) {
      this.setData({
        btnTxt: "立即预约"
      })
    }
    const params = {
      tagSource: '1'
    }
    const indexQuery = app.globalData.urlBase + "spread/mp/goods/indexQuery";
    util.http(indexQuery, params).then(res => {
      const { adItemList, cityList, hasAppointOfWaitGpsVerify, superCardList } = res
      /** 筛选弹窗广告、banner广告、首页广告 **/
      let dialogAd = null
      let adv = [] //首页广告
      let bannerAdv = [] //banner广告
      let adList = adItemList ? adItemList : []
      adList.forEach((item) => {
        if (item.adPosition == '1') {
          adv.push(item)
        } else if(item.adPosition == '4'){
          bannerAdv.push(item)
        } else {
          dialogAd = { ...item }
        }

      })
      let newData = [...segmentData]
      let showOnlineEdu = true
      if (!res.showOnlineEdu) { //不显示线上
        newData.splice(1, 1)
        showOnlineEdu = false
      }
      this.setData({
        adv,
        dialogAd,
        citiesArr: cityList,
        superCardList: bannerAdv,
        enterLoading: false,
        bannerCurrent: 0,
        segmentData: newData,
        showOnlineEdu:showOnlineEdu
      })
      this.showOrderTip(hasAppointOfWaitGpsVerify)
      wx.setStorage({
        key: "superCardData",
        data: superCardList
      })
    })
    /*查询本周上新 */
    // let weekNewUrl = app.globalData.urlBase + '/spread/mp/goods/goodsShowNew';
    // util.http(weekNewUrl, {}).then(res => {
    //   if (res.errorCode === 9000) {
    //     this.setData({
    //       current:0,
    //       weekNewArr: res.results
    //     })
    //   }
    // });
    if (this.pageIndex >= 0) {
      if (this.goodsList) this.countDown() //页面再次加载时调用计时器
      return;
    } else {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.asyncGetLocation().then(res => {
        const location = util.handleGCJToBaidu(res.latitude, res.longitude)
        this.latitude = location.latitude;
        this.longitude = location.longitude
        this.postCity(res);
        // this.firstPostList();
      }).catch(() => {
        this.firstPostList();
      });
      /**首次查询列表 */
    }

    /**
     * @deprecated 0.8
     * 会员卡查询
     *
     * */
    // let url = app.globalData.urlBase + "spread/mp/goods/findSuperCard";
    // util.http(url, {}).then(res => {
    //   console.log('首页会员卡详情---------', res.superCardList)
    //   this.setData({
    //     superCardList: res.superCardList,
    //     enterLoading: false
    //   })
    //   wx.setStorage({
    //     key: "superCardData",
    //     data: res.superCardList
    //   })
    // })
    /**
     * @deprecated 0.8
     * 热门城市查询
     * */

    // let hotCityUrl = app.globalData.urlBase + '/spread/mp/goods/promoteCity';
    // util.http(hotCityUrl, {
    //   tagSource: '1'
    // }).then(res => {
    //   if (res.errorCode === 9000) {
    //     this.setData({
    //       citiesArr: res.cityList
    //     })
    //   }
    // });



    /**查询已有会员卡类型-->根据卡类型-->首次查询列表 */
    // this.cardTypeQuery();

  },
  /**
   * 是否有可以兑换的卡券
   */
  queryCompletedTask() {
    const taskUrl = app.globalData.urlBase + 'spread/mp/cardTask/queryCompletedTask'
    util.http(taskUrl, {}).then(res => {
      if (res.errorCode == 9000 && res.taskStatus == 1) {

        this.noticeFlag = true
      }
    })
  },
  /**
   * 0.8
   * @deprecated
   */
  cardTypeQuery: function () {
    /** 已有会员卡查询*/
    let cardTypeUrl = app.globalData.urlBase + 'spread/mp/goods/superCardTypeInfo';
    util.http(cardTypeUrl, {}).then(res => {
      if (res.errorCode === 9000) {
        let goodsListPadTop = 100;
        if (res.cardTypeList.length === 1) {
          goodsListPadTop = 70;
        } !this.cardType && (this.cardType = res.cardTypeList[0].goodsType);
        let myCardList = wx.getStorageSync('myCardList');
        if (this.pageIndex >= 0 && (JSON.stringify(myCardList) === JSON.stringify(res.cardTypeList))) {
          if (this.goodsList) this.countDown() //页面再次加载时调用计时器
          return;
        } else {
          wx.pageScrollTo({
            scrollTop: 0
          })
          this.setData({
            goodsTab: res.cardTypeList,
            goodsListPadTop: goodsListPadTop
          })
          wx.setStorageSync('myCardList', res.cardTypeList);
          if (res.cardTypeList.length > 1) {

            // this.observerScroll();
            // var query = wx.createSelectorQuery(),
            //   that = this;
            // query.select('#cityNav').boundingClientRect().exec(res=>{
            //   this.cityNavHeight = res[0].height
            // })
            // query.select('#goodsNav').boundingClientRect();
            // query.selectViewport().scrollOffset();
            // query.exec(function(res) {
            //   console.log('res', res)
            //   if (that.data.goodsNavmenuTop === 0) {
            //     that.goodsNavHeight = res[1].height
            //     that.setData({
            //       goodsNavmenuTop: res[1].top,
            //     })
            //   }
            // });
          }
          /**首次查询列表 */
          this.firstPostList();
        }
      }
    })

  },
  firstPostList: function () {
    /**首次商品列表查询 */
    this.pageIndex = 0
    this.postListData().then(res => {
      this.hasMoreData = res.results.length === this.pageSize
      wx.setStorageSync("recommendList", res.results)
      this.goodsList = res.results
      this.setData({
        // recommendData: res.results,
        listLoading: false
      })
      this.countDown();
    })
  },
  onHide: function () {
    clearTimeout(this.timeOut)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.hasMoreData) {
      this.setData({
        listLoading: false
      })
      return false
    }
    this.pageIndex++;
    this.postListData().then(res => {
      console.log("findAll-------length-------", res.results.length)
      this.hasMoreData = res.results.length === this.pageSize
      this.goodsList = this.data.recommendData.concat(res.results)
      this.countDown()
      this.setData({
        listLoading: false
      })
    })
  },
  // 首页数据
  postListData: function () {
    this.setData({
      listLoading: true
    })
    let _this = this;
    let url = app.globalData.urlBase + "spread/mp/goods/findAll";
    //this.type
    let city = wx.getStorageSync('chosenCity') || '杭州'
    console.info('this.pageIndex', this.pageIndex)
    return util.http(url, {
      goodsTag: "2",
      tagSource: "1",
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      shopModeType: this.shopModeType,
      // goodsType: this.goodsType,
      lat: this.latitude,
      lon: this.longitude,
      goodsName: this.goodsName,
      city: city
      // cardType: this.cardType
    })
  },
  onNavToGoodsDetail: function (e) {
    let param = util.stringifyParams({
      goodsId: e.target.dataset.goodsid,
      goodsType: e.target.dataset.goodstype
    })
    // wx.navigateTo({
    //   url: '/pages/index/ticket/ticket-detail/ticket-detail' + param
    // });
  },
  choseCity: function (e) {
    let city = e.currentTarget.dataset.city;
    city = city.indexOf('市') > -1 ? city : city + '市';
    let province = e.currentTarget.dataset.province;
    wx.navigateTo({
      url: '/pages/index/index-more/index-more?city=' + city + '&province=' + province,
    })
  },
  choseCardType: function (e) {
    let type = e.currentTarget.dataset.type,
      index = e.currentTarget.dataset.index;
    this.setData({
      activeTabIndex: index
    })
    this.cardType = type;
    this.pageIndex = 0;
    this.setData({
      recommendData: [],
      listLoading: true
    })
    this.postListData().then(res => {

      this.hasMoreData = res.results.length === this.pageSize
      this.goodsList = res.results //切换选项卡的时候更新倒计时数据
      this.countDown()
      this.setData({
        // recommendData: res.results,
        listLoading: false,
        goodsNavFixed: false
      })
    })
  },
  /**分段器切换 */
  segmentChange: function (e) {
    console.info('e', e)
    const item = e.detail.item
    console.info('item', item)
    this.shopModeType = item.id
    this.goodsType = item.goodsType
    this.pageIndex = 0
    this.postListData().then(res => {

      this.hasMoreData = res.results.length === this.pageSize
      this.goodsList = res.results
      this.countDown()//切换选项卡的时候更新倒计时数据
      this.setData({
        listLoading: false,
        goodsNavFixed: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.query = wx.createSelectorQuery();
    this.query.select('.segment-sticky').boundingClientRect()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.timeOut)
    clearInterval(this.unpaidInterval)
  },
  onPageScroll: function (e) {
    var that = this;
    //that.data.cityNavmenuTop  281
    //that.data.goodsNavmenuTop  850
    // console.log(that.data.cityNavmenuTop + '-' + that.data.goodsNavmenuTop);
    if (that.data.cityNavmenuTop === 0) {
      return false;
    }
    // if (e.scrollTop > 281) {
    //   that.setData({
    //     cityNavFixed: true
    //   })
    // } else {
    //   that.setData({
    //     cityNavFixed: false
    //   })
    // }
    this.setData({
      scrollTop: e.scrollTop,
      scrollIng: true,
      fabFloat: true
    })
    let timer = setTimeout(() => {
      if (this.data.scrollTop === e.scrollTop) {
        this.setData({
          scrollTop: e.scrollTop,
          scrollIng: false,
          fabFloat: false
        })
        clearTimeout(timer)
      }
    }, 300)

    // this.query.exec(res => {
    //   const isSatisfy = res[0].top <= this.data.cityNavHeight ? true : false;
    //   if (this.data.isFixedTop !== isSatisfy) {
    //     this.setData({
    //       isFixedTop: isSatisfy
    //     });
    //   }
    // });
    // const scrollTop = e.scrollTop - (that.cityNavHeight + that.goodsNavHeight + that.statusBarHeight)
    // const goodsNavFixed = scrollTop > that.data.goodsNavmenuTop
    // if (goodsNavFixed != that.data.goodsNavFixed){
    //     that.setData({
    //       goodsNavFixed
    //     })

    // }

    // if (scrollTop >= that.data.goodsNavmenuTop) {
    //   that.setData({
    //     goodsNavFixed: true
    //   })
    // } else {
    //   that.setData({
    //     goodsNavFixed: false
    //   })
    // }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    this.postAllData();
    this.firstPostList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 600);
  },
  swiperCurIndexChange: function (e) {
    let specialSwiperCurIndex = e.detail + 1;
    this.setData({
      specialSwiperCurIndex
    })
  },

  /**点击广告链接 */
  clickAd: function (e) {
    wx.showLoading({
      title: '正在跳转'
    })
    let { id, url } = e.currentTarget.dataset
    let targetUrl = url
    const exp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
    if (exp.test(url)) { //匹配是否外链
      url = encodeURIComponent(url)
      targetUrl = `/pages/common/webview-link/webview-link?url=${url}`
    }
    const apiUrl = app.globalData.urlBase + "spread/mp/goods/clickAd"
    if (targetUrl === '/pages/tabBar/recordedLesson/index') {
      wx.switchTab({
        url: targetUrl
      });
    } else {
      wx.navigateTo({
        url: targetUrl
      })
    }

    util.http(apiUrl, { adId: id }).then(res => {
      console.log('点击广告', res)
      wx.hideLoading();

    }).catch(err => {
      wx.hideLoading();
    })

  },
  handleClose: function () {
    this.setData({
      vshow: false,
    });
  },
  dialogAdClose: function () {
    this.setData({
      dialogAdShow: false
    })
  },
  showOrderTip(hasAppointOfWaitGpsVerify) {
    const dateTime = util.getNowFormatDate()
    if (hasAppointOfWaitGpsVerify) {
      const date = wx.getStorageSync('indexOrderTip');
      if (date != dateTime) {
        wx.setStorage({
          key: 'indexOrderTip',
          data: util.getNowFormatDate(),
        })
        this.setData({
          vshow: true
        })

      }
    } else {
      if (this.data.dialogAd) {
        const dialogAd = wx.getStorageSync('dialogAd');
        if (dialogAd != dateTime) {
          wx.setStorage({
            key: 'dialogAd',
            data: util.getNowFormatDate(),
          })
          this.setData({
            dialogAdShow: true
          })
        }
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

  observerScroll() {
    wx.createIntersectionObserver().disconnect()
    wx.createIntersectionObserver().relativeToViewport({ top: -this.data.cityNavHeight }).observe('#goodsType', (res => {
      const { top } = res.boundingClientRect;
      if (top > 520) {
        return
      }
      const isFixedTop = res.intersectionRatio > 0 ? false : true;
      if (this.data.isFixedTop !== isFixedTop) {
        this.setData({
          isFixedTop,
        })
      }

    }));
  },
  countDown() {//倒计时函数
    clearTimeout(this.timeOut)
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime() / 1000;
    let endTimeList = this.goodsList;
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      if (o.advanceSale == 1) {
        let endTime = o.countdown;
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
          let time = (endTime - newTime);
          // 获取天、时、分、秒
          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          obj = {
            day: util.padFormat(day),
            hou: util.padFormat(hou),
            min: util.padFormat(min),
            sec: util.padFormat(sec)
          }
        } else {//活动已结束，全部设置为'00'
          obj = {
            day: '00',
            hou: '00',
            min: '00',
            // sec: '00'
          }
        }
        o.countDown = obj
      }

    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ recommendData: endTimeList })
    this.timeOut = setTimeout(this.countDown, 1000);
  },
  onNavToPrivilege() {
    wx.navigateTo({
      url: '/pages/mine/privilege/privilege',
    });
  },
  //获取位置信息
  getLocationInfo() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          resolve(res)
        },
        fail(res) {
          resolve(res)
        }
      });
    });
  },
  // 获取授权的位置信息
  asyncGetLocation: function() {
    let _this = this,
      locationObj = {};
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: "wgs84",
        success: res => {
          locationObj = res;
          console.info("成功获取了Location:", res)
          resolve(locationObj)
        },
        fail: res => {
          console.info("拒绝授权Location:", res)
          wx.showModal({
            content: '闪闪课堂需要您的地理位置授权',
            confirmText: '去开启',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.userLocation'] === true) {
                      _this.startLoadData();
                    } else {
                      console.log('拒绝授权');
                    }
                  }
                })
              } else if (res.cancel) {
                reject();
              }
            }
          })
        }
      })
    })
  }
})
