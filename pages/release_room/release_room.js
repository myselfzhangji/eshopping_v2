// pages/release/release.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["发布房源", "查看我的发布"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],
    role: ['业主', '转租', '室友', '公寓'],
    clickRoleId: -1,
    rentMode: ['整租', '单间出租', '床位出租'],
    clickrentModeId: -1,
    comment: [{
      value: '限男生',
      selected: false,
      title: '限男生'
    }, {
      value: '限女生',
      selected: false,
      title: '限女生'
    }, {
      value: '可情侣',
      selected: false,
      title: '可情侣'
    }, {
      value: '可办居住证',
      selected: false,
      title: '可办居住证'
    }, {
      value: '可备案',
      selected: false,
      title: '可备案'
    }, {
      value: '不可带宠物',
      selected: false,
      title: '不可带宠物'
    }, {
      value: '带独卫',
      selected: false,
      title: '带独卫'
    }],
    price: 0,
    location:'',
  },

  valuechange: function (res) {
    //console.log('value', res)
    if (res.detail.value == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
      return
    }

    if (res.target.id == 'price'){
      this.setData({
        price: res.detail.value
      })
      //console.log('price', this.data.price)
    }
    if (res.target.id == 'location') {
      this.setData({
        location: res.detail.value
      })
      //console.log('location', this.data.location)
    }
  },

  checkboxChange(e) {
    console.log('checkboxChange e:', e);
    let string = "comment[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.comment[e.target.dataset.index].selected
    })
    let detailValue = this.data.comment.filter(it => it.selected).map(it => it.value)
    console.log('所有选中的值为：', detailValue)
  },

  /**
   * 用户点击Button,字体变色.
   */
  chooseRole: function (res) {
    if (this.data.clickRoleId == res.currentTarget.id) {
      this.setData({
        clickRoleId: -1
      })
      return;
    }
    this.setData({
      clickRoleId: res.currentTarget.id
    })
  },

  chooseRentMode: function (res) {
    if (this.data.clickrentModeId == res.currentTarget.id) {
      this.setData({
        clickrentModeId: -1
      })
      return;
    }
    this.setData({
      clickrentModeId: res.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 4,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
    //     });
    //   }
    // });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
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

  addMall() {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0]
        const tempFile = filePath.split('.')
        const cloudPath = 'room-' + tempFile[tempFile.length - 2] + '.jpg'
        wx.cloud.uploadFile({
          cloudPath,  // 上传至云端的路径
          filePath,   // 小程序临时文件路径
          success: res => {
            console.log(res)
            db.collection('emall').add({
              data: {
                title: this.data.location + '有房出租',
                price: this.data.price,
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

  getMall(e) {
    console.log(e)
    wx.navigateTo({
      url: './show_release',
    })
  },

})