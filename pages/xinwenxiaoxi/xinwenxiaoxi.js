var page = 1;         // 初次加载页数
var hadLastPage = false;  // 判断是否到最后一页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: "5",//从0开始
    xxlist: [],
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/xinwenxiaoxi',
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
    // this.loadList();
    this.countInfo();
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    page = 1;
    hadLastPage = false;
    var that = this;
    that.setData({
      xxlist: []
    })
    this.loadList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;
    var that = this;
    that.setData({
      xxlist: []
    })
    this.loadList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    this.loadList();
  },
  loadList: function (event) {
    if (hadLastPage != false) {
      wx.showToast({
        title: '到底啦',
      });
      return;
    }
    var that = this;
    // 显示加载图标  
    wx.showNavigationBarLoading();

    wx.request({
      url: getApp().globalData.url + '/weChat/msg/getXWXXlist',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        rows: parseInt(that.data.rows) + 1,
        page: page,
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
        if (res.data.msg == "success") {
          // 回调函数  
          var xxlist_add = that.data.xxlist;

          for (var i = 0; i < res.data.list.length; i++) {
            xxlist_add.push(res.data.list[i]);
          }
          // 页数+1  
          page++;
          // 设置数据  
          that.setData({
            xxlist: xxlist_add
          })
        } else {
          hadLastPage = true;
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })

  }, 
  /**跳转详情页 */
  tzxwxxinfo: function (e) {
    var id=e.currentTarget.dataset.index
    wx.request({
      url: getApp().globalData.url + '/weChat/msg/editXWXXyd',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if(res.data.msg=="ok"){
          wx.navigateTo({
            url: '../xinwenxiangqing/xinwenxiangqing?id=' + id,
          });
        }
      }
    })
  }
})