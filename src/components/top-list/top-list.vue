<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songList"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {createSong} from 'common/js/song'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        songList: [],
        rank: true
      }
    },
    created() {
      this.$_getMusicList()
    },
    methods: {
      $_getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songList = this.$_formatSongList(res.songlist)
            console.log(this.songList)
            console.log(res)
          }
        })
      },
      $_formatSongList(list) {
        let ret = []
        list.forEach((item) => {
          let data = item.data
          if (data.albumid && data.songid) {
            ret.push(createSong(data))
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songList.length) {
          return this.songList[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "top-list.styl"
</style>
