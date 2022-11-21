<template>
  <q-page class="q-pa-md">
    <div class="items-center justify-evenly">
      <div class="row">
        <div class="col-2" />
        <div class="col-4">
          <q-file
            v-model="files"
            label="Pick OCA Bundle zip files"
            accept=".zip"
            filled
            multiple />
        </div>
        <div class="col-2" />
        <div class="col-2">
          <q-btn
            size="lg"
            label="Validate"
            :disable="files.length == 0"
            @click="validate" />
        </div>
        <div class="col-2" />
      </div>

      <br />

      <div class="row">
        <div class="col-12">
          <q-spinner v-if="loading" color="primary" size="5em" />

          <q-card v-if="resultHTML" class="q-pa-md">
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="resultHTML"></span>
            <!-- eslint-enable vue/no-v-html -->
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Validator } from 'oca.js'
import { resolveFromZip } from 'oca.js-form-core'

export default defineComponent({
  name: 'Validate',
  setup() {
    const resultHTML = ref('')
    const files = ref([])
    const loading = ref(false)

    const validate = async () => {
      resultHTML.value = ''
      loading.value = true
      const result: { [key: string]: string[] } = {}
      for (const file of files.value) {
        const validator = new Validator()
        try {
          const oca = await resolveFromZip(file)
          const validationResult: {
            success: boolean
            errors: string[]
          } = validator.validate(oca) as { success: boolean; errors: string[] }
          if (validationResult.success) {
            result[(file as File).name] = []
          } else {
            result[(file as File).name] = validationResult.errors.map(
              e => e.split('at line')[0]
            )
          }
        } catch (e) {
          result[(file as File).name] = [e as string]
        }
      }

      Object.entries(result).forEach(([fileName, errors]) => {
        resultHTML.value += `<br><strong>${fileName}: `
        if (errors.length == 0) {
          resultHTML.value +=
            '<div style="display: inline; color: #00CC99">valid</strong></div>'
        } else {
          resultHTML.value +=
            '<div style="display: inline; color: #FC100D">invalid</strong></div><ul>'
          errors.forEach(e => {
            resultHTML.value += `<li>${e}</li>`
          })
          resultHTML.value += '</ul>'
        }
      })
      loading.value = false
      files.value = []
    }

    return {
      validate,
      resultHTML,
      loading,
      files
    }
  }
})
</script>

<style lang="scss"></style>
