/**
 * Created by HFJY on 2018-6-5.
 */
wx.config({
    debug: false,
    appId: appid, //wxc0b5dfa06f872eee  wx199f202da1f10384
    timestamp: time,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
        // 所有要调用的 API 都要加到这个列表中
        'onMenuShareTimeline', 'onMenuShareAppMessage', "hideMenuItems", "showMenuItems"
    ]
});
wx.ready(function () {
    wx.hideMenuItems({
        menuList: ["menuItem:share:qq", "menuItem:share:QZone", "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari"
        ]
    });
    wx.showMenuItems({
        menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:copyUrl"] // 要显示的菜单项，所有menu项见附录3
    });

    //朋友圈
    wx.onMenuShareTimeline({
        title: '海风教育校园招聘', // 分享标题
        desc: '职等你来，欢迎加入海风大家庭！', // 分享描述
        link: share_link, // 分享链接
        imgUrl: 'https://cdn-vip.hfjy.com/newtpl/static/wx/img/wxico.jpg', // 分享图标
        success: function () {},
        cancel: function () {}
    });
    //分享到朋友
    wx.onMenuShareAppMessage({
        title: '海风教育校园招聘', // 分享标题
        desc: '职等你来，欢迎加入海风大家庭！', // 分享描述
        link: share_link, // 分享链接
        imgUrl: 'https://cdn-vip.hfjy.com/newtpl/static/wx/img/wxico.jpg', // 分享图标
        success: function () {},
        cancel: function () {}
    });
});
