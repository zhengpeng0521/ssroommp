// components/rate/rate.js
Component({
  externalClasses:['extend-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:Number,
      value:0
    },
    score:{
      type:Number,
      value:5
    },
    color:{
      type:String,
      value:'#FF9436'
    },
    /* 未选中的颜色 */
    voidColor:{
      type:String,
      value:'#c7c7c7'
    },
    disableColor:{
      type:String,
      value:'#bdbdbd'
    }
  },
  observers:{
    value:function(value){
      if(value!==this.data.innerValue){
        this.setData({
          innerValue: value
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    innerValue: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      const score = event.currentTarget.dataset.score;
      this.setData({
        innerValue:score+1
      });
      this.triggerEvent('change',score+1,{})
    },
    onTouchMove:function(event){
      const _a = event.touches[0], clientX = _a.clientX, clientY = _a.clientY;
      const query = wx.createSelectorQuery().in(this).selectAll('.rate-icon');
      query.boundingClientRect(rect =>{

        const target = rect.sort(item=>{
          return item.left - item.right
        }).find(item => {
          return clientX >= item.left && clientX <= item.right && clientY >= item.top && clientY <= item.bottom;
        })
        if(target != null){
          this.onSelect({ ...event, currentTarget:target});
        }
      }).exec()
      
    }
  }
})
