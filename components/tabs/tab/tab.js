// components/tabs/tab/tab.js
Component({
  relations:{
    '../tabs': {
      type: 'ancestor',
      linked: function (target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
      },
    },
  },
  
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    inited:{
      type:Boolean
    },
    active:{
      type:Boolean
    },
    disabled:{
      type:Boolean
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

  }
})
