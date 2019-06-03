var WxParse = require('../../wxParse/wxParse.js');
var timer = require('../../utils/wxTimer.js');
var wxTimer = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    ksxq_timu:true,
    ksxq_datk:false,
    wxTimerList: {}
  },
  // 点击答题卡跳转答题卡页面
  datika_dj:function(){
    this.setData({
      ksxq_timu: false,
      ksxq_datk: true,
    })
  },
  /**点击未选的答案返回主页面 */
  fhdtk_dt:function(e){
    // 轮播跳转指定页
    var index = e.currentTarget.dataset.index
    this.setData({
      ksxq_timu: true,
      ksxq_datk: false,
      sequence: index+1,
      curIndex: index
    })
  },
  // 点击交卷
  jiaojjieguo:function(){
    var ppid = this.data.ppid
    var pQuestionArr = this.data.pQuestionArr
    var that = this

    // 自动评卷
    var jsonarray = JSON.stringify(pQuestionArr)
    // console.log(jsonarray)
    wx.request({
      url: getApp().globalData.url + '/minipro/zxks/savePPaper',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        ppid: ppid,
        jsonarray: jsonarray
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if (res.data.msg == "success") {
          wx.redirectTo({
            url: '../kaoshijieguo/kaoshijieguo?ppid=' + ppid,
          })
          wx.showToast({
            title: '交卷成功！',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '交卷失败！',
            icon: 'none'
          })
        }
      }
    })

    // wx.showModal({
    //   content: '确定要交卷吗',
    //   success: function (res) {
    //     if (res.confirm) {
          
    //     } else if (res.cancel) {
    //       console.log('取消交卷')
    //     }
    //   }
    // })
  },
  // 查看结果
  ckjieguo: function(){
    var ppid = this.data.ppid
    wx.navigateTo({
      url: '../kaoshijieguo/kaoshijieguo?ppid=' + ppid,
    })
  },

  // 选择对应选项
  menuClick: function(e){
    var index = e.currentTarget.dataset.index
    var key = e.currentTarget.dataset.key
    // 点击改变选项样式，存储选项
    var pQuestionArr = this.data.pQuestionArr;
    for (var i = 0; i < pQuestionArr.length; i++) {
      let qtype = pQuestionArr[i].question.type
      if (i == index) {
        // 单选题
        if (qtype == '0') {
          pQuestionArr[i].hasChoose = key
        }
        // 多选题
        if (qtype == '1') {
          let isChoose = true
          let hasChoose = pQuestionArr[i].hasChoose;
          if (hasChoose != ""){
            let chooseArr = hasChoose.split(",")
            for (var j = 0; j <chooseArr.length; j++){
              if (chooseArr[j]==key){
                chooseArr.splice(j, 1);
                isChoose = false
              }
            }
            if (isChoose){
              pQuestionArr[i].hasChoose = hasChoose + "," + key
            }else{
              pQuestionArr[i].hasChoose = chooseArr.join(",")
            }
          }else{
            pQuestionArr[i].hasChoose = hasChoose + key
          }
        }else{//单选和判断
          pQuestionArr[i].hasChoose = key
        }
        // 判断题
        if (qtype == '2') {
          if('A' == key){
            pQuestionArr[i].hasChoose = '1'
          } else if('B' == key){
            pQuestionArr[i].hasChoose = '0'
          }
        }
      }
    }
    this.setData({
      pQuestionArr: pQuestionArr
    })
  },
  // 查询试卷题目
  getPPaper: function(ppid){
    wx.showLoading({
      title: '加载中',
    })
    // 生成试卷
    var that = this
    wx.request({
      url: getApp().globalData.url + '/minipro/zxks/getQuestionList',
      method: "POST",
      // 请求头部  
      header: {
        'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        ppid: ppid
      },
      success: function (res) {
        //判断session
        if (res.data.timeOut == 'OUT') {
          wx.reLaunch({
            url: '../shouye/shouye'
          });
          return false;
        }
        if (res.data.msg == "success") {
          var pQuestionArr = res.data.pQuestionArr
          if (pQuestionArr.length == 0){
            wx.showToast({
              title: '试卷无试题！',
              icon: 'none'
            })
          }else{
            //富文本循环替换html标签
            for (var i = 0; i < pQuestionArr.length; i++) {
              WxParse.wxParse('topic' + i, 'html', pQuestionArr[i].question.content, that)
              if (i === pQuestionArr.length - 1) {
                WxParse.wxParseTemArray("qcontentArr", 'topic', pQuestionArr.length, that)
              }
            }
            let qcontentArr = that.data.qcontentArr;
            for (var j = 0; j < qcontentArr.length; j++) {
              let contentStr = ''
              let imgArr = []
              let imgLen = 0
              for (var k = 0; k < qcontentArr[j].length;k++){
                let node = qcontentArr[j][k].nodes[0]
                if (node.tag == 'img'){
                  imgArr[imgLen] = getApp().globalData.url.substring(0, getApp().globalData.url.length-5) + node.attr.src
                  imgLen ++
                }else{
                  contentStr = contentStr + node.text
                }
              }
              pQuestionArr[j].question.content = contentStr
              pQuestionArr[j].question.img = imgArr
            }
          }
          var tfngNum = res.data.tfngNum
          var singleNum = res.data.singleNum
          var multipleNum = res.data.multipleNum
          that.setData({
            pQuestionArr: pQuestionArr,//查询结果
            qcount: pQuestionArr.length,//题目数量
            tfngNum: tfngNum,
            singleNum: singleNum,
            multipleNum: multipleNum,
            sequence: 1,//第一题序号
            curIndex: 0
          })
          // console.log(pQuestionArr)
        } else {
          wx.showToast({
            title: '查询试卷失败！',
            icon: 'none'
          })
        }
        wx.hideLoading()
      }
    })
  },
  // 题目滑动触发事件
  changeQuestion: function (e) {
    this.setData({
      sequence: e.detail.current + 1
    })
  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/kaoshixiangqing',
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
    var that = this
    var ppid = options.ppid
    var timeStr = options.timeStr
    var type = options.type
    var title = options.title;
    if (title != null && title != "") {
      wx.setNavigationBarTitle({
        title: title,
      })
    }
    // 查询试卷内容
    this.getPPaper(ppid,type)
    // 定时器
    // 0 未考 1已考
    if(type == '0'){
      wxTimer = new timer({
        beginTime: timeStr,
        name: 'wxTimer',
        complete: function () {
          that.jiaojjieguo()
        }
      })
      wxTimer.start(this)
    }
    // ppid个人试卷id type是否已考
    this.setData({
      ppid: ppid,
      type: type
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
    if(wxTimer != null){
      wxTimer.stop();
    }
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