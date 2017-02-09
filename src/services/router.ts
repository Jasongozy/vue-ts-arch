import { Vue }            from 'av-ts'
import { isEmpty }        from 'lodash'
import { AsyncComponent } from 'vue'
import * as VueRouter     from 'vue-router'

const Hello: AsyncComponent = (resolve) => {
  require.ensure([], () => {
    resolve(require('../components/hello/hello.component.vue'))
  }, 'hello')
}

const Another: AsyncComponent = (resolve) => {
  require.ensure([], () => {
    resolve(require('../components/another.component.vue'))
  }, 'another')
}

Vue.use(VueRouter)

const routerBase = isEmpty(process.env.VUE_ROUTER_BASE)
  ? '/'
  : process.env.VUE_ROUTER_BASE

const routes: VueRouter.RouteConfig[] = [
  {
    name    : 'index',
    path    : '/',
    redirect: { name: 'hello' },
  },
  {
    path     : '/hello',
    component: Hello,
    children : [
      {
        name      : 'hello',
        path      : '',
        components: {
          another: Another,
        },
      },
    ],
  },
  {
    path    : '*',
    redirect: { name: 'index' },
  },
]

export default new VueRouter({
  mode: 'history',
  base: routerBase,
  routes,
  scrollBehavior(to) {
    if (to.params['scrollToSelector']) {
      return { selector: to.params['scrollToSelector'] }
    }
    return { x: 0, y: 0 }
  },
})
