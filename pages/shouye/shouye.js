Page({

  /**
   * 页面的初始数据
   */
  data: {
   
   
  },
  onTap: function () {
    wx.navigateTo({
        url: '../denglu/denglu',
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var a='{"1":"1"}'
    // a=JSON.parse(a)
    // console.log(Object.prototype.toString.call(a) )

    //获取APP跳转微信小程序的标识
    var scene = wx.getLaunchOptionsSync().scene
    if (scene == 1069){
      var telephone = wx.getLaunchOptionsSync().query.telephone
      if(telephone != undefined){
        wx.showToast({
          title: ''+telephone,
          icon: 'success',
          duration: 2000
        })
        //1、根据手机号在后台进行session绑定。2、跳转到主页

        // getApp().globalData.jiaozhengid = data.jzid;
        // wx.switchTab({
        //   url: '../zhuye/zhuye',
        // })
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})