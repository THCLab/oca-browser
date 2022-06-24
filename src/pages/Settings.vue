<template>
  <q-page class="q-pa-md">
    <q-card class="settings-card">
      <q-card-section>
        <div class="text-h5">Settings</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-select
          v-model="defaultLanguage"
          :options="languages"
          label="Default Language"
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          emit-value
          map-options
          options-dense
          dense
          @filter="filterFn" />

        <q-card-section>
          <div class="row items-center">
            <div class="text-subtitle1">OCA Repositories</div>
            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="ocaRepoHelpExpanded ? 'help_outline' : 'help'"
              @click="ocaRepoHelpExpanded = !ocaRepoHelpExpanded" />
          </div>

          <q-slide-transition>
            <div v-show="ocaRepoHelpExpanded">
              <q-separator />
              <q-card-section class="text-subitle2">
                OCA Repository is a component for storing and sharing OCA
                objects freely. True object interoperability suggests that an
                object's storage location needs not to be the primary focus but
                instead the file content. OCA follows a content centric
                networking (CCN) approach with a Self-Addressing Identifiers
                (SAID) referencing each object.
                <br /><br />Learn more
                <a
                  target="_blank"
                  href="https://oca.colossi.network/guide/oca-ecosystem.html#oca-repository"
                  >here</a
                >
                or
                <a
                  target="_blank"
                  href="https://oca.colossi.network/tools/oca-repository.html"
                  >here</a
                >.
              </q-card-section>
            </div>
          </q-slide-transition>

          <q-separator />

          <div
            v-for="(_, i) in ocaRepositoryUrls"
            :key="i"
            class="row items-center">
            <q-icon
              name="remove_circle_outline"
              class="col-1 cursor-pointer"
              size="sm"
              left
              @click="removeOcaRepositoryUrl(i)" />
            <q-input
              v-model="ocaRepositoryUrls[i].value"
              class="col"
              label="OCA Repository URL"
              dense />
          </div>
          <div class="row items-center" style="height: 40px">
            <q-icon
              name="add_circle_outline"
              class="col-1 cursor-pointer"
              size="sm"
              left
              @click="addOcaRepositoryUrl" />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row items-center">
            <div class="text-subtitle1">Data Vaults</div>
            <q-btn
              color="grey"
              round
              flat
              dense
              :icon="dataVaultHelpExpanded ? 'help_outline' : 'help'"
              @click="dataVaultHelpExpanded = !dataVaultHelpExpanded" />
          </div>

          <q-slide-transition>
            <div v-show="dataVaultHelpExpanded">
              <q-separator />
              <q-card-section class="text-subitle2">
                OCA Data Vault is a simple PoC data storage implementation
                showcasing how to consume and provide data described by OCA.

                <br /><br />Learn more
                <a
                  target="_blank"
                  href="https://oca.colossi.network/guide/oca-ecosystem.html#oca-data-vault"
                  >here</a
                >.
              </q-card-section>
            </div>
          </q-slide-transition>

          <q-separator />

          <div
            v-for="(_, i) in dataVaultUrls"
            :key="i"
            class="row items-center">
            <q-icon
              name="remove_circle_outline"
              class="col-1 cursor-pointer"
              size="sm"
              left
              @click="removeDataVaultUrl(i)" />
            <q-input
              v-model="dataVaultUrls[i].value"
              class="col"
              label="Data Vault URL"
              dense />
          </div>
          <div class="row items-center" style="height: 40px">
            <q-icon
              name="add_circle_outline"
              class="col-1 cursor-pointer"
              size="sm"
              left
              @click="addDataVaultUrl" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, Ref } from 'vue'
import { useStore } from 'src/store'
import { languages as l } from '@/languages'

export default defineComponent({
  name: 'Settings',
  setup() {
    const $store = useStore()
    const languages = ref(l)
    const ocaRepoHelpExpanded = ref(true)
    const dataVaultHelpExpanded = ref(true)

    const ocaRepositoryUrls = ref(
      $store.state.settings.ocaRepositoryUrls.map(el => ref(el))
    )
    const addOcaRepositoryUrl = () => {
      ocaRepositoryUrls.value.push(ref(''))
    }
    const removeOcaRepositoryUrl = (i: number) => {
      ocaRepositoryUrls.value.splice(i, 1)
    }
    watch(ocaRepositoryUrls.value, async (value: Ref<string>[]) => {
      await $store.dispatch(
        'settings/updateOcaRepositoryUrl',
        value.map(el => el.value)
      )
    })

    const dataVaultUrls = ref(
      $store.state.settings.dataVaultUrls.map(el => ref(el))
    )
    const addDataVaultUrl = () => {
      dataVaultUrls.value.push(ref(''))
    }
    const removeDataVaultUrl = (i: number) => {
      dataVaultUrls.value.splice(i, 1)
    }
    watch(dataVaultUrls.value, async (value: Ref<string>[]) => {
      await $store.dispatch(
        'settings/updateDataVaultUrl',
        value.map(el => el.value)
      )
    })

    const defaultLanguage = computed({
      get: () => $store.state.settings.language,
      set: async val => {
        await $store.dispatch('settings/updateLanguage', val)
      }
    })

    const filterFn = (val: string, update: (callback: () => void) => void) => {
      update(() => {
        const needle = val.toLowerCase()
        languages.value = l.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      defaultLanguage,
      languages,
      filterFn,
      ocaRepoHelpExpanded,
      dataVaultHelpExpanded,
      ocaRepositoryUrls,
      addOcaRepositoryUrl,
      removeOcaRepositoryUrl,
      dataVaultUrls,
      addDataVaultUrl,
      removeDataVaultUrl
    }
  }
})
</script>

<style>
.settings-card {
  min-width: 20vw;
  max-width: 40vw;
}
</style>
