Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiala_dwyc:false,
    status:'',
    statusStr:'全部',
    type: 0,//1集中  0个人
    page:1,
    rows:6,
    laborItems:[],
    dibu:false,//火速加载中
  },
  // 点击全部
  quanbudj:function(){
    if (this.data.xiala_dwyc){
      this.setData({
        xiala_dwyc: false,
      });
    }else{
      this.setData({
        xiala_dwyc: true,
      });
    }
  },
  laodongdj: function (e) {
    let statusStr='全部';
    let status=e.currentTarget.dataset.status;
    if (status == '0') { statusStr = '未审核'}
    else if (status == 1) { statusStr = '审核未通过' }
    else if (status == 2) { statusStr = '未劳动' }
    else if (status == 3) { statusStr = '劳动中' }
    else if (status == 4) { statusStr = '已完成' }
    this.setData({
      xiala_dwyc: false,
      status:status,
      statusStr: statusStr,
      page:1,
      // laborItems: []
    });
    this.laborItems();
  },
  // 点击内容
  jz_dj:function(){
    this.setData({
      type: 1,
      page:1,
      // laborItems: [],
      status: '',
      statusStr: '全部',
    });
    this.laborItems();
  },
  wode_hui: function () {
    this.setData({
      type: 0,
      page: 1,
      // laborItems:[],
      status: '',
      statusStr: '全部',
    });
    this.laborItems();
  },
  // 跳转新建劳动页面
  xinjianlaodong: function () {
    wx.navigateTo({
      url: '../xinjianlaodong/xinjianlaodong',
    })
  },
   // 跳转审核中页面
  shenhezhong: function (e) {
    let itemid=e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
   
    if(status<=2){
      wx.navigateTo({
        url: '../shenhezhong/shenhezhong?itemid='+itemid,
      })
    }else{
      wx.navigateTo({
        url: '../kaishilaodong/kaishilaodong?itemid=' + itemid,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      page: 1,
    }) 
    this.laborItems();
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
    this.setData({
      page: 1,
    })
    this.laborItems();
    wx.stopPullDownRefresh(); //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 显示加载图标
    this.setData({
      dibu: true
    })
    this.laborItems();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * 获取劳动列表
   */
  laborItems:function(){
    let type=this.data.type;
    let status=this.data.status;
    let page=this.data.page;
    let rows=this.data.rows;
    let jzid=getApp().globalData.jiaozhengid;
    let that=this;
    wx.request({
      url: getApp().globalData.url + '/labor/getLaborItemList', //请求劳动列表
      data: { jzid: jzid, page: page, rows: rows ,type:type,status:status},
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
        let list = res.data.laborItems;
        if(page>1){
          list = that.data.laborItems.concat(list);
        }
        if (res.data.laborItems.length > 0) {
          page += 1;
        }
        that.setData({
          page: page,
          laborItems: list
        });
        setTimeout(function(){
          that.setData({
            dibu: false
          })
        },800);
      }
    })

  },

 
})