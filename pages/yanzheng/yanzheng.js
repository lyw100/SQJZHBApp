var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    yzm:"",
    time: '获取验证码', //倒计时 
    currentTime: 61
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  userNameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  yzmInput: function (e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  tj:function(){
    var that = this;
    // console.log(that.data)
    if(that.data.username==""){
      wx.showModal({
        title: '提示',
        content: "请填写账号",
        showCancel: false
      })
      return;
    } else if (that.data.yzm == ""){
      wx.showModal({
        title: '提示',
        content: "请填写验证码",
        showCancel: false
      })
      return;
    }
    wx.request({
      url: getApp().globalData.url + '/weChat/editPWD/forgetPw',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        username: that.data.username,
        yzm:that.data.yzm
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
          wx.navigateTo({
            url: '../shuruxinmimao/shuruxinmimao',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "验证码错误",
            showCancel: false
          })
        }
      }
    })

   
  },
  getyzm:function(){
    var that = this;
    if (that.data.username==""){
      wx.showModal({
        title: '提示',
        content: "手机号不能为空",
        showCancel: false
      })
      return
    }
    wx.request({
      url: getApp().globalData.url + '/weChat/editPWD/getYZM',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        username: that.data.username,
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res.data)
        if(res.data.msg=="OK"){
          that.getCode();
          that.setData({
            disabled: true
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
          that.setData({
            disabled: false
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