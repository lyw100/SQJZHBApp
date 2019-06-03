var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var intervalImg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jieshu:false,//结束按钮
    tijiao:false,//提交按钮与上传图片按钮
    shualiandl:false,
    laborItem:'',
    address:'',
    facemsg:'',
    num: 25,
    imgurl: ''
  },
  tijiao_zhuye: function () {
    let status=this.data.laborItem.status;
    if(status==2){
      //保存开始劳动照片
      this.saveLaborPicture(status);
    }else if(status==3){
      //劳动结束上传照片
      this.saveLaborPicture(status);
     
    }

  },
  /**
   * 上传照片
   */
  paizhao:function(){
    let that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let laborItem = that.data.laborItem;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let dateTime=that.getDateTime();
        let laodong='';
        if (laborItem.status==2){
          laodong = '开始劳动照片';
        } else if (laborItem.status == 3) {
          laodong = '结束劳动照片';
        }
        for (let i = 0; i < tempFilePaths.length;i++){
          let map={};
          map.picture = tempFilePaths[i];
          map.time = laodong;
          map.isUsed = 0;//未上传
          laborItem.pictures.push(map);
        }
        that.getAddress();
        that.setData({
          laborItem: laborItem          
        })
      }
    })
    
  },
  /**
   * 移除照片
   */
  removePicture:function(e){
    let index = e.currentTarget.dataset.index;
    let laborItem=this.data.laborItem;
    laborItem.pictures.splice(index,1);
    this.setData({
      laborItem: laborItem
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let  itemid=options.itemid;
    if (itemid==null){
      itemid=6;
    }
    console.log(itemid);
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/labor/getLaborItemById', //获取义务劳动内容
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
          laborItem: res.data,
        });
        let title = '';
        if (res.data.status == 2) {
          title = '开始劳动';
          that.setData({
            tijiao:true,
            jieshu:false
          })
        } else if (res.data.status == 3) {
          title = '劳动中';
          that.setData({
            tijiao: false,
            jieshu:true
          })
        } else if (res.data.status == 4) {
          title = '结束劳动';
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


    console.log(nowHour);
    console.log(nowMin);
    let DateTime = nowYear + "-" + nowMonth + "-" + nowDay+" "+nowHour+":"+nowMin;
    console.log('DateTime:' + DateTime);
    //返回当天的日期
    return DateTime;
  },

  /**
   * 查询地点
   */
  getAddress: function () {
    let that=this;
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
          }
        })
      }
    })
    
  },

  /**
   * 保存劳动照片
   */
  saveLaborPicture:function(status){
    
    let pictures=this.data.laborItem.pictures;
    let urls=[];
    for(let i=0;i<pictures.length;i++){
      if(pictures[i].isUsed==0){
        urls.push(pictures[i].picture);
      }
    }
    if(urls.length==0){
      wx.showToast({
        title: '请选择照片后提交',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      
      let laborItem = this.data.laborItem;
      let dateTime = this.getDateTime();
      let json={};
      json.address=this.data.address;
      console.log("address.real:" + json.address);
      json.itemid=laborItem.id;
      json.dateTime = dateTime + ':00';
      json.status=status;
      if (urls.length==1){
        json.end = "yes";
      }else{
        json.end = "no";
      }
      this.uploadOneByOne(urls, 0, 0, 0, urls.length,json);
    }
  },

  /**
  * 采用递归的方式上传多张
  */
  uploadOneByOne(imgPaths, successUp, failUp, count, length, json) {
    let that = this;
    
    console.log('正在上传第' + (count+1) + '张');
    var header = getApp().globalData.header; //获取app.js中的请求头
    wx.uploadFile({
      url: getApp().globalData.url + '/labor/uploadPicture',
      filePath: imgPaths[count],
      header: header,
      formData: json,
      name: 'file',//示例，使用顺序给文件命名
      success: function (e) {
        successUp++;//成功+1
      },
      fail: function (e) {
        failUp++;//失败+1
      },
      complete: function (e) {
        count++;//下一张
        if (count == length) {
          //上传完毕，作一下提示
          let laborItem=that.data.laborItem;
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          for(let i=0;i<laborItem.pictures.length;i++){
            laborItem.pictures[i].isUsed=1;
          }
          if(json.status==2){
            laborItem.startRealTime=json.dateTime.substring(0,16);
            laborItem.startRealAddress=json.address;
            laborItem.status=3;
            that.setData({
              tijiao: false,
              jieshu: true,
              laborItem:laborItem
            })
          }else if(json.status==3){
            // laborItem.endRealTime = json.dateTime.substring(0, 16);
            // laborItem.endRealAddress = json.address;
            // laborItem.status = 4;
            // that.setData({
            //   tijiao: false,
            //   jieshu: false
            // })
            wx.navigateBack({
              delta: 1,
              url: '../yiwulaodong/yiwulaodong',
            })
          }

        } else {
          //递归调用，上传下一张
          if (count+1 == length){
            json.end="yes";
          }
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length, json);
          
        }
      }
    })
  },

  /**
   * 结束劳动
   */
  jieshulaodong:function(){
    this.setData({
      shualiandl: true,//是否展示刷脸窗口
    });
    var that = this;
    this.changeImg();//切图
    setTimeout(function () {
      that.takePhoto();
    }, 4000);
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
    let  that=this;
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
              that.setData({
                tijiao: true,
                jieshu: false,
                shualiandl:false
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
})