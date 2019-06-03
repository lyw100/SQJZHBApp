Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd: "",
    pwd1: ""
  },
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  pwd1Input: function (e) {
    this.setData({
      pwd1: e.detail.value
    })
  },
  savepw:function(){
    var that = this;
    if(that.data.pwd==""){
       wx.showModal({
        title: '提示',
        content: "密码不能为空",
        showCancel: false
      })
      return;
    }else if(that.data.pwd!=that.data.pwd1){
      wx.showModal({
        title: '提示',
        content: "密码输入错误",
        showCancel: false
      })
      return;
    }
    wx.request({
      url: getApp().globalData.url + '/weChat/editPWD/changePw',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pwd: that.data.pwd,
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res);
        if (res.data.msg == "OK") {
          wx.switchTab({
            url: '../zhuye/zhuye',
          })
        } else if (res.data.msg==""){
          wx.showModal({
            title: '提示',
            content: "修改失败",
            showCancel: false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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