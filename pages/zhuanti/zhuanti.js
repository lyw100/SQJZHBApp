// pages/zhuanti/zhuanti.js
var page=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    specialid:"",
    courseList:[],
    dibu: false,//加载样式
  },
  /**
   * 加载专题
   */
  loadSpecial:function(){
    var self=this;
    var specialid=this.data.specialid;
    wx.request({
      url: getApp().globalData.url + '/zhuanti/getSpecial',
      data: {
        specialid: specialid
      },
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
        if(res.data.msg=="OK"){
          var title=res.data.name;
          var urls = res.data.imgUrls;
          var imgUrls=[];
          var arr=urls.split(",");
          wx.setNavigationBarTitle({
            title: title
          })
          for(var i=0;i<arr.length;i++){
            if(i==0){
              imgUrls.push({ url: arr[i], img: "biaotou" });
            }else{
              imgUrls.push({ url: arr[i], img: "gaibianchang" });
            }
          }
          self.setData({
            imgUrls: imgUrls,
            swiperCurrent: 0
          })
        }
      }
    })
  },
  /**
   * 加载课程
   */
  loadCourse:function(){
    var self = this;
    var specialid = this.data.specialid;
    wx.request({
      url: getApp().globalData.url + '/zhuanti/getSpecialCourse',
      data: {
        specialid: specialid,
        jzid: getApp().globalData.jiaozhengid,
        page:page,
        rows:6
      },
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
        if (res.data.msg == "OK") {
          var list = res.data.list;
          var courseList = self.data.courseList;
          for(var i=0;i<list.length;i++){
            courseList.push(list[i]);
          }
          self.setData({
            courseList: courseList
          });          
          if(list.length>0){
            page++;
          }else{
            self.setData({
              dibu: false
            })
            if(page>1){
              wx.showToast({
                title: '暂无更多数据',
                icon: 'none',
                duration: 1000
              })
            }
          }
        }
      }
    })
  },
  imgChange: function (e) {
    // console.log("轮播图动画change方法");
    var index = e.detail.current;
    var imgUrls = this.data.imgUrls;

    for (var i = 0; i < imgUrls.length; i++) {
      if (i == index) {
        //img = "biaotou";
        imgUrls[i].img = "biaotou";
      } else {
        //img = "gaibianchang";
        imgUrls[i].img = "gaibianchang";
      }

    }
    this.setData({
      imgUrls: imgUrls
    })
  },
  gaibian: function () {

  },
  /**
  * 添加选课记录
  */
  chooseCourse: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var courseid = e.currentTarget.dataset.id;

    var url = getApp().globalData.url + '/course/saveSign';
    wx.request({
      url: url, //获取视频播放信息
      data: { 
        courseid: courseid, 
        jzid: getApp().globalData.jiaozhengid
        },
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
        if (res.data == "ok") {//选课成功
          var courseList = that.data.courseList;
          courseList[index].isSign = 1;
          that.setData({
            courseList: courseList,
          });
          wx.showToast({
            title: '选课成功',
            icon: 'success',
            duration: 1000
          })
        } else if (res.data == "more") {
          wx.showToast({
            title: '选择课时超出',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
  * 取消选课  判断播放进度是否为0  不是0不可以取消
  */
  cancleSign: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var courseid = e.currentTarget.dataset.id;

    var url = getApp().globalData.url + '/course/cancleSign';
    wx.request({
      url: url, //获取视频播放信息
      data: { 
        courseid: courseid, 
        jzid: getApp().globalData.jiaozhengid 
        },
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
          var courseList = that.data.courseList;
          courseList[index].isSign = 0;
          that.setData({
            courseList: courseList,
          })
          wx.showToast({
            title: '取消课程成功',
            icon: 'success',
            duration: 1000
          })
        } else if (res.data == "progress") {//进度不为空
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
  },
  /**
   * 单击课程跳转到播放页面
   */
  bofang: function (e) {
    var courseid = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/zhuanti',
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
    //专题id
    var specialid = options.specialid;
    this.setData({
      specialid: specialid
    })
    page=1;
    this.loadSpecial();
    this.loadCourse();
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
    this.setData({
      dibu:true
    })
    this.loadCourse();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})