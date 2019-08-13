// pages/message/message.js
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置

var app = getApp();
Page({
  data: {
    msgData: []

  },
  changeInputValue(ev) {
    this.setData({
      inputVal: ev.detail.value
    })
  },
  //删除留言
  DelMsg(ev) {
    var n = ev.target.dataset.index;

    var list = this.data.msgData;
    list.splice(n, 1);

    this.setData({
      msgData: list

    });
  },
  //添加留言
  addMsg() {
    var list = this.data.msgData;
    list.push({
      msg: this.data.inputVal
    });
    //更新
    this.setData({
      msgData: list,
      inputVal: ''

    });
  },
})