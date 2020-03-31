// pages/test-game/answer-question/answer-question.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:0,
    selected: '',
    showSubmit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.aid = ''
    this.selectedQuestionId = []
    this.question = []
    this.flag = false
    
  },
  getList() { 
    this.aid = ''
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/questionList'
    let selectedQuestionId = ""
    
    const data = {
      pageSize:10
    }
    if(this.selectedQuestionId){
      data.selectedQuestionId = this.selectedQuestionId.join(',')
    } 
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        if (res.results.length > 0) { 
          this.flag = true
        }
        this.setData({
          question:res.results
        })
      }
    })
  },
  select(e) { 
    const data = e.currentTarget.dataset
    this.aid = data.aid
    this.qid = data.qid
    this.setData({
      selected:data.aid
    })
  },
  next() { 
    if(this.aid === ''){
      wx.showToast({
        title: '请选择答案',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.selectedQuestionId.push(this.qid)
    this.question.push({'question':this.qid,'answer':this.aid})
    this.aid = '';
    this.setData({
      show:this.data.show+1
    })
    if (this.selectedQuestionId.length >= 9) { 
      this.setData({
        showSubmit:true
      })
      return;
    }
    
  },
  change() { 
    this.getList()
  },
  submit() {
    if(this.aid === ''){
      wx.showToast({
        title: '请选择答案',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.question.push({ 'question': this.qid, 'answer': this.aid })
    console.log(this.question.length)
    wx.redirectTo({
      url: '/pages/test-game/gift/gift?question=' + JSON.stringify(this.question),
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {
    // if (wx.getStorageSync('token') === "") {
    //   var promise = util.loginByCode()
    //   promise
    //     .then(this.handleProcess)
    // } else {
    //   this.handleProcess()
    // }
    this.getList()
  },
  handleProcess() { 
    const user = wx.getStorageSync("g_userInfo")
    if (user.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return;
    } else { 
      if(!this.flag)this.getList()
      
    }
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