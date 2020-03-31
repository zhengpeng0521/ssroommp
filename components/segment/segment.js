// components/segment/segment.js
const segmentData = [
  { id: '', name: '精选推荐', goodsType: '' },
  
  { id: 2, name: '线上教培',goodsType:103 },
  { id: 1, name: '线下教培', goodsType: 103 },
  { id: '', name: '玩乐优选',goodsType:101 },
  { id: '', name: '医美',goodsType:102 }
]
Component({
  externalClasses: [
    'segment-class',
    'tab-class'
  ],
  /**
   * 组件的属性列表
   */
  properties: {
    segment: {
      type: Array,
      value: segmentData
    },
    observeRef: {
      type: String,
      value: ''
    },
    offsetTop: {
      type: Number,
      value: 0
    },
    currentActive: {
      type: Number,
      value: 0
    },
    tagStyle: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsNavFixed: false,
    active: 0,
    offsetTop: 0,
    system:''
  },
  lifetimes: {
    attached: function () {
      const system = wx.getSystemInfoSync()
      if (system && system.platform == 'android' || system.platform == 'Android') { 
        this.setData({
          system:'android'
        })
      }
      this.height = 0;
      // 在组件实例进入页面节点树时执行
      
      // if (this.data.observeRef) { 
      //   const query = this.createSelectorQuery()
      //   query.select('#goodsNav').boundingClientRect()
      //   query.exec(res => { 
      //     this.height = res[0].height
      //     this.observerScroll()
      //   })
      // } 
      
    },
    ready: function () { 
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    observerScroll() {
      wx.createIntersectionObserver().relativeToViewport({ top: -(this.data.offsetTop+this.height) }).observe(this.data.observeRef, (res => {
        const { top } = res.boundingClientRect;
        if (top > 500) {
          return
        }
        const goodsNavFixed = res.intersectionRatio > 0 ? false : true;
        this.setData({
          goodsNavFixed,
        })
      }));
    },
    choseCardType(e) {
      const dataset = e.currentTarget.dataset
      const index = dataset.index
      this.triggerEvent('change', dataset)
      if (index !== this.data.currentActive) { 
        this.setData({
          currentActive: index
        })
      }
      
    }
  } 
})
