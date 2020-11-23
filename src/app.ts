import { createApp } from 'vue'

import TaroUiVue from "taro-ui-vue/src"
import store from './store'

import "./custom-variables.scss"
import './assets/style/ui.scss'
import './app.scss'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(TaroUiVue).use(store)

export default App
