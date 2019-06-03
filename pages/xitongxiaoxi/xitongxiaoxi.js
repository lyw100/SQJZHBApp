var page = 1;         // 初次加载页数
var hadLastPage = false;  // 判断是否到最后一页
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:"9",
    xxlist:[],
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/xitongxiaoxi',
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

    this.setData({
      xxlist: []
    })
    this.loadList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page=1;
    hadLastPage=false;
    
    this.setData({
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
    wx.showNavigationBarLoading();
    var that = this;
    // 显示加载图标  
    // wx.showLoading({
    //   title: '玩命加载中',
    // })

    wx.request({
      url: getApp().globalData.url + '/weChat/msg/getXTXXlist',
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
        if (res.data.msg =="success") {
          // 回调函数  
          var xxlist_add = that.data.xxlist;
          for (var i = 0; i < res.data.list.length; i++) {
            xxlist_add.push(res.data.list[i]);
          }
          //富文本循环替换html标签
          for (var i = 0; i < xxlist_add.length; i++){
            WxParse.wxParse('topic' + i, 'html', xxlist_add[i].content, that);
            if (i === xxlist_add.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', xxlist_add.length, that)
            }
          }
          let list = that.data.listArr;
          list.map((item, index, arr) => {
            arr[index][0].audittime = xxlist_add[index].audittime;
          });
          // 页数+1  
          page++;
          // 设置数据  
          that.setData({
            xxlist: xxlist_add,
            list:list,
          })
        } else {
          hadLastPage = true;
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  }
})