Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    latitude: '',
    longitude: '',
    focus: true,
    nr_xsyc:false,
    list:[],
    searchinput:'',
  },
  /**
   * 查询地点
   */
  bindKeyInput:function(e){
    let value=e.detail.value.trim();
    if(value.length>0){
      let key = "YGNBZ-MWGWI-6YCGS-54WJU-ZL4HJ-OXFA6";
      let regin = this.data.city;
      let location = this.data.latitude + "," + this.data.longitude;//38.01845,114.45482
      let url = "https://apis.map.qq.com/ws/place/v1/suggestion/?region=" + regin
       + "&key=" + key + "&keyword=" + value + "&location=" + location + "&region_fix=1" 
       + "&output=json";
      let that=this;
      wx.request({
        url: url, //请求腾讯定位
        data: { },
        header: {
          'Cookie': getApp().globalData.header.Cookie, 
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.timeOut == 'OUT') {
            wx.reLaunch({
              url: '../shouye/shouye'
            });
            return false;
          }
          let status = res.data.status;
          if (status == 0) {
            that.setData({
              list: res.data.data,
              nr_xsyc: true,
            })
          }
        }
      })

    }else{
      this.setData({
        nr_xsyc: false,
      })
    }

  },
  chahaodj: function () {
    this.setData({
      nr_xsyc: false,
      searchinput:'',
    })
  },
  // 点击取消返回上一级
  quxiaoanniu:function(){
    wx.navigateBack({
      url: '../xinjianlaodong/xinjianlaodong',
    })
  },
  // 点击地址返回
  reback:function(e){
    var title = e.currentTarget.dataset.title;
    wx.setStorageSync("laborAddressValue", title);
    wx.navigateBack({
      url: '../xinjianlaodong/xinjianlaodong?',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    this.setData({
      city:options.city
    })
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      }
    })
    wx.setStorageSync("laborAddress", options.address);
    wx.setStorageSync("laborAddressValue", '');
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
    
  }
})