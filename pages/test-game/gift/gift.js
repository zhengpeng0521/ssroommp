// pages/test-game/gift/gift.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    pay: 0.00,
    amount: '',
    count: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('g_userInfo')
    this.setData({
      userInfo
    })
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
  submit() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/create'
    const data = {
      pageSize:10
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          question:res.results
        })
      }
    })
  },
  handleNumber(e) {
    const number = e.detail.value
    const minAmount = Number(this.data.amount/number).toFixed(2)
    if (minAmount < 0.1) { 
      const money = 0.1*number
      this.setData({
        amount:money,
        pay: Number(money * (1 + 0.02)).toFixed(2),
      })
      wx.showModal({
        title: '提示',
        content: `红包最低金额不得小于0.1元，已调整金额为${money}元`,
        showCancel: false,
        confirmText: '确定',
      });
    }
  },
  handleBlur(e) { 
    const pattern = new RegExp(/^(([1-9][0-9]*)|([0-9]+\.[0-9]{1,2}))$/)
    const money = e.detail.value
    if (pattern.test(money) && money >= 0.1) {
      this.setData({
        amount:money,
        pay: Number(money * (1 + 0.02)).toFixed(2),
      })
    } else { 
      this.setData({
        amount:''
      })
      wx.showToast({
        title: '最小金额为0.1',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  handleCount(e) { 
    const pattern = new RegExp(/^([0-9]|10)$/)
    const count = e.detail.value
    if (!pattern.test(count)) { 
      wx.showToast({
        title: '答对题数必须是0-10之间',
        icon: 'none',
      });
      this.setData({
        count:''
      })
    }
  },
  formSubmit: function (e) {
    this.form = e.detail.value
    if (!this.form.awardTotalAmount || !this.form.minAnswerCount || !this.form.awardNumber) { 
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
      return
    }
    this.createOrder().then(res => {
      if (res.errorCode === 9000) {
        console.log(res)
        this.params = {}
        this.params.id = res.topicId
        this.params.amount = this.form.awardTotalAmount
        const url = app.globalData.urlBase + 'spread/mp/promotion/topic/pay';
        util.http(url, {
          id: this.params.id
        }).then(this.processPay)
      } else {
        wx.hideLoading({
          success() {
            wx.showModal({
              title: '提示',
              content: res.errorMessage,
              showCancel:false
            })
          }
        });
      }
    })
  },
  createOrder: function() {
    wx.showLoading();
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/create';
    
    return util.http(url, {
      question: this.options.question,
      payAmount:this.data.pay,
      ...this.form
    })
  },
  processPay: function (data) {
    console.log(data);
    let self = this;
    if (data.errorCode === 9000) {
      let params = util.stringifyParams(this.params);
      const url = "/pages/test-game/game-share/game-share" + params
      this.url = url
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.packages,
        signType: data.signType,
        paySign: data.paySign,
        success: function (res) {
          wx.hideLoading();
          if (wx.requestSubscribeMessage) {
            self.subscribeMessage()
          } else { 
            wx.reLaunch({
              url:this.url
            })
          }
          
        },
        fail: function (res) {
          wx.hideLoading();
          console.info("取消支付：", res)
        }
      })
    } else {
      wx.showToast({
        title: data.errorMessage,
        icon: "none",
        duration: 1000
      })
    }
  },
  subscribeMessage() { 
    wx.requestSubscribeMessage({
      tmplIds: ['wS4PMcXDxxJP1ovsTCYRFZ57im80wNqhB5iEb6084wQ','IEa5d1oSbZzrZYn2Y2TO-TugsYwO8sRJYVswYo1_JHc','_mDNMYNWvC3tlN2h1qOF7P-criHo7vbRlie9lrldZfI'],
      success:(res)=>{
        wx.reLaunch({
          url:this.url
        })
      },
      fail: (err) => {
        wx.reLaunch({
          url:this.url
        })
        wx.showModal({
          title: '提示',
          content: '打开订阅消息有助于及时接受通知',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log('成功', res)
                },
                fail(res){
                  console.log('失败', res)
                }
              })
            } else if (res.cancel) {
              reject('用户拒绝了');
            }
          }
        })
      }
    })
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

})