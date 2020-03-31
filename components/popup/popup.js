// components/popup/popup.js
import { transition } from '../vant/utils/transition';
const positionKey = [
  'center',
  'bottom'
];
Component({
  externalClasses: [
    'custom-class',
  ],
  behaviors: [transition(false)],
  /**
   * 组件的属性列表
   */
  properties: {
    round: Boolean,
    closeable: Boolean,
    customStyle: String,
    overlayStyle: String,
    closeStyle:String,
    transition: {
      type: String,
      observer: 'observeClass'
    },
    zIndex: {
      type: Number,
      value: 100
    },
    overlay: {
      type: Boolean,
      value: true
    },
    closeIcon: {
      type: String,
      value: 'cross'
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'center',
      observer: 'observeClass'
    },
    offsetTop: {
      type: Number,
      value: 0
    },
    title: {
      type: String,
      value: ''
    },
    important: {
      type: String,
      value: ''
    }
  },
  created() {
    this.observeClass();
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
    close:function(){
      this.triggerEvent('close')
    },
    onClickOverlay:function(){
      if (this.data.closeOnClickOverlay){
        this.close();
      }
    },
    observeClass() {
      const { transition, position } = this.data;
      const updateData = {
        name: transition || position
      };
      if (transition === 'none') {
        updateData.duration = 0;
      }
      this.setData(updateData);
    },
    noop(){
      
    }
  }
})
