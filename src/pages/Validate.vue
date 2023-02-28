<template>
  <q-page class="q-pa-md">
    <div class="items-center justify-evenly">
      <div class="row">
        <div class="col-4" />
        <div class="col-4">
          <q-file
            v-model="files"
            label="Pick OCA Bundle zip files"
            accept=".zip"
            filled
            multiple />
        </div>
        <div class="col-1" />
        <div class="col-3">
          <div class="row items-start">
            <q-btn
              size="lg"
              label="Check"
              :disable="files.length == 0"
              @click="validate" />

            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="validateHelpExpanded ? 'help_outline' : 'help'"
              @click="validateHelpExpanded = !validateHelpExpanded" />
          </div>

          <q-slide-transition>
            <div v-show="validateHelpExpanded">
              <q-separator />
              <div class="q-py-sm text-subitle2">
                This validation tool validates the schema structure and verifies
                the objectual integrity of the OCA Bundle.
              </div>
            </div>
          </q-slide-transition>
        </div>

        <q-separator />
      </div>

      <div class="row">
        <div class="col-12">
          <q-spinner v-if="loading" color="primary" size="5em" />

          <q-card
            v-if="!!Object.keys(resultsRef).length && !loading"
            class="q-pa-md">
            <div v-for="(value, name, i) in resultsRef" :key="i">
              <q-separator v-if="i != 0" />

              <q-card-section>
                <strong>
                  {{ name }}
                  <div
                    style="display: inline"
                    :style="{
                      color: value.errors.length > 0 ? '#FC100D' : '#00CC99'
                    }">
                    {{ value.errors.length > 0 ? 'failed' : 'passed' }}
                  </div>
                  integrity tests
                </strong>
              </q-card-section>

              <div v-if="value.valid">
                <q-tabs
                  v-model="value.tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator>
                  <q-tab label="Overlays" name="overlays" />
                  <q-tab label="OCA JSON" name="oca" />
                </q-tabs>

                <q-tab-panels v-model="value.tab">
                  <q-tab-panel name="overlays">
                    <ul>
                      <li
                        v-for="(overlay, ov_i) in value.oca.overlays"
                        :key="ov_i">
                        {{ overlay.type.split('/')[2] }}
                        {{ overlay.language ? `(${overlay.language})` : '' }}
                      </li>
                    </ul>
                  </q-tab-panel>

                  <q-tab-panel name="oca">
                    <json-viewer
                      :value="value.oca"
                      :expand-depth="3"></json-viewer>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
              <div v-else>
                <ul>
                  <li v-for="(error, err_i) in value.errors" :key="err_i">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Validator, OCA } from 'oca.js'
import { resolveFromZip } from 'oca.js-form-core'

import JsonViewer from 'vue-json-viewer'

export default defineComponent({
  name: 'Validate',
  components: { JsonViewer },
  setup() {
    const files = ref([])
    const loading = ref(false)
    const resultsRef = ref({})
    const validateHelpExpanded = ref(true)

    const validate = async () => {
      loading.value = true
      const results: {
        [key: string]: {
          oca: OCA | Record<string, never>
          tab?: string
          valid: boolean
          errors: string[]
        }
      } = {}
      for (const file of files.value) {
        const validator = new Validator()
        try {
          const oca: OCA = await resolveFromZip(file)
          const validationResult: {
            success: boolean
            errors: string[]
          } = validator.validate(oca) as { success: boolean; errors: string[] }
          if (validationResult.success) {
            results[(file as File).name] = {
              oca,
              tab: 'overlays',
              valid: true,
              errors: []
            }
          } else {
            results[(file as File).name] = {
              oca,
              tab: 'overlays',
              valid: false,
              errors: validationResult.errors.map(e => e.split('at line')[0])
            }
          }
        } catch (e) {
          results[(file as File).name] = {
            oca: {},
            valid: false,
            errors: [e as string]
          }
        }
      }

      resultsRef.value = results
      loading.value = false
      files.value = []
    }

    return {
      validate,
      resultsRef,
      loading,
      validateHelpExpanded,
      files
    }
  }
})
</script>

<style lang="scss"></style>
