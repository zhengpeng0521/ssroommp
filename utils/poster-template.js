export default class ImagePoster {
  palette(data) {
    const system = wx.getSystemInfoSync()
    console.log(system)
    const ratio = system.pixelRatio
    let deviceWidth = system.screenWidth * 2
    let deviceHeight = deviceWidth * 1.608
    let draw = deviceWidth
    if (ratio == 3) draw = deviceWidth - 1 // 修复在设备像素比是3的情况下有1像素黑边
    let goodsImg = data.posterImg
    let qrcodeContent = data.shareQrCodeImg
    let user = wx.getStorageSync("g_userInfo")
    let avatar = user.avatar
    let nickname = user.nickname
    // const logo = 'https://img.ishanshan.com/gimg/n/20200109/1eb6ce8673d32c8e894c66cc0f442d37'
    const logo = 'http://img.ishanshan.com/gimg/n/20200318/e50daefe1297025363813576eb2f4cfa'
    return ({
      width:`${draw}rpx`,
      height: `${deviceHeight}rpx`,
      background: "#ffffff",
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
        // {
        //   type: 'image',
        //   url: `${avatar}`,
        //   css: {
        //     width: '100rpx',
        //     height: '100rpx',
        //     top: '0rpx',
        //     left: '0rpx',
        //     mode: "widthFix"
        //   }
        // },
        
        {
          type: 'image',
          url: `${goodsImg}`,
          css: {
            width:`${deviceWidth}rpx`,
            height: `${deviceHeight}rpx`,
            top: "0rpx",
            left: "0rpx",
            mode: "widthFix"
          },
        },
        {
          type: 'text',
          text: `${nickname}向您精选推荐`,
          css: {
            right: '200rpx',
            fontSize: '28rpx',
            fontWeight:'500',
            bottom: '120rpx',
            color:'#ffffff'
          }
        },
        {
          type: "rect",
          css: {
              width:`${deviceWidth}rpx`,
              height: `90rpx`,
              bottom: "0rpx",
              right: "0rpx",
              color: "#ffffff"
          }
        },
        {
          type: "rect",
          css: {
              width:`180rpx`,
              height: `180rpx`,
              bottom: "0rpx",
              right: "0rpx",
              color: "#ffffff",
              borderRadius:'10rpx'
          }
        },
        {
          type: 'text',
          text: `吃喝玩乐学 尽在闪闪课堂`,
          css: {
            fontSize: '30rpx',
            fontWeight: 'bold',
            left: '180rpx',
            bottom: '30rpx',
            color:'#333333'
          }
        },
        {
          type: 'image',
          url: `${logo}`,
          css: {
            width: '120rpx',
            height: '120rpx',
            left: '30rpx',
            bottom: '-18rpx',
            mode: "widthFix"
          },
        }, 
        {
          type: 'image',
          url: `${qrcodeContent}`,
          css: {
            width: '160rpx',
            height: '160rpx',
            right: '10rpx',
            bottom: '10rpx'
          },
        }, 
        
      ],
    });
  }
}
