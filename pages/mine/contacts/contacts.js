// pages/mine/contacts/contacts.js
var app = getApp()
var util = require("../../../utils/util")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nocontact: true, //没有联系人开关
    contactData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.findAllContact()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.findAllContact()
  },
  radioChange: function(e) {
    let arr = e.detail.value.split('-');
    this.name = arr[0];
    this.idCard = arr[1];
  },

  contactDetail: function(e) {
    wx.navigateTo({
      url: "/components/contact-info/contact-info?name=" +
        e.currentTarget.dataset.radio.name +
        "&id=" +
        e.currentTarget.dataset.radio.idCard +
        "&manId=" +
        e.currentTarget.dataset.radio.linkmanId +
        "&isowner=" + e.currentTarget.dataset.radio.isOwner
    })
  },

  /**
   * slide-delete 删除产品
   */
  handleSlideDelete({
    detail: {
      id
    }
  }) {
    console.log("删除产品获取的id------", id)
    // let contactData = this.data.contactData
    // let productIndex = contactData.findIndex(item => item.linkmanId === id)

    // contactData.splice(productIndex, 1)
    const data = {
      linkmanId: id
    }
    let url = app.globalData.urlBase + "/spread/mp/cust/linkmanDelete"

    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.findAllContact()
        wx.showToast({
          title: "删除成功",
          icon: "success",
          duration: 2000
        })
      } else {
        wx.showToast({
          title: "删除失败",
          icon: "warn",
          duration: 2000
        })
      }
    })
  },

  findAllContact: function() {
    let url = app.globalData.urlBase + "/spread/mp/cust/linkmanFindAll"

    util.http(url, {}).then(res => {
      if (res.errorCode === 9000) {
        console.log("获取的所有联系人信息-----", res)
        if (res.items.length) {
          this.setData({
            contactData: res.items,
            nocontact: true
          })
        } else {
          this.setData({
            nocontact: false
          })
        }
        this.setData({
          contactData: res.items
        })
      } else {
        wx.showModal({
          title: res.errorMessage
        })
      }
    })
  },
  /*新增购买人*/
  addNewContact: function() {
    wx.navigateTo({
      url: "/components/contact-info/contact-info"
    })

  },
  choseContact: function() {
    // this.name  this.idCard
    if (!this.name) {
      return false;
    }
    let pages = getCurrentPages(),
      prevPage = pages[pages.length - 2],
      obj = {
        name: this.name,
        idCard: this.idCard
      };

    prevPage.getVal(obj);
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})