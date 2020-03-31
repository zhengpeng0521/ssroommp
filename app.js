const util = require('/utils/util');
//app.js
App({
  onLaunch: function() {
    // wx.clearStorageSync();
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    util.updateMiniprogram();
  },
  onShow: function() {

  },
  globalData: {
    spreadLevel: {
      0: '会员',
      1: '小达人',
      2: '大团长'
    },
    // urlBase: 'http://192.168.1.218:8080/', //gjl
    // urlBase: 'http://192.168.3.51:8080/', //添饭
    // urlBase: 'http://192.168.1.48:8080/',  //笔记本添饭
    // urlBase: 'http://10.8.0.70:8080/', //王英语
    // urlBase: 'http://192.168.3.122:8080/', //liming
    // urlBase: 'http://192.168.43.14:8080/', //zj
    // urlBase: 'http://192.168.1.83:8080/', //李明

    urlBase: 'http://124.160.59.118:9981/', //外网测试地址
    // urlBase: 'http://192.168.1.56:9981/', //offline
    socketUrl: 'ws://192.168.1.56:9982/websocket/',
    qrcodeUrl: 'https://exp.mynatapp.cc/',

    // urlBase: 'https://ssmp.ishanshan.com/',
    // socketUrl: 'wss://ssmpshare.ishanshan.com/websocket/',
    // qrcodeUrl: 'https://ssmp.ishanshan.com/'
  }
})
