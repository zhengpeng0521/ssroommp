export default class LastMayday {
    palette(data) {
      
      let deviceWidth = wx.getSystemInfoSync().screenWidth*2
      let deviceHeight = deviceWidth * 1.8893
console.log('分享的图片',data)
        let user = wx.getStorageSync("g_userInfo")
        let goodsImg = data.posterImg
        let qrcodeContent = data.shareQrCodeImg,
            app = getApp()
        return {
            width:`${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            background: "#eeeeee",
            views: [
                {
                    type: "rect",
                    css: {
                        width:`${deviceWidth}rpx`,
                      height: `${deviceHeight}rpx`,
                        left: "0rpx",
                        top: "0rpx",
                        color: "#ffffff"
                    }
                },

                {
                    type: "image",
                    url: goodsImg,
                    css: {
                      width: `${deviceWidth}rpx`,
                      height: `${deviceHeight}rpx`,
                        top: "0rpx",
                        left: "0rpx",
                      mode: "scaleToFill"
                    }
                },

                {
                    type: "image",
                    url: qrcodeContent,
                    css: {
                        width: "150rpx",
                        height: "150rpx",
                        bottom: "40rpx",
                        left: "40rpx",
                        borderRadius: "75rpx"
                    }
                }
            ]
        }
    }
}
