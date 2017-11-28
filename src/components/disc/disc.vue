<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="discs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getDisc} from 'api/recommend'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        discs: []
      }
    },
    created() {
      this.$_getDisc()
    },
    methods: {
      $_getDisc() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getDisc(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.discs = this.$_formatDiscList(res.cdlist[0].songlist)
          }
        })
      },
      $_formatDiscList(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
            ret.push(createSong(item))
          }
        })
        return ret
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "disc.styl"
</style>
