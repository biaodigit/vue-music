<template>
  <div class="tab border-1px-bottom">
    <router-link to="/recommend" tag="div" class="tab-item">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link to="/singer" tag="div" class="tab-item">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link to="/search" tag="div" class="tab-item">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "tab.styl"
</style>
