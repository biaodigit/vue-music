<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <p class="title">用户中心</p>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :current-index="currentIndex" :switches="switches"></switches>
      </div>
      <div @click="random" class="random-wrapper">
        <i class="icon-play"></i>
        <span class="random">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="scroll" :data="favoriteList" v-show="currentIndex === 0" ref="favorite">
          <ul class="list">
            <li @click="selectItem(song)" class="item" v-for="song in favoriteList">
              <span class="song">{{song.name}}</span>
              <span class="name">{{song.singer}}</span>
            </li>
          </ul>
        </scroll>
        <scroll class="scroll" :data="playHistory" v-show="currentIndex === 1" ref="play">
          <ul class="list">
            <li @click="selectItem(song)" class="item" v-for="song in playHistory">
              <span class="song">{{song.name}}</span>
              <span class="name">{{song.singer}}</span>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {mapGetters, mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  import Song from 'common/js/song'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        currentIndex: 0,
        switches: [
          {
            text: '收藏记录'
          },
          {
            text: '播放记录'
          }
        ]
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      switchItem(index) {
        this.currentIndex = index
        if (index === 0) {
          this.$nextTick(() => {
            this.$refs.favorite.refresh()
          })
        } else {
          this.$nextTick(() => {
            this.$refs.play.refresh()
          })
        }
      },
      selectItem(item) {
        this.insertSong(new Song(item))
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({list})
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favorite && this.$refs.favorite.refresh()
        this.$refs.play && this.$refs.play.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    computed: {
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "user-center.styl"
</style>
