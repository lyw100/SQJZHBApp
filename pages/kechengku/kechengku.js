Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstshow: true,//第一次加载页面内容
    menuflag: true,
    photohidden: false,
    jingxuan: 'xzzhangtai',
    shipin: 'lanse',
    tuwen: '',
    yuyin: '',
    indicatorDots: false,
    bixiuyanse: 'yanse',
    xuankeShow: true,
    yixuanShow: false,
    shipinShow: true,
    tuwenShow: false,
    yuyinShow: false,
    page: 1,
    subid: 'sub',
    dingwei_yincang: false,
    dibu: false,
  },
  /**遮罩层 */
  // 遮罩层显示
  denghaoanniu: function () {
    this.setData({ menuflag: false })
  },
  // 遮罩层隐藏
  conceal: function () {
    this.setData({ menuflag: true })
  },

  xzkc: function (event) {
    this.setData({
      xuankeShow: false,
      yixuanShow: true
    })
  },
  yiyuankecheng: function (event) {
    this.setData({
      xuankeShow: true,
      yixuanShow: false
    })
  },
  /**
   * 视频 图文 语音页面切换
   */
  shipin: function () {
    this.setData({
      shipin: 'lanse',
      tuwen: '',
      yuyin: '',
    })
  },
  tuwen: function () {
    this.setData({
      shipin: '',
      tuwen: 'lanse',
      yuyin: '',
    })
  },
  yuyin: function () {
    this.setData({
      shipin: '',
      tuwen: '',
      yuyin: 'lanse',
    })
  },
  /**
   * 搜索页面跳转
   */
  onSousuo: function () {
    // courseType = 0 视频
    // subjectType = 0 必修
    var subType = this.data.subType;
    // console.log("subType:"+subType);
    wx.navigateTo({
      url: '../sousuo/sousuo?subjectType=' + subType + '&courseType=&menu=course&subjectId=',
    })
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/kechengku',
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

    //轮播图
    // this.topCourseList();
    //获取必修科目
    this.getKMList(0);
    this.countInfo();
    this.getZJJZCourse();
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
    // console.log(this.data.firstshow);
    if (this.data.firstshow == false) {
      var that = this;
      that.getZJJZCourse();
      let jzid = getApp().globalData.jiaozhengid;
      let subList = this.data.subList;
      for (let i = 0; i < subList.length; i++) {
        let courseList = subList[i].courseList;
        for (let j = 0; j < courseList.length; j++) {
          wx.request({
            url: getApp().globalData.url + '/course/isSign', //获取视频播放信息
            data: { courseid: courseList[j].id, jzid: jzid },
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
              if (res.data == "true") {//是选课内容
                subList[i].courseList[j].isSign = 1;
                that.setData({
                  subList: subList,
                })

              }else{
                
                subList[i].courseList[j].isSign = 0;
                that.setData({
                  subList: subList,
                })
              }
            }
          })
        }
      }

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
    //轮播图
    // this.topCourseList();
    //获取必修科目
    this.getKMList(0);
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var jingxuan = this.data.jingxuan;
    if (jingxuan == "") {//选择的tab不是精选 可以继续加载
      var page = this.data.page + 1;
      this.setData({
        page: page,
        dibu: true,
      });
      this.getCourseBysubid(0, 6, page);
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取点击量最多的5个课程
   */
  topCourseList: function () {
    var that = this;
    var query = {};
    var url = getApp().globalData.url + '/sign/topCourseList';
    if (this.data.jingxuan != ""){
      //精选课程
      query.subid = 0;
      url = getApp().globalData.url + '/sign/kckTopCourseList';
    } else if ( this.data.subList[0].id == this.data.subTabList[0].id){
      //正则法规教育
      url = getApp().globalData.url + '/sign/kckTopCourseList';
      query.subid = this.data.subList[0].id;
    }else {
      //其它
      query.subid = this.data.subList[0].id;
    }
    // if (this.data.bixiuyanse=="yanse"){
    //   query.type=0;
    // }else{
    //   query.type=1;
    // }
    wx.request({
      url: url, //获取点击量最多的3个课程
      data: query,
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

  },


  /**
   * 获取所有科目   subType 0  必修   1选修
   */
  getKMList: function (subType) {

    // if(subType==0){
    //   this.setData({
    //     jingxuan:'xzzhangtai',
    //     bixiuyanse:'yanse',
    //     xuanxiuyanse:'',
    //     subType:subType,
    //     page:1
    //   })
    // }else if(subType==1){
    //   this.setData({
    //     jingxuan: 'xzzhangtai',
    //     bixiuyanse: '',
    //     xuanxiuyanse: 'yanse',
    //     subType: subType,
    //     page: 1
    //   })
    // }
    this.setData({
      jingxuan: 'xzzhangtai',
      subid: 'sub',
      // bixiuyanse: '',
      // xuanxiuyanse: 'yanse',
      // subType: subType,
      page: 1
    })
    this.topCourseList();
    var that = this;
    //获取科目
    wx.request({
      url: getApp().globalData.url + '/course/listKM', //获取科目列表
      data: { 'type': '' },
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
        var subList = res.data;
        that.setData({
          subList: subList,
          subTabList: subList
        })
        for (var i = 0; i < subList.length; i++) {
          that.data.subTabList[i].tabClass = "";
          var subid = subList[i].id;
          if (i == 1) {
            that.getCourseBysubid(i, 3, 1);
          } else {
            that.getCourseBysubid(i, 4, 1);
          }

        }

      }
    })
  },

  /**
   * 点击课程tab栏
   */
  subTap: function (e) {
    this.setData({ menuflag: true })
    wx.showLoading({
      title: '加载中',
    })
    var subid = e.currentTarget.dataset.subid;
    var index = e.currentTarget.dataset.index;
    var subTabList = this.data.subTabList;
    this.data.subList = [];
    if (index != null) {//点击非精选科目
      // this.data.jingxuan="";

      this.data.subList[0] = subTabList[index];
      this.getCourseBysubid(0, 6, 1);
      for (var i = 0; i < subTabList.length; i++) {
        subTabList[i].tabClass = "";
      }
      subTabList[index].tabClass = "xzzhangtai";
      this.setData({
        jingxuan: '',
        subTabList: subTabList
      });
      var that = this;
      that.setData({
        page: 1,
        subid: 'sub' + subid
      });
    } else {//点击精选tab
      // this.data.jingxuan = "jingxuan";
      this.setData({
        jingxuan: 'xzzhangtai',
        page: 1,
        subid: 'sub'
      });
      this.data.subList = subTabList;
      for (var i = 0; i < subTabList.length; i++) {
        subTabList[i].tabClass = "";
        if (i == 1) {
          this.getCourseBysubid(i, 3, 1);
        } else {
          this.getCourseBysubid(i, 4, 1);
        }
      }


    }

    //轮播图
    this.topCourseList();

    this.setData({
      subTabList: subTabList
    });
    //跳转到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })

    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  
  },
  getZJJZCourse: function () {
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    wx.request({
      url: getApp().globalData.url + '/course/getCourseBySubid', //根据课程id获取课程
      data: { jzid: jzid, subid: -1 },
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
        var zjjzList = res.data;
        that.setData({
          zjjzList: zjjzList
        })
      }
    })
  },
  /**
   * 根据课程id获取课程
   */
  getCourseBysubid: function (index, rows, page) {
    var jzid = getApp().globalData.jiaozhengid;
    var that = this;
    var subList = that.data.subList;
    var subid = subList[index].id;
    wx.request({
      // url: 'http://localhost:8081/SQJZ' + '/course/getCourseBySubid', //根据课程id获取课程
      url: getApp().globalData.url + '/course/getCourseBySubid', //根据课程id获取课程
      data: { jzid: jzid, subid: subid, page: page, rows: rows },
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
        var courseList = res.data;
        if (page == 1) {
          subList[index].courseList = courseList;
        } else {
          courseList = subList[index].courseList.concat(courseList);
          subList[index].courseList = courseList;
        }
        // console.log(subList);
        that.setData({
          dibu: false,
          subList: subList,
        })
        // console.log(that.data);
      }
    })

  },
  /**
     * 专家讲座跳转到更多课程页面
     */
  moreZJJZ: function (e) {
    var subid = -1;
    var subname ="专家讲座";
    wx.navigateTo({
      url: '../gengduotuijian/gengduotuijian?subid=' + subid + '&title=' + subname,
    });
  },
  /**
   * 跳转到更多课程页面
   */
  moreSubCourse: function (e) {
    var subid = e.currentTarget.dataset.subid;
    var subname = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../gengduotuijian/gengduotuijian?subid=' + subid + '&title=' + subname,
    });
  },
  /**
   * 选课
   */
  chooseCourse: function (e) {

    var courseid = e.currentTarget.dataset.id;
    var that = this;
    var subindex = e.currentTarget.dataset.subindex;
    var index = e.currentTarget.dataset.index;

    var jzid = getApp().globalData.jiaozhengid;
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
          wx.showToast({
            title: '选课成功',
            icon: 'none',
            duration: 2000
          })
          if (subindex=='zjjz'){//判断是否是专家讲座
            var zjjzList = that.data.zjjzList;
            zjjzList[index].isSign = 1;
            that.setData({
              zjjzList: zjjzList,
            })
            let jingxuan = that.data.jingxuan;
            if(jingxuan!=""){
              let subid = zjjzList[index].subject.id;
              let courseid = zjjzList[index].id;
              let subList = that.data.subList;
              for (let i = 0; i < subList.length;i++){
                if(subid==subList[i].id){
                  let courses=subList[i].courseList;
                  for(let j=0;j<courses.length;j++){
                    if(courseid==courses[j].id){
                      courses[j].isSign = 1;
                      that.setData({
                        subList: subList,
                      })
                    }
                  }
                }
              }
            }
          }else{
            var subList = that.data.subList;
            var courseList = subList[subindex].courseList;
            courseList[index].isSign = 1;
            that.setData({
              subList: subList,
            })
            let jingxuan = that.data.jingxuan;
            if (jingxuan != "") {
              let zjjzList = that.data.zjjzList;
              for (let i = 0; i < zjjzList.length; i++) {
                if (courseList[index].id == zjjzList[i].id) {
                  zjjzList[i].isSign = 1;
                  that.setData({
                    zjjzList: zjjzList,
                  })
                }
              }
            }
          }
          

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

  //视频播放
  bofang: function (e) {
    var courseid = e.currentTarget.dataset.id;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },
  /**
   * 获取必修科目
   */
  bixiuke: function () {
    this.getKMList(0);
  },
  /**
   * 获取选修科目
   */
  xuanxiuke: function () {
    this.getKMList(1);
  },

  /**
   * 取消选课  判断播放进度是否为0  不是0不可以取消
   */
  cancleSign: function (e) {
    var courseid = e.currentTarget.dataset.id;
    var that = this;
    var subindex = e.currentTarget.dataset.subindex;
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
          if (subindex == 'zjjz') {//判断是否是专家讲座
            var zjjzList = that.data.zjjzList;
            zjjzList[index].isSign = 0;
            that.setData({
              zjjzList: zjjzList,
            })
            let jingxuan = that.data.jingxuan;
            if (jingxuan != "") {
              let subid = zjjzList[index].subject.id;
              let courseid = zjjzList[index].id;
              let subList = that.data.subList;
              for (let i = 0; i < subList.length; i++) {
                if (subid == subList[i].id) {
                  let courses = subList[i].courseList;
                  for (let j = 0; j < courses.length; j++) {
                    if (courseid == courses[j].id) {
                      courses[j].isSign = 0;
                      that.setData({
                        subList: subList,
                      })
                    }
                  }
                }
              }
            }
          }else{
            var subList = that.data.subList;
            var courseList = subList[subindex].courseList;
            courseList[index].isSign = 0;
            that.setData({
              subList: subList,
            })
            let jingxuan = that.data.jingxuan;
            if (jingxuan != "") {
              let zjjzList = that.data.zjjzList;
              for (let i = 0; i < zjjzList.length; i++) {
                if (courseList[index].id == zjjzList[i].id) {
                  zjjzList[i].isSign = 0;
                  that.setData({
                    zjjzList: zjjzList,
                  })
                }
              }
            }
          }
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
  },
  /**
   * 轮播图改变样式
   */
  imgChange: function (e) {
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
  }
})