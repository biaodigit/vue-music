<template>
  <transition name="fade">
    <div class="play-list" @click="hide" v-show="showFlag">
      <div class="play-list-wrapper border-1px-top" @click.stop>
        <div class="top">
          <i @click="changeMode" class="icon" :class="iconMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </div>
        <scroll :data="sequenceList" class="list" ref="scroll">
          <transition-group name="list" tag="ul" ref="list">
            <li :key="item.id" @click="selectItem(item)" class="item" v-for="item in sequenceList">
              <i class="current" :class="getCurrentCls(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="favorite" @click.stop="toggleFavorite(item)">
                <i :class="iconFavorite(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="close" @click="hide">
          <span class="text">关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" confirm="清空" @confirm="confirmClear"></confirm>
      <toast v-model="showToast" :text="text" ref="toast"></toast>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Toast from 'base/toast/toast'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        showToast: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          this.scrollToCurrentSong(this.currentSong)
        })
      },
      hide() {
        this.showFlag = false
      },
      getCurrentCls(item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item) {
        let index = this.sequenceList.findIndex((song) => {
          return song.id === item.id
        })
        this.setCurrentIndex(index)
      },
      deleteItem(item) {
        if (this.isDeleting) {
          return
        }
        this.isDeleting = true
        this.deleteSong(item)
        if (!this.playlist.length) {
          return
        }
        setTimeout(() => {
          this.isDeleting = false
        }, 300)
      },
      scrollToCurrentSong(song) {
        let index = this.sequenceList.findIndex((item) => {
          return song.id === item.id
        })
        this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300)
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      confirmClear() {
        this.clearPlaylist()
        this.hide()
      },
      ...mapActions([
        'deleteSong',
        'clearPlaylist'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrentSong(newSong)
        }, 30)
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
      }
    },
    components: {
      Scroll,
      Confirm,
      Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "play-list.styl"
</style>
