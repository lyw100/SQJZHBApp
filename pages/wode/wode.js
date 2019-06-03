var pageReport=2;//思想汇报页码
Page({
  /**
   * 页面的初始数据
   */
  data: {
    kechxz_wxz:false,
    kechxz_xz:true,
    zaixks_wxz:true,
    zaixks_xz: false,
    sixhb_wxz: true,
    sixhb_xz: false,
    xinlpg_wxz: true,
    xinlpg_xz: false,
    wdsc_hui:true,
    wdsc_lan:false,
    kechengxuexixs:true,
    zaixiankaoshixs:false,
    sixianghbxianshi:false,
    xinlipgxianshi:false,
    qiandaoxs:true,
    wodeshoucangmk:false,
    reportList: [],//思想汇报列表
    hours:0,//已完成学时
    labor_hours:0,//劳动时长
    page:1,
    rows:6,
    dibu:false,
    scpage:1,
    courseList:[]
  },

  sxhb_zhankai: function (e) {
    let index = e.currentTarget.dataset.index;
    let reportList=this.data.reportList;
    reportList[index].isFold = !reportList[index].isFold;
    this.setData({
      reportList: reportList,
    })
  },
  //签到  已签到
  qiandao:function(){
      var that = this
      wx.request({
        url: getApp().globalData.url + '/jzryqd/saveQD', //保存签到
        method: "POST",
        // 请求头部  
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          jzid: getApp().globalData.jiaozhengid
        },
        success: function (res) {
          //判断session
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          if(res.data == "OK"){
            that.setData({
              qiandaoxs: false,
              yiqiandaoxs: true
            })
            wx.showToast({
              title: '签到成功',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
  qiandaotype:function(){
    var that = this
    wx.request({
      url: getApp().globalData.url + '/jzryqd/getQDType', //获取签到状态
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        jzid: getApp().globalData.jiaozhengid
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if (res.data == "OK") {
          that.setData({
            qiandaoxs: false,
            yiqiandaoxs: true
          })
        }else{
          that.setData({
            qiandaoxs: true,
            yiqiandaoxs: false
          })
        }
      }
    })
  },

  lianjie:function(){
    wx.showActionSheet({
      itemList: ['退出当前账号登录','清除缓存'],//'修改密码'功能屏蔽2019-05-18
      success(res) {
        // if(res.tapIndex==0){
        //   wx.navigateTo({
        //     url: '../yanzheng/yanzheng'
        //   })
        // }else 
        if (res.tapIndex == 0) {//res.tapIndex==1
          wx.request({
            url: getApp().globalData.url +'/weChat/user/logout',
            method:"POST",
            data:{},
            header:{
              'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
              //判断session
              if (res.data.timeOut == 'OUT') {
                wx.reLaunch({
                  url: '../shouye/shouye'
                });
                return false;
              }
            }
          })
          getApp().globalData.jiaozhengid = "";
          getApp().globalData.header.Cookie = "";
          wx.reLaunch({
            url: '../denglu/denglu'
          })
        } else if (res.tapIndex == 1) {//res.tapIndex==2
          wx.clearStorage({
            success: function (res) {
              wx.showToast({
                title: '清除缓存成功',
                icon: 'none',
                duration: 1000
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '清除缓存失败',
                icon: 'none',
                duration: 1000
              })
            }
          });
        }
       },
      fail(res) {
        // console.log(res.errMsg)
      }
    })
  },
  // 在线考试方法分页加载
  ksloadList: function () {
    var that = this
    var page = this.data.page
    var kshadLastPage = this.data.kshadLastPage
    var jzid = getApp().globalData.jiaozhengid
    if (kshadLastPage) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        dibu:false
      })
      return
    }
    if (this.data.zaixks_wxz == false && this.data.zaixks_xz == true) {
      if (page <= 1) {
        wx.request({
          url: getApp().globalData.url + '/minipro/zxks/getXzkslist',
          method: "POST",
          // 请求头部  
          header: {
            'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: { jzid: jzid},
          success: function (res) {
            //判断session
            if (res.data.timeOut == 'OUT') {
              wx.reLaunch({
                url: '../shouye/shouye'
              });
              return false;
            }
            if (res.data.msg == "success") {
              var xzkslist = res.data.xzkslist
              var xzkslen = xzkslist.length
              // 设置数据  
              that.setData({
                dibu:false,
                xzkslist: xzkslist,
                xzkslen: xzkslen
              })
            }else{
              that.setData({
                dibu: false,
                xzkslen: 0
              })
            }
          }
        })
      }
      wx.request({
        url: getApp().globalData.url + '/minipro/zxks/getLskslist',
        method: "POST",
        // 请求头部  
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          rows: this.data.rows,
          page: page,
          jzid: jzid
        },
        success: function (res) {
          //判断session
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          if (res.data.msg == "success") {
            var lskslist = res.data.lskslist
            // 设置数据  
            that.setData({
              lskslist: that.data.lskslist.concat(lskslist),
              page: page + 1,
              lskslen: that.data.lskslist.length + lskslist.length
            })
          } else {
            var lskslen = that.data.lskslist.length
            that.setData({
              kshadLastPage: true,
              lskslen: lskslen
            })
            // wx.showToast({
            //   title: '暂无更多数据',
            //   icon: 'none',
            //   duration: 1000
            // })
          }
        }
      })
    }
  },

  /**点击在线考试跳转考试详情页 */
  tzzkhsxqym: function (e) {
    var tpid = e.currentTarget.dataset.tpid
    var type = e.currentTarget.dataset.type
    // 0 未考 1已考
    if (type == '0') {
      wx.showModal({
        content: '考试开始后不能停止，确定开始考试吗？',
        success: function (res) {
          if (res.confirm) {
            // 生成试卷
            wx.request({
              url: getApp().globalData.url + '/minipro/zxks/createTestpaper',
              method: "POST",
              // 请求头部  
              header: {
                'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                jzid: getApp().globalData.jiaozhengid,
                tpid: tpid
              },
              success: function (res) {
                //判断session
                if (res.data.timeOut == 'OUT') {
                  wx.reLaunch({
                    url: '../shouye/shouye'
                  });
                  return false;
                }
                if (res.data.msg == "success") {
                  var ppid = res.data.ppid
                  var timeStr = res.data.timeStr
                  var title = res.data.title
                  // 跳转到考试页面
                  wx.navigateTo({
                    url: '../kaoshixiangqing/kaoshixiangqing?ppid=' + ppid + '&timeStr=' + timeStr + '&type=' + type +'&title=' + title
                  })
                } else if (res.data.msg == "notstart"){
                  wx.showToast({
                    title: '考试未开放！',
                    icon: 'none'
                  })
                }else {
                  wx.showToast({
                    title: '生成试卷失败！',
                    icon: 'none'
                  })
                }
              }
            })
          }
        }
      })
    }else {
      // 查询试卷
      wx.request({
        url: getApp().globalData.url + '/minipro/zxks/getHisPPaper',
        method: "POST",
        // 请求头部  
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          jzid: getApp().globalData.jiaozhengid,
          tpid: tpid
        },
        success: function (res) {
          //判断session
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          if (res.data.msg == "success") {
            var ppid = res.data.ppid
            var timeStr = res.data.timeStr
            var title = res.data.title
            if(ppid != ""){
              // 跳转到考试页面
              wx.navigateTo({
                url: '../kaoshixiangqing/kaoshixiangqing?ppid=' + ppid + '&timeStr=' + timeStr + '&type=' + type + '&title=' + title
              })
            }else{
              wx.showToast({
                title: '您没有参加此次考试！',
                icon: 'none'
              })
            }
          } else {
            wx.showToast({
              title: '查询试卷失败！',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  /**
   * 获取矫正人员信息
   */
  rectifyPeople:function(){
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    // console.log(that.globalData.header.Cookie);
    wx.request({
      url: getApp().globalData.url + '/sign/getRectifyPeopleById', //请求当月已选课程地址
      // url: 'http://localhost:8081/SQJZ/sign/cmonthSignList', //请求当月已选课程地址
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
        var jzry = res.data;
        
        that.setData({
          jzry: jzry
        })
      }
    })
  },
  /**
   * 获取当月课程列表
   */
  currentCourse:function(){
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    // console.log(that.globalData.header.Cookie);
    wx.request({
      url: getApp().globalData.url + '/sign/cmonthSignList', //请求当月已选课程地址
      // url: 'http://localhost:8081/SQJZ/sign/cmonthSignList', //请求当月已选课程地址
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
        // var hours = res.data.hours;
        var list = res.data.list;
        that.setData({
          // hours: parseFloat(hours).toFixed(1),
          nowList: list
        })
      }
    })
  },
  /**
   * 获取当月已完成课程总学时
   */
  currentCourseHours: function () {
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    // console.log(that.globalData.header.Cookie);
    wx.request({
      url: getApp().globalData.url + '/sign/signHours', //请求当月已选课程时间
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
        var labor_hours = res.data.labor_hours;
        that.setData({
          hours: parseFloat(hours).toFixed(1),
          labor_hours: parseFloat(labor_hours).toFixed(1),
        })
      }
    })
  },
  /**
   * 历史课程
   */
  historyCourse:function(){
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
        if (that.data.page > 1) {
          if (that.data.historyList != null) {
            list = that.data.historyList.concat(list);
          }
        }
        if (res.data.length > 0) {
          var page = that.data.page + 1;
          that.setData({
            page: page
          });
        }
        
        that.setData({
          dibu:false,
          historyList: list
        })
      }
    })
  },
  /**
   * 视频播放触发事件
   */
  coursePlay:function(e){
    var courseid = e.currentTarget.dataset.courseid;
    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
    wx.navigateTo({ 
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },
  /** 课程学习*/
  kechengxuexi:function(){
    this.setData({
      kechxz_wxz: false,
      kechxz_xz:true,
      zaixks_wxz: true,
      zaixks_xz: false,
      sixhb_wxz: true,
      sixhb_xz: false,
      xinlpg_wxz: true,
      xinlpg_xz: false,
      wdsc_hui: true,
      wdsc_lan: false,
      kechengxuexixs: true,
      zaixiankaoshixs: false,
      sixianghbxianshi: false,
      xinlipgxianshi: false,
      wodeshoucangmk: false,
      wdsc_lan: false,
      wdsc_hui:true,
     
    })
    this.rectifyPeople();//矫正人员信息
    this.currentCourse();//当月课程
    this.historyCourse();//历史课程
  },
  /** 在线考试*/
  zaixiankaoshi: function () {
    this.setData({
      zaixks_wxz:false,
      zaixks_xz: true,
      kechxz_wxz: true,
      kechxz_xz: false,
      sixhb_wxz: true,
      sixhb_xz: false,
      xinlpg_wxz: true,
      xinlpg_xz: false,
      wdsc_hui: true,
      wdsc_lan: false,
      kechengxuexixs: false,
      zaixiankaoshixs: true,
      sixianghbxianshi: false,
      xinlipgxianshi: false,
      wodeshoucangmk:false,
      page: 1,
      xzkslist: [],
      lskslist: [],
      kshadLastPage: false
    })
    this.ksloadList()
  },
  /** 思想汇报*/
  sixianghuibao: function () {
    this.setData({
      sixhb_wxz: false,
      sixhb_xz: true,
      kechxz_wxz: true,
      kechxz_xz: false,
      zaixks_wxz: true,
      zaixks_xz: false,
      xinlpg_wxz: true,
      xinlpg_xz: false,
      wdsc_hui: true,
      wdsc_lan: false,
      kechengxuexixs: false,
      zaixiankaoshixs: false,
      sixianghbxianshi: true,
      xinlipgxianshi: false,
      wodeshoucangmk:false,
    })
   
    
  },
  // 我的收藏
  wodeshoucangtp: function () {
    this.setData({
      kechxz_wxz: true,
      kechxz_xz: false,
      zaixks_wxz: true,
      zaixks_xz: false,
      sixhb_wxz: true,
      sixhb_xz: false,
      xinlpg_wxz: true,
      xinlpg_xz: false,
      kechengxuexixs: false,
      zaixiankaoshixs: false,
      sixianghbxianshi: false,
      xinlipgxianshi: false,
      wodeshoucangmk:true,
      wdsc_lan: true,
      wdsc_hui:false,
      scpage:1,
      courseList:[]
    })
    this.loadCollection();//我的收藏
  },
  /*加载我的收藏*/
  loadCollection:function(){
    var url=getApp().globalData.url;
    var self=this;
    var page=this.data.scpage;
    wx.request({
      url: url+'/wdsc/list',
      data: {
        jzid: getApp().globalData.jiaozhengid,
        page: page,
        rows: 6
      },
      method: 'POST',
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if(res.data.msg=="OK"){
          var list=res.data.list;
          var courseList=self.data.courseList;
          for(var i=0;i<list.length;i++){
            courseList.push(list[i]);
          }
          self.setData({
            courseList: courseList
          })
          if(list.length>0){
            self.setData({
              scpage:page+1
            })
          }else{
            self.setData({
              dibu:false
            })
            wx.showToast({
              title: '暂无更多数据',
              icon:'none',
              duration:1000
            })
          }
        }
      }
    })
  },
  //我的收藏，视频播放
  bofang: function (e) {
    var courseid = e.currentTarget.dataset.id;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/shouyebofang/shouyebofang?record=record&courseid=" + courseid
    })
  },
  /**
   * 我的收藏，选课
   */
  chooseCourse: function (e) {

    var courseid = e.currentTarget.dataset.id;
    var that = this;
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
        
        if (res.data == "ok") {//选课成功
          wx.showToast({
            title: '选课成功',
            icon: 'none',
            duration: 2000
          })
          var courseList=that.data.courseList;
          courseList[index].isSign=1;
          that.setData({
            courseList: courseList,
          })
        } else if (res.data == "more") {
          wx.showToast({
            title: '选择课时超出',
            icon: 'none',
            duration: 2000
          })
        }else{
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
  },
  /**
   * 我的收藏
   * 取消选课  判断播放进度是否为0  不是0不可以取消
   */
  cancleCourse: function (e) {
    var courseid = e.currentTarget.dataset.id;
    var that = this;
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
       
        if (res.data == "ok") {//取消选课成功
          var courseList=that.data.courseList;
          courseList[index].isSign=0;
          that.setData({
            courseList: courseList,
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
  },
  // 义务劳动
  wode_ywld: function () {
    wx.navigateTo({
      url: '../yiwulaodong/yiwulaodong',
    })
  },
  // 我的签到
  wodeqiandao:function(){
    wx.navigateTo({
      url: '../wodeqiandao/wodeqiandao',
    })
  },
  loadReport:function(){
    var path=getApp().globalData.url;
    //var path = 'http://localhost:8080/SQJZ';
    var self = this;
    wx.request({
      url: path + '/report/list',
      data: {
        jzid: getApp().globalData.jiaozhengid,
        page: 1,
        rows: 5
      },
      method: 'POST',
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
        if (res.data.msg == 'OK') {
          var list = res.data.list;
          for (var i = 0; i < list.length; i++) {
            var images = [];
            if (list[i].urls!=null&&list[i].urls.length>0){
              images= list[i].urls.split(',');
            }
            list[i].images = images;
            list[i].isFold=true;
          }
          self.setData({
            reportList: list
          })
        }
      }
    })
  },
  /**
   * 思想汇报，加载更多
   */
  loadMoreReport:function(){
    var path=getApp().globalData.url;
    //var path = 'http://localhost:8080/SQJZ';
    var reportList=this.data.reportList
    var self=this;
    // wx.showLoading({
    //   title: '加载中'
    // })
    wx.request({
      url: path+'/report/list',
      data:{
        jzid: getApp().globalData.jiaozhengid,
        page: pageReport,
        rows:5
      },
      method:'POST',
      header:{
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res){
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if(res.data.msg=='OK'){
          var list = res.data.list;
          if(list.length>0){
            for (var i = 0; i < list.length; i++) {
              var images = [];
              if (list[i].urls!=null&&list[i].urls.length > 0) {
                images = list[i].urls.split(',');
              }
              list[i].images = images;
              list[i].isFold = true;
              reportList.push(list[i])
            }
            self.setData({
              reportList: reportList
            })
            pageReport++;
          }
        }
      },
      complete: function () {
        setTimeout(function () {
          // wx.hideLoading()
          self.setData({
            dibu:false
          })
        }, 1000)
      }
    })
  },
  /** 心理评估*/
  xinlipiggu: function () {
    this.setData({
      xinlpg_wxz: false,
      xinlpg_xz: true,
      kechxz_wxz: true,
      kechxz_xz: false,
      zaixks_wxz: true,
      zaixks_xz: false,
      sixhb_wxz: true,
      sixhb_xz: false,
      wdsc_hui: true,
      wdsc_lan: false,
      kechengxuexixs: false,
      zaixiankaoshixs: false,
      sixianghbxianshi: false,
      xinlipgxianshi: true,
      xlhadLastPage: false,
      wodeshoucangmk:false,
      psyReportList:[],
      xinlipage: 1,
    })
    this.loadPsyReportList();
  },
  //加载心理评估页面的历史评估
  loadPsyReportList: function () {
    var that = this;
    var page = this.data.xinlipage
    var xlhadLastPage = this.data.xlhadLastPage
    if (xlhadLastPage) {
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
      that.setData({
        dibu: false
      })
      return
    }
    if (this.data.xinlpg_wxz == false && this.data.xinlpg_xz == true) {
      wx.request({
        url: getApp().globalData.url + '/psyass/getPsyReportList', //获取历史评估
        method: "POST",
        // 请求头部  
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          rows: this.data.rows,
          page: page,
          jzid: getApp().globalData.jiaozhengid
        },
        success: function (res) {
          //判断session
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          if (res.data.msg == "success") {
            var list = res.data.maplist
            // 设置数据  
            that.setData({
              dibu:false,
              psyReportList: that.data.psyReportList.concat(list),
              xinlipage: page + 1,
              xlpglen: that.data.psyReportList.length + list.length
            })
          } else {
            that.setData({
              dibu: false,
              xlhadLastPage: true,
              xlpglen: that.data.psyReportList.length
            })
            // wx.showToast({
            //   title: '暂无更多数据',
            //   icon: 'none',
            //   duration: 1000
            // })
          }
        }
      })
    }
  },
  /**
   * 跳转播放页面
   */
  tzbofangym:function(){
    wx.navigateTo({
      url: '../shouyebofang/shouyebofang',
    })
  },
  /**
   * 心理评估 开始测试页面
   * 点击查看 跳转结果页面
   */
  tzxinlipinggu:function(){
    wx.navigateTo({
      url: '../xinlipinggu/xinlipinggu',
    })
  },
  tzceshijieguo: function (e) {
    var psyreportid = e.currentTarget.dataset.psyreportid;
    wx.navigateTo({
      url: '../ceshijieguo/ceshijieguo?psyrepid=' + psyreportid,
    })
  },

  /**点击拍照确定 跳转拍照页面 现在把链接做到拍照汇报标题上
   */
  tzpaizhaoyemian:function(){
    var imgList=[];
    wx.navigateTo({
      url: '../paizhaoshangchuan/paizhaoshangchuan?imgList='+JSON.stringify(imgList),
    })
  },
  /**
   * 思想汇报，点击选择图片
   */
  dianji:function(){
    var images=[];
    var path = getApp().globalData.url;
    //var path = 'http://localhost:8080/SQJZ'
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: '../paizhaoshangchuan/paizhaoshangchuan?imgList='+JSON.stringify(tempFilePaths),
        })
      }
    })
  },
  /**
   * 思想汇报列表，单击图片预览
   */
  imgPreview:function(event){
    var src=event.currentTarget.dataset.src
    var list=event.currentTarget.dataset.list
    wx.previewImage({
      urls: list,
      current: src
    })
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/wode',
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
  // 集中学习
  jizhongxuexi: function(){
    wx.navigateTo({
      url: '../jizhongxuexi/jizhongxuexi',
    })
    // wx.showToast({
    //   title: '功能开发中',
    //   icon: 'none',
    //   duration: 1000
    // })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadReport();
    pageReport = 2;

    this.rectifyPeople();//矫正人员信息
    this.qiandaotype();
    // this.currentCourse();//当月课程
    this.historyCourse();//历史课程
    //this.loadCollection();//我的收藏
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
    this.currentCourseHours();
    
    // 在线考试刷新
    if (this.data.zaixks_wxz == false && this.data.zaixks_xz == true) {
      this.zaixiankaoshi()
    }
    //思想汇报
    if (this.data.sixhb_wxz == false && this.data.sixhb_xz == true) {
      this.loadReport();
      pageReport = 2;
    }
    if (this.data.kechxz_xz) {//是否选择是课程学习
      var that = this;
      setTimeout(function () {
        that.currentCourse();
      }, 200)
    }
    //心里评估刷新
    if (this.data.xinlpg_wxz == false && this.data.xinlpg_xz == true) {
      this.xinlipiggu();
    }
    //我的收藏
    if (this.data.wodeshoucangmk){
      this.setData({
        scpage:1,
        courseList:[]
      })
      this.loadCollection();
    }
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
    var sxhb=this.data.sixhb_xz;
    if (sxhb){
      this.loadMoreReport()
    }
    if (this.data.kechxz_xz){//是否选择是课程学习
      this.historyCourse();//历史课程
    }

    // 在线考试上拉触底
    if (this.data.zaixks_wxz == false && this.data.zaixks_xz == true) {
      this.ksloadList();
    }
      // 心理评估上拉触底 
    if (this.data.xinlpg_wxz == false && this.data.xinlpg_xz == true) {
      this.loadPsyReportList();
    }
    //我的收藏
    if (this.data.wodeshoucangmk){
      this.loadCollection();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
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
        
        if (res.data == "ok") {//取消选课成功
          var nowList = that.data.nowList;
          nowList.splice(index, 1);
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