//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var jzid = this.globalData.jiaozhengid;
    if(jzid!=""){
      //var path ="http://localhost:8080/SQJZ";
      var path = this.globalData.url;
      wx.request({
        url: path + '/wechat/zxtj/online',
        data: {},
        method: 'POST',
        header: {
          'Cookie': this.globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {

        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //var path ="http://localhost:8080/SQJZ";
    var path=getApp().globalData.url;
    wx.request({
      url: path +'/wechat/zxtj/offline',
      data: {},
      method:'POST',
      header:{
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res){

      }
    })
  },
  globalData: {
    userInfo: null,
    jiaozhengid:"",
    header: { 'Cookie': '' },//这里还可以加入其它需要的请求头，比如'x-requested-with': 'XMLHttpRequest'表示ajax提交，微信的请求时不会带上这个的
    // url:"https://www.tksqjz.com/SQJZ",
    // url:"https://www.tksqjz.com:8082/SQJZ",
     url: "http://localhost:8010/SJYKT",
    // url: "https://www.tksqjz.com:8085/SJYKT",
    //url: "https://www.tianrunxinxi.com/SQJZ",
  }
  
})