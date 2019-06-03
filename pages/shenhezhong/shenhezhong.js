var intervalImg ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shualiandl:false,
    facemsg:'',
    num:25,
    imgurl:'',
    kaishi:true,
  },
  tzldz:function(){
    this.setData({
      shualiandl: true,//是否展示刷脸窗口
    });
    var that=this;
    this.changeImg();//切图
    setTimeout(function(){
      that.takePhoto();
    },3000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let itemid = options.itemid;
    var that=this;
    wx.request({
      url: getApp().globalData.url + '/labor/getLaborItemById', //获取义务劳动内容
      data: {id:itemid},
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
          laborItem: res.data,
        });

        let datetime = that.getDateTime();
        let startTime = res.data.labor.startTime;
        let endTime = res.data.labor.endTime;
        if (datetime < startTime||datetime>endTime) {
          that.setData({
            kaishi: false,
          });
        }
        console.log('kaishi:'+that.data.kaishi);
        console.log('status:'+res.data.status);
        console.log('status1:'+res.data.labor.status);
        let title='';
        if (res.data.status == 0){
          title='审核中';
        } else if (res.data.status == 1) {
          title = '审核未通过';
        } else if (res.data.status == 2) {
          title = '审核通过';
        }
        console.log(title);
        wx.setNavigationBarTitle({
          title: title,
        })
      }
    }) 
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
   * 切图
   */
  changeImg: function () {
    var that = this;
    var num = that.data.num;
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
   * 刷脸登录
   */
  takePhoto: function () {
    let that=this;
    that.setData({
      facemsg: '',
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // this.setData({ logindisabled: true });
        var header = getApp().globalData.header; //获取app.js中的请求头
        wx.uploadFile({
          url: getApp().globalData.url + '/course/face',
          filePath: res.tempImagePath,
          header: header,
          formData: {
            telephone: wx.getStorageSync("username")
          },
          name: 'file',
          success: (res) => {
           
            var data = JSON.parse(res.data);
            if (data.msg == "OK") {
              clearInterval(intervalImg);
              wx.redirectTo({
                url: '../kaishilaodong/kaishilaodong?itemid='+this.data.laborItem.id,
              })
            } else {
             that.setData({
               facemsg:data.msg
             })
             setTimeout(function(){
               that.takePhoto();
             },3000);
            }

          }
        })
      }
    })
  },

  /**
  * 获取当前时间
  */
  getDateTime: function () {
    let now = new Date();

    let nowYear = now.getFullYear(); //当前年 
    let nowMonth = now.getMonth() + 1; //当前月 
    if (nowMonth < 10) { nowMonth = "0" + nowMonth }
    let nowDay = now.getDate(); //当前日 
    if (nowDay < 10) { nowDay = "0" + nowDay }
    let nowHour = now.getHours();//当前时间
    if (nowHour < 10) { nowHour = "0" + nowHour }
    let nowMin = now.getMinutes();//当前分钟
    if (nowMin < 10) { nowMin = "0" + nowMin }


    let DateTime = nowYear + "-" + nowMonth + "-" + nowDay + " " + nowHour + ":" + nowMin;

    //返回当天的日期
    return DateTime;
  },
})