//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    list:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('emall').get({
      success: res => {
        console.log('ujhgty',res)
        this.setData({
          list: res.data
        })
          wx.hideLoading()
      }
    })
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
  },
  toDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
    console.log(e)
  }
})
