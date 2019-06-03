Page({
  onSousuo:function(){
    wx.navigateTo({
      url: '../sousuo/sousuo?subjectType=""&courseType=""&menu=index&subjectId=""',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
     page:1,
     rows:4,
     dibu:false
  },
  /**单击扫一扫图标 */
  scanTap:function(){
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        // console.log(res)
      }
    })
  },
  /**跳转消息页面 */
  xiaoxiyemian:function(){
    wx.navigateTo({
      url: '../xiaoxi/xiaoxi',
    }); 
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/zhuye',
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
    
    this.reLoad();
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
    var that=this;
    this.getMsg();
    setTimeout(function () {
     that.cmonthSignList();
    }, 200)
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
    // 显示顶部刷新图标
    // wx.showNavigationBarLoading();
    this.data.page=1;
    this.cmonthSignList();
    this.reLoad();
    this.getMsg();
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标
    this.setData({
      dibu: true
    })
    var that=this;
    var page = this.data.page;
    var rows = this.data.rows;
    var jzid = getApp().globalData.jiaozhengid;
    wx.request({
      url: getApp().globalData.url + '/sign/historySignList', //请求历史已选课程地址
      // url: 'http://localhost:8081/SQJZ/sign/historySignList', //请求历史已选课程地址
      data: {jzid:jzid,page:page,rows:rows},
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
        if(list.length>0){
          page+=1;
          var content=that.data.historyList.concat(list);
          that.setData({
            dibu:false,
            page:page,
            historyList: content
          });
        }else{
          that.setData({
            dibu:false
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

   /**
   * 点击已选课程图片跳转
   */
    signRecord:function(e){
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/shouyebofang/shouyebofang?record=sign&id="+id
    })
  },
  

  /**
   * 点击轮播图播放视频
   */
  swipclick:function(e){
    // console.log(e);
    var courseid = e.currentTarget.dataset.courseid;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },
  /**
   * 修改为单击轮播图跳转到专题页面
   */
  bannerTap:function(e){
    //special为专题,course为课程
    var type = e.currentTarget.dataset.type;
    var specialid = e.currentTarget.dataset.specialid;
    if(type=="special"){
      wx.navigateTo({
        url: "/pages/zhuanti/zhuanti?specialid=" + specialid
      })
    }else if(type=="course"){
      wx.navigateTo({
        url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + specialid
      })
    }else{
      wx.showToast({
        title: '获取类型错误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 重新加载数据
   */
  reLoad:function(){
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
   
    wx.request({
      url: getApp().globalData.url + '/sign/historySignList', //请求历史已选课程地址
      // url: 'http://localhost:8081/SQJZ/sign/historySignList', //请求历史已选课程地址
      data: { jzid: jzid, 'page': that.data.page, 'rows': that.data.rows },
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
        if(page>1){
          list = that.data.historyList.concat(list);
        }
        if (list.length > 0) {
          var page = that.data.page + 1;
          that.setData({
            page: page
          });
        }
        that.setData({
          historyList: list
        })
      }
    })
    this.loadBanner();
  },
  /**
   * 加载顶部轮播图
   */
  loadBanner:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/zhuanti/listBanner',
      //url: 'http://localhost:8080/SQJZ/zhuanti/listBanner',
      data: { 
        jzid: getApp().globalData.jiaozhengid
        },
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
        if(res.data.msg=="OK"){
          var list = res.data.list;
          that.setData({
            swiperCurrent: 0,
            imgUrls: list
          })
        }
      }
    })
  },
  /**
   * 当月课程查询
   */
  cmonthSignList:function(){
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    // console.log(that.globalData.header.Cookie);
    wx.request({
      url: getApp().globalData.url + '/sign/cmonthSignList', //请求当月已选课程地址
      data: { jzid: jzid },
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
        var hours = res.data.hours;
        var list = res.data.list;
        that.setData({
          hours: parseFloat(hours).toFixed(1),
          nowList: list
        })
      }
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  getMsg: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/weChat/msg/getMsg',
      header: getApp().globalData.header, //获取app.js中的请求头
      success(res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        var data = res.data;
        //消息总数
        var msgcount= data.xtcount + data.xwcount
        var jiujiujia="";
        if (msgcount>99){
          msgcount="99+";
          jiujiujia ="jiujiujia";
        }
        //赋值
        that.setData({
          msgcount: msgcount,
          jiujiujia: jiujiujia
        })
      }
    })
  },
  /**
   * 取消选课  判断播放进度是否为0  不是0不可以取消
   */
  cancleSign: function (e) {
    var that = this;
    var courseid = e.currentTarget.dataset.courseid;
    var index = e.currentTarget.dataset.index;

    var jzid = getApp().globalData.jiaozhengid;
    var url = getApp().globalData.url + '/course/cancleSign';
    wx.request({
      url: url, //获取视频播放信息
      data: { courseid: courseid, jzid: jzid },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      dataType: 'text',
      success(res) {
        if (res.data.indexOf("{") == 0 && res.data.lastIndexOf("}") != -1) {
          var errdata = JSON.parse(res.data);
          //判断session
          if (errdata.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
        }
        if (res.data == "ok") {//取消选课成功
          var nowList = that.data.nowList;
          nowList.splice(index,1);
          that.setData({
            nowList: nowList,
          })
          
          wx.showToast({
            title: '取消课程成功',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data == "progress") {
          wx.showToast({
            title: '该课程已学习不可取消',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data == "assign") {
          wx.showToast({
            title: '指定课程不可取消',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }



})



