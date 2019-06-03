var RSAUtil = require("../../utils/RSA.js");
var module="";
var empoent="";
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    password:"",
  },
  userNameInput:function(e){
    this.setData({
      username: e.detail.value
    })
  },
  passWdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  scanQRCode: function (e) {
    let passwd = this.data.password;
    let pw = RSAUtil.encryptedString(RSAUtil.getRasKey(empoent, module), this.data.password)
    let usernm = this.data.username;
    if(usernm==""){
      wx.showModal({
        title: '提示',
        content: "账号不能为空",
        showCancel: false
      })
      return
    } else if (passwd == ""){
      wx.showModal({
        title: '提示',
        content: "密码不能为空",
        showCancel: false
      })
      return
    }
    wx.request({
      url: getApp().globalData.url + '/weChat/user/login', 
      data: {
        telephone: usernm,
        password: pw
      },
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if(res.data.msg=="OK"){
          wx.setStorageSync("username", usernm);
          wx.setStorageSync("password", pw)
          wx.setStorageSync("passwd", passwd)
          var jzid=res.data.jzid;
            getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
          //记录登录时间  更新模板消息发送数据
          wx.login({
            success(res1) {
              if (res1.code) {
                //发起网络请求
                wx.request({
                  url: getApp().globalData.url + '/wechat/getOpenid',
                  data: {
                    jzid: jzid,
                    code: res1.code,
                    formId: e.detail.formId
                  },
                  method: "POST",
                  header: {
                    'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success(res2) {

                  }
                })
              }else {
                console.log('微信登录失败！' + res1.errMsg)
              }
            }
          })
          
          wx.navigateTo({
            url: '../shualiandenglu/shualiandenglu',
          })
        } else if (res.data.msg == "isLogin"){
          wx.showModal({
            title: '提示',
            cancelText: '取消登录',
            confirmText: '继续登录',
            content: '您上次登录可能未正常退出，请确认已退出系统，如果上次登录已退出请忽略本次提示！',
            success: function (sm) {
              if (sm.confirm) {

                wx.setStorageSync("username", usernm);
                wx.setStorageSync("password", pw)
                wx.setStorageSync("passwd", passwd)
                var jzid = res.data.jzid;
                getApp().globalData.header.Cookie = 'JSESSIONID=' + res.data.sessionId;
                //记录登录时间  更新模板消息发送数据
                wx.login({
                  success(res1) {
                    if (res1.code) {
                      //发起网络请求
                      wx.request({
                        url: getApp().globalData.url + '/wechat/getOpenid',
                        data: {
                          jzid: jzid,
                          code: res1.code,
                          formId: e.detail.formId
                        },
                        method: "POST",
                        header: {
                          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success(res2) {

                        }
                      })
                    } else {
                      console.log('微信登录失败！' + res1.errMsg)
                    }
                  }
                })

                wx.navigateTo({
                  url: '../shualiandenglu/shualiandenglu',
                })

              } else if (sm.cancel) {
               
              }
            }
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
    this.setData({
      username: wx.getStorageSync("username"),
      password: wx.getStorageSync("passwd"),
    })
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
    wx.request({
      url: getApp().globalData.url + '/weChat/user/getRSA',
      method: "get",
      success(res) {
       
          module= res.data.module,
          empoent= res.data.empoent


      }
    })
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