Page({

  /**
   * 页面的初始数据
   */
  data: {
    jzry:'',
    startDate:'',
    startTime:'08:00',
    startMinDate:'',
    startMaxDate:'',
    endDate:'',
    endTime:'16:00',
    endtMinDate:'',
    endtMaxDate:'',
    endMinTime:'08:00',
    content:'',
    startAddress:'',
    endAddress:'',
  },
  /**
   * 开始年月日选择
   */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      startDate: e.detail.value,
      endtMinDate: e.detail.value,
      startTime:'08:00',
      endMinTime:'',
    })
    if (e.detail.value>=this.data.endDate){
      this.setData({
        endDate: e.detail.value,
        endMinTime: '08:00',
      })
      if (this.data.startTime > this.data.endTime) {
        this.setData({
          endTime: '08:00',
        })
      }
    }else{
      this.setData({
        endMinTime:'',
      })
    }
    
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
    if (this.data.startDate== this.data.endDate){
      this.setData({
        endMinTime: e.detail.value
      })
      if (e.detail.value > this.data.endTime) {
        this.setData({
          endTime: e.detail.value,
        })
      }
    }
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      endDate: e.detail.value,
      endTime:'16:00',
    })
    if (e.detail.value == this.data.startDate) {
      this.setData({
        endMinTime: this.data.startTime,
      })
      if (this.data.startTime > this.data.endTime) {
        this.setData({
          endTime: this.data.startTime,
        })
      }
    } else {
      this.setData({
        endMinTime: '',
      })
    }

  },
  bindTimeChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },
  bindTextAreaInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 点击劳动地点跳转chakan页面
  addStartAddress: function () {
    let city = this.data.jzry.jzCity;
    city=city.substring(0, city.indexOf("市")+1);
    wx.navigateTo({
      url: '../chaxun/chaxun?address=startAddress&city='+city,
    })
  },
  // 点击劳动地点跳转chakan页面
  addEndAddress: function () {
    let city = this.data.jzry.jzCity;
    city = city.substring(0, city.indexOf("市") + 1);
    wx.navigateTo({
      url: '../chaxun/chaxun?address=endAddress&city=' + city,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.rectifyPeople();//获取矫正人员
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
    let laborAddress=wx.getStorageSync("laborAddress");
    let laborAddressValue =wx.getStorageSync("laborAddressValue");
    
    if (laborAddressValue.length>0){
      this.setData({
        [laborAddress]: laborAddressValue
      })
    }  

    wx.setStorageSync("laborAddress", '');
    wx.setStorageSync("laborAddressValue", '');
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
   * 获取矫正人员信息
   */
  rectifyPeople: function () {
    var that = this;
    var jzid = getApp().globalData.jiaozhengid;
    wx.request({
      url: getApp().globalData.url + '/sign/getRectifyPeopleById', //矫正人员
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

        that.initDate();//时间初始化
      }
    })
  },
  /**
   * 时间初始化
   */
  initDate:function(){
    let nextDay=this.getNextDay();
    
    let jzEndTime=this.data.jzry.jzEndTime;
    jzEndTime = jzEndTime.substring(0, 10);

    this.setData({
      startDate: nextDay,
      endDate: nextDay,
      startMinDate: nextDay,
      endtMinDate: nextDay,
      startMaxDate: jzEndTime,
      endtMaxDate:jzEndTime
    })
  },
  /**
   * 获取明天的日期
   */
  getNextDay:function(){
    //时间加一天
    let timestamp = Date.parse(new Date());
    let newTimestamp = timestamp +  24 * 60 * 60 * 1000;
    let now = new Date(newTimestamp);
    //获取明天的日期
    let nowYear = now.getFullYear(); //当前年 
    let nowMonth = now.getMonth() + 1; //当前月 
    if (nowMonth < 10) { nowMonth = "0" + nowMonth }
    let nowDay = now.getDate(); //当前日 
    if (nowDay < 10) { nowDay = "0" + nowDay }
   
    let nextDay = nowYear + "-" + nowMonth + "-" + nowDay;
    //返回明天的日期
    return nextDay;
  },
  // 点击提交保存后 跳转义务劳动页面
  saveLabor: function () {
    let json={};
    let content = this.data.content.trim();
    if(content.length>0){
      json.content=content;
    }else{
      this.showMessage("劳动内容不能为空");
      return;
    }

    let startTime = this.data.startDate + " " + this.data.startTime+':00';
    json.startTime = startTime;
    let endTime = this.data.endDate + " " + this.data.endTime + ':00';
    json.endTime = endTime;
    let startAddress=this.data.startAddress;
    if (startAddress.length > 0) {
      json.startAddress = startAddress;
    } else {
      this.showMessage("开始劳动地点不能为空");
      return;
    }
    let endAddress=this.data.endAddress;
    if (endAddress.length > 0) {
      json.endAddress = endAddress;
    } else {
      this.showMessage("结束劳动地点不能为空");
      return;
    }
    var jzid = getApp().globalData.jiaozhengid;
    if(jzid==''){
      this.showMessage("矫正人员不能为空");
      return;
    }
    json.createrid=this.data.jzry.jzid;
    json.creater=this.data.jzry.name;
    json.provinceid = this.data.jzry.jzProvinceId;
    json.cityid = this.data.jzry.jzCityId;
    json.countyid = this.data.jzry.jzCountyId;
    json.officeid = this.data.jzry.jzAddressId;
    json.orgid=this.data.jzry.jzdwId;

    wx.request({
      url: getApp().globalData.url + '/labor/createLabor', //添加义务劳动
      data: json,
      dataType:'text',
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
        if(res.data=='ok'){
          wx.navigateBack({
            url: '../yiwulaodong/yiwulaodong',
          })
        }
      }
    })  

  },
  /**
   * 提示消息
   */
  showMessage:function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })

    
  }
})