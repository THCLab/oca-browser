import { boot } from 'quasar/wrappers'
import init_oca_js from 'oca.js'
import init, { OcaJs } from 'oca.js-form-core'

export default boot(async ({ app, store }) => {
  await init_oca_js()
  await init()

  const ocaJs = new OcaJs({
    dataVaults: store.state.settings.dataVaultUrls,
    ocaRepositories: store.state.settings.ocaRepositoryUrls
  })

  app.config.globalProperties.$ocaJs = ocaJs
  store._modules.root.state.$ocaJs = ocaJs
})
