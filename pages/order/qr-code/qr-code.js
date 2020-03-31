var app = getApp();
var util = require('../../../utils/util');

var QR = require("../../../utils/qrCodeGenerate");

// pages/order/qr-code/qr-code.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrCodeData: [],
        ticketData: {},
        currentQrCodeIndex: 0,
        currentQrCode: {},
        qrCodeCount: '',
        qrCodeArr: [],
        canvasHidden: false,
        isLoading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.options = options;
        this.getQrCodeData();
    },

    getQrCodeData: function () {
        
        let purchaseId = this.options.purchaseId;
        let shopId = app.globalData.g_shopId;
        let url1 = app.globalData.urlBase + 'saas-ssp/app/purchaseGoods/query';
        let url2 = app.globalData.urlBase + 'saas-ssp/app/purchaseGoods/summaryQuery';
        let param = {
            purchaseId,
            shopId
        };
        util.http(url1, param).then(this.processQrCodeData);
        util.http(url2, param).then(data => {
            this.setData({
                ticketData: data,
                isLoading: false
            });
        });
    },

    /**
   QrCode数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.getQrCodeData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    // 处理后端二维码数据
    processQrCodeData: function (data) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        let result = data.results;
        if (result == null) return;
        //二维码每四位加空格
        for (let res of result) {
            let verificationCode = res.verificationCode;
            res.verificationCode = util.qrCodeFormat(verificationCode);
        }
        this.setData({
            qrCodeData: result,
            currentQrCode: result && result[0] || '',
            qrCodeCount: result.length
        });
        if(result[0].qrCodeStr != null){
            this.generateCanvas(result[0].qrCodeStr);
        }else{
            wx.showToast({
                title: '核销码获取失败，请刷新后重试。如仍无法获取，请联系游乐园解决！',
                icon: 'none',
                duration: 1500
            });
        }

    },


    // 改变二维码
    changeQrCode: function (e) {
        let left = e.currentTarget.dataset.left;
        if (left) {
            if (this.data.currentQrCodeIndex === 0) return;
            this.data.currentQrCodeIndex -= 1;
        } else {
            let len = this.data.qrCodeData.length - 1;
            if (this.data.currentQrCodeIndex === len) return;
            this.data.currentQrCodeIndex += 1;
        }
        this.setData({
            currentQrCode: this.data.qrCodeData[this.data.currentQrCodeIndex],
            currentQrCodeIndex: this.data.currentQrCodeIndex
        });
        if (this.data.qrCodeData[this.data.currentQrCodeIndex].qrCodeStr != null){
            this.generateCanvas(this.data.qrCodeData[this.data.currentQrCodeIndex].qrCodeStr);
        }else{
            wx.showToast({
                title: '核销码获取失败，请刷新后重试。如仍无法获取，请联系游乐园解决！',
                icon: 'none',
                duration: 1500
            });
        }
    },


    // canvas二维码实现
    generateCanvas: function (initUrl) {
        let size = this.setCanvasSize();//动态设置画布大小
        this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    },

    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / 400;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            console.info('res.windowWidth/scale', width);
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },

    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => { this.canvasToTempImage(); }, 1000);

    },

    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId:
                'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log('tempFilePath:', tempFilePath);
            },
            fail: function (res) {
                console.log('canvas绘制失败：', res);
            }
        });
    }

})
