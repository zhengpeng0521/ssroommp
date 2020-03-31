// components/collapse-tag/collapse-tag.js
Component({
  externalClasses: [
    'custom-class',
  ],
  /**
   * 组件的属性列表
   */
  properties: {
    isExpand: {
      type: Boolean,
      value: false
    },
    idx: {
      type: String,
      value: '0'
    },
    num: {
      type: Array,
      value: []
    },
    wrapWidth: {
      type: Number,
      value: 240
    }
  },
  observers: { 
    'num': function () { 
      // this.handleRect()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showToggle: false
  },
  lifetimes: {
    attached: function () {
      
    },
    ready: function () {
      this.handleRect()
    },
    moved: function () { 
      this.handleRect()
    },
    detached: function () {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleRect() { 
      Promise.all([
        this.getRect('.item-slide'),
        this.getRect('#card' + this.data.idx)
      ]).then(([itemRects, cardRect]) => {
        if (cardRect.width >= itemRects.width) {
          this.setData({
            showToggle: true
          })
        }
      });
    },
    getRect(selector, all) {
      return new Promise(resolve => {
        wx.createSelectorQuery()
          .in(this)[all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    toggle(e) {
      if (this.data.showToggle) { 
        this.setData({
          isExpand: !this.data.isExpand
        })
      }
      this.triggerEvent('toggle', e);
    }
  }
})