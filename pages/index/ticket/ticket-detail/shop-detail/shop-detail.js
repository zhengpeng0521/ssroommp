var app = getApp();
var util = require('../../../../../utils/util');

// pages/index/ticket/ticket-detail/shop-detail/shop-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: {},
    device: [],
    isLoading: true,
    animateOfAddress: null,
    animateOfPhone: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options;
    let url = app.globalData.urlBase + '/spread/mp/goods/getShop';
    let param = {
      shopId: this.options.shopId,
    };
    util.http(url, param).then(this.processShopData);
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      animateOfPhone: null,
      animateOfAddress: null
    });
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

  processShopData: function(data) {
    let arr = [{
        img: '/images/icon/shop-wifi.png',
        text: 'WIFI'
      },
      {
        img: '/images/icon/shop-parking.png',
        text: '停车劵'
      },
      {
        img: '/images/icon/shop-coffe.png',
        text: '休息区'
      },
      {
        img: '/images/icon/shop-jicun.png',
        text: '寄存区'
      }
    ];
    let tmp = [];
    let tmpArr = data.suppFac.split(',');
    for (let item of tmpArr) {
      item = Number(item) - 1;
      tmp.push(arr[item]);
    }
    data.imgs = data.imgs.split(',');
    this.setData({
      shopData: data,
      device: tmp,
      isLoading: false
    });
  },

  onOpenMap: function() {
    let _this = this;
    this.setData({
      animateOfAddress: true
    });
    setTimeout(() => {
      let lat = Number(_this.data.shopData.lat);
      let lng = Number(_this.data.shopData.lon);
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: _this.data.shopData.name,
            address: _this.data.shopData.address,
            fail: function(res) {
              console.log(res)
              wx.showToast({
                title: '经纬度不正确',
              })
            }
          });
        },
      })

    }, 100);

  },

  onPhoneCall: function() {
    this.setData({
      animateOfPhone: true
    });
    setTimeout(() => {
      wx.makePhoneCall({
        phoneNumber: this.data.shopData.tel
      })
    }, 100);
  }


})