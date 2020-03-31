// components/popup/mask/mask.js
Component({
  externalClasses: ['custom-class'],
  properties: {
    show: Boolean,
    customStyle: String,
    duration: {
      type: null,
      value: 300
    },
    zIndex: {
      type: Number,
      value: 1
    }
  },

  methods: {

    onClick() {
      this.triggerEvent('click')
    },
    noop(){
      
    }
  },
})
