// pages/index/ticket/ticket-detail/purchase/select-coupon/select-coupon.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		canUseCouponArr: [],
		otherCouponArr: [],
		unuseCoupon: false,
		selectedCoupon: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var value = wx.getStorageSync('coupon');
		let canUseCouponArr = value.canUseCouponArr;
		let otherCouponArr = value.otherCouponArr;
		this.setData({
			canUseCouponArr: this.formatDate(canUseCouponArr),
			otherCouponArr: this.formatDate(otherCouponArr)
		});
	},

	formatDate: function (value) {
		if (value) {
			for (let item of value) {
				let endDate = item.endDate;
				endDate = endDate.match(/\d{4}-\d{1,2}-\d{1,2}/);
				if (endDate) endDate = endDate[0].replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g, '$1.$2.$3');
				item.endDate = endDate;
			}
			return value;
		}
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
		let obj = {
			unuseCoupon: this.data.unuseCoupon,
			selectedCoupon: this.data.selectedCoupon
		};
		wx.setStorageSync('selectedCoupon', obj);
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

	},

	// 点击选择优惠券事件
	onSeletCoupon: function (e) {
		if(this.data.unuseCoupon === true)return;
		let index = e.currentTarget.dataset.index;
		console.info(typeof index);
		this.setData({
			selectedCoupon: Number(index)
		});
	},

	onChangeState: function () {
		this.setData({
			unuseCoupon: !this.data.unuseCoupon,
			selectedCoupon: ''
		});
	}

})