// components/share-dialog/share-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playCardTitle: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    inviteDialogShow: function() {
      this.triggerEvent('continueShate');
    },
    naviToPlayCard: function() {
      this.triggerEvent('naviToPlayCard')
    },
    hidePoster: function() {
      this.triggerEvent('hideDialog');
    }
  }
})