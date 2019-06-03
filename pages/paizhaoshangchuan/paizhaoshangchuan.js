// pages/paizhaoshangchuan/paizhaoshangchuan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText:'',//标题
    inputContent:'',//内容
    imgList:[],//图片列表
    urlList:[]//上传图片返回的地址
  },
  inputBind:function(event){
    var text=event.detail.value
    this.setData({
      inputText:text
    })
  },
  inputContentBind:function(event){
    var text=event.detail.value
    this.setData({
      inputContent:text
    })
  },
  /**
   * 点击选择图片
   */
  dianji: function () {
    var imgList=this.data.imgList
    var count=9-imgList.length
    var self=this
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length;i++){
          imgList.push(tempFilePaths[i])
        }
        
        self.setData({
          imgList: imgList
        })
      }
    })
  },
  /**
   * 发表
   */
  fabiao:function(){
    var title=this.data.inputText.trim();
    if(title==''){
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration:1000
      })
      return;
    }
    var content = this.data.inputContent.trim();
    var imgList=this.data.imgList
    if (content==""&&imgList.length==0){
      wx.showToast({
        title: '请输入思想汇报内容或选择图片',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var path = getApp().globalData.url;
    //var path = 'http://localhost:8080/SQJZ'
    var imgList = this.data.imgList
       wx.showToast({
      title: '正在提交...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    var self=this
    //图片数量
    var count = 0
    if(imgList.length>0){
      for (var i = 0; i < imgList.length; i++) {
        wx.uploadFile({
          url: path + '/report/upload',
          filePath: imgList[i],
          name: 'file',
          header: {
            'Cookie': getApp().globalData.header.Cookie, //获取app.js中的请求头
            'content-type': 'multipart/form-data'
          },
          formData: { 
            jzid: getApp().globalData.jiaozhengid,
            index: i 
            },
          success(res) {
            var data = JSON.parse(res.data)
            if (data.msg == "OK") {
              count++;
              var imgUrls = self.data.urlList
              imgUrls.push(data.imgUrl)
              self.setData({
                urlList: imgUrls
              })
              if (count == imgList.length) {
               self.saveReport();
                
              }
            }
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        })
      }

    }else{
      self.saveReport();
    }
   
  },
  imgPreview:function(event){
    var src = event.currentTarget.dataset.src
    var list = event.currentTarget.dataset.list
    wx.previewImage({
      urls: list,
      current: src
    })
  },
  deleteImg:function(event){
    var imgList=this.data.imgList
    var self=this
    var index=event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success:function(res){
        if(res.confirm){
          imgList.splice(index,1)
        }else if(res.cancel){
          //console.log("取消")
        }
        self.setData({
          imgList:imgList
        })
      }
    })

  },
  countInfo: function () {
    wx.request({
      url: getApp().globalData.url + '/count/paizhaoshangchuan',
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
    var imgList=JSON.parse(options.imgList);
    this.setData({
      imgList:imgList
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
    // console.log("离开")
    // wx.showModal({
    //   title: '提示',
    //   content: '确定要返回吗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    
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
   * 保存思想汇报
   */
  saveReport:function(){
    let title = this.data.inputText
    let content = this.data.inputContent;
    let imgUrls=this.data.urlList;

    wx.request({
      url: getApp().globalData.url + '/report/add',
      data: {
        jzid: getApp().globalData.jiaozhengid,
        title: title,
        content: content,
        pathes: JSON.stringify(imgUrls)
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
        if (res.data == 'OK') {
          wx.showToast({
            title: '发表成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: '发表思想汇报失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '发表思想汇报失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  }
})