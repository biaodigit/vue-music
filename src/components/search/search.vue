<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" @onFocus="onFocus" ref="searchBox"></search-box>
      <div class="cancel" v-show="isFocus" @click="onBlur">取消</div>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="hot-key-wrapper" v-show="!isFocus">
        <h3 class="title">热门搜索</h3>
        <ul>
          <li @click="addQuery(item.k)" class="key" v-for="item in hotKey">{{item.k}}</li>
        </ul>
      </div>
      <div class="search-history-wrapper" v-show="isFocus && searchHistory.length">
        <h3 class="title">
          <span class="text">搜索历史</span>
          <span class="clear">
                <i class="icon-clear"></i>
              </span>
        </h3>
        <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory" ref="searchList"></search-list>
      </div>
    </div>
    <div class="search-result-wrapper" v-show="query">
      <search-result @select="saveSearch" @listScroll="blurInput" :query="query"></search-result>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchResult from 'components/search-result/search-result'
  import SearchList from 'base/search-list/search-list.vue'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {shuffle} from 'common/js/util'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        isFocus: false,
        hotKey: null,
        query: ''
      }
    },
    created() {
      this.keyArr = []
      this.$_getHotKey()
    },
    activated() {
      if (this.keyArr) {
        this.randomHotKey()
      }
    },
    methods: {
      onFocus() {
        this.isFocus = true
        this.$nextTick(() => {
          this.$refs.searchList.refresh()
        })
      },
      onBlur() {
        if (this.query) {
          this.query = ''
          this.$refs.searchBox.clearQuery()
        }
        this.isFocus = false
      },
      $_getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.keyArr = res.data.hotkey
            this.hotKey = shuffle(this.keyArr).slice(0, 8)
          }
        })
      },
      randomHotKey() {
        this.hotKey = shuffle(this.keyArr).slice(0, 8)
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query) {
        this.query = query.trim()
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory'
      ])
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    components: {
      SearchBox,
      SearchResult,
      SearchList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "search.styl"
</style>
