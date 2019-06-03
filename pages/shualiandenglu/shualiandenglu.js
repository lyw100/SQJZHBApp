var errorcishu=0;//未检测到人脸次数限制
var errorcishu1=0;//多次刷脸未通过次数限制
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msgData:"识别中,请稍后...",
    num: 12, //初始值
    imgurl: "", //图片路径
    interval: "" //定时器
  },

  takePhoto: function () {
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
          msgData: "识别中,请稍后..."
        })
        // wx.showLoading({
        //   title: '正在校验.....',
        // })
        this.setData({ logindisabled: true });
        var header = getApp().globalData.header; //获取app.js中的请求头
        wx.uploadFile({
          url: getApp().globalData.url + '/weChat/user/face',
          filePath: res.tempImagePath,
          header: header,
          formData: {
            telephone: wx.getStorageSync("username"),
            password: wx.getStorageSync("password")
          },
          name: 'file',
          success: (res) => {
            wx.hideLoading();
            var data = JSON.parse(res.data);
            if (data.msg == "OK") {
              getApp().globalData.jiaozhengid =  data.jzid;
              wx.switchTab({
                url: '../zhuye/zhuye',
              })
            } else {
              this.setData({
                msgData: data.msg
              })
              errorcishu1++;
              if ('未能识别到人脸' == data.msg){
                errorcishu++;
              }else{
                errorcishu=0;
              }
              if (errorcishu >= 3 || errorcishu1>=5){
                wx.showModal({
                  title: '操作超时',
                  cancelText: '退出',
                  confirmText: '再试一次',
                  content: '正对手机更容易成功',
                  success: function (sm) {
                    if (sm.confirm) {
                      errorcishu=0;
                      errorcishu1 = 0;
                      setTimeout(function () {
                        that.takePhoto();
                      }, 3000);
                    } else if (sm.cancel) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }else{
                setTimeout(function () {
                  that.takePhoto();
                }, 3000);
              }
              
              
             
            }

          }
        })
      }
    })
  },
  progress: function () {
    var that = this;
    var num = that.data.num;
    var interval = setInterval(function () {
      that.setData({
        imgurl: "../../img/" + (13 - num) + ".png"
      })
      num--;
      if (num == 0) {
        num = 12
      }
    }, 100)
    that.setData({
      interval: interval
    })
  },
  //清除interval
  clearTimeInterval: function (that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },
  error(e) {
    // console.log(e.detail)
  },
  // switch1change: function (e) {
  //   console.log(e)
  //   if (e.detail.value) {
  //     this.setData({ value: 'back' })
  //   } else {
  //     this.setData({ value: 'front' })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.progress();
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
    var that = this
    setTimeout(function () {
      that.takePhoto();
    }, 5000);
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
    var that = this;
    that.clearTimeInterval(that)
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