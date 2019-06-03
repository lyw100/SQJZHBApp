Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'',//下拉选项状态
    statusStr:'全部',
    xiala_dwyc:false,
    page:1,
    rows: 6,
    learnItems: [],
    dibu: false,//火速加载中
  },
  /**
   * 学习状态选择
   */
  learnStatus: function (e) {
    let statusStr = '全部';
    let status = e.currentTarget.dataset.status;
    if (status == '0') { statusStr = '未开始' }
    else if (status == 1) { statusStr = '学习中' }
    else if (status == 2) { statusStr = '已结束' }
    this.setData({
      xiala_dwyc: false,
      status: status,
      statusStr: statusStr,
      page: 1,
    });
    this.learnItems();
  },
  /**
   * 全部点击
   */
  quanbudj:function(){
    if (this.data.xiala_dwyc) {
      this.setData({
        xiala_dwyc: false,
      });
    } else {
      this.setData({
        xiala_dwyc: true,
      });
    }
  },
  shenhezhong:function(e){
    let itemid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../jzxxzt/jzxxzt?itemid=' + itemid,
    })
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
    this.learnItems();
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
    this.learnItems();
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
    this.learnItems();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 获取集中学习列表
   */
  learnItems: function () {
    let status = this.data.status;
    let page = this.data.page;
    let rows = this.data.rows;
    let jzid = getApp().globalData.jiaozhengid;
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/learn/getLearnItemList', //请求劳动列表
      data: { jzid: jzid, page: page, rows: rows, status: status },
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
        let list = res.data.learnItems;
        if (page > 1) {
          list = that.data.learnItems.concat(list);
        }
        if (res.data.learnItems.length > 0) {
          page += 1;
        }
        that.setData({
          page: page,
          learnItems: list
        });
        setTimeout(function () {
          that.setData({
            dibu: false
          })
        }, 800);
      }
    })

  },
})