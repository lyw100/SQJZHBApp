var page = 1;         // 初次加载页数
var hadLastPage = false;  // 判断是否到最后一页
var lmtype='0';//0法律法规 1心灵鸡汤 2生活帮助
Page({

  tzxinwenye:function(e){
    var id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../xinwenxiangqing/xinwenxiangqing?id=' + id,
    });
  },

  /**
  * 页面的初始数据
  */
  data: {
    rows: "9",
    flfgtit:"xuanke  yanse",
    xljttit: "xuanxiuke",
    shbztit: "xuanxiuke",
    falvfagui: true,//法律法规
    xinlingjitang: false,//心灵鸡汤
    shenghuobangzhu: false,//生活帮助
    list: [],
    dibu: false
  },

  /**法律法规 心灵鸡汤 生活 */
  falcfg:function(){
    hadLastPage = false;
    lmtype="0";
    page = 1;
    this.setData({
      flfgtit: "xuanke yanse",
      xljttit: "xuanxiuke ",
      shbztit: "xuanxiuke",
      falvfagui: true,
      xinlingjitang: false,
      shenghuobangzhu: false,
      list: []
    })
    this.loadList();
  },

  xinljt: function(){
    hadLastPage = false;
    lmtype = "1";
    page = 1;
    this.setData({
      flfgtit: "xuanke ",
      xljttit: "xuanxiuke  yanse",
      shbztit: "xuanxiuke",
      falvfagui: false,
      xinlingjitang: true,
      shenghuobangzhu: false,
      list: []
    })
    this.loadList();
  },
  shenghbz: function () {
    hadLastPage = false;
    lmtype = "2";
    page = 1;
    this.setData({
      flfgtit: "xuanke ",
      xljttit: "xuanxiuke",
      shbztit: "xuanxiuke  yanse",
      falvfagui: false,
      xinlingjitang: false,
      shenghuobangzhu: true,
      list: []
    })
    this.loadList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      page = 1;
    hadLastPage = false;

    this.setData({
      list: []
    })
    this.loadList();
    // this.countInfo();
  },
  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {
    // page = 1;
    // hadLastPage = false;

    // this.setData({
    //   list: []
    // })
    // this.loadList();
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    page = 1;
    hadLastPage = false;

    this.setData({
      list: []
    })
    this.loadList();
  },
  loadList: function (event) {
    if (hadLastPage != false) {
      wx.showToast({
        title: '到底啦',
      });
      this.setData({
        dibu: false
      })
      return;
    }
    wx.showNavigationBarLoading();
    var that = this;
    // 显示加载图标  
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    wx.request({
      url: getApp().globalData.url + '/weChat/zhbd/list',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        rows: parseInt(that.data.rows) + 1,
        page: page,
        lmtype: lmtype,
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        // console.log(res);
        if (res.data.msg == "success") {
          // 回调函数  
          var list_add = that.data.list;
          for (var i = 0; i < res.data.list.length; i++) {
            if(lmtype==0){
              res.data.list[i].audittime=res.data.list[i].audittime.substring(0, 10);
            }else{
              //图片
              for (var j = 0; j < res.data.list[i].attachment.length; j++){
                // console.log(res.data.list[i].attachment[j].fileUrl)
                // res.data.list[i].attachment[j].fileUrl = getApp().globalData.url + "/upload/nr/" + res.data.list[i].creater+"/"+res.data.list[i].attachment[j].fileUrl;
              }

              //时间
             let hours= that.formatDate(res.data.list[i].audittime);
             let str="";
             if(hours<24){
               str = hours+"小时以前";
             } else if (hours>=24){
               str = parseInt(hours/24) + "天以前";
             }else if(hours>24*30){
               str = parseInt(hours / 24/30) + "个月以前";
             } else if (hours > 24 * 30*12) {
               str = parseInt(hours / 24 / 30 * 12) + "年以前";
             }
              res.data.list[i].audittime = str
            }
            list_add.push(res.data.list[i]);
          }
          // 页数+1  
          page++;
          // 设置数据  
          that.setData({
            list: list_add,
          })
        } else {
          hadLastPage = true;
        }
        that.setData({
          dibu: false
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })

  },
  formatDate: function (date) {
    var timestamp = Date.parse(new Date());//当前时间戳
    //var stringTime = date + " 00:00:00";//标准化时间格式
    var iosTime = date.replace(/-/g, '/');//解决ios端无法识别 
    var timestamp2 = Date.parse(new Date(iosTime));//待格式化时间戳
    var hours = Math.floor(Math.abs((timestamp - timestamp2) / 3600000))
    return hours
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    this.setData({
      dibu:true
    })
    this.loadList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})