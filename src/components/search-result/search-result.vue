<template>
  <scroll :pullup="pullup"
          :beforeScroll="beforeScroll"
          :data="result"
          @pullUp="searchMore" @beforeScroll="listScroll" class="search-result">
    <ul class="result-list">
      <li @click="selectItem(item)" v-for="item in result" class="item">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result text="暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic} from 'common/js/song'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const perpage = 20
  const TYPE_SINGER = 'singer'
  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        hasMore: true,
        result: [],
        pullup: true,
        beforeScroll: true
      }
    },
    methods: {
      search(query) {
        this.page = 1
        this.hasMore = true
        search(query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.$_initResult(res.data)
            this.$_checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this.$_initResult(res.data))
            this.$_checkMore(res.data)
          }
        })
      },
      listScroll() {
        this.$emit('listScroll')
      },
      $_initResult(data) {
        let ret = []
        console.log(data)
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this.$_formatSongList(data.song.list))
        }
        console.log(ret)
        return ret
      },
      $_formatSongList(list) {
        let ret = []
        list.forEach((song) => {
          if (isValidMusic(song)) {
            ret.push(createSong(song))
          }
        })
        return ret
      },
      $_checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      getIcon(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.name
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          return
        }

        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search-result.styl"
</style>
