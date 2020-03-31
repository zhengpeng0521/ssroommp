// components/tabs/tabs.js
Component({
  externalClasses: ['custom-class','tabs-custom', 'nav-class','tabs-nav-class', 'tab-class','tab-active-class'],
  relations:{
    './tab/tab': {
      type: 'descendant',
      linked: function (target) {
        this.child.push(target);
        this.updatedTabs(this.data.tabs.concat(target.data));
      },
    },
  },
  created:function(){
    this.child = [];
    
  },
  attached:function(){
    const query = wx.createSelectorQuery().in(this).select('.tabs-wrap');
    query.boundingClientRect((rect) => {
      this.navHeight = rect.height;
      this.observerContentScroll();
    }).exec();
  },
  /**
   * 组件的属性列表
   */
  properties: {
    sticky: {
      type: Boolean,
    },
    stickyStyle: {
      type: String,
      value:''
    },
    /**
     * 当前激活的的tab
     */
    active:{
      type:Number,
      value:0
    },
    type: {
      type: String,
      value:'line'
    },
    offsetTop: {
      type: Number,
      value: 0
    },
    auto:{
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs:[],
    position:'',
    wrapStyle:'',
  },
  observers:{
    active:function(){
      this.setActiveTab()
    },
    offsetTop: function(){
      this.setWrapStyle();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      const index = event.currentTarget.dataset.index;
      if(this.data.tabs[index].disabled){
        this.triggerEvent('disabled',{index,title:this.data.tabs[index].title});
      }else{
        this.triggerEvent('click',{index,title:this.data.tabs[index].title});
        this.setActive(index);
      }
    },
    updatedTabs:function(tabs){
      tabs = tabs || this.data.tabs;
      this.setData({
        tabs
      });
      this.setActiveTab();
    },
    setActive:function(active){
      if (active !== this.data.active){
        this.triggerEvent('change', active);
        this.setData({
          active
        });
        this.setActiveTab();
      }
    },
    setActiveTab(){
      this.child.forEach((item,index)=>{
        const data = {
          active: index === this.data.active
        }
        if (data.active) {
          data.inited = true;
        }
        if (data.active !== item.data.active) {
          item.setData(data);
        }
      });
      // setTimeout(()=> { 
      //   this.setTrack()
      // },50)
    },
    observerContentScroll(){
      if(!this.data.sticky) return false;
      const { offsetTop } = this.data;
      const { windowHeight } = wx.getSystemInfoSync();
      this.createIntersectionObserver().disconnect();
      this.createIntersectionObserver().relativeToViewport({ top: -(this.navHeight + offsetTop) })
        .observe('.tabs-container', (res) => {
          const { top } = res.boundingClientRect;
          if (top > offsetTop) {
            return;
          }
          const position = res.intersectionRatio > 0 ? 'top' : 'bottom';
          this.triggerEvent('scroll', {
            scrollTop: top + offsetTop,
            isFixed: position === 'top'
          });
          this.setPosition(position);
      });
      this.createIntersectionObserver()
        .relativeToViewport({ bottom: -(windowHeight - 1 - offsetTop) })
        .observe('.tabs-container', (res) => {
          const { top, bottom } = res.boundingClientRect;
          if (bottom < this.navHeight) {
            return;
          }
          const position = res.intersectionRatio > 0 ? 'top' : '';
          this.triggerEvent('scroll', {
            scrollTop: top + offsetTop,
            isFixed: position === 'top'
          });
          this.setPosition(position);
      });
    },
    setWrapStyle() {
      const { offsetTop, position,stickyStyle } = this.data;
      let wrapStyle;
      switch (position) {
        case 'top':
          wrapStyle = `
            top: ${offsetTop}px;
            position: fixed;
          `;
          wrapStyle += stickyStyle;
          break;
        case 'bottom':
          wrapStyle = `
            top: auto;
            bottom: 0;
          `;
          break;
        default:
          wrapStyle = '';
      }
      if (wrapStyle !== this.data.wrapStyle) {
        this.setData({ wrapStyle });
      }
    },
    setPosition(position) {
      if (position !== this.data.position) {
        this.setData({ position },()=>{
          this.setWrapStyle();
        });
      }
    }
  }
})
