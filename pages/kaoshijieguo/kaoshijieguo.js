Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/kaoshijieguo',
      data: {},
      method: "POST",
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ppid = options.ppid
    var that = this
    wx.request({
      url: getApp().globalData.url + '/minipro/zxks/getPPaper',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        ppid: ppid
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if (res.data.msg == "success") {
          var pPaperObj = res.data.pPaperObj
          var testPaper = res.data.testPaper
          var pQuestionArr = res.data.pQuestionArr
          var isAccess = res.data.isAccess
          that.setData({
            pPaperObj: pPaperObj,//个人试卷
            testPaper: testPaper,
            pQuestionArr: pQuestionArr,//个人试卷试题
            isAccess: isAccess
          })
          // console.log(pQuestionArr)
        } else {
          wx.showToast({
            title: '查询试卷失败！',
            icon: 'none'
          })
        }
      }
    })
    this.countInfo();
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