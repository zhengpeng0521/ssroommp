// pages/index/address/address.js
var app = getApp()
const util = require("../../../utils/util")
import cities from './city.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: cities.city,
    letterArr: [],
    toView: 'hot',
    hotCities: ['北京', '常德', '常州', '成都', '大连', '广州', '杭州', '衡阳', '南京', '上海', '邵阳', '深圳', '苏州', '武汉', '长沙', '重庆'],
    activeIndex: 0,
    positionCity: '杭州',
    searchContext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let letterArr = ['hot'],
    chosenCity = wx.getStorageSync('chosenCity');
    cities.city.map((item) => {
      letterArr.push(item.title);
    })
    this.setData({
      letterArr: letterArr
      // positionCity: chosenCity
    })
    let hotCityUrl = app.globalData.urlBase + '/spread/mp/goods/promoteCity';
    util.http(hotCityUrl, {
      tagSource: '1'
    }).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          hotCities: res.cityList
        })
        this.asyncGetLocation().then(res => {
          const location = util.handleGCJToBaidu(res.latitude, res.longitude)
          this.latitude = location.latitude;
          this.longitude = location.longitude
          this.postCity(res);
        })
      }
    });
    const value = wx.getStorageSync('search_record')
    if (value) {
      this.setData({
        searchRecord: JSON.parse(value)
      })
    }
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
      this.setData({
        positionCity: res.city
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  getSearchContext(e) {
    let city = e.detail.value;
    var cityList = this.data.cityList;
    this.setData({
      searchContext : city
    })
    var searchArr = [];
    cityList.forEach(item =>{
      var citylist = item.lists;
      citylist.forEach(value => {
        if(value.indexOf(city) >= 0){
          searchArr.push(value);
        }
      })
      if(item.title === city.toUpperCase()) {
        searchArr.push(...citylist)
      }
    })
    if(searchArr){
      this.setData({
        searchResult : searchArr
      })
    }
  },
  // 获取历史记录数据
  getRecordData(city) {
    if (city) {
      const value = wx.getStorageSync('search_record')
      const record = value ? JSON.parse(value) : []
      if (record.indexOf(city) == -1) {
        record.unshift(city)
      }
      const newValue = record.slice(0, 9)
      wx.setStorage({
        key: 'search_record',
        data: JSON.stringify(newValue)
      })
      this.setData({
        searchRecord: newValue
      })
    }
  },
  choseLetter: function(e) {
    let letter = e.currentTarget.dataset.letter,
      index = e.currentTarget.dataset.index;
    this.setData({
      toView: letter,
      activeIndex: index
    })
  },
  touchStart: function(e) {
    this.startPageY = e.changedTouches[0].pageY;
    this.startIndex = e.currentTarget.dataset.index;
    console.log(this.startIndex);
    console.log('滑动开始');
  },
  touchMove: function(e) {
    let letterHeight = 20;
    let endIndex = this.startIndex + Math.floor((e.changedTouches[0].pageY - this.startPageY) / letterHeight);
    let letterArr = this.data.letterArr;
    if (endIndex <= 0) {
      endIndex = 0;
    }
    if (endIndex >= letterArr.length - 1) {
      endIndex = letterArr.length - 1;
    }
    this.setData({
      toView: letterArr[endIndex],
      activeIndex: endIndex
    })
  },
  choseCity: function(e) {
    let city = e.currentTarget.dataset.city;
    this.getRecordData(city)
    this.prevPageCitySearch(city)
  },
  prevPageCitySearch: function(city) {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    wx.setStorageSync('chosenCity', city);
    // prevPage.acceptCity(city);
    prevPage.setData({
      locationCity:city
    },function(){
      wx.navigateBack()
    })
    // wx.navigateBack({
    //   delta: 1
    // })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
