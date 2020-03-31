var app = getApp();
var util = require('../../../../../utils/util');

// pages/index/ticket/ticket-detail/all-comment/all-comment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userCommentData: [],                    //评论数据
        pageData: null,                     //分页数据
        nextPageIndex: 1,                   //下一页页码
        evaluationCount: '',
        averageScore: '',
        isLoading: true,
        hasMoreData: true,
        isLoadingMore: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.options = options;
        this.url = app.globalData.urlBase + 'saas-ssp/app/evaluation/queryList';
        let param = {
            shopId: app.globalData.g_shopId,
            sourceId: options.sourceId,
            type: this.options.type === 'ticket' ? 6 : 4,
            pageSize: 10
        };
        util.http(this.url, param).then(this.processCommentData);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // 是否有更多数据
        if (this.data.hasMoreData === false) return;
        this.setData({
            isLoadingMore: true
        });
        let param = {
            shopId: app.globalData.g_shopId,
            sourceId: this.options.sourceId,
            type: this.options.type === 'ticket' ? 6 : 4,
            pageSize: 10,
            pageIndex: this.data.nextPageIndex,
        };
        util.http(this.url, param).then(this.processMoreCommentData);
    },

    // 处理首次加载的数据
    processCommentData: function (data) {
        let result = data.results;
        // 将分数转为布尔数组,时间戳转换
        for (let item in result) {
            let score = result[item].score;
            let createTime = result[item].createTime;
            score = Number(score);
            score = util.convertToStarsArray(score);
            createTime = util.getDiffTime(createTime, true);
            result[item].score = score;
            result[item].createTime = createTime;
        }
        console.info('serializeData', result);
        this.setData({
            pageData: data.data,
            userCommentData: result,
            evaluationCount: data.data.resultCount,
            averageScore: data.averageScore,
            isLoading: false
        });
        if (data.data.pageCount <= 1) {
            this.setData({
                hasMoreData: false
            });
        }
    },

    // 加载更多的数据
    processMoreCommentData: function (data) {
        let result = data.results;
        // 将分数转为布尔数组,时间戳转换
        for (let item in result) {
            let score = result[item].score;
            let createTime = result[item].createTime;
            score = Number(score);
            score = util.convertToStarsArray(score);
            createTime = util.getDiffTime(createTime, true);
            result[item].score = score;
            result[item].createTime = createTime;
        }
        this.setData({
            userCommentData: this.data.userCommentData.concat(data.results),
            isLoadingMore: false
        });
        this.data.nextPageIndex += 1;
        this.isHaveMoreDate();
    },

    // 是否还有更多数据
    isHaveMoreDate: function () {
        if (this.data.nextPageIndex >= this.data.pageData.pageCount) {
            this.setData({
                hasMoreData: false
            });
        }
    }

})