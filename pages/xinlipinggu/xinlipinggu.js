Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  menuClick: function (e) {
    var tilenum = ["a","b","c","d","e"];
    var fennum = { "a":1, "b":2, "c":3, "d":4, "e":5};
    var index=e.currentTarget.dataset.index;
    var num=e.currentTarget.dataset.num;
    var questionlist = this.data.questionlist;
    questionlist[index][num] = 1;
    questionlist[index].select = fennum[num];
    for (var i = 0; i < tilenum.length;i++){
      if (tilenum[i] != num){
        questionlist[index][tilenum[i]] = 0;
      }
    }
    this.setData({
      questionlist: questionlist
    })
  },
  /**点击提交测试 */
  tjcs: function (e) {
    var query = wx.createSelectorQuery();
    var xz = query.select();
    var list = xz._selectorQuery._defaultComponent.data.questionlist;
    var str = "";
    var alllist = [];
    for(var i = 0;i < list.length;i++){
      if (list[i].select == undefined){
       str = "NO";
      }else{
        var map = {};
        map["psyid"] = list[i].id;
        map["score"] = list[i].select;
        map["sortid"] = list[i].sortid;
        alllist[i] = map;
      }
    }
    
    if(str != ""){
      wx.showModal({
        title: '提示',
        content: '有未选择题目，请检查'
      });
      return;
    }else{
      wx.showToast({
        title: '正在提交...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      var jsonarray = JSON.stringify(alllist);
      wx.request({
        method: "POST",
        url: getApp().globalData.url + '/psyass/savePsyReport', //获取90道心理评估试题
        data: {
          jsonarray: jsonarray,
          jzid: getApp().globalData.jiaozhengid
        },
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          //判断session
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          if (res.data.msg == "OK"){
            var psyrepid = res.data.psyrepid;
            wx.redirectTo({
              url: '../ceshijieguo/ceshijieguo?psyrepid=' + psyrepid,
            })
          }else{
            wx.hideToast();
            wx.showModal({
              title: '提示',
              content: '提交失败'
            });
          }
        }
      })
    }
      
    

  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/xinlipinggu',
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
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/psyass/getQuestion', //获取90道心理评估试题
      data: {},
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res.data);
        var list = res.data;
        for(var i=0;i<list.length;i++){
          var item=list[i];
          item['a'] = 0;
          item['b'] = 0;
          item['c'] = 0;
          item['d'] = 0;
          item['e'] = 0;
        }
        that.setData({
          swiperCurrent: 0,
          questionlist: list
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