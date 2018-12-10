import {
  Button
  , Dropdown
  , DropdownMenu
  , DropdownItem
} from 'element-ui'

export default {
  install( Vue ){
    Vue.use(Button)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
  }
}
