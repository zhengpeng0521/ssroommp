// component/shop-info/shop-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    indexOfCurrentDevice: false,
    indexOfCurrentAddress: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onNavToShopDetail(){
      console.info('component1 =>', this.data);
      let lat = this.properties.shopData.lat;
      let lng = this.properties.shopData.lng;
      this.setData({
        indexOfCurrentDevice: true
      });
      setTimeout(() => {
        console.info('component2 =>', this.data);
        wx.navigateTo({
          url: '/pages/index/ticket/ticket-detail/shop-detail/shop-detail?lat=' + lat + '&lng=' + lng
        });
        this.setData({
          indexOfCurrentDevice: false
        });
      }, 100);
    },

    onPhoneCall(){
      wx.makePhoneCall({
        phoneNumber: this.properties.shopData.mobile
      })
    },

    onOpenMap(){
      this.setData({
        indexOfCurrentAddress: true
      });
      setTimeout(() => {
        wx.openLocation({
          latitude: Number(this.properties.shopData.lat),
          longitude: Number(this.properties.shopData.lng),
          scale: 15,
          name: this.properties.shopData.shopName,
          address: this.properties.shopData.shopAddress
        });
        this.setData({
          indexOfCurrentAddress: false
        });
      }, 100);
    }
  }
})
