// custom-tab-bar/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    active: {
      type: String,
      value: 'index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 'index',
    list: [{
        'pagePath': '/pages/tabBar/index/index',
        'icon': 'iconicon_tab_sy',
        'title': '首页',
        'page': 'index'
      },
      {
        'pagePath': '/pages/order/order',
        'icon': 'iconicon_tab_dd',
        'title': '订单',
        'page': 'order'
      },
      {
        'pagePath': '/pages/trade/trade',
        'icon': 'iconicon_tab_hy',
        'title': '会员',
        'page': 'trade'
      },
      {
        'pagePath': '/pages/mine/mine',
        'icon': 'iconicon_tab_wd',
        'title': '我的',
        'page': 'mine'
      }
    ],
    isIphoneX:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchToIndex: function(e) {
   
      
      wx.switchTab({
        url: '/pages/tabBar/index/index'
      })
    },
    switchToOrder: function() {
    
     
      wx.switchTab({
        url: '/pages/order/order'
      })
    },
    switchToMember: function() {
      let userInfo = wx.getStorageSync('g_userInfo');
      if (userInfo.registStatus === 0) {
        wx.navigateTo({
          url: '/pages/index/playcard/playcard?cardIndex=0'
        })
      } else {
        wx.switchTab({
          url: '/pages/trade/trade'
        })
      }
    },
    switchToMine: function() {
     
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }
  },
  lifetimes: {
    created: function() {
       
    },
    attached: function() {
      let _this = this;
      wx.getSystemInfo({
        success: function (res) {
          if (res.model.search('iPhone X') != -1) {
            console.log('x')
            _this.setData({
              isIphoneX: true
            })
          }
        },
      }) 
    }
  }
})
