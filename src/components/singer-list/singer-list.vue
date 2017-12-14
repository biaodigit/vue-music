<template>
  <scroll :data="singers" class="singer-type" ref="scroll">
    <ul class="list">
      <li @click="selectItem(item)" class="item" v-for="item in singers">
        <img class="avatar" v-lazy="item.avatar">
        <span class="name">{{item.name}}</span>
      </li>
    </ul>
    <router-view></router-view>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import {ERR_OK} from 'api/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapGetters, mapMutations} from 'vuex'

  const pathReg = /\/singer/

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: [],
        errImg: require('../../common/image/singer.png')
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getSingerList() {
        getSingerList(this.singerType).then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._formatSingerList(res.data.list)
          }
        })
      },
      _formatSingerList(list) {
        let ret = []
        list.forEach((singer) => {
          ret.push(new Singer({
            id: singer.Fsinger_mid,
            name: singer.Fsinger_name
          }))
        })
        return ret
      },
      selectItem(item) {
        this.$router.push({
          path: `/singer/${this.singerType}/${item.id}`
        })
        this.setSinger(item)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      '$route'() {
        if (!pathReg.test(this.$route.path)) {
          return
        }
        this._getSingerList()
      }
    },
    computed: {
      ...mapGetters([
        'singerType'
      ])
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "singer-list.styl"
</style>
