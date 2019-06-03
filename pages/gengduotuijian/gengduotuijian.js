Page({
  tzbfy:function(){
    wx.navigateTo({
      url: '../shouyebofang/shouyebofang',
    })
  },
  onSousuo:function(){
    wx.navigateTo({
      url: '../sousuo/sousuo?subjectType=&courseType=&menu=course&subjectId='+this.data.subid,
    })
  },

  gaibian:function(){

  },

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    // shipinShow: 'lanse',
    // tuwenShow:'',
    // yuyinShow: '',
    page:1,
    moreList:[],
    dibu: false,//加载样式
    firstshow: true,//第一次加载页面内容
  },

  // shipin:function(){
  //  this.setData({
  //     shipinShow: 'lanse',
  //     tuwenShow : '',
  //     yuyinShow : '',
  //  })
  // },
  // tuwen: function () {
  //   this.setData({
  //     shipinShow: '',
  //     tuwenShow: 'lanse',
  //     yuyinShow: '',
  //   })
  // },
  // yuyin: function () {
  //   this.setData({
  //     shipinShow: '',
  //     tuwenShow: '',
  //     yuyinShow: 'lanse',
  //   })
  // },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/gengduotuijian',
      data: {},
      method: "POST",
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
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
    var that=this;
    var subid=options.subid;
    var title=options.title;
    if(title!=null&&title!=""){
      wx.setNavigationBarTitle({
        title: title,
      })
    }
    var jzid = getApp().globalData.jiaozhengid;
    this.setData({
      subid:subid,
      jzid:jzid
    })
    wx.request({
      url: getApp().globalData.url + '/sign/topCourseList', //获取点击量最多的3个课程
      data: { subid: subid},
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res.data);
        var list = res.data;
        for(var i=0;i<list.length;i++){
          if(i==0){
            list[i].img ="biaotou";
            list[i].text ="titxinxi";
          }else{
            list[i].img = "gaibianchang";
            list[i].text = "xiaotuzi";
          }
        }
        that.setData({
          swiperCurrent: 0,
          imgUrls: list
        })
      }
    })
    //获取更多推荐
    this.moreCourseList();
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
  onShow: function (options) {
    if (this.data.firstshow == false) {
      var that = this;
      var subid = that.data.subid;
      that.setData({
        page: 1,
        moreList: [],
      })
      
      wx.request({
        url: getApp().globalData.url + '/sign/topCourseList', //获取点击量最多的3个课程
        data: { subid: subid },
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          // console.log(res.data);
          var list = res.data;
          for (var i = 0; i < list.length; i++) {
            if (i == 0) {
              list[i].img = "biaotou";
              list[i].text = "titxinxi";
            } else {
              list[i].img = "gaibianchang";
              list[i].text = "xiaotuzi";
            }
          }
          that.setData({
            swiperCurrent: 0,
            imgUrls: list
          })
        }
      })
      //获取更多推荐
      this.moreCourseList();
      this.countInfo();

    }
    //下一次不是第一次渲染
    this.setData({
      firstshow: false,
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
    this.setData({
      dibu: true,
    })
    //获取更多推荐
    this.moreCourseList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bofang1: function (e){
    if (this.data.subid!=-1){
      this.bofang(e);
    }
  },
  bofang:function(e){
    var courseid = e.currentTarget.dataset.courseid;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },

  moreCourseList:function(){
    
    var that=this;
    var page=this.data.page;
    var url = getApp().globalData.url + '/course/getMoreCourse';//获取推荐课程列表地址
    var subid=this.data.subid;
    var jzid=this.data.jzid;
    wx.request({
      url: url, //获取推荐课程列表地址
      data: { jzid: jzid, subid: subid, page: page, rows: 6 },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res.data);        
        var list = res.data;
        if(list.length>0){
          var moreList = that.data.moreList.concat(list);
          page+=1;
          that.setData({
            page:page,
            moreList: moreList,
          })
        }
        that.setData({
          dibu: false,
        })

      }
    })

  },

  /**
   * 轮播图动画结束方法
   */
  gaibian:function(e){
    // console.log("轮播图动画结束方法");
    

  },
  
  imgChange:function(e){
    // console.log("轮播图动画change方法");
    var index = e.detail.current;
    var imgUrls = this.data.imgUrls;
    for (var i = 0; i < imgUrls.length; i++) {
      if (i == index) {
        imgUrls[i].img = "biaotou";
        imgUrls[i].text = "titxinxi";
      } else {
        imgUrls[i].img = "gaibianchang";
        imgUrls[i].text = "xiaotuzi";
      }

    }
    this.setData({
      imgUrls: imgUrls
    })
  },

  /**
   * 添加选课记录
   */
  chooseCourse: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var courseid = e.currentTarget.dataset.id;
    var jzid = this.data.jzid;

    var url = getApp().globalData.url + '/course/saveSign';
    wx.request({
      url: url, //获取视频播放信息
      data: { courseid: courseid, jzid: jzid },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      dataType: 'text',
      success(res) {
        
        if (res.data == "ok") {//选课成功
          wx.showToast({
            title: '选课成功',
            icon: 'none',
            duration: 2000
          })
          var moreList = that.data.moreList;
          moreList[index].isSign = 1;
          that.setData({
            moreList: moreList,
          })
          // that.moreCourseTap(e);
        } else if (res.data == "more") {
          wx.showToast({
            title: '选择课时超出',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (res.data.indexOf("{") == 0 && res.data.lastIndexOf("}") != -1){
            var data = JSON.parse(res.data);
            //判断session
            if (data.timeOut == 'OUT') {
              wx.reLaunch({
                url: '../shouye/shouye'
              });
              return false;
            }
          }
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
    var jzid = this.data.jzid;

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
        
        if (res.data == "ok") {//取消选课成功
          var moreList = that.data.moreList;
          moreList[index].isSign = 0;
          that.setData({
            moreList: moreList,
          })
          wx.showToast({
            title: '取消课程成功',
            icon: 'none',
            duration: 2000
          })
          // that.moreCourseTap(e);
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
        } else {
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
        }
      }
    })
  }
})
