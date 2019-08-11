//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {

    wx.cloud.callFunction({
      name: 'login',
      success: res =>{
        //console.log(res)
        e.detail.userInfo.openid = res.result.openid
        console.log('1234', e)
        //需要openid
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo
        })
        wx.setStorageSync('userInfo', e.detail.userInfo)
      }
    })
  },
  addMall(){
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'room-' + tempFile[tempFile.length-2] + '.jpg'
        wx.cloud.uploadFile({
          cloudPath,  // 上传至云端的路径
          filePath,   // 小程序临时文件路径
          success: res => {
            console.log(res)
            db.collection('emall').add({
              data: {
                title: '商品2',
                price: 18,
                tags: ['books', 'food'],
                image: res.fileID
              },
              success: res2 => {
                console.log(res2)
                wx.showToast({
                  title: '新增成功',
                })
              }
            })
          }
        })
        // const tempFilePaths = res.tempFilePaths
        // for (var i = 0; i < tempFilePaths.length; i++) {
        //   let randString = Math.floor(Math.random() * 1000000).toString() + '.png'
        //   wx.cloud.uploadFile({
        //     cloudPath: randString, // 上传至云端的路径
        //     filePath: tempFilePaths[i], // 小程序临时文件路径
        //     success: res => {
        //       photos.add({
        //         data: {
        //           image: res.fileID
        //         }
        //       }).then(res => {
        //         wx.showToast({
        //           title: '上传成功',
        //           icon: 'success'
        //         })
        //       })
        //     },
        //     fail: console.error
        //   })
        // }
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  getMall(){
    db.collection('emall').get({
      success: res =>{
        console.log(res)
      }
    })
  }
})
