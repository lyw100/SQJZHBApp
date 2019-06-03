var errorcishu = 0;//未检测到人脸次数限制
var errorcishu1 = 0;//多次刷脸未通过次数限制
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yincangqdmk:true,
    shualiandl:false,
    jrqdjc:false,
    qdy_hui:false,
    qdy_lan: true,
    tjym_hui: true,
    tjym_lan:false,
    qd_yemian:true,
    th_yemian:false,
    msgData: "识别中,请稍后...",
    num: 25, //初始值
    imgurl: "", //图片路径
    interval: "", //定时器
    latitude:0,
    longitude:0,
    address:""

  },
  /**
   * 签到
   */
  djqd_ym:function(){
    this.setData({
      qdy_hui: false,
      qdy_lan: true,
      tjym_hui: true,
      tjym_lan: false,
      qd_yemian: true,
      th_yemian: false,
    })
  },
  /**
   * 统计
   */
  djtj_ym:function(){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //年  
    var year = date.getFullYear();
    //月  
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    this.setData({
      date: year + "-" + month
    });
    this.getTJList();
    this.setData({
      qdy_hui: true,
      qdy_lan: false,
      tjym_hui: false,
      tjym_lan: true,
      qd_yemian: false,
      th_yemian: true
    })
  },
  /**
   * 获取签到统计数据
   */
  getTJList:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/jzryqd/getList',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        jzid: getApp().globalData.jiaozhengid,
        time: that.data.date
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        var dyqd=0;
        if(res.data.length>0){
          for (var i = 0; i < res.data.length; i++) {
            var signlist=res.data[i].signlist;
            for (var j = 0; j < signlist.length; j++) {
              dyqd++;
            }
          }
        }
        that.setData({
          maplist: res.data,
          dyqdnum: dyqd,
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getTJList();
  },
  myCatchTouch: function () {
    // console.log('stop user scroll it!');
    return;
  },
  /**
  * 点击刷脸签到
  */
  shualianqiandao:function(){
    var that = this
    if (that.data.address ==''){
      wx.showToast({
        title: '获取位置失败，请打开手机GPS定位功能',
        icon: 'none',
        mask:true,
      })
      return;
    }
    that.setData({
      yincangqdmk: false,
      shualiandl: true,
    })
    setTimeout(function () {
      that.takePhoto();
    }, 5000);
  },
  /**
  * 刷脸登录
  */
  takePhoto: function () {
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
          msgData: "识别中,请稍后..."
        })
        // wx.showLoading({
        //   title: '正在校验.....',
        // })
        this.setData({ logindisabled: true });
        var header = getApp().globalData.header; //获取app.js中的请求头
        wx.uploadFile({
          url: getApp().globalData.url + '/course/face',
          filePath: res.tempImagePath,
          header: header,
          formData: {
            telephone: wx.getStorageSync("username")
          },
          name: 'file',
          success: (rest) => {
            var data = JSON.parse(rest.data);
            if (data.timeOut == 'OUT') {
              wx.reLaunch({
                url: '../shouye/shouye'
              });
              return false;
            }
            if (data.msg == "OK") {
              var jzid = getApp().globalData.jiaozhengid;
              wx.uploadFile({
                url: getApp().globalData.url + '/jzryqd/uploadQDImg',
                filePath: res.tempImagePath,
                header: header,
                name: 'file',
                formData: {
                  jzid: jzid
                },
                success(res) {
                  //判断session
                  if (res.data.timeOut == 'OUT') {
                    wx.reLaunch({
                      url: '../shouye/shouye'
                    });
                    return false;
                  }
                  var json = JSON.parse(res.data);
                  wx.request({
                    url: getApp().globalData.url + '/jzryqd/saveQD', //保存签到
                    method: "POST",
                    // 请求头部  
                    header: {
                      'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      jzid: jzid,
                      latitude: that.data.latitude,
                      longitude: that.data.longitude,
                      address: that.data.address,
                      qdtime: json.qdtime,
                      imgpath: json.imgpath
                    },
                    success: function (res) {
                      //判断session
                      if (res.data.timeOut == 'OUT') {
                        wx.reLaunch({
                          url: '../shouye/shouye'
                        });
                        return false;
                      }
                      var data = res.data;
                      var str = "";
                      if (data == "OK") {
                        str = "签到成功";
                      } else {
                        str = "签到失败";
                      }
                      that.setData({
                        yincangqdmk: true,
                        shualiandl: false,
                      })
                      that.getQDAddress();
                      wx.showToast({
                        title: str,
                        icon: 'none',
                        duration: 2000
                      })

                    }
                  })
                }
              })
            } else {
              this.setData({
                msgData: data.msg
              })
              errorcishu1++;
              if ('未能识别到人脸' == data.msg) {
                errorcishu++;
              } else {
                errorcishu = 0;
              }
              if (errorcishu >= 3 || errorcishu1 >= 5) {
                wx.showModal({
                  title: '操作超时',
                  cancelText: '退出',
                  confirmText: '再试一次',
                  content: '正对手机更容易成功',
                  success: function (sm) {
                    if (sm.confirm) {
                      errorcishu = 0;
                      errorcishu1 = 0;
                      setTimeout(function () {
                        that.takePhoto();
                      }, 3000);
                    } else if (sm.cancel) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              } else {
                setTimeout(function () {
                  that.takePhoto();
                }, 3000);
              }
            }
          }
        })
      }
    })
  },
  /**
   * 获取位置及当前签到次数
   */
  getQDAddress:function(){
    var that = this;
    // // 引入SDK核心类
    var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
    var qqmapsdk = new QQMapWX({
      key: '4QSBZ-6FUHF-SS3JW-JUQI2-YDTIS-E4FTW' // 必填
    });
    var regionWX = [];
    wx.getLocation({
      // type: 'wgs84',
      type: 'gcj02',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          coord_type: 5,
          poi_options: 'policy=2;radius=3000;page_size=20;page_index=1',
          success: function (data) {
            //console.log(data);
             var address = data.result.formatted_addresses.recommend;
            //var address = data.result.address;
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              address: address
            })
          }
        })
      }
    });
   
    
    wx.request({
      url: getApp().globalData.url + '/jzryqd/getQDType',
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
        var dtcount = res.data.dtcount;
        var dycount = res.data.dycount;
        console.log(res);
          that.setData({
            dtqdnum: dtcount,
            dyqdnum: dycount,
          })
      }
    })
    
  },
  /**
   * 摄像头图片循环
   */
  progress: function () {
    var that = this;
    var num = that.data.num;
    var interval = setInterval(function () {
      that.setData({
        imgurl: "../../img/" + (39 - num) + ".png"
      })
      num--;
      if (num == 13) {
        num = 25
      }
    }, 100)
    that.setData({
      interval: interval
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    this.progress();
    this.getQDAddress();
    setInterval(function () {
      that.getTime();
    }, 1000) //循环时间 这里是1秒 
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
    
  },
  /**
   * 获取当前时间
   */
  getTime: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();
    if (h < 10) {
      h = "0" + date.getHours();
    } else {
      h = date.getHours();
    }
    if (m < 10) {
      m = "0" + date.getMinutes();
    } else {
      m = date.getMinutes();
    }
    if(s < 10){
      s = "0" + date.getSeconds();
    }else{
      s = date.getSeconds();
    }
    var currentTime = h + ":" + m + ":" + s;
    this.setData({
      currentTime: currentTime
    })
  },
})