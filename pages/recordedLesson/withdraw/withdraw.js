// pages/recordedLesson/withdraw/withdraw.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true,
    ruleDialog:false,
    totalNum:'',
    inputValue:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getBenefitNum().then((res) => {
      this.setData({
        totalNum: res.benefitOverview.freeBenefit,
      })
    });
  },

  /* 获取可提现金额 */
  getBenefitNum:function(){
    let params = { }
    const url = app.globalData.urlBase + 'spread/mp/drp/benefit/queryBenefitOverview'
    return util.http(url, params)
  },

  /* 点击提现全部金额 */
  setAll:function(){
    this.setData({
      inputValue:this.data.totalNum
    })
  },

  /* 输入提现金额 */
  changeInput:function(e){

    const pattern=new RegExp(/^(([1-9][0-9]*)|([0-9]+\.[0-9]{1,2}))$/)
    if (pattern.test(e.detail.value)){
      this.setData({
        inputValue:e.detail.value,
      })
    }else {
      wx.showToast({
        title: '提现金额仅支持小数点后2位',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /* 查看提现记录 */
  viewRecord: function() {
    wx.navigateTo({
      url: '../withdrawal-record/withdrawal-record',
    })

  },

  /* 更改复选框 */
  changeCheckbox:function(){
    this.setData({
      checked:!this.data.checked
    })
  },

  /* 确认提交 */
  confirmsubmit: function () {
    console.log('inputValue',this.data.inputValue)
    if(this.data.totalNum==0){
      wx.showToast({
        title: `您没有可提现金额`,
        icon: 'none'
      });
      return;
    }
    if (this.data.checked == false) {
      wx.showModal({
        title: '提示',
        content: '请勾选用户协议',
        showCancel: false,
      })
    } else if (!this.data.inputValue) {
      wx.showToast({
        title: `请输入提现金额`,
        icon: 'none'
      });
    } else if (Number(this.data.inputValue) > Number(this.data.totalNum)) {
      wx.showToast({
        title: `最多提现金额为${this.data.totalNum}`,
        icon: 'none'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: `请确定您提现的金额`,
        success: (res)=>{
          if (res.confirm) {
            this.submit()
          } else if (res.cancel) {

          }
        }
      })

    }
  },

  /* 提现 */
  submit:function(){
    let params = {
      withdrawalAmount:this.data.inputValue
    }
    const url = app.globalData.urlBase + 'spread/mp/drp/mine/withdrawalApply'
    util.http(url, params).then(res=>{
      if(res.errorCode==9000){
        // 订阅消息调用
        this.subscribeMessage()
        wx.showModal({
          title: '提示',
          content: '操作成功,请等待审核',
          showCancel: false,
          success: function(result) {
            if(result.confirm){
              // 返回
              wx.navigateBack({
                delta: 1
              });
            }
          }
        })
      }else{
        wx.showToast({
          title: res.errorMessage,
          icon: 'none'
        });
      }
    })

  },

  /* 订阅消息 */
  subscribeMessage:function(){
    if(wx.requestSubscribeMessage){
      wx.requestSubscribeMessage({
        tmplIds: ['-79hrriDR4w1ysOTttwJZeb2zkBfDYUWhYxAl_sKIZY'],
        success (res) {
          console.log('订阅消息',res)
          if (res['-79hrriDR4w1ysOTttwJZeb2zkBfDYUWhYxAl_sKIZY'] === 'accept'){
            wx.showToast({
              title: '订阅成功！',
              duration: 1000,
            })
          }
        },
        fail(err) {
          consoel.log(err)
          wx.showModal({
            title:'提示',
            content:'打开订阅消息有助于及时接受通知',
            success: function(res) {
              if(res.confirm){
                wx.openSetting({
                  success: (res)=>{

                  },
                  fail: (res)=>{

                  },
                });
              }else if (res.cancel){
                console.log('用户拒绝了')
              }
            }
          })
        }
      });
    }
  },

  /* 查看提现说明 */
  viewRule() {
    this.setData({
      ruleDialog:!this.data.ruleDialog
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
