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
  // onPullDownRefresh(){
  //   this.getList(true)
  // },
  // onReachBottom(){
  //   this.page += 1
  //   this.getList(true)
  // },
  getList(isInit){
    const PAGE = 5
    db.collection('emall').skip(this.page * PAGE).limit(PAGE).get({
      success: res => {
        console.log('ujhgty', res.data)

        if(isInit){
          this.setData({
            list: res.data
          })
        } else {
          this.setData({
            list: this.data.list.concat(res.data)
          })
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      }
    })
  },

  onLoad: function () {
    this.page = 0;
    this.getList(true)
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // db.collection('emall').get({
    //   success: res => {
    //     console.log('ujhgty',res)
    //     this.setData({
    //       list: res.data
    //     })
    //       wx.hideLoading()
    //   }
    // })
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

  toDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
    console.log(e)
  }
})
