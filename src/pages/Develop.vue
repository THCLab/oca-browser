<template>
  <q-page class="q-pa-md">
    <q-card class="converter-card">
      <q-card-section>
        <div class="row">
          <div class="text-h5">XLS to OCA Converter</div>
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="converterHelpExpanded ? 'help_outline' : 'help'"
            @click="converterHelpExpanded = !converterHelpExpanded" />
        </div>
      </q-card-section>

      <q-slide-transition>
        <div v-show="converterHelpExpanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            It converts properly prepared xls(x) file to OCA Bundle.<br />
            As an outcome you would receive a zip file which would include
            capture base object and all overlays within JSON format.
            <ul>
              <li>
                <b>OCA file [required] (XLS/XLSX)</b><br />
                <a
                  href="https://github.com/THCLab/oca-parser-xls/raw/main/templates/template.xlsx">
                  Download template</a
                >.
              </li>
              <li>
                <b>OCA references files (XLS/XLSX)</b><br />
                When any of attributes in OCA file is a
                <a
                  target="_blank"
                  href="https://oca.colossi.network/specification/#attribute-type">
                  Reference or Array[Reference] type</a
                >, you can compose it's OCA files into OCA Bundle.
              </li>
              <li>
                <b>OCA credential layout file (YML/YAML)</b><br />
                <a
                  target="_blank"
                  href="https://github.com/THCLab/oca-html-preview-demo/tree/main/examples/layout/credential.yaml">
                  See example</a
                >.
              </li>
              <li>
                <b>OCA form layout file (YML/YAML)</b><br />
                <a
                  target="_blank"
                  href="https://github.com/THCLab/oca-html-preview-demo/tree/main/examples/layout/form.yaml">
                  See example</a
                >.
              </li>
              <li>
                <b>Data Entry file</b><br />
                Generated XLSX file for capturing data
              </li>
            </ul>
          </q-card-section>
        </div>
      </q-slide-transition>

      <q-separator />

      <q-card-section>
        <q-file
          v-model="rootFile"
          label="Select OCA file"
          accept=".xls,.xlsx"
          filled />
        <q-file
          v-model="referenceFiles"
          label="Select OCA references files"
          accept=".xls,.xlsx"
          multiple />

        <div class="row items-center">
          <div class="col-5">
            <q-checkbox
              v-model="withDefaultCredentialLayout"
              size="lg"
              label="Generate default Credential Layout" />
          </div>
          <div class="col-2">
            <div class="row justify-center">or</div>
          </div>
          <div class="col-5">
            <q-file
              v-model="credentialLayoutFile"
              label="Select Credential Layout file"
              accept=".yml,.yaml"
              dense />
          </div>
        </div>

        <div class="row items-center">
          <div class="col-5">
            <q-checkbox
              v-model="withDefaultFormLayout"
              size="lg"
              label="Generate default Form Layout" />
          </div>
          <div class="col-2">
            <div class="row justify-center">or</div>
          </div>
          <div class="col-5">
            <q-file
              v-model="formLayoutFile"
              label="Select Form Layout file"
              accept=".yml,.yaml"
              dense />
          </div>
        </div>

        <q-checkbox
          v-model="withDataEntry"
          size="lg"
          label="Generate Data Entry File" />

        <br />

        <q-btn color="primary" :disable="!rootFile" @click="convert">
          Convert
        </q-btn>
        <br />
        <!-- eslint-disable vue/no-v-html -->
        <span v-html="convertionResult" />
        <!-- eslint-enable vue/no-v-html -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch, getCurrentInstance } from 'vue'
import { AxiosInstance } from 'axios'

export default defineComponent({
  name: 'Develop',
  setup() {
    const currentInstance = getCurrentInstance()
    if (!currentInstance) {
      return
    }
    const $axios = currentInstance.appContext.config.globalProperties
      .$axios as AxiosInstance
    const converterHelpExpanded = ref(true)
    const rootFile = ref()
    const referenceFiles = ref([])
    const withDefaultCredentialLayout = ref(false)
    const credentialLayoutFile = ref()
    const withDefaultFormLayout = ref(false)
    const formLayoutFile = ref()
    const withDataEntry = ref(false)
    const convertionResult = ref('')

    const ocaConverterUrl = 'https://tool.oca.argo.colossi.network'

    watch(withDefaultCredentialLayout, value => {
      if (value) {
        credentialLayoutFile.value = null
      }
    })
    watch(credentialLayoutFile, newFile => {
      if (newFile) {
        withDefaultCredentialLayout.value = false
      }
    })
    watch(withDefaultFormLayout, value => {
      if (value) {
        formLayoutFile.value = null
      }
    })
    watch(formLayoutFile, newFile => {
      if (newFile) {
        withDefaultFormLayout.value = false
      }
    })

    /* eslint-disable */
    const convert = async () => {
      const formData = new FormData()
      formData.append('file', rootFile.value)
      referenceFiles.value.forEach((file: File) =>
        formData.append('referencesFiles[]', file)
      )

      if (credentialLayoutFile.value) {
        formData.append('credentialLayoutFile', credentialLayoutFile.value)
      }
      if (formLayoutFile.value) {
        formData.append('formLayoutFile', formLayoutFile.value)
      }

      formData.append('withDefaultCredentialLayout', ""+withDefaultCredentialLayout.value)
      formData.append('withDefaultFormLayout', ""+withDefaultFormLayout.value)
      formData.append('withDataEntry', ""+withDataEntry.value)

      const response = await $axios.post(ocaConverterUrl, formData)
      const responseResult = response.data
      if (responseResult.success) {
        convertionResult.value = `Success!<ul><li><a href="${ocaConverterUrl}/${responseResult.filename}">Click here to download OCA Bundle</a></li>`
        if (withDataEntry.value) {
          convertionResult.value += `<li><a href="${ocaConverterUrl}/${responseResult.data_entry}">Click here to download OCA Data Entry file</a></li>`
        }
        convertionResult.value += `</ul>`
      } else {
        const errors: string[] = responseResult.errors
        console.error(errors)
        convertionResult.value = 'Failure! Fix those errors and try again: <ul>'
        errors.forEach(e => convertionResult.value += `<li>${e}</li>`)
        convertionResult.value += '</ul>'
      }

      resetForm()
    }
    /* eslint-enable */

    const resetForm = () => {
      rootFile.value = null
      referenceFiles.value = []
      withDefaultCredentialLayout.value = false
      credentialLayoutFile.value = null
      withDefaultFormLayout.value = false
      formLayoutFile.value = null
      withDataEntry.value = false
    }

    return {
      convert,
      converterHelpExpanded,
      convertionResult,
      rootFile,
      referenceFiles,
      withDefaultCredentialLayout,
      credentialLayoutFile,
      withDefaultFormLayout,
      formLayoutFile,
      withDataEntry
    }
  }
})
</script>

<style>
.converter-card {
  min-width: 300px;
  width: min(700px, 100%);
}
</style>
