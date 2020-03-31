// pages/distribution/index/index.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    banner: [],
    region: ['浙江省', '杭州市', ''],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.province = '浙江省'
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
    this.getBanner()
    this.startLoadData();
  },
  /**
   * 获取banner
   */
  getBanner() { 
    const url = app.globalData.urlBase + 'spread/mp/goods/findCardForMorePage'
    util.http(url, {}).then(res => { 
      this.setData({
        banner:res.cardList
      })
    })
  },
  
  /**
   * 获取商品列表
   */
  getGoodsList() { 
    this.setData({
      listLoading: true
    })
    const url = app.globalData.urlBase + 'spread/mp/drp/goods/findAll'
    let city = wx.getStorageSync('chosenCity') || '杭州'
    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      province: this.province === '全部' ? '' : this.province,
      city: city === '全部' ? '' : (city.indexOf('市') > 0 ? city : city + '市'),
      district: this.district === '全部' ? '' : this.district
    }
    if (this.goodsName) {
      params.spuName = this.goodsName;
    }
    return util.http(url, params)
  },
  firstPostList() { 
    this.getGoodsList().then(res => { 
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        distributorFlag:res.distributorFlag,
        list: res.results,
        listLoading: false,
        noData: !res.data || res.data.pageCount === 0
      })
    }).catch(err => { 
      this.setData({
        distributorFlag:false,
        list: [],
        listLoading: false,
        noData: true
      })
    })
  },
  addressChange(e) { 
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
  startLoadData: function () {
    this.setData({
      listLoading: true
    })
    const locationCity = wx.getStorageSync('chosenCity');
    if (locationCity) {
      this.setData({
        locationCity: locationCity
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
      this.firstPostList()
    });
  },
  // 获取授权的位置信息
  asyncGetLocation: function() {
    let  locationObj = {};
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
            content: '惠吧需要您的地理位置授权',
            confirmText: '去开启',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.userLocation'] === true) {
                      // this.startLoadData()
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
    let url = app.globalData.urlBase + "spread/mp/goods/shopLocation"
    const location = util.handleGCJToBaidu(e.latitude, e.longitude)
    util.http(url, {
      lat: location.latitude,
      lon: location.longitude
    }).then((res) => {
      let chosenCity = wx.getStorageSync('chosenCity');
      let resCity = res.city;
      if (!this.province && chosenCity && resCity.indexOf(chosenCity) === -1) {
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
              province = this.province;
              city = chosenCity;
            }
            this.setData({
              locationCity: city,
              region: [province, city, '全部']
            })
            this.firstPostList()
          }
        })
      } else {
        this.setData({
          locationCity: chosenCity || resCity,
          region: [this.province || res.province, chosenCity || resCity, '全部']
        })
        this.firstPostList()
      }
    })
  },
  goodsNameSearch: function(e) {
    let val = e.detail.value;
    this.goodsName = val;
    this.firstPostList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.hasMoreData = true;
    this.pageIndex = 0;
    this.getGoodsList().then(res => {
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
    this.getGoodsList().then(res => {
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