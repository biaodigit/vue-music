import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/dsinger/dsinger')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const UserCenter = () => import('components/user-center/user-center')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const SingerType = () => import('components/singer-type/singer-type')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':type',
          component: SingerType,
          children: [
            {
              path: ':id',
              component: SingerDetail
            }
          ]
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
