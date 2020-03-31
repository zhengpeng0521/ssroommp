// components/navBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    
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
    goBack:function(){
      console.log('1244');
      this.triggerEvent('triggerback',{},{})
    }
  }
})
