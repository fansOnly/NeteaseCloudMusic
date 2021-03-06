export default {
  pages: [
    "pages/index/index",
    "pages/music/index",
    "pages/search/index/index",
    "pages/search/result/index",
    "pages/playlist/index/index",
    "pages/playlist/detail/index",
    "pages/album/new/index",
    "pages/album/detail/index",
    "pages/artist/index/index",
    "pages/artist/detail/index",
    "pages/artist/songs/index",
    "pages/mv/index/index",
    "pages/mv/detail/index",
    "pages/mine/index",
    "pages/mine/album/index/index",
    "pages/mine/playhistory/index",
    "pages/mine/followeds/index",
    "pages/mine/follows/index",
    "pages/mine/message/index",
    "pages/mine/timedoff/index",
    "pages/login/index",
    "pages/login/register/index",
    "pages/404/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#ee433a",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "white",
  },
  requiredBackgroundModes: ["audio"],
  tabBar: {
    selectedColor: "#ee433a",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "assets/image/tab01.png",
        selectedIconPath: "assets/image/tab01s.png",
        text: "发现",
      },
      {
        pagePath: "pages/music/index",
        iconPath: "assets/image/tab02.png",
        selectedIconPath: "assets/image/tab02s.png",
        text: "我的音乐",
      },
      {
        pagePath: "pages/mine/index",
        iconPath: "assets/image/tab03.png",
        selectedIconPath: "assets/image/tab03s.png",
        text: "个人中心",
      },
    ],
  },
};
