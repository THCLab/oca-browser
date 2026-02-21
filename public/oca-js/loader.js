import init, * as ocaJsModule from './oca_js.js'

window.__ocaJsModule = {
  ...ocaJsModule,
  default: init
}
