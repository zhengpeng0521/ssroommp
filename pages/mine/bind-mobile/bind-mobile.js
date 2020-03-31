var app = getApp();
var util = require('../../../utils/util');

// pages/my/bind-mobile/bin-mobile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    reSendTip: false,
    reSendTime: 59
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.authCheck();
  },
  authCheck: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "/pages/index/get-auth/get-auth?type=userInfo"
          });
        }
      }
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
  getPhoneNumber: function(e) {
    this.encryptedData = e.detail.encryptedData;
    this.iv = e.detail.iv;
    var promise = new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          console.info("wx.login成功:", res)
          this.code = res.code
          resolve(res.code)
        },
        fail: res => {
          console.info(" wx.login失败：", res)
        }
      })
    })
    promise.then(util.postUserInfo)
      .then(util.processToken)
      .then(util.processAuthMess).then(this.getPhoneFunc);
  },

  getPhoneFunc: function(res) {
    console.log('-----------', this.encryptedData, this.iv);
    let url = app.globalData.urlBase + '/spread/mp/cust/fetchMobileByWx',
      _this = this;
    util.http(url, {
      encryptedData: this.encryptedData,
      iv: this.iv
    }).then((res) => {
      if (res.errorCode === 9000) {
        _this.mobile = true;
        _this.setData({
          mobile: res.mobile
        })
      } else {
        _this.mobile = false;
      }
    });

  },
  // 设置手机号
  onSetMobile: function(e) {
    console.info("输手机号了！", e);
    this.authCheck();
    let value = e.detail.value;
    // let reg = /^((?:13[0-9])|(?:14[5|7|9])|(?:15(?:[0-3]|[5-9]))|(?:16[6])|(?:17[0135678])|(?:18[0-9])|(?:19[189]))\\d{4}(\\d{4})$/;
    // let validate = reg.test(value);
    if (true) {
      this.data.mobile = value;
      this.mobile = true;
    } else {
      this.mobile = false;
      // wx.showToast({
      //   title: '请输入正确的手机号',
      //   icon: 'none',
      //   duration: 1000
      // });
    }
  },

  // 设置验证码
  onSetValidate: function(e) {
    console.info("输入验证码了！", e);
    let value = e.detail.value;
    let reg = /^\d{4}(\d{2})?$/;
    let validate = reg.test(value);
    if (validate) {
      this.data.validateCode = value;
      this.validate = true;
    } else {
      this.validate = false;
      // wx.showToast({
      //   title: '请输入正确的验证码',
      //   icon: 'none',
      //   duration: 1000
      // });
    }
  },

  // 点击获取验证码事件
  onObainValidate: function() {
    if (this.mobile) {
      let url = app.globalData.urlBase + '/sms/aliyun/sendVerifyCode';
      let param = {
        mobile: this.data.mobile
      };
      util.http(url, param).then(this.processSendValidate);
    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 发送手机号获取验证码
  processgetValidate: function(data) {
    console.info('验证码在此：', data);
    let url = app.globalData.urlBase + '/sms/aliyun/checkVerifyCode';
    let param = {
      mobile: this.data.mobile,
      verifyCode: data.verifyCode

    };
    util.http(url, param).then(this.processSendValidate);
  },

  // 将手机号和验证码发给后台
  processSendValidate: function(data) {
    let resCode = data.errorCode;
    if (resCode === 9000) {
      this.setData({
        reSendTip: true
      });
      let time = this.data.reSendTime;
      let timer = setInterval(() => {
        time -= 1;
        if (time === 0) {
          clearInterval(timer);
          this.setData({
            reSendTip: false,
            reSendTime: 59
          });
          return;
        }
        this.setData({
          reSendTime: time
        });
      }, 1000);
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 1000
      });
    } else {
      wx.showToast({
        title: data.errorMessage,
        icon: 'none',
        duration: 1000
      });
    }
  },

  onBindSubmit: function() {
    if (this.mobile && this.validate) {
      util.http(app.globalData.urlBase + '/sms/aliyun/checkVerifyCode', {
        mobile: this.data.mobile,
        verifyCode: this.data.validateCode
      }).then(this.bindMobile);

    } else {
      wx.showToast({
        title: '请输入正确的手机号和验证码',
        icon: 'none',
        duration: 1000
      });
    }
  },
  bindMobile: function(res) {
    if (res.errorCode === 9000) {
      let url = app.globalData.urlBase + '/spread/mp/cust/register';
      let _this = this;
      wx.getUserInfo({
        success: function(res) {
          let param = {
            mobile: _this.data.mobile,
            verifyCode: _this.data.validateCode,
            nickname: res.userInfo.nickName,
            sex: res.userInfo.gender,
            avator: res.userInfo.avatarUrl
          };
          util.http(url, param).then(_this.processSubmit);
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.errorMessage,
        showCancel: false
      })
    }
  },
  processSubmit: function(data) {
    console.info(data);
    if (data.errorCode === 9000) {
      app.globalData.g_userMobile = this.data.mobile;
      wx.showToast({
        title: '手机号绑定成功',
        icon: 'success',
        duration: 1000
      });
      let url = app.globalData.urlBase + '/spread/mp/auth/session';
      util.http(url, {}).then((res) => {
        if (res.errorCode === 9000) {
          let userInfo = res;
          wx.setStorageSync('g_userInfo', userInfo);
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
        }
      })
    } else {
      wx.showToast({
        title: data.errorMessage,
        icon: 'none',
        duration: 1000
      });
    }
  }

})