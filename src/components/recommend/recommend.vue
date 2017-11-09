<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <div v-if="recommends.length" class="slider-content">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单</h1>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    data() {
      return {
        recommends: []
      }
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(this.recommends)
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.list)
          }
        })
      }
    },
    components: {
      Slider
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "recommend.styl"
</style>
