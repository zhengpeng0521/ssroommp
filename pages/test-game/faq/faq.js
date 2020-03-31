// pages/test-game/faq/faq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const qusetions = [{
        'title': '怎么玩',
        'results': '用户可在本平台内出题，并在出题完成后设置答对后的奖励红包。'
      },
      {
        'title': '未被领取的金额什么时候退款？',
        'results': '出题24小时后题目将终止答题，届时系统会将未被领取金额退还至本系统余额中，用户进入“我的钱包”页进行提现。'
      },
      {
        'title': '如何查看出题记录和答题记录？',
        'results': '小程序首页点击“出题记录”，“答题记录”'
      },
      {
        'title': '如何查看题目答案',
        'results': '因涉及奖励红包，故本系统不支持查看好友出题的正确答案'
      },
      {
        'title': '是否可以重新回答',
        'results': '目前不支持重新回答'
      },
      {
        'title': '为什么提现会失败',
        'results': '提现失败可能有两类原因：一、提现微信号未进行实名，微信限制未实名微信号进行提现。二、提现金额小于0.3元，微信限制单次提现金额最少0.3元'
      },



    ];
    this.slideArr = [];
    qusetions.forEach((item, index) => {
      // if (index === 0) {
      //   this.slideArr.push(true)
      // } else {
      //   this.slideArr.push(false)
      // }
      this.slideArr.push(false)
    })
    this.setData({
      qusetions: qusetions,
      slide: this.slideArr
    })
  },
  slideAction: function(e) {
    let index = e.currentTarget.dataset.index;
    this.slideArr[index] = !this.slideArr[index];
    console.log(this.slideArr);
    this.setData({
      slide: this.slideArr
    })
  },
  goHome() { 
    wx.reLaunch({
      url: '/pages/test-game/game-index/game-index',
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})