Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/ceshijieguo',
      data: {},
      method: "POST",
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.timeOut =='OUT'){
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
    var that = this;
    var psyrepid = options.psyrepid;
    var jzid = getApp().globalData.jiaozhengid;
    this.setData({
      psyrepid: psyrepid,
      jzid: jzid
    })
    wx.request({
      url: getApp().globalData.url + '/psyass/getPsyReport', //获取90道心理评估试题
      data: {
        psyrepid: psyrepid,
      },
      header: {
        'Cookie': getApp().globalData.header.Cookie, 
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        var data = res.data;
         that.setData({
           bianhao: data.bianhao,
           jieguo:data.jieguo,
           jzname: data.jzname,
           time: data.time,
           zongfen: data.zongfen,
           zongjunfen: data.zongjunfen,
           yinzilist: data.yinzilist,
         })
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