// pages/signin/signin.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    carts: [],
  },

  //获取全局的carts变量值
  onShow: function () {
    console.log('carts1', app.globalData.carts)
    this.setData({
      list: app.globalData.carts
    })
    db.collection('emall').get({
      success: res => {
        console.log('mtyhhg', res)
      }
    })
  },
  onLoad: function () {
    // db.collection('emall').get({
    //   success: res => {
    //     console.log('kdjfkdjfjfl', res)
    //     this.setData({
    //       list: res.data
    //     })
    //   }
    // })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});