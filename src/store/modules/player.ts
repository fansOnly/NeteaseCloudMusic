import Taro from "@tarojs/taro";
import { getSongUrl, getSongDetail, checkMusic, simiSong } from "@/services/song"
import store from '../index'
import { getRandFromArray } from '@/utils/util'
import { Player, Song } from '@/utils/interface'

let audioInstance = Taro.createInnerAudioContext();

const state = {
  visible: false,
  player: <Player>{
    id: "", // 音乐id
    src: "", // 音乐地址
    paused: true, // 播放状态
    loop: false, // 是否循环播放
    autoplay: false, // 是否自动播放
    volume: 1, // 音量 0 ~ 1
    startTime: 0, // 开始播放位置
    currentTime: 0, // 当前音频的播放位置（单位 s）
    // trackIds: [], // 播放列表id集合
    autoqa: true, // 智能音质
    mode: 'queue', // 播放模式 repeat / shuffle / queue
  },
  song: <Song> {
    id: '',
    name: '',
    ar: [{id:'',name:''}],
    al: {id:'', name:''},
    dt: 0,
    t: 0, // ？未知字段
    s: {br: 0, size: 0},
    h: {br: 0, size: 0},
    m: {br: 0, size: 0},
    l: {br: 0, size: 0},
    liked: false,
    likeCount: 0,
    commentCount: 0,
  },
  tracks: [], // 播放列表
};

initAudioInstance(state);

const mutations = {
  TOGGLE_VISIBLE(state: any) {
    state.visible = !state.visible
  },
  UPDATE_PLAYER(state: any, data: Player) {
    state.player = {
      ...state.player,
      ...data,
    };
    if (data.src) {
      audioInstance.src = data.src;
    }
  },
  UPDATE_SONG(state: any, data: Song) {
    state.song = {
      ...state.song,
      ...data,
    };
  },
  UPDATE_TRACKS(state: any, data: Array<Song>) {
    state.tracks = data
  },
  PLAY() {
    audioInstance.play();
  },
  PAUSE() {
    audioInstance.pause();
  },
  SEEK(state: any, time: number) {
    state.startTime = time;
    audioInstance.seek(time);
  },
};

const actions = {
  async TOGGLE_VISIBLE({ commit, dispatch }, songid?: string) {
    if (songid) {
      await dispatch('PLAY', songid)
    }
    commit('TOGGLE_VISIBLE')
  },
  UPDATE_PLAYER({ commit }, data: Player) {
    commit("UPDATE_PLAYER", data);
  },
  UPDATE_SONG({ commit }, data: Player) {
    commit("UPDATE_SONG", data);
  },
  UPDATE_TRACKS( { commit }, data: Array<Song>) {
    commit('UPDATE_TRACKS', data)
  },
  async PLAY({ state, commit }, songid?: string) {
    const { player: { id: playerid }, tracks } = state
    songid = songid ?? playerid ?? state.song.id
    if (!songid) {
      return Taro.showToast({
        title: '未查找到音频资源，播放失败',
        icon: 'none',
        duration: 1500
      })
    }
    const trackIds = tracks.map((v: any) => v.id)
    const { success } = await checkMusic(songid);
    if (success) {
      if (playerid == songid) {
        commit("UPDATE_PLAYER", { paused: false });
        commit("PLAY");
      } else {
        const { code, data } = await getSongUrl(songid);
        if (code === 200) {
          const src = data[0].url;
          commit('UPDATE_PLAYER', { id: songid, src, paused: false })
          const { code: code2, songs } = await getSongDetail(songid);
          if (code2 === 200) {
            const { name, ar = [], al = {}, dt, t, s = {}, h = {}, m = {}, l = {}, likeCount = 1099, commentCount = 287 } = songs[0]
            commit("UPDATE_SONG", { id: songid, name, ar, al, dt: dt/1000, t, s, h, m, l, likeCount, commentCount });
            if (!trackIds.includes(playerid)) {
              commit('UPDATE_TRACKS', [{ id: songid, name, ar, al }])
            }
          } else {
            Taro.showToast({
              title: "获取音乐详情失败",
              icon: "none",
            });
          }
          if (!trackIds.includes(playerid)) {
            const { code: code3, songs: simiSongs } = await simiSong(songid)
            // 处理接口字段不统一的问题
            simiSongs.map((v: any)=> {
              v.al = v.album
              v.ar = v.artists
              return v
            })
            if (code3 === 200) {
              commit('UPDATE_TRACKS', [...state.tracks, ...simiSongs])
            }
          }
          commit("PLAY");
        } else {
          Taro.showToast({
            title: "获取音乐资源失败",
            icon: "none",
          });
        }
      }
    }
  },
  async MULTI_PLAY({ commit }, datas: Array<Song>) {
    if (!datas.length) return
    const { id: songid, name, ar=[{id:'',name:''}], al={id:'',name:''},dt,t,s={br: 0, size: 0},h={br: 0, size: 0}, m={br: 0, size: 0},l={br: 0, size: 0} } = datas[0]
    const { code, data } = await getSongUrl(songid);
    if (code === 200) {
      const src = data[0].url;
      commit("UPDATE_PLAYER", { id: songid, src, paused: false });
      commit("UPDATE_SONG", { id: songid, name, ar, al, dt: dt/1000, t, s, h, m, l });
      commit('UPDATE_TRACKS', [...datas])
      commit("PLAY");
    }
  },
  PLAY_NEXT() {
    handleOnPlayEnd(1)
  },
  PLAY_PREV() {
    handleOnPlayEnd(-1)
  },
  PAUSE({ commit }) {
    commit("UPDATE_PLAYER", { paused: true });
    commit("PAUSE");
  },
  SEEK({ commit }, data: number) {
    commit("SEEK", data);
  },
};

function initAudioInstance(state: any) {
  audioInstance.startTime = state.startTime;
  audioInstance.loop = state.loop;
  audioInstance.autoplay = state.autoplay;
  audioInstance.volume = state.volume;
  // audioInstance.playbackRate = 1; // 播放速度 0.5 ~ 2.0
  audioInstance.onPlay(() => {
    console.log("开始播放::", audioInstance.currentTime);
  });
  audioInstance.onPause(() => {
    console.log("暂停播放::", audioInstance.currentTime);
  });
  audioInstance.onTimeUpdate(() => {
    store.dispatch('player/UPDATE_PLAYER', {currentTime: audioInstance.currentTime})
  })
  audioInstance.onSeeked(() => {
    console.log("跳转完成::", audioInstance.currentTime);
  });
  audioInstance.onWaiting(() => {
    console.log("音频缓冲中...");
  });
  audioInstance.onCanplay(() => {
    console.log("音频缓冲成功，开始播放::", audioInstance.buffered);
  });
  audioInstance.onEnded(() => {
    console.log("播放结束");
    handleOnPlayEnd(1)
  });
  audioInstance.onError((res: any) => {
    console.log("onError:", res);
  });
}

// 处理一首歌曲播放完成后的逻辑
function handleOnPlayEnd(step: number) {
  const { tracks = [], player: {id, loop, mode} } = state
  const { length } = tracks
  const trackIds = tracks.map((v: any) => v.id)
  let prevPlayId: string // 上一首要播放的歌曲id
  let nextPlayId: string // 下一首要播放的歌曲id
  // 只有一首歌，播放完成后停止播放
  if ((length === 0) || (length === 1 && !loop)) {
    store.dispatch('player/UPDATE_PLAYER', {paused: true})
    audioInstance.stop();
    Taro.showToast({
      title: '列表播放已完成',
      icon: 'none',
      duration: 1500
    })
    return
  }
  if (loop) { // 单曲循环
    store.dispatch('player/PLAY', id)
  } else if (mode === 'queue') { // 列表循环
    const current: number = trackIds?.indexOf(id)
    if (step > 0) {
      if (current < length - 1) {
        nextPlayId = trackIds[current + 1]
      } else {
        nextPlayId = trackIds[0]
      }
      store.dispatch('player/PLAY', nextPlayId)
    } else {
      if (current === 0) {
        prevPlayId = trackIds[length - 1]
      } else {
        prevPlayId = trackIds[current - 1]
      }
      store.dispatch('player/PLAY', prevPlayId)
    }
  } else { // 随机播放
    nextPlayId = getRandFromArray(trackIds, [id])
    store.dispatch('player/PLAY', nextPlayId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
