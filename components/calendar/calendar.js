// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateTime:{
      type:Array,
      value: []
    },
    isBlacklist:{
      type:Number,
      value:0
    },
    /**选择的日期 */
    daysTime:{
      type:Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dayContainerWidth:0
  },
  attached: function () {
    // 在组件实例进入页面节点树时执行
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let screenWidth = res.windowWidth,
          dayContainerWidth = Math.floor((screenWidth / 7) * 100) / 100;
        _this.setData({
          dayContainerWidth: dayContainerWidth
        });
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dateFormat() {
      const weeks_ch = dateUtil.weeks_ch
      const datearr = this.dateArr(this.data.startTime, this.data.endTime)

      let dateTime = [];
      datearr.forEach((obj, idx) => {
        const yearMonth = dateUtil.formatTimeToMonth(obj)
        const beginWeek = dateUtil.getDisplayInfo(obj).beginWeek
        const daysArr = dateUtil.getDisplayInfo(obj, this.data.appointMonthGroupPlans).daysArr
        dateTime.push({ yearMonth, beginWeek, daysArr })
      })
      this.setData({
        weeks_ch,
        dateTime
      })
    },
    choseDate:function(e){
      let available = e.currentTarget.dataset.available,
        daystime = e.currentTarget.dataset.daystime;
      const arg = {
        available,
        daystime
      }
      this.triggerEvent('chose', arg)
    }
  }
})
