var WxParse = require('../../wxParse/wxParse.js');
var interval;
var timer;
Page({
  // gengduotj: function () {
  //   let subid = this.data.record.course.subject.id;
  //   wx.redirectTo({
  //     url: '../gengduotuijian/gengduotuijian?subid=' + subid,
  //   });
  // },
  /**
   * 页面的初始数据
   */
  data: {
    addPlayNum:false,//当前视频获取后是否添加播放次数
    photoTimes:[],//刷脸时间的集合
    face:true,//作为是否刷脸的依据
    countdown:60,//刷脸倒计时
    xianshi: false,
    shualiandl: false,//是否显示刷脸登录弹窗
    duigouxz: false,
    wbf:false,
    sc_xianshi:true,
    sc_yingcang:false,
    xk_xianshi: true,
    xk_yingcang: false,
    kcjj_yincang:false,
    xianshiyemain:true,
    lastTime:0,
    dibu: false,
    yulan:true,
    page:1,
    shoucangzhong:false,
    shiti:false,//是否显示试题
    curQindex:0,//当前试题的索引
    curQswiper:0,//主动控制当前试题的索引变量
    sectionEnd:false//当前课程是否播放结束
  },
  // 点击收藏 选课显示
  shoucangdj:function(){
    this.setData({
      sc_xianshi: false,
      sc_yingcang: true,
    })
  },
  // 课程简介点击
  tiaozhuanjj:function(){
    this.setData({
      kcjj_yincang: true,
      xianshiyemain: false,
    })
  },
  // 详情页叉号
  ch_tz: function () {
    this.setData({
      kcjj_yincang: false,
      xianshiyemain: true,
    })
  },
  xuankedj: function () {
    this.setData({
      xk_xianshi: false,
      xk_yingcang: true,
    })
  },
  myCatchTouch: function () {
    // console.log('stop user scroll it!');
    return;
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/shouyebofang',
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
    let that = this;
    let data = {};
    let url = '';
    let jzid = getApp().globalData.jiaozhengid;
    data.jzid = jzid;
    if (options.record == 'sign') {//选课播放记录
      data.id = options.id;
      url = getApp().globalData.url + '/course/getSignRecord';
    } else if (options.record == 'scan') {//浏览播放记录
      data.id = options.id;
      url = getApp().globalData.url + '/course/getScanRecord';
    } else if (options.record == 'record') {//播放记录
      data.courseid = options.courseid;
      url = getApp().globalData.url + '/course/getRecord';
    }

    // data.courseid = 42;
    // url = 'http://localhost:8081/SQJZ/course/getRecord';
    wx.request({
      url: url, //获取视频播放信息
      data: data,
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
        let isSign = 0//标识是选课 0为浏览
        if (res.data.operator != null) {
          isSign = 1;//播放课程为选课课程
        }
       
        let sections = res.data.course.sections;
        let flag=true;
        for (let i = 0; i < sections.length; i++) {
          if(sections[i].state==1){//判断章节是否播放完
            sections[i].yanse = "zhangjieend";
          }else{
            if (flag){//未播放的第一个视频进行播放
              sections[i].yanse = "zhangjie"; 
              that.getVideoSection(res.data.course.id, res.data.course.sections[i].id);
              flag=false;
            }else{
              sections[i].yanse = ""; 
            }
          }
        }
        // console.log(sections);
        if(flag){//所有章节都播放完成
          sections[0].yanse ="zhangjieend zhangjie";
          that.getVideoSection(res.data.course.id, res.data.course.sections[0].id);
        }
        that.setData({
          record: res.data,
          isSign: isSign,
          subType: res.data.course.subject.type,
          sections: sections
        })
        wx.setNavigationBarTitle({
          title: res.data.course.name,
        })

        
        that.moreCourse();

      }
    })
    this.countInfo();


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    
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
    this.videoContext.pause();
    clearTimeout(timer);//取消定时器
    clearInterval(interval);//取消计时器
    this.saveProgress();//保存视频进度
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.videoContext.pause();
    clearTimeout(timer);//取消定时器
    clearInterval(interval);//取消计时器
    this.saveProgress();//保存视频进度
    

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
    if(this.data.shiti==false){
      this.setData({
        dibu:true
      })
      this.moreCourse();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  /**
  * 开始播放时执行的方法
  */
  bindPlay: function () {
    // this.videoContext.play();
    // console.log("点击播放");
    // this.videoContext.requestFullScreen();//执行全屏方法
    if(this.data.sectionEnd){//当前课程播放结束
      this.videoContext.seek(0);
      this.videoContext.pause();//暂停
      this.setData({
        sectionEnd:false
      });
      return;
    }
    if (this.data.shualiandl){
      this.videoContext.pause()
    }else{
      if (this.data.addPlayNum==false){
        this.setData({
          addPlayNum: true
        });
        let progress=this.data.progress;
        // console.log("progress:"+progress);
        let duration=this.data.sectionRecord.section.duration;
        if (duration!=progress){
          this.videoContext.seek(progress);
        }
        let courseid = this.data.record.course.id;//课程id
        let jzid = this.data.record.jzid;
        let url = getApp().globalData.url + '/course/addPlayNum';
        wx.request({
          url: url,
          data: { courseid: courseid,jzid: jzid },
          dataType: 'text',
          header: {
            'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
            'content-type': 'application/json' // 默认值
          },
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
            // console.log(res.data);
            
          }
        })

      }
    }

    
  },
  /**
   * 暂停的方法
   */
  bindPause: function () {
    this.videoContext.pause()
  },
  
  /**
   * 视频播放结束退出全屏
   */
  bindended:function(){
    let progress = parseInt(this.data.progress);
    let sectionRecord = this.data.sectionRecord;
    let duration = sectionRecord.section.duration;
    let isSign=this.data.isSign;
    if (duration - progress < 3) {
      if (isSign==1){//选课
        this.videoContext.exitFullScreen();//执行全屏方法
        if (sectionRecord.state != 1){//未完成课时
          this.getquestions();
        }else{
          this.getNextSection();
        }
      }
    }  
  },
  /**
   * 全屏的方法
   */
  bindFullscreenchange: function (e) {
    // let isfull = e.detail.fullScreen;
    // if (!isfull) {
    //   // console.log("非全屏暂停");
    //   this.videoContext.pause();//视频暂停
    // }
  },
  //视频播放出错的方法
  videoErrorCallback: function (e) {
    // console.log('视频错误信息:')
    // console.log(e.detail.errMsg)
  },
  //防拖拽方法
  bindTimeupdate: function (e) {
    let that=this;
    if(this.data.face==false){
      this.videoContext.pause();//视频播放暂停
    }
    //console.log(e.detail)
    let currentTime = e.detail.currentTime;//当前时间
    let lastTime = this.data.lastTime;//上一个节点的时间
    let progress = this.data.progress;//播放进度  最大的播放时间


    // console.log("progress:" + progress);
    // console.log("currentTime:" + currentTime);
    // console.log("lastTime:" + lastTime);

    if (this.data.isSign==1){//课程为选课课程
      //当前播放时间与上次播放节点时间差大于2秒
      if (lastTime - currentTime > 10 || currentTime - lastTime > 10) {
        if (currentTime < progress) {//当前播放时间小于播放进度
          this.videoContext.seek(currentTime);
          this.setData({
            lastTime: currentTime
          })
          return;
        } else {
          this.videoContext.seek(lastTime);
          return;
        }
      }
      
      if(progress!=this.data.sectionRecord.section.duration){
        //弹出刷脸登录
        //刷脸验证的时间集合 10分钟内 1-2次   大于10分钟  1-3次
        let photoTimes = this.data.photoTimes;
        let cTime=parseInt(currentTime);
        //循环刷脸时间 验证刷脸
        for(let i=0;i<photoTimes.length;i++){
          let time=photoTimes[i].time;
          let flag=photoTimes[i].flag;

          if (cTime == time && flag == false && currentTime>=progress) {
              this.videoContext.exitFullScreen();//退出全屏方法
              this.saveProgress();
              this.videoContext.pause();//视频播放暂停
              photoTimes[i].flag=true;
              setTimeout(function(){
                that.setData({
                  photoTimes: photoTimes,
                  shualiandl: true,
                  xianshi: true,
                  face:false
                });
                that.clearProgress();//重新加载定时器
              },300)
          }
        }
      }

      //正常播放
      if (currentTime > progress) {
        this.setData({
          progress: currentTime
        });
      }



    }else{//课程为非选课课程
      let yulan=this.data.yulan;
      if(currentTime>60&&yulan){
        this.setData({
          yulan:false
        })
        this.videoContext.seek(60);
        this.videoContext.pause();//视频播放暂停
        this.videoContext.exitFullScreen();//退出全屏方法
        wx.showModal({
          title: '提示',
          content: '未选课 可预览时长1分钟',
          showCancel:false,
          success(res) {
            that.setData({
              yulan: true
            })
          }
        })
      }
      if (currentTime < 2){
        wx.showToast({
          title: '未选课 可预览时长1分钟',
          icon: 'none',
          duration: 3000
        })
      }
      //非选课正常播放
      this.setData({
        progress: currentTime
      });
    }
    this.setData({
      lastTime:currentTime
    })
    
    //console.log(currentTime+'==='+lastTime);
  },

  /**
   * 获取推荐课程列表
   */
  moreCourse: function () {
    let that = this;
    // console.log(this.data.record);
    let courseid = this.data.record.course.id;
    let subid = this.data.record.course.subject.id;
    if (courseid != null && courseid > 0) {
      let url = getApp().globalData.url + '/course/getMoreCourse';
      // let url = 'http://localhost:8081/SQJZ/course/getMoreCourse'; //获取推荐课程列表地址
      let jzid = this.data.record.jzid;
      let page=this.data.page;
      wx.request({
        url: url, //获取推荐课程列表地址
        data: { subid: subid, courseid: courseid, page: page, rows: 4, jzid: jzid },
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
          let list = res.data;
          if(page>1){
            list=that.data.moreList.concat(list);
          }
          page=page+1;
          that.setData({
            dibu:false,
            moreList: list,
            page:page
          })
        }
      })

    }
  },

  /**
   * 保存视频进度
   */
  saveProgress: function () {
    let that = this;
    // console.log(this.data.record);
    let courseid = this.data.record.course.id;//课程id
    let sectionid = this.data.sectionRecord.section.id;//课程章节id
    let progress = parseInt(this.data.progress);//进度
    let shualian="";
    if (this.data.shualiandl == true && progress!=0) {
      shualian="1";//正在刷脸中退出
    }else if(this.data.shiti==true){
      shualian = "2";//做试题中退出
    }else{
      shualian = "0";//正常状态退出
    }

    if (this.data.sectionRecord.section.duration - this.data.progress<3){
      progress = this.data.sectionRecord.section.duration;
    }
    let sectionRecord=this.data.sectionRecord;
    sectionRecord.progress = progress;
    this.setData({
      sectionRecord: sectionRecord
    })
    if (courseid != null && courseid > 0) {
      let url = getApp().globalData.url + '/course/saveProgress';
      // let url = 'http://localhost:8081/SQJZ/course/saveProgress'; 
      let jzid = this.data.record.jzid;
      // console.log(jzid);
      wx.request({
        url: url,
        data: {shualian:shualian, id: courseid, progress: progress, jzid: jzid ,sectionid:sectionid},
        dataType: 'text',
        header: {
          'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
          'content-type': 'application/json' // 默认值
        },
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
          // console.log(res.data);

        }
      })

    }
  },

  /**
   * 点击更多视频进行播放
   */
  moreCourseTap: function (e) {
    this.saveProgress();  

    let courseid = e.currentTarget.dataset.id;
    let url = getApp().globalData.url + '/course/getRecord';
    let that = this;
    let jzid = getApp().globalData.jiaozhengid;
    wx.request({
      url: url, //获取视频播放信息
      data: { jzid: jzid, courseid: courseid },
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
        let isSign = 0//标识是选课 0为浏览
        if (res.data.operator != null) {
          isSign = 1;//播放课程为选课课程
        }
       
        let sections = res.data.course.sections;
        let flag = true;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].state == 1) {//判断章节是否播放完
            sections[i].yanse = "zhangjieend";
          } else {
            if (flag) {//未播放的第一个视频进行播放
              sections[i].yanse = "zhangjie";
              that.getVideoSection(res.data.course.id, res.data.course.sections[i].id);
              flag = false;
            } else {
              sections[i].yanse = "";
            }
          }
        }
        if (flag) {//所有章节都播放完成
          sections[0].yanse = "zhangjieend zhangjie";
          that.getVideoSection(res.data.course.id, res.data.course.sections[0].id);
        }
        that.setData({
          record: res.data,
          isSign: isSign,
          sections: sections,
          page:1
        })
        wx.setNavigationBarTitle({
          title: res.data.course.name,
        })

        that.moreCourse();    
        //跳转到顶部
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    })

  },
  /**
   * 添加选课记录
   */
  chooseCourse: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let courseid = e.currentTarget.dataset.id;
    let jzid = this.data.record.jzid;

    let url = getApp().globalData.url + '/course/saveSign';
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
          let moreList = that.data.moreList;
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
        }
      }
    })


  },
  /**
   * 正在播放的视频添加选课
   */
  tianjiaxuanke: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否添加本课程为选课课程',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          let courseid = e.currentTarget.dataset.id;
          let jzid = getApp().globalData.jiaozhengid;

          let url = getApp().globalData.url + '/course/saveSign';
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
                that.setData({
                  isSign: 1,
                  progress: 0,
                  lastTime: 0
                })

                let sections = that.data.sections;
                for (let i = 0; i < sections.length; i++) {
                  if (sections[i].yanse == "zhangjie") {//判断正在播放的章节
                    that.getVideoSection(that.data.record.course.id, sections[i].id);
                  }
                }
                that.videoContext.seek(0);
                // that.moreCourseTap(e);
              } else if (res.data == "more") {
                wx.showToast({
                  title: '选择课时超出',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })

        }
      }
    })


   
  },

  /**
   * 取消选课  判断播放进度是否为0  不是0不可以取消
   */
  cancleSign:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let courseid = e.currentTarget.dataset.id;
    let jzid = this.data.record.jzid;

    let url = getApp().globalData.url + '/course/cancleSign';
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
          let moreList = that.data.moreList;
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
        }
      }
    })
  },


  /**
   * 取消正在播放的视频添加选课
   */
  quxiaoxuanke: function (e) {
    let that = this;
    let courseid = e.currentTarget.dataset.id;
    let jzid = getApp().globalData.jiaozhengid;

    let url = getApp().globalData.url + '/course/cancleSign';
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
          that.setData({
            isSign: 0,
          })
          // that.moreCourseTap(e);
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
   * 获取正在播放的章节信息
   */
  getVideoSection:function(courseid,sectionid){
    let jzid = getApp().globalData.jiaozhengid;
    let that=this;
    wx.request({
      // url:'http://localhost:8081/SQJZ/course/getVideoSection', //获取正在播放的章节信息
      url: getApp().globalData.url + '/course/getVideoSection', //获取正在播放的章节信息
      data: { courseid: courseid, jzid: jzid, sectionid: sectionid},
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
        let progress = res.data.progress;
        let duration= res.data.section.duration;
        let shualian=res.data.shualian;
        //视频弹出验证次数    10分钟以内 弹1-2次    大于10分钟弹 1-3次 
        //视频播放前10%不弹验证 
        let prefix = parseInt(duration * 0.1); 
        let num = 0;//视频弹出验证次数
        if (duration <= 600) {//小于10分钟  弹1-2次 
          num = Math.floor( Math.random()*2+1);
        } else if (duration > 600) {//  大于10分钟弹 1-3次 
          num = Math.floor(Math.random()*3 + 1);
        }
        let photoTimes=[];//刷脸的时间集合
        //根据刷脸次数   循环添加刷脸时间
        for(let i=0;i<num;i++){
          let map={};
          if(i==0&&shualian==1){//上一次观看视频到验证时退出
            map.flag = false;
            map.time = progress;
          }else{
            //随机刷脸时间      整个视频长度的10%进度之内不刷脸  
            let photoTime=parseInt(Math.random() * (duration - prefix) + prefix);
            map.flag=false;
            map.time = photoTime;
          }
          photoTimes.push(map);
        }
        console.log("photoTimes");
        console.log(photoTimes);
        that.setData({
          addPlayNum:false,
          sectionRecord:res.data,
          progress: progress,
          lastTime: progress,
          photoTimes: photoTimes
        });
        
        that.videoContext = wx.createVideoContext('myVideo');
        
      }
    })

  },

  /**
   * 点击章节播放事件
   */
  sectionTap:function(e){
    this.saveProgress();
    let courseid = e.currentTarget.dataset.courseid;
    let sectionid = e.currentTarget.dataset.sectionid;
    let index = e.currentTarget.dataset.index;
    let sections=this.data.sections;
    for(let i=0;i<sections.length;i++){
      if(sections[i].state!=1){
        sections[i].yanse="";
      }else{
        sections[i].yanse = "zhangjieend";
      }
    }
    sections[index].yanse ="zhangjie";

    this.setData({
      sections:sections
    });
    this.getVideoSection(courseid, sectionid);

  },

  /**
   * 刷脸登录
   */
  takePhoto: function () {
    let that=this;
    clearTimeout(timer);//取消定时器
    clearInterval(interval);//取消计时器
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showLoading({
          title: '正在核验身份.....',
        })
        // this.setData({ logindisabled: true });
        let header = getApp().globalData.header; //获取app.js中的请求头
        wx.uploadFile({
          url: getApp().globalData.url + '/course/face',
          filePath: res.tempImagePath,
          header: header,
          formData: {
            telephone: wx.getStorageSync("username")
          },
          name: 'file',
          success: (res) => {
            wx.hideLoading();
            let data = JSON.parse(res.data);
            if (data.msg == "OK") {
              this.setData({
                shualiandl: false,//是否展示刷脸窗口
                xianshi: false,
                face:true//验证通过
              });
              this.videoContext.play();//视频播放暂停
              
            } else {
              wx.showModal({
                title: '提示',
                content: data.msg,
                showCancel: false,
                success:function(){
                  that.clearProgress();//重新加载定时器
                }
              })
            }

          }
        })
      }
    })
  },
  /**
   * 倒计时清除当前视频进度
   */
  clearProgress:function(){
    let that=this;
    let progress=this.data.sectionRecord.progress;
    clearTimeout(timer);
    timer = setTimeout(function () {
      //进度清零  并暂停
      that.videoContext.seek(0);
      that.videoContext.pause();//视频暂停
      that.setData({
        progress: 0,
        lastTime: 0
      });
      that.saveProgress();//保存0进度

    }, 60000);

    this.setData({
      countdown:60
    });

    clearInterval(interval);
    // console.log("countdown:"+that.data.countdown);
    interval=setInterval(function(){
      that.setData({
        countdown: that.data.countdown-1
      });
      if (that.data.countdown==0){
        clearInterval(interval);
      }
    },1000);
  },

  //重新播放视频
  resetVideo:function(){
    this.setData({
      shualiandl: false,
      xianshi: false,
      face: true
    });
    this.getVideoSection(this.data.record.course.id, this.data.sectionRecord.section.id);
  },

  /**
   * 收藏课程
   */
  addcollection: function (e) {
    let shoucangzhong=this.data.shoucangzhong;
    if(shoucangzhong==false){
      this.setData({
        shoucangzhong:true
      })
      let that = this;
      let courseid = e.currentTarget.dataset.id;
      let jzid = this.data.record.jzid;

      let url = getApp().globalData.url + '/course/addCollection';
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
          if (res.data == "ok") {//收藏课程
            let record = that.data.record;
            record.course.collection = 1;
            that.setData({
              record: record,
              shoucangzhong:false
            })
          } else {//收藏失败
            wx.showToast({
              title: '课程收藏失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    }
  },

  /**
   * 取消收藏课程
   */
  delcollection: function (e) {
    let that = this;
    let courseid = e.currentTarget.dataset.id;
    let jzid = this.data.record.jzid;

    let url = getApp().globalData.url + '/course/delCollection';
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
        if (res.data == "ok") {//取消收藏课程
          let record = that.data.record;
          record.course.collection = 0;
          that.setData({
            record: record,
          })

        } else {//取消收藏失败
          wx.showToast({
            title: '课程收藏失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },


  /**
   * 章节视频看完   获取试题
   */
  getquestions: function () {
    let that = this;
    let sectionid = this.data.sectionRecord.section.id;
    
    let url = getApp().globalData.url + '/course/questionList';
    wx.request({
      url: url, //获取视频播放信息
      data: { sectionid: sectionid },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/json' // 默认值
      },
      dataType: 'json',
      success(res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
          if (res.data.length>0) {//章节关联试题数量
            let questions = res.data;
            for (var i = 0; i < questions.length; i++) {
              WxParse.wxParse('topic' + i, 'html', questions[i].content, that)
              if (i === questions.length - 1) {
                WxParse.wxParseTemArray("qcontentArr", 'topic', questions.length, that)
              }
            }
            let qcontentArr = that.data.qcontentArr;
            for (var j = 0; j < qcontentArr.length; j++) {
              let contentStr = ''
              let imgArr = []
              let imgLen = 0
              for (var k = 0; k < qcontentArr[j].length; k++) {
                let node = qcontentArr[j][k].nodes[0]
                if (node.tag == 'img') {
                  imgArr[imgLen] = getApp().globalData.url.substring(0, getApp().globalData.url.length - 5) + node.attr.src
                  imgLen++
                } else {
                  contentStr = contentStr + node.text
                }
              }
              questions[j].content = contentStr
              questions[j].img = imgArr
            }


            that.setData({
              questions: questions,
              curQindex:0,
              curQswiper:0,
              shiti:true
            })
            
          }else{
            that.getNextSection();
          }
      }
    })
  },

  /**
   * 试题完成保存进度 并自动播放下一个章节
   */
  getNextSection :function(){
    this.saveProgress();//保存视频进度

    let progress = parseInt(this.data.progress);
    let sectionRecord = this.data.sectionRecord;
    let duration = sectionRecord.section.duration;
    let isSign = this.data.isSign;


    let sections = this.data.sections;

    for (let i = 0; i < sections.length; i++) {
      if (sections[i].id == this.data.sectionRecord.section.id) {//该章节正在播放的章节
        sections[i].yanse = "zhangjieend";
        if ((i + 1) < sections.length) {//有下一个章节
          this.getVideoSection(this.data.record.course.id, this.data.record.course.sections[i + 1].id);
          if (sections[i + 1].yanse != "zhangjieend") {
            sections[i + 1].yanse = "zhangjie";
          } else {
            sections[i + 1].yanse = "zhangjieend zhangjie";
          }
        }else{
          // this.getVideoSection(this.data.record.course.id, this.data.record.course.sections[i].id);
          sectionRecord.progress = sectionRecord.section.duration;
          this.setData({
            sectionRecord: sectionRecord,
            sectionEnd: true,//当前课程播放结束
            shiti: false
          })
        }

        this.setData({
          sections: sections
        })
      }
    }
  },
  // 题目滑动触发事件
  changeQuestion: function (e) {
    this.setData({
      curQindex: e.detail.current
    })
  },

  // 选择对应选项
  menuClick: function (e) {
    let index = e.currentTarget.dataset.index
    let key = e.currentTarget.dataset.key
    // 点击改变选项样式，存储选项
    let questions = this.data.questions;
    let question = questions[index];
    let qtype = questions[index].type
    // 单选
    if (qtype == '0') {
      question.hasChoose = key;
    }else if (qtype == '1') {// 多选题
      let isChoose = true
      let hasChoose = question.hasChoose;
      if (hasChoose != ""&&hasChoose!=null) {
        let chooseArr = hasChoose.split(",")
        if (chooseArr.indexOf(key)>-1){
          chooseArr.splice(chooseArr.indexOf(key), 1);
          isChoose = false
        }
       
        if (isChoose) {
          question.hasChoose = hasChoose + "," + key
        } else {
          question.hasChoose = chooseArr.join(",")
        }
      } else {
        question.hasChoose = key
      }
    } else if (qtype == '2') {// 判断题
      if ('A' == key) {
        question.hasChoose = '1'
      } else if ('B' == key) {
        question.hasChoose = '0'
      }
    }
    this.setData({
      questions: questions
    })
  },
  /**
   * 试题提交
   */
  questionSubmit:function(){
    let flag=false;
    let questions=this.data.questions;
    let weiwancheng=[];
    for(let i=0;i<questions.length;i++){
      let question=questions[i];
      if (question.hasChoose == null || question.hasChoose==""){
        weiwancheng.push(i+1);
        flag = true;
      }
    }
    if(flag){
      wx.showToast({
        title: '您第' + weiwancheng.join(",") + '道试题未完成',
        icon: 'none',
        duration: 3000
      })
      return;//如果试题未完成返回
    }
    let hasScore=0;
    let rightNum =0;
    let isPass=0;
    let totalScore=0;
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      totalScore += question.score;
      if (question.hasChoose == question.zhengque) {
        hasScore += question.score;
        rightNum+=1;
      }
      question.hasChoose="";//清除已选答案
    }
    //得分小于60% 不及格
    if(hasScore*100/totalScore<60){
      this.setData({
        questions: questions,
        curQindex: 0,
        curQswiper: 0
      })
      wx.showToast({
        title: '您的得分未及格,请重新完成试题',
        icon: 'none',
        duration: 3000
      })
    }else{
      isPass = 1;//及格了
      this.setData({
        questions: questions,
        curQindex: 0,
        curQswiper:0,
        
      })
      this.getNextSection(); 
      //跳转到顶部
      wx.pageScrollTo({
        scrollTop: 0
      })
    }

    let signSectionid=this.data.sectionRecord.id;
    let jzid = this.data.record.jzid;
    let questionNum = questions.length;

    //保存做题记录信息
    wx.request({
      url: getApp().globalData.url + '/course/saveSignSectionQuestion',
      data: { signSectionid: signSectionid ,
              jzid:jzid,
              questionNum:questionNum,
              rightNum:rightNum,
              hasScore:hasScore,
              totalScore:totalScore,
              isPass: isPass
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
      }
    })

  }

})