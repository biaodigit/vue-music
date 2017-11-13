<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(item,index) in songs">
        <div class="rank">
          <span :class="getIconCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content" @click="selectSong(item,index)">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}·${song.album}`
      },
      getIconCls(index) {
        if (!this.rank) {
          if (index <= 2) {
            return 'text firstToThird'
          } else {
            return 'text'
          }
        } else {
          if (index <= 2) {
            return `icon icon${index}`
          } else {
            return 'text'
          }
        }
      },
      getRankText(index) {
        if (!this.rank) {
          return index + 1
        } else {
          if (index > 2) {
            return index + 1
          }
        }
      },
      selectSong(item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "song-list.styl"
</style>
