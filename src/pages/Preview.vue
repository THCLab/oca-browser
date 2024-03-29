<template>
  <q-page class="q-pa-md">
    <div class="items-center justify-evenly">
      <div class="row">
        <div class="col-4" />
        <div class="col-4">
          <q-file
            v-model="file"
            label="Pick OCA Bundle zip file"
            accept=".zip"
            filled />
        </div>
        <div class="col-1" />
        <div class="col-3">
          <div class="row items-start">
            <q-input v-model="namespace" label="Namespace" dense />
            <q-btn
              color="primary"
              :disabled="!file || !namespace"
              @click="publish">
              Publish
            </q-btn>

            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="publishHelpExpanded ? 'help_outline' : 'help'"
              @click="publishHelpExpanded = !publishHelpExpanded" />
          </div>

          <q-slide-transition>
            <div v-show="publishHelpExpanded">
              <q-separator />
              <div class="q-py-sm text-subitle2">
                Publish in given namespace selected OCA Bundle to all OCA
                Repositories.
              </div>
            </div>
          </q-slide-transition>

          <q-separator />

          <div class="row">
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="publishResult"></span>
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </div>

      <br />

      <div class="row">
        <div class="col-12">
          <!-- eslint-disable vue/no-v-html -->
          <span v-html="parsingResult"></span>
          <!-- eslint-enable vue/no-v-html -->
          <q-spinner v-if="loading" color="primary" size="5em" />
          <div class="q-gutter-y-md" style="max-width: 100vw; width: 100%">
            <q-card v-if="htmlOCAForm || htmlOCACredential">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator>
                <q-tab name="form" label="Form" :disable="!htmlOCAForm" />
                <q-tab
                  name="credential"
                  label="Credential"
                  :disable="!htmlOCACredential" />
              </q-tabs>

              <q-separator />

              <!-- eslint-disable vue/no-v-html -->
              <q-tab-panels v-model="tab" animated>
                <q-tab-panel
                  style="display: flex; justify-content: center"
                  name="form">
                  <div
                    style="min-width: 300px; max-width: 30vw"
                    v-html="htmlOCAForm" />
                </q-tab-panel>

                <q-tab-panel
                  style="display: flex; justify-content: center"
                  name="credential">
                  <div
                    :style="{
                      'min-width': credentialWidth,
                      'min-height': credentialHeight,
                      width: credentialWidth,
                      height: credentialHeight
                    }"
                    v-html="htmlOCACredential" />
                </q-tab-panel>
              </q-tab-panels>
              <!--eslint-enable-->
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch, getCurrentInstance } from 'vue'
import { resolveFromZip, OcaJs } from 'oca.js-form-core'
import { useStore } from 'src/store'
import { renderOCAForm, renderOCACredential } from 'oca.js-form-html'
import { AxiosInstance } from 'axios'

export default defineComponent({
  name: 'Preview',
  setup() {
    const $store = useStore()
    const defaultLanguage = $store.state.settings.language
    const currentInstance = getCurrentInstance()
    if (!currentInstance) {
      return
    }
    const $ocaJs = currentInstance.appContext.config.globalProperties
      .$ocaJs as OcaJs
    const $axios = currentInstance.appContext.config.globalProperties
      .$axios as AxiosInstance
    const parsingResult = ref('')
    const file = ref()
    const publishHelpExpanded = ref(true)
    const namespace = ref('')
    const publishResult = ref('')
    const loading = ref(false)
    const htmlOCAForm = ref()
    const htmlOCACredential = ref()
    const credentialWidth = ref('0')
    const credentialHeight = ref('0')
    const tab = ref('form')

    const ocaRepoHostUrls = $store.state.settings.ocaRepositoryUrls

    watch(file, async newFile => {
      htmlOCACredential.value = null
      htmlOCAForm.value = null
      parsingResult.value = ''
      loading.value = true
      try {
        const oca = await resolveFromZip(newFile)
        const structure = await $ocaJs.createStructure(oca)
        if (
          structure.credentialLayout &&
          !structure.controls.some(c => c.type == 'Reference')
        ) {
          const credential = await renderOCACredential(
            structure,
            {},
            {
              defaultLanguage,
              dataVaultUrl: $store.state.settings.dataVaultUrls[0],
              ocaRepoHostUrl: ocaRepoHostUrls[0]
            }
          )
          htmlOCACredential.value = credential.node
          credentialWidth.value = credential.config.width
          credentialHeight.value = `${
            parseInt(credential.config.height, 10) / credential.pageNumber + 38
          }px`
        }

        if (structure.formLayout) {
          const form = await renderOCAForm(
            structure,
            {},
            {
              showFlagged: true,
              defaultLanguage,
              onSubmitHandler: capturedData => console.log(capturedData)
            }
          )
          htmlOCAForm.value = form
        }
        if (!htmlOCAForm.value) {
          tab.value = 'credential'
        }
      } catch (e) {
        parsingResult.value += '<div style="color: #FC100D">Failure!</div>'
        parsingResult.value += e
        console.error(e)
      } finally {
        loading.value = false
      }
    })

    const publish = async () => {
      for (const [i, ocaRepoHostUrl] of ocaRepoHostUrls.entries()) {
        const requestUrl = `${ocaRepoHostUrl}/api/v0.1/namespaces/${namespace.value}/schemas`
        const formData = new FormData()
        formData.append('file', file.value)

        const publishResponse = await $axios.post(requestUrl, formData)
        /* eslint-disable */
        if (publishResponse.data.success) {
          publishResult.value += `${i}: Success! <a href="${publishResponse.data.path}">Click here to open</a><br>`
        } else {
          console.error(publishResponse.data.errors)
          publishResult.value += `${i}: Failure! Open dev console for more information<br>`
        }
        /* eslint-enable */
      }
    }

    return {
      htmlOCAForm,
      htmlOCACredential,
      parsingResult,
      defaultLanguage,
      loading,
      credentialWidth,
      credentialHeight,
      tab,
      publish,
      publishHelpExpanded,
      publishResult,
      namespace,
      file
    }
  }
})
</script>

<style lang="scss"></style>
