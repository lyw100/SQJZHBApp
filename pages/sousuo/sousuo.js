
var page = 2;
Page({
  /**
  * 页面的初始数据
  */
  data: {
    searchList: [],
    path: getApp().globalData.url,
    //path: 'http://localhost:8080/SQJZ',
    qkch: false,//清空
    zhuyesousuo: true,
    ssnrjieguo: false,
    djjg: false,
    xuankeShow: true,
    yixuanShow: false,
    zcfgym: true,
    ddjy: false,
    sxjkjyym: false,
    inputText: "",
    hotList: [],//热点搜索
    topList: [],//搜索框查询list
    relateList: [],//相关资料
    listAll: [],//查询返回的所有数据
    sercherStorage: [],//搜索历史列表
    sercherList: [],//用于倒序展示搜索历史
    StorageFlag: false, //显示搜索记录标志位
    height: 64,
    choiceId: 0,//查询结果顶部标签选中id
    subjectType: '',//课程类型：科目种类 0必修 1选修，课程库传参
    courseType: '',//课程类型 0视频 1图文 2音频,课程库传参
    subjectId: '',//课程id,课程库传参
    iszjjz:"",
    dibu: false,//加载样式
  },
  shouyebof: function () {
    wx.navigateTo({
      url: '../shouyebofang/shouyebofang',
    });
  },
  //顶部搜索框输入
  iptchufa: function (e) {
    var self = this;
    var text = e.detail.value
    if (text == "") {
      this.setData({
        qkch: false,
        ssnrjieguo: false,
        zhuyesousuo: true,
        djjg: false,
        inputText: text
      })
    } else {
      this.setData({
        qkch: true,
        zhuyesousuo: false,
        ssnrjieguo: true,
        djjg: false,
        inputText: e.detail.value
      })
    }

    wx.request({
      url: this.data.path + '/search/searchByName',
      data: { name: e.detail.value },
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
        var list = res.data;
        self.setData({
          searchList: list

        })

      }
    })
  },
  ssjieguo: function () {
    this.setData({
      qkch: false,
      zhuyesousuo: false,
      ssnrjieguo: false,
      djjg: true,
    })
  },
  quxiao: function () {
    var menu=this.data.menu;
    if(menu=='index'){
      wx.switchTab({
        url: '../zhuye/zhuye',
      })
    }else if(this.data.subjectId!=''){
      //相关课程
      wx.navigateTo({
        url: '../gengduotuijian/gengduotuijian?subid=' + this.data.subjectId,
      });
    }else{
      //课程库
      wx.switchTab({
        url: '../kechengku/kechengku',
      })
    }
  },
  xzkc: function (e) {
    var path = this.data.path;
    var that = this;
    var index = e.currentTarget.dataset.index;
    var xgzl = e.currentTarget.dataset.xgzl;
    var courseid = e.currentTarget.dataset.id;
    var jzid = getApp().globalData.jiaozhengid;
    var url = path + '/course/saveSign';
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
        if(xgzl==1){
          var relateList = that.data.relateList;
          relateList[index].isSign = 1;
          that.setData({
            relateList: relateList,
          })
        }else{
          var topList = that.data.topList;
          topList[index].isSign = 1;
          that.setData({
            topList: topList,
          })
        }
          
          wx.showToast({
            title: '选课成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  yixuankecheng: function (e) {
    var path = this.data.path;
    var that = this;
    var xgzl = e.currentTarget.dataset.xgzl;
    var index = e.currentTarget.dataset.index;
    var courseid = e.currentTarget.dataset.id;
    var jzid = getApp().globalData.jiaozhengid;
    var url = path + '/course/cancleSign';
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
          if (xgzl == 1) {
            var relateList = that.data.relateList;
            relateList[index].isSign = 0;
            that.setData({
              relateList: relateList,
            })
          }else{
            var topList = that.data.topList;
            topList[index].isSign = 0;
            that.setData({
              topList: topList,
            })
          }
          
          wx.showToast({
            title: '取消选课成功',
            icon: 'success',
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
    // this.setData({
    //   xuankeShow: true,
    //   yixuanShow: false
    // })
  },
  /**
  * 政策法规 tab 页切换
  */
  zcfganniu: function (e) {
    var id = e.currentTarget.id;
    var list = this.data.listAll;
    var top = [];
    var relate = [];
    var subjectId;
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].subjectId) {
        top = list[i].top;
        relate = list[i].relate;
        subjectId = list[i].subjectId;
      }
    }
    this.setData({
      zcfgym: true,
      ddjy: false,
      sxjkjyym: false,
      topList: top,//搜索框查询list
      relateList: relate,//相关资料
      choiceId: subjectId
    })
  },
  ddwhanniu: function () {
    this.setData({
      zcfgym: false,
      ddjy: true,
      sxjkjyym: false,
    })
  },

  sxjkjyanniu: function () {
    this.setData({
      zcfgym: false,
      ddjy: false,
      sxjkjyym: true,
    })
  },
  /**
   * 跳转到播放页面
   */
  tzbfyemain: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shouyebofang/shouyebofang?record=record&courseid=' + id,
    });
  },

  /**
   * 点击搜索主页面内容跳转结果页面
   */
  tzsouzuojieguoym: function () {
    this.setData({
      qkch: true,
      zhuyesousuo: false,
      ssnrjieguo: false,
      djjg: true,
    })
  },
  //搜索框回车
  inputConfirm: function () {
    var text = this.data.inputText
    this.setData({
      inputText: text,
      ssnrjieguo: false
    })
    //判断是否加入搜索历史
    var searchData = this.data.sercherStorage;
    var flag = true;
    for (var i = 0; i < searchData.length; i++) {
      if (text == searchData[i].name) {
        flag = false
      }
    }
    if (flag) {
      searchData.push({ name: text })
      wx.setStorageSync('searchData', searchData)
    }
    //搜索次数加1
    var path = this.data.path;
    wx.request({
      url: path + '/search/editClicks',
      data: { name: text },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
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
    this.search();
  },
  //搜索功能
  search: function () {
    var path = this.data.path;
    var subjectType = this.data.subjectType;
    var courseType = this.data.courseType;
    var subjectId = this.data.subjectId;
    console.log(subjectId)
    var self = this;
    page = 2;
    wx.request({
      url: path + '/search/list',
      data: {
        jzid: getApp().globalData.jiaozhengid,
        name: this.data.inputText,
        subjectType: subjectType,
        courseType: courseType,
        subjectId: subjectId,
        page: 1,
        rows: 5
      },
      method: 'POST',
      header: { 
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if (res.data.msg == "OK") {
          if (res.data.listAll.length > 0) {
            var choiceId = self.data.choiceId;
            if (choiceId == 0) {
              self.setData({
                djjg: true,
                topList: res.data.top,
                relateList: res.data.relate,
                listAll: res.data.listAll,
                choiceId: res.data.listAll[0].subjectId
              })
            } else {
              var listAll = res.data.listAll;
              for (var i = 0; i < listAll.length; i++) {
                if (choiceId == listAll[i].subjectId) {
                  self.setData({
                    djjg: true,
                    topList: listAll[i].top,
                    relateList: listAll[i].relate,
                    listAll: res.data.listAll,
                    choiceId: listAll[i].subjectId
                  })
                }
              }
            }
          } else {
            self.setData({
              djjg: true,
              topList: [],
              relateList: [],
              listAll: [],
              choiceId: 0
            })
          }
        }
      }
    })
  },
  //清除搜索框
  clearInput: function () {
    this.setData({
      inputText: "",
      qkch: false,
      ssnrjieguo: false,
      zhuyesousuo: true,
      djjg: false
    })
    this.openLocationsercher();
    //热点搜索list
    var self = this;
    var path = this.data.path;
    wx.request({
      url: path + '/search/hotList',
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
        self.setData({
          hotList: res.data.list
        })
      }
    })
  },
  //清除缓存历史
  clearSearchStorage: function () {
    wx.removeStorageSync('searchData')
    this.setData({
      sercherStorage: [],
      StorageFlag: false,
      //zhuyesousuo:false
    })
  },
  //搜索历史下拉箭头
  changeHeight: function (e) {
    this.setData({
      height: 'auto'
    })
  },
  //打开搜索历史
  openLocationsercher: function () {
    var list = wx.getStorageSync('searchData') || [];
    var history = [];
    if (list.length > 0) {
      for (var i = list.length - 1; i >= 0; i--) {
        history.push(list[i]);
      }
    }
    this.setData({
      sercherStorage: wx.getStorageSync('searchData') || [],
      StorageFlag: true,
      sercherList: history
      //listFlag: true,
    })
  },
  //点击缓存搜索列表
  tapSercherStorage: function (e) {
    var name = e.currentTarget.dataset.name;
    //将所选的搜索历史加到搜素框
    this.setData({
      inputText: name,
      StorageFlag: false,
      zhuyesousuo: false,
      qkch: true
    })
    //搜索次数加1
    var path = this.data.path;
    wx.request({
      url: path + '/search/editClicks',
      data: { name: name},
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
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
    this.search();
  },
  hotTap:function(e){
    var text=e.currentTarget.dataset.name;
    this.setData({
      inputText: text,
      StorageFlag: false,
      zhuyesousuo: false,
      qkch: true
    })
    //搜索次数加1
    var path = this.data.path;
    wx.request({
      url: path + '/search/editClicks',
      data: { courseId: e.currentTarget.id },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
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
    var searchData = this.data.sercherStorage;
    var flag = true;
    for (var i = 0; i < searchData.length; i++) {
      if (text == searchData[i].name) {
        flag = false;
      }
    }
    //将搜索记录更新到缓存
    if (flag) {
      searchData.push({
        name: this.data.inputText
      })
      wx.setStorageSync('searchData', searchData);
      this.setData({ StorageFlag: false, })
    }
    this.search();
  },
  //添加搜索历史
  setSercherStorage: function (e) {
    this.setData({
      qkch: true,
      zhuyesousuo: false,
      ssnrjieguo: false,
      djjg: true,
    })

    var self = this;
    if (self.data.inputText.length == 0) {
      return;
    }
    //控制搜索历史
    var text = e.currentTarget.dataset.name;
    var searchData = this.data.sercherStorage;
    var flag = true;
    //将所选的搜索历史加到搜素框
    this.setData({
      inputText: text,
      StorageFlag: false,
    })
    for (var i = 0; i < searchData.length; i++) {
      if (text == searchData[i].name) {
        flag = false;
      }
    }
    //将搜索记录更新到缓存
    if (flag) {
      // var searchData = self.data.sercherStorage;
      searchData.push({
        //id: searchData.length,
        name: this.data.inputText
      })
      wx.setStorageSync('searchData', searchData);
      self.setData({ StorageFlag: false, })
    }
    var path = this.data.path;
    wx.request({
      url: path + '/search/editClicks',
      data: { courseId: e.currentTarget.id },
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
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
    this.search();

  },
  /**
   * 上拉加载更多
   */
  loadMore: function () {

    var name = this.data.inputText;//搜索框内容
    var subjectId = this.data.choiceId;//科目id
    var subjectType = this.data.subjectType;
    var courseType = this.data.courseType;
    var path = this.data.path;
    var self = this;
    var iszjjz=this.data.iszjjz;
    
    self.setData({
      dibu:true,
    })
    wx.request({
      url: path + '/search/loadMore',
      data: {
        jzid: getApp().globalData.jiaozhengid,
        name: name,
        subjectId: subjectId,
        subjectType: subjectType,
        courseType: courseType,
        iszjjz: iszjjz,
        page: page,
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
        var relateList = self.data.relateList;
        if (res.data.msg == "OK") {
          var list = res.data.list;
          if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              relateList.push(list[i])
            }
            self.setData({
              relateList: relateList
            })
            page++;

          }
        }
        self.setData({
          dibu: false,
        })
      },
      // complete: function () {
      //   setTimeout(function () {
      //     wx.hideLoading()
      //   }, 1000)
      // }
    })
  },
  countInfo: function () {
    wx.request({
      url: this.data.path + '/count/sousuo',
      data: {},
      method: "POST",
      header: { 
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded' },
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
    // console.log(options)
    var menu = options.menu;
    var iszjjz="";
    if (options.subjectId == -1) {//判断是否为专家讲座
      iszjjz='1';
    }
    if (menu == 'course') {
      this.setData({
        subjectType: options.subjectType,
        courseType: options.courseType,
        subjectId: options.subjectId,
        menu:'course',
        iszjjz: iszjjz//判断是否为专家讲座
      })
    }else{
      this.setData({
        menu: 'index'
      })
    }
    //搜索历史
    this.openLocationsercher();
    //热点搜索list
    var self = this;
    var path = this.data.path;
    wx.request({
      url: path + '/search/hotList',
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
        self.setData({
          hotList: res.data.list
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
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})