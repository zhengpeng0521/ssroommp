// pages/index/index-more/index-more.js
const app = getApp()
const util = require("../../../utils/util")
const type_901 = [
  { id: 1, name: '线下教培', goodsType: 103 },
  { id: 2, name: '线上教培',goodsType:103 },
  { id: '', name: '玩乐优选', goodsType: 101 },
]
const type_905 = [
  { id: 1, name: '线下教培', goodsType: 103 },
  { id: 2, name: '线上教培',goodsType:103 },
]
const type_906 = [
  { id: '', name: '医美', goodsType:102 }
]
const segmentData = {
  901: type_901,
  902: type_901,
  905: type_905,
  906: type_906
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendData: [],
    btnTxt: '会员免费',
    selectArr: [],
    sliderShowBool: false,
    province: '浙江',
    locationCity: '杭州',
    district: '',
    selectedTitleIndex: 0,
    noData: false,
    listLoading: true,
    goodsTypeTitle: '商品类型',
    cardTypeTitle: '卡类型',
    activeTabIndex: 0,
    cardTypeSlideShow: false,
    activeBuyCardIndex: 0,
    region: ['浙江省', '杭州市', ''],
    disabled: false,
    segmentData:segmentData['901'],
    keyword: '' // 搜索关键词
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let chosenCity = options.city;
    let province = options.province;
    this.province = province;
    this.options = options;
    this.goodsType = options.typeNum
    this.shopModeType = 1;
    if (this.goodsType == 103) { //从使用券进来
      this.shopModeType = 2
      this.setData({
        goodsTypeTitle: '课程',
        disabled: true,
        currentActive: 0,
        segmentData: [
          { id: 2, name: '线上教培',goodsType: 103 },
          { id: 1, name: '线下教培',goodsType: 103 }
        ]
      })
    }
    if (options.showOnlineEdu === 'false') {  //如果存在showOnlineEdu并且为false
      let newData = [...this.data.segmentData]
      // 去掉线上教培
      if (this.goodsType == 103) { //从使用券进来
        newData.splice(0, 1)
      } else { 
        newData.splice(1, 1)
      }
      
      this.shopModeType = 1
      this.setData({
        segmentData:newData
      })
    }
    this.goodsType = 103
    wx.setStorageSync('chosenCity', chosenCity);
    // this.setData({})
    this.queryMineSuperCard()
    this.startLoadData();
  },

  onShow: function() {

  },
  startLoadData: function() {
    let userInfo = wx.getStorageSync('g_userInfo'),
      locationCity = wx.getStorageSync('chosenCity');
    if (locationCity) {
      this.setData({
        locationCity: locationCity
      })
    }
    if (userInfo.vipLevel > 1) {
      this.setData({
        btnTxt: '立即预约'
      })
    }
    this.pageIndex = 0;
    this.pageSize = 10;
    this.hasMoreData = true;



    this.asyncGetLocation().then(res => {
      const location = util.handleGCJToBaidu(res.latitude, res.longitude)
      this.lat = location.latitude;
      this.lon = location.longitude
      this.postCity(res);
    }).catch(() => {
      this.firstPostList();
    });
  },
  queryMineSuperCard: function(cardOwnerStatus) {

    let url = app.globalData.urlBase + '/spread/mp/goods/findCardForMorePage',
      _this = this;
    return util.http(url, {
      cardOwnerStatus
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
  },
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
          success(res) {
            let province = null,
              city = null;
            if (res.confirm) {
              province = res.province;
              city = res.resCity;
              wx.setStorageSync('chosenCity', city)
            } else if (res.cancel) {
              province = _this.province;
              city = chosenCity;
            }
            _this.setData({
              locationCity: city,
              region: [province, city, '全部']
            })
            _this.firstPostList();
          }
        })
      } else {
        _this.setData({
          locationCity: chosenCity || resCity,
          region: [_this.province || res.province, chosenCity || resCity, '全部']
        })
        _this.firstPostList();
      }
    })
  },
  firstPostList: function() {
    this.queryMineSuperCard().then(res => {
      if (res.errorCode === 9000) {
        if (!this.cardType) {
          let myCard = res.cardList.filter(item => {
            return item.customerHasCurrentCard == 1;
          })
          let notMyCard = res.cardList.filter(item => {
            return item.customerHasCurrentCard != 1;
          })
          let selectedCard = notMyCard[0];
          if (myCard.length > 0) {
            selectedCard = myCard[0];
          }
          this.cardType = selectedCard.goodsType;
          this.setData({
            cardTypeTitle: selectedCard.spuName
          })
        }
        this.setData({
          goodsTab: res.cardList
        })
        this.postListData().then((res) => {
          this.hasMoreData = res.results.length === this.pageSize;
          this.goodsList = res.results;
          this.countDown();
          
          this.setData({
            // recommendData: res.results,
            listLoading: false,
            noData: !res.data || res.data.pageCount === 0
          })
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  sliderShow: function(e) {

    let typeName = e.currentTarget.dataset.parameter,
      selectArr = [];
    if (typeName === 'cardType') {
      this.setData({
        sliderShowBool: !this.data.sliderShowBool,
        selectArr: this.selectArr
      })
    }
    if (typeName === 'goodsType') {
      if (this.options.typeNum == 103) return;
      selectArr = [{
        title: '全部',
        type: 'goodsType',
        typeNum: ''
      }, {
        title: '门票',
        type: 'goodsType',
        typeNum: '101'
      }, {
        title: '消费卡',
        type: 'goodsType',
        typeNum: '102'
      }, {
        title: '课程',
        type: 'goodsType',
        typeNum: '103'
      }];
      this.setData({
        sliderShowBool: !this.data.sliderShowBool,
        cardTypeSlideShow: false,
        selectArr: selectArr
      })
    }
  },
  closeSlide: function() {
    this.setData({
      sliderShowBool: false,
      cardTypeSlideShow: false
    })
  },
  addressChange: function(e) {
    let address = e.detail.value;
    this.province = address[0];
    this.city = address[1];
    this.district = address[2];
    this.pageIndex = 0;
    this.setData({
      locationCity: this.city === '全部' ? '' : this.city,
      recommendData: [],
      selectedTitleIndex: 0,
      province: this.province === '全部' ? '' : this.province,
      district: this.district === '全部' ? '' : this.district,
      region: [this.province, this.city, '全部']
    })
    wx.setStorageSync('chosenCity', this.city);
    this.firstPostList();
  },
  tabFilter: function(e) {
    let obj = e.currentTarget.dataset,
      index = obj.index,
      type = obj.type,
      para = obj.para,
      title = obj.title;

    if (type === 'goodsType') {
      this.goodsType = para || 0;
      this.setData({
        goodsTypeTitle: para ? title : '商品类型'
      })
    }

    this.pageIndex = 0;
    this.setData({
      sliderShowBool: false,
      recommendData: []
    })
    this.firstPostList();
  },
  choseCardType: function(e) {
    let type = e.currentTarget.dataset.type,
      index = e.currentTarget.dataset.index,
      cardName = e.currentTarget.dataset.title;
    this.cardType = type;
    
    this.pageIndex = 0;
    const segData = segmentData[this.cardType]?segmentData[this.cardType]:segmentData[901]
    this.setData({
      cardTypeSlideShow: false,
      cardTypeTitle: cardName,
      segmentData: segData,
      currentActive:0
    })
    this.shopModeType = segData[0]['id']
    this.goodsType = segData[0]['goodsType']
    this.firstPostList();
  },
  choseAllOrBuy: function(e) {
    let cardOwnerStatus = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    this.queryMineSuperCard(cardOwnerStatus).then(res => {
      this.setData({
        goodsTab: res.cardList,
        activeBuyCardIndex: index
      })
    })
  },
  handleInput (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  goodsNameSearch: function() {
    this.goodsName = this.data.keyword;
    this.firstPostList();
  },
  cardTypeSlideShowAct: function() {
    this.setData({
      cardTypeSlideShow: !this.data.cardTypeSlideShow,
      sliderShowBool: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.hasMoreData || this.noData) {
      this.setData({
        listLoading: false
      })
      return false;
    }
    this.pageIndex++;
    this.postListData().then((res) => {
      this.hasMoreData = res.results.length === this.pageSize;
      this.timeOut && clearTimeout(this.timeOut);
      this.goodsList = this.data.recommendData.concat(res.results);
      this.countDown();
      this.setData({
        // recommendData: this.data.recommendData.concat(res.results),
        listLoading: false
      })
    })
  },
  postListData: function() {
    this.setData({
      listLoading: true
    })
    let city = wx.getStorageSync('chosenCity') || '杭州',
      url = app.globalData.urlBase + '/spread/mp/goods/queryMoreGoods';

    let params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      province: this.province === '全部' ? '' : this.province,
      city: city === '全部' ? '' : (city.indexOf('市') > 0 ? city : city + '市'),
      district: this.district === '全部' ? '' : this.district
    }
    if (this.options.ruleId) { 
      params.ruleId = this.options.ruleId;
    }
    // if (this.goodsType) {
    //   params.goodsType = this.goodsType;
    // }
    if (this.cardType) {
      params.cardType = this.cardType;
    }
    // if (this.shopModeType) {
    //   params.shopModeType = this.shopModeType
    // }
    if (this.goodsName) {
      params.goodsName = this.goodsName;
    }
    if (this.lat || this.lon) {
      params.lat = this.lat;
      params.lon = this.lon;
    }
    return util.http(url, params)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.timeOut && clearTimeout(this.timeOut)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.timeOut)
  },
  segmentChange: function (e) { 
    const item = e.detail.item
    this.shopModeType = item.id
    this.goodsType = item.goodsType
    this.pageIndex = 0;
    this.firstPostList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.hasMoreData = true;
    this.pageIndex = 0;
    this.postListData().then(res => {
      if (res.errorCode === 9000) {
        this.hasMoreData = res.results.length === this.pageSize;
        this.timeOut && clearTimeout(this.timeOut);
        this.countDown();
        // this.setData({
        //   recommendData: res.results
        // })
      }
      wx.stopPullDownRefresh();
    })
  },

  countDown() {//倒计时函数
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
