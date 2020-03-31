// components/flowLayout/flowLayout.js
const DEFAULT_HEIGHT = 182

let init = true
let _columns = 2
Component({
  data: {
    list: [],
    rawData: {}, // 源数据
    orderArr: [], // 记录原始数值
    renderList: [], // 记录用于渲染的数组排序
    _imageFillMode: 'widthFix', // 图片适配 mode
    _fontColor: 'black',
    _limitContent: true
  },

  // properties list
  properties: {
    // optional
    // optional | default: { }
    option: {
      type: Object,
      value: {}
    },
    // raw dataset
    // required
    dataSet: {
      type: Array,
      value: [],
      observer: function (newVal) {
        let { rawData } = this.data
        let dataSet = {}
        let orderArr = []

        let { option } = this.properties
        let forceRepaint = false

        if (!!option) {
          forceRepaint = !!option.forceRepaint ? option.forceRepaint : forceRepaint
        }


        newVal.forEach(item => {
          // 当不强制重排，且已经有该数据源
          if (!forceRepaint && rawData[item['evaluateId']]) {
            item._height = rawData[item['evaluateId']]._height
            item._rendered = rawData[item['evaluateId']]._rendered
          } else {

            item._rendered = false
            item._height = DEFAULT_HEIGHT
          }

          // if (item.likedCount) {
          //   item.likedCount = item.likedCount > 99 ? '99+' : item.likedCount
          // }

          dataSet[item['evaluateId']] = item // 源数据
          orderArr.push(item['evaluateId'])
        })

        this.setData(
          { rawData: dataSet, orderArr },
          this._getRenderList.bind(this, true)
        )
      }
    }
  },

  methods: {
    /**
     * @description 计算单个默认高度
     * @param card_id 卡片 id
     */
    _computeSingleCardHeight(card_id) {
      return new Promise((resolve, reject) => {
        let query = wx.createSelectorQuery().in(this)
        query.select('#card-' + card_id).boundingClientRect(res => {
          console.log('res', res)
          resolve({ card_id, height: res.height })
        })
        query.exec()
      })
    },

    /**
     * @description 计算当前卡片高度，如果有传入 id 则计算和更新单个，如果没有传入 id 同时传入了 init，则只计算 第一个
     * @param {Object} opt id
     */
    _computeCardHeight(opt) {
      // 默认展开
      let { rawData, orderArr } = this.data

      let height = []
      height.length = 0

      if (!orderArr || !orderArr.length) {
        // 如果为空数组则无需计算
        return
      }
      if (init) {
        init = false
        orderArr.forEach(item => {
          height.push(this._computeSingleCardHeight(item))
        })
        Promise.all(height).then(res => {
          res.forEach(item => {
            rawData[item.card_id]['_height'] = item.height
            rawData[item.card_id]['_rendered'] = true
          })
          this.setData({ rawData }, this._getRenderList)
        })
      } else {
        let card_id = opt && opt.evaluateId ? opt.evaluateId : 0
        if (card_id) {
          // 计算单个
          this._computeSingleCardHeight(card_id).then(res => {
            let currentHeight = res.height
            if (currentHeight !== rawData[card_id]['_height']) {
              rawData[card_id]['_height'] = res.height
              this.setData({ rawData }, this._getRenderList)
            }
          })
        } else {
          // 非初始化情况下
          orderArr.forEach((item, index) => {
            if (!rawData[item]['_rendered']) {
              height.push(this._computeSingleCardHeight(item))
            }
          })
          Promise.all(height).then(res => {
            res.forEach(item => {
              rawData[item.card_id]['_height'] = item.height
              rawData[item.card_id]['_rendered'] = true
            })
            this.setData({ rawData }, this._getRenderList)
          })
        }
      }
    },

    /**
     * @description 图片预览功能
     */
    _imagePreview(event) {
      let dataset = event.currentTarget.dataset
      wx.previewImage({
        urls: dataset.images,
        current: dataset.currentImage
      })
    },


    _getRenderList(shouleRecomputeHeight = false) {
      let renderList = []
      let heightArr = []
      const arrLength = _columns
      const { orderArr, rawData } = this.data

      heightArr = Array(arrLength).fill(0)
      // initial render Arr
      for (let i = 0; i < arrLength; i++) {
        renderList[i] = []
      }

      orderArr.forEach(item => {
        let willPushIndex = heightArr.indexOf(Math.min.apply(null, heightArr))
        renderList[willPushIndex].push(item)
        heightArr[willPushIndex] += rawData[item]['_height']
      })
      // 由于需要 renderList 先去前台渲染完已有 dom 节点之后再来这边计算每个卡片的高度
      if (shouleRecomputeHeight) {
        this.setData({ renderList }, this._computeCardHeight)
        return
      } else {
        this.setData({ renderList })
      }
    },
  }
})

