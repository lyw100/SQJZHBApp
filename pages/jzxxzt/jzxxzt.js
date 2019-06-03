var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var intervalTime;
var intervalImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    learnItem:'',
    shualiandl: false,
    address: '',//当前地点
    nowTime:'',//当前时间
    nextHour:'',//下一小时
    facemsg: '',
    num: 25,
    imgurl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getDateTime();//获取时间
    //一分钟执行一次
    intervalTime=setInterval(function(){
      that.getDateTime();//获取时间
    },60000);
    let itemid = options.itemid;
    if (itemid == null) {
      itemid = 60;
    }
    console.log(itemid);
    wx.request({
      url: getApp().globalData.url + '/learn/getLearnItemById', //获取学习内容
      data: { id: itemid },
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
        that.setData({
          learnItem: res.data,
        });
        let title = '';
        if (res.data.status == 0) {
          title = '学习未开始';
          that.setData({
            tijiao: true,
            jieshu: false
          })
        } else if (res.data.status == 1) {
          title = '学习中';
          that.setData({
            tijiao: false,
            jieshu: true
          })
        } else if (res.data.status == 2) {
          title = '学习结束';
          that.setData({
            tijiao: false,
            jieshu: false
          })
        }
        console.log(title);
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    })

    qqmapsdk = new QQMapWX({
      key: '4QSBZ-6FUHF-SS3JW-JUQI2-YDTIS-E4FTW' // 必填
    });
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
    clearInterval(intervalTime);
    clearInterval(intervalImg);
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
  getDateTime: function () {
    //当前时间
    let now = new Date();
    //下一个小时
    var timestamp = Date.parse(now);
    var newTimestamp = timestamp + 60 * 60 * 1000;
    var nextHourTime = new Date(newTimestamp);
    //当前时间
    let nowYear = now.getFullYear(); //当前年 
    let nowMonth = now.getMonth() + 1; //当前月 
    if (nowMonth < 10) { nowMonth = "0" + nowMonth }
    let nowDay = now.getDate(); //当前日 
    if (nowDay < 10) { nowDay = "0" + nowDay }
    let nowHour = now.getHours();//当前时间
    if (nowHour < 10) { nowHour = "0" + nowHour }
    let nowMin = now.getMinutes();//当前分钟
    if (nowMin < 10) { nowMin = "0" + nowMin }

    //下一个小时的
    let nextYear = nextHourTime.getFullYear(); //下一个小时的年 
    let nextMonth = nextHourTime.getMonth() + 1; //下一个小时的月 
    if (nextMonth < 10) { nextMonth = "0" + nextMonth }
    let nextDay = nextHourTime.getDate(); //下一个小时的日 
    if (nextDay < 10) { nextDay = "0" + nextDay }
    let nextHour = nextHourTime.getHours();//下一个小时的时间
    if (nextHour < 10) { nextHour = "0" + nextHour }
    let nextMin = nextHourTime.getMinutes();//下一个小时的分钟
    if (nextMin < 10) { nextMin = "0" + nextMin }

    let nextTime = nextYear+"-"+nextMonth+"-"+nextDay+" "+nextHour + ":" + nextMin;
    let DateTime = nowYear + "-" + nowMonth + "-" + nowDay + " " + nowHour + ":" + nowMin;
    this.setData({
      nextHour: nextTime,
      nowTime: DateTime
    });
    console.log('DateTime:' + DateTime);
    console.log('nextTime:' + nextTime);
    //返回当天的日期
    return DateTime;
  },
  /**
   * 签到  签退
   */
  qiandao:function(){
    this.getAddress();
    let that=this;
    this.changeImg();
    this.setData({
      shualiandl:true
    });
    
  },
  /**
   * 切图
   */
  changeImg: function () {
    let that = this;
    let num = that.data.num;
    intervalImg = setInterval(function () {
      that.setData({
        imgurl: "../../img/" + (39 - num) + ".png"
      })
      num--;
      if (num == 13) {
        num = 25
      }
    }, 100)

  },
  /**
   * 刷脸验证
   */
  takePhoto: function () {
    let that = this;
    that.setData({
      facemsg: '',
    })
    let nowTime=this.data.nowTime;
    let learnItem = this.data.learnItem;
    let address=this.data.address;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // this.setData({ logindisabled: true });
        var header = getApp().globalData.header; //获取app.js中的请求头
        wx.uploadFile({
          url: getApp().globalData.url + '/learn/face',
          filePath: res.tempImagePath,
          header: header,
          formData: {
            telephone: wx.getStorageSync("username"),
            itemid: learnItem.id,
            dateTime:nowTime,
            address:address
          },
          name: 'file',
          success: (res) => {

            var data = JSON.parse(res.data);
            if (data.msg == "OK") { 
              
              if (learnItem.status=='0'){
                wx.setNavigationBarTitle({
                  title: '学习中',
                })
                learnItem.status=1;
                learnItem.startRealTime=nowTime;
                learnItem.startUrl = data.photo;
                learnItem.startRealAddress=address;
                wx.showToast({
                  title: '签到成功',
                  icon: 'none',
                  duration: 3000
                })
              } else if (learnItem.status == '1') {
                wx.setNavigationBarTitle({
                  title: '已结束',
                })
                learnItem.status = 2;
                learnItem.endRealTime = nowTime;
                learnItem.endUrl = data.photo;
                learnItem.endRealAddress = address;
                wx.showToast({
                  title: '签退成功',
                  icon: 'none',
                  duration: 3000
                })
              }
              that.setData({
                shualiandl: false,
                learnItem: learnItem
              })
              clearInterval(intervalImg);
            } else {
              that.setData({
                facemsg: data.msg,
              })
              setTimeout(function () {
                that.takePhoto();
              }, 3000);
            }

          }
        })
      }
    })
  },

  /**
   * 查询地点
   */
  getAddress: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let location = res.latitude + "," + res.longitude;//38.01845,114.45482
        console.log(location);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          poi_options: 'policy=2;radius=500;page_size=10;page_index=1',
          success: function (data) {
            //console.log(data);
            var address = data.result.formatted_addresses.recommend;
            //var address = data.result.address;
            that.setData({
              address: address
            })
            setTimeout(function () {
              that.takePhoto();
            }, 3000);
          }
        })
      }
    })

  },
})