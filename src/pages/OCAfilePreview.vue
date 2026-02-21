<template>
  <q-page class="q-pa-md preview-page">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="preview-card" flat>
          <q-card-section>
            <div class="text-h6">OCAfile Input</div>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2 q-mb-xs">Overlay Definition Source</div>
            <q-option-group
              v-model="overlaySource"
              :options="overlaySourceOptions"
              inline
              dense />
            <q-file
              v-if="overlaySource === 'upload'"
              v-model="overlayFile"
              filled
              dense
              label="Overlay definition file"
              accept=".overlayfile,.json,.yaml,.yml,.txt"
              @update:model-value="onOverlayFileChange">
              <template #prepend>
                <q-icon name="upload_file" />
              </template>
            </q-file>
            <q-banner
              v-else
              dense
              rounded
              class="bg-cyan-1 text-cyan-10 q-mt-sm">
              Core overlay is loaded from local repository:
              <strong>semantic.overlayfile</strong>
            </q-banner>
            <div class="text-caption text-grey-7 q-mt-xs">
              Choose your own overlay file or use the remote core overlay.
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2 q-mb-xs">OCAfile Source</div>
            <q-option-group
              v-model="ocafileSource"
              :options="ocafileSourceOptions"
              inline
              dense />
            <q-select
              v-if="ocafileSource === 'example'"
              v-model="selectedOcafileExample"
              filled
              dense
              emit-value
              map-options
              option-value="file"
              option-label="label"
              :options="ocafileExamples"
              :loading="ocafileExamplesLoading"
              label="Choose OCAfile example"
              @update:model-value="onOcafileExampleChange" />
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-input
              v-model="ocafileInput"
              type="textarea"
              filled
              dense
              placeholder="Paste your OCAfile here..."
              :rows="16"
              style="font-family: monospace; font-size: 12px"
              @input="debouncedParse" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              color="secondary"
              label="Publish"
              :loading="publishLoading"
              :disable="!ocafileInput || publishLoading"
              @click="publishOcafile" />
            <q-btn
              color="primary"
              label="Parse & Build"
              :loading="loading"
              :disable="!ocafileInput || !overlayDefinition || overlayLoading"
              @click="parseAndBuild" />
          </q-card-actions>
          <q-card-section v-if="publishMessage" class="q-pt-none">
            <q-banner
              dense
              rounded
              :class="
                publishStatus === 'success'
                  ? 'bg-green-1 text-green-9'
                  : 'bg-red-1 text-red-9'
              ">
              {{ publishMessage }}
            </q-banner>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md preview-output-grid">
      <div class="col-12 col-lg-7">
        <q-card class="preview-card" flat>
          <q-card-section>
            <div class="text-h6">OCABundle Output</div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <div v-if="error" class="text-negative q-pa-sm">
              <q-icon name="error" />
              {{ error }}
            </div>
            <div
              v-else-if="!bundleResult"
              class="text-grey-6 text-center q-pa-md">
              <div>Enter an OCAfile and click "Parse & Build"</div>
            </div>
            <div v-else>
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator>
                <q-tab name="overlays" label="Overlays" />
                <q-tab name="json" label="OCA Bundle (JSON)" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" class="output-tab-panels">
                <q-tab-panel name="json">
                  <json-viewer
                    v-if="bundleResult"
                    :value="bundleResult"
                    :expand-depth="4" />
                </q-tab-panel>

                <q-tab-panel name="overlays">
                  <div
                    v-if="overlaysList.length > 0"
                    class="overlay-stack-wrap">
                    <div class="overlay-stack">
                      <div
                        v-for="(overlay, index) in overlaysList"
                        :key="index"
                        class="overlay-layer"
                        role="button"
                        tabindex="0"
                        :class="{
                          'overlay-layer--active':
                            selectedOverlayIndex === index
                        }"
                        :style="getOverlayStyle(overlay, index)"
                        @mouseenter="selectOverlay(index)"
                        @focus="selectOverlay(index)"
                        @keydown.enter="selectOverlay(index)"
                        @keydown.space.prevent="selectOverlay(index)"
                        @click="selectOverlay(index)">
                        <button
                          v-if="overlay.variants.length > 1"
                          class="overlay-layer__swap overlay-layer__swap--left"
                          @click.stop="
                            switchOverlayVariant(overlay.typeKey, -1, $event)
                          ">
                          <q-icon name="chevron_left" />
                        </button>
                        <button
                          v-if="overlay.variants.length > 1"
                          class="overlay-layer__swap overlay-layer__swap--right"
                          @click.stop="
                            switchOverlayVariant(overlay.typeKey, 1, $event)
                          ">
                          <q-icon name="chevron_right" />
                        </button>
                        <transition
                          :name="getOverlaySwapTransitionName(overlay.typeKey)">
                          <div
                            :key="`${overlay.typeKey}-${overlay.activeVariantIndex}`"
                            class="overlay-layer__panel">
                            <div class="overlay-layer__number">
                              {{ index + 1 }}
                            </div>
                            <div class="overlay-layer__content">
                              <div class="overlay-layer__title">
                                {{ getOverlayTitle(overlay, index) }}
                              </div>
                              <div class="overlay-layer__meta">
                                {{
                                  typeof overlay.overlay.language === 'string'
                                    ? overlay.overlay.language
                                    : ''
                                }}
                                <span v-if="overlay.variants.length > 1">
                                  {{ getOverlayVariantCounter(overlay) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </transition>
                      </div>

                      <div
                        v-if="hasCaptureBase"
                        class="capture-base-layer"
                        :class="{
                          'capture-base-layer--active':
                            selectedDetailsKind === 'capture-base'
                        }"
                        role="button"
                        tabindex="0"
                        @click="selectedDetailsKind = 'capture-base'"
                        @focus="selectedDetailsKind = 'capture-base'"
                        @keydown.enter="selectedDetailsKind = 'capture-base'"
                        @keydown.space.prevent="
                          selectedDetailsKind = 'capture-base'
                        ">
                        <div class="capture-base-layer__number">CB</div>
                        <div class="capture-base-layer__content">
                          <div class="capture-base-layer__title">
                            Capture Base
                          </div>
                          <div class="capture-base-layer__meta">
                            Base attributes and classification
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-grey-6 q-pa-md">
                    No overlays in bundle
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card flat bordered class="overlay-details">
          <q-card-section class="row items-center justify-between">
            <div class="text-subtitle2">{{ selectedDetailsTitle }}</div>
            <div
              v-if="
                selectedDetailsKind === 'overlay' &&
                selectedOverlayCard &&
                selectedOverlayCard.variants.length > 1
              "
              class="row items-center q-gutter-xs">
              <q-btn
                dense
                round
                flat
                icon="chevron_left"
                @click="
                  switchOverlayVariant(selectedOverlayCard.typeKey, -1)
                " />
              <div class="text-caption text-grey-8">
                {{ selectedOverlayCard.activeVariantIndex + 1 }} /
                {{ selectedOverlayCard.variants.length }}
              </div>
              <q-btn
                dense
                round
                flat
                icon="chevron_right"
                @click="switchOverlayVariant(selectedOverlayCard.typeKey, 1)" />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <transition name="overlay-detail-fade" mode="out-in">
              <json-viewer
                v-if="selectedDetailsValue"
                :key="selectedDetailsKey"
                :value="selectedDetailsValue"
                :expand-depth="4" />
              <div v-else key="no-overlay" class="text-grey-6">
                Select an overlay card or capture base to inspect details.
              </div>
            </transition>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import JsonViewer from 'vue-json-viewer'

const CORE_OVERLAY_URL = '/overlayfiles/semantic.overlayfile'
const OCA_REPOSITORY_PUBLISH_URL =
  'https://repository.oca.argo.colossi.network/api/v2/oca-bundles'

interface OcafileExampleEntry {
  file: string
  label: string
}

interface OcaJsResult {
  v: string
  d: string
  capture_base: {
    type: string
    d: string
    classification: string
    attributes: Record<string, string>
    flagged_attributes: string[]
  }
  overlays?:
    | Array<Record<string, unknown>>
    | Record<string, Record<string, unknown>>
}

type OverlayEntry = Record<string, unknown>

interface OverlayCard {
  typeKey: string
  typeName: string
  version: string
  variants: OverlayEntry[]
  activeVariantIndex: number
  overlay: OverlayEntry
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

interface OcaJsModule {
  default: (input?: unknown) => Promise<unknown>
  parseOCAfile: (ocafileStr: string, overlayFileStr?: string | null) => unknown
  buildFromOCAfile: (ocafileStr: string, overlaysDir?: string | null) => unknown
  validateBundleSemantics: (bundle: unknown) => unknown
}

interface OcaJsApi {
  parseOCAfile: OcaJsModule['parseOCAfile']
  buildFromOCAfile: OcaJsModule['buildFromOCAfile']
  validateBundleSemantics: OcaJsModule['validateBundleSemantics']
}

type WindowWithOcaJs = Window & {
  __ocaJsModule?: OcaJsModule
}

let ocaJsApi: OcaJsApi | null = null
let ocaJsScriptPromise: Promise<OcaJsModule> | null = null

function normalizeErrorValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }

  if (value instanceof Error) {
    return value.message
  }

  if (Array.isArray(value)) {
    const messages = value
      .map(item => normalizeErrorValue(item))
      .filter((item): item is string => item !== null)
    return messages.length > 0 ? messages.join('; ') : null
  }

  if (typeof value === 'object') {
    const objectValue = value as {
      message?: unknown
      reason?: unknown
      details?: unknown
      error?: unknown
      Err?: unknown
    }

    return (
      normalizeErrorValue(objectValue.message) ??
      normalizeErrorValue(objectValue.reason) ??
      normalizeErrorValue(objectValue.details) ??
      normalizeErrorValue(objectValue.error) ??
      normalizeErrorValue(objectValue.Err) ??
      JSON.stringify(value)
    )
  }

  return String(value)
}

function getResultError(result: unknown, operation: string): string | null {
  if (typeof result !== 'object' || result === null) {
    return null
  }

  const resultObject = result as {
    error?: unknown
    Err?: unknown
    errors?: unknown
  }

  const message =
    normalizeErrorValue(resultObject.error) ??
    normalizeErrorValue(resultObject.Err) ??
    normalizeErrorValue(resultObject.errors)

  return message === null ? null : `${operation}: ${message}`
}

function isValidationResult(result: unknown): result is ValidationResult {
  if (typeof result !== 'object' || result === null) {
    return false
  }

  const value = result as { valid?: unknown; errors?: unknown }
  return typeof value.valid === 'boolean' && Array.isArray(value.errors)
}

function normalizeBundleResult(result: unknown): unknown {
  if (typeof result !== 'string') {
    return result
  }

  const trimmed = result.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return result
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return result
  }
}

function parseOverlayType(overlay: OverlayEntry): {
  typeKey: string
  typeName: string
  version: string
} {
  const fallback = {
    typeKey: 'overlay/unknown',
    typeName: 'unknown',
    version: ''
  }

  const typeValue = overlay.type
  if (typeof typeValue !== 'string') {
    return fallback
  }

  const parts = typeValue.split('/').filter(Boolean)
  if (parts.length < 2) {
    return {
      typeKey: typeValue,
      typeName: typeValue,
      version: ''
    }
  }

  return {
    typeKey: parts.slice(0, 2).join('/'),
    typeName: parts[1],
    version: parts.slice(2).join('/')
  }
}

function shadeHexColor(hex: string, delta: number): string {
  const source = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(source)) {
    return hex
  }

  const clamp = (value: number) => Math.max(0, Math.min(255, value))
  const r = clamp(parseInt(source.slice(0, 2), 16) + delta)
  const g = clamp(parseInt(source.slice(2, 4), 16) + delta)
  const b = clamp(parseInt(source.slice(4, 6), 16) + delta)

  return `#${[r, g, b]
    .map(channel => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

async function loadOcaJsApi(): Promise<OcaJsApi> {
  if (ocaJsApi !== null) {
    return ocaJsApi
  }

  const module = await loadOcaJsModuleFromPublic()

  await module.default()

  ocaJsApi = {
    parseOCAfile: module.parseOCAfile,
    buildFromOCAfile: module.buildFromOCAfile,
    validateBundleSemantics: module.validateBundleSemantics
  }

  return ocaJsApi
}

function loadOcaJsModuleFromPublic(): Promise<OcaJsModule> {
  const ocaWindow = window as WindowWithOcaJs
  if (ocaWindow.__ocaJsModule !== undefined) {
    return Promise.resolve(ocaWindow.__ocaJsModule)
  }

  if (ocaJsScriptPromise !== null) {
    return ocaJsScriptPromise
  }

  ocaJsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = '/oca-js/loader.js'

    script.onload = () => {
      if (ocaWindow.__ocaJsModule === undefined) {
        reject(new Error('Loaded /oca-js/loader.js but OCA module is missing'))
        return
      }

      resolve(ocaWindow.__ocaJsModule)
    }

    script.onerror = () => {
      reject(new Error('Failed to load /oca-js/loader.js'))
    }

    document.head.appendChild(script)
  })

  return ocaJsScriptPromise
}

export default defineComponent({
  name: 'OCAfilePreview',
  components: { JsonViewer },
  setup() {
    const overlaySource = ref<'upload' | 'core'>('upload')
    const overlaySourceOptions = [
      { label: 'Upload file', value: 'upload' },
      { label: 'Use core overlay', value: 'core' }
    ]

    const overlayFile = ref<File | null>(null)
    const overlayDefinition = ref('')
    const overlayLoading = ref(false)

    const ocafileSource = ref<'paste' | 'example'>('paste')
    const ocafileSourceOptions = [
      { label: 'Paste manually', value: 'paste' },
      { label: 'Choose example', value: 'example' }
    ]
    const ocafileExamples = ref<OcafileExampleEntry[]>([])
    const selectedOcafileExample = ref('')
    const ocafileExamplesLoading = ref(false)
    const publishLoading = ref(false)
    const publishStatus = ref<'success' | 'error' | null>(null)
    const publishMessage = ref('')

    const ocafileInput = ref('')
    const loading = ref(false)
    const error = ref('')
    const bundleResult = ref<OcaJsResult | null>(null)
    const tab = ref('overlays')
    const validationResult = ref<ValidationResult | null>(null)
    const validationLoading = ref(false)
    const selectedOverlayIndex = ref(0)
    const selectedDetailsKind = ref<'overlay' | 'capture-base'>('overlay')
    const activeVariantByType = ref<Record<string, number>>({})
    const overlaySwapDirectionByType = ref<Record<string, -1 | 1>>({})

    const overlayPalette = [
      '#ea580c',
      '#0f766e',
      '#1d4ed8',
      '#be123c',
      '#6d28d9',
      '#047857'
    ]

    const allOverlays = computed<OverlayEntry[]>(() => {
      if (bundleResult.value?.overlays === undefined) {
        return []
      }

      if (Array.isArray(bundleResult.value.overlays)) {
        return bundleResult.value.overlays
      }

      return Object.values(bundleResult.value.overlays)
    })

    const overlaysList = computed<OverlayCard[]>(() => {
      const groups = new Map<string, OverlayEntry[]>()

      allOverlays.value.forEach(overlay => {
        const { typeKey } = parseOverlayType(overlay)
        if (!groups.has(typeKey)) {
          groups.set(typeKey, [])
        }
        groups.get(typeKey)?.push(overlay)
      })

      return Array.from(groups.entries()).map(([typeKey, variants]) => {
        const variantIndex =
          activeVariantByType.value[typeKey] === undefined
            ? 0
            : activeVariantByType.value[typeKey] % variants.length

        const overlay = variants[variantIndex]
        const { typeName, version } = parseOverlayType(overlay)

        return {
          typeKey,
          typeName,
          version,
          variants,
          activeVariantIndex: variantIndex,
          overlay
        }
      })
    })

    const selectedOverlayCard = computed<OverlayCard | null>(() => {
      if (overlaysList.value.length === 0) {
        return null
      }

      return overlaysList.value[selectedOverlayIndex.value] ?? null
    })

    const selectedOverlay = computed<OverlayEntry | null>(() => {
      return selectedOverlayCard.value?.overlay ?? null
    })

    const hasCaptureBase = computed(() => {
      return bundleResult.value?.capture_base !== undefined
    })

    const selectedDetailsTitle = computed(() => {
      if (selectedDetailsKind.value === 'capture-base') {
        return 'Capture Base details'
      }

      return 'Overlay details'
    })

    const selectedDetailsValue = computed<unknown | null>(() => {
      if (selectedDetailsKind.value === 'capture-base') {
        return bundleResult.value?.capture_base ?? null
      }

      return selectedOverlay.value
    })

    const selectedDetailsKey = computed(() => {
      if (selectedDetailsKind.value === 'capture-base') {
        return 'capture-base'
      }

      if (selectedOverlayCard.value === null) {
        return 'none'
      }

      return `${selectedOverlayCard.value.typeKey}-${selectedOverlayCard.value.activeVariantIndex}`
    })

    const selectOverlay = (index: number): void => {
      selectedOverlayIndex.value = index
      selectedDetailsKind.value = 'overlay'
    }

    let debounceTimer: number | null = null

    const debouncedParse = () => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = window.setTimeout(() => {
        if (
          overlayDefinition.value.trim() !== '' &&
          ocafileInput.value.trim() !== ''
        ) {
          void parseAndBuild()
        }
      }, 1000)
    }

    const onOverlayFileChange = async (file: File | null) => {
      overlayDefinition.value = ''
      if (file === null) {
        return
      }

      try {
        overlayDefinition.value = await file.text()
      } catch (err: unknown) {
        overlayFile.value = null
        error.value =
          err instanceof Error
            ? err.message
            : 'Failed to read overlay definition file'
      }
    }

    const loadCoreOverlayDefinition = async () => {
      overlayLoading.value = true
      try {
        const response = await fetch(CORE_OVERLAY_URL)
        if (!response.ok) {
          throw new Error('Failed to download core overlay definition')
        }

        overlayDefinition.value = await response.text()
        overlayFile.value = null
      } finally {
        overlayLoading.value = false
      }
    }

    const loadOcafileExamples = async () => {
      if (ocafileExamples.value.length > 0) {
        return
      }

      ocafileExamplesLoading.value = true
      try {
        const response = await fetch('/ocafiles/index.json')
        if (!response.ok) {
          throw new Error('Failed to load OCAfile examples list')
        }

        const payload = (await response.json()) as
          | OcafileExampleEntry[]
          | string[]
        ocafileExamples.value = payload.map(item => {
          if (typeof item === 'string') {
            return { file: item, label: item }
          }

          return {
            file: item.file,
            label: item.label
          }
        })

        if (
          selectedOcafileExample.value === '' &&
          ocafileExamples.value.length > 0
        ) {
          selectedOcafileExample.value = ocafileExamples.value[0].file
        }
      } finally {
        ocafileExamplesLoading.value = false
      }
    }

    const onOcafileExampleChange = async (fileName: string) => {
      if (fileName.trim() === '') {
        return
      }

      try {
        const response = await fetch(`/ocafiles/${fileName}`)
        if (!response.ok) {
          throw new Error(`Failed to load example OCAfile: ${fileName}`)
        }

        ocafileInput.value = await response.text()
      } catch (err: unknown) {
        error.value =
          normalizeErrorValue(err) ??
          `Failed to load example OCAfile: ${fileName}`
      }
    }

    const parseAndBuild = async () => {
      if (overlayLoading.value) {
        error.value = 'Overlay definition is still loading'
        return
      }

      if (ocafileInput.value.trim() === '') {
        bundleResult.value = null
        validationResult.value = null
        return
      }

      if (overlayDefinition.value.trim() === '') {
        error.value = 'Overlay definition file is required'
        bundleResult.value = null
        validationResult.value = null
        return
      }

      loading.value = true
      error.value = ''

      try {
        const api = await loadOcaJsApi()
        const ocafile = ocafileInput.value.trim()

        const parseResult = api.parseOCAfile(ocafile, overlayDefinition.value)
        const parseError = getResultError(
          parseResult,
          'Failed to parse OCAfile'
        )
        if (parseError !== null) {
          throw new Error(parseError)
        }

        const buildResult = api.buildFromOCAfile(
          ocafile,
          overlayDefinition.value
        )
        const buildError = getResultError(
          buildResult,
          'Failed to build OCABundle'
        )
        if (buildError !== null) {
          throw new Error(buildError)
        }

        const normalizedBuildResult = normalizeBundleResult(buildResult)
        bundleResult.value = normalizedBuildResult as OcaJsResult
        selectedOverlayIndex.value = 0
        selectedDetailsKind.value =
          allOverlays.value.length > 0 ? 'overlay' : 'capture-base'
        activeVariantByType.value = {}
        overlaySwapDirectionByType.value = {}

        validationLoading.value = true
        const validation = api.validateBundleSemantics(normalizedBuildResult)
        validationResult.value = isValidationResult(validation)
          ? validation
          : {
              valid: false,
              errors: ['Validation returned an unexpected response']
            }
      } catch (err: unknown) {
        error.value =
          normalizeErrorValue(err) ?? 'Failed to parse/build OCAfile'
        bundleResult.value = null
        validationResult.value = null
        console.error(err)
      } finally {
        validationLoading.value = false
        loading.value = false
      }
    }

    const publishOcafile = async () => {
      const ocafile = ocafileInput.value.trim()
      if (ocafile === '') {
        publishStatus.value = 'error'
        publishMessage.value = 'OCAfile is empty, nothing to publish'
        return
      }

      publishLoading.value = true
      publishStatus.value = null
      publishMessage.value = ''

      try {
        const response = await fetch(OCA_REPOSITORY_PUBLISH_URL, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'text/plain'
          },
          body: ocafile
        })

        const responseText = await response.text()
        let payload: unknown = responseText

        try {
          payload = JSON.parse(responseText)
        } catch {
          // Keep plain text response
        }

        if (!response.ok) {
          const reason = normalizeErrorValue(payload) ?? response.statusText
          throw new Error(`Publish failed: ${reason}`)
        }

        const getPublishedSaid = (value: unknown): string | null => {
          if (typeof value === 'string') {
            const trimmed = value.trim()
            return trimmed === '' ? null : trimmed
          }

          if (typeof value !== 'object' || value === null) {
            return null
          }

          const record = value as Record<string, unknown>
          const direct =
            record.said ?? record.SAID ?? record.digest ?? record.d ?? record.id

          if (typeof direct === 'string' && direct.trim() !== '') {
            return direct.trim()
          }

          const nested = record.data ?? record.result ?? record.bundle
          return getPublishedSaid(nested)
        }

        const publishedSaid = getPublishedSaid(payload)

        publishStatus.value = 'success'
        if (publishedSaid !== null) {
          publishMessage.value =
            'Your ocafile was uploaded to OCA Repository you can share it using following link: ' +
            `${OCA_REPOSITORY_PUBLISH_URL}/${encodeURIComponent(
              publishedSaid
            )}?w=true`
        } else {
          publishMessage.value =
            'Your ocafile was uploaded to OCA Repository successfully.'
        }
      } catch (err: unknown) {
        publishStatus.value = 'error'
        publishMessage.value = normalizeErrorValue(err) ?? 'Publish failed'
      } finally {
        publishLoading.value = false
      }
    }

    const getOverlayTitle = (card: OverlayCard, index: number): string => {
      const baseName = card.typeName || `Overlay ${index + 1}`
      return card.version !== '' ? `${baseName} (${card.version})` : baseName
    }

    const getOverlayVariantCounter = (card: OverlayCard): string => {
      return `• ${card.activeVariantIndex + 1}/${card.variants.length}`
    }

    const switchOverlayVariant = (
      typeKey: string,
      direction: -1 | 1,
      event?: Event
    ): void => {
      const card = overlaysList.value.find(item => item.typeKey === typeKey)
      if (card === undefined) {
        return
      }

      if (card.variants.length <= 1) {
        return
      }

      const nextIndex =
        (card.activeVariantIndex + direction + card.variants.length) %
        card.variants.length

      activeVariantByType.value = {
        ...activeVariantByType.value,
        [card.typeKey]: nextIndex
      }

      overlaySwapDirectionByType.value = {
        ...overlaySwapDirectionByType.value,
        [card.typeKey]: direction
      }

      const target = event?.currentTarget as HTMLElement | undefined
      if (target !== undefined) {
        target.blur()
      }
    }

    const getOverlaySwapTransitionName = (typeKey: string): string => {
      return overlaySwapDirectionByType.value[typeKey] === -1
        ? 'overlay-layer-swap-prev'
        : 'overlay-layer-swap-next'
    }

    const getOverlayStyle = (
      card: OverlayCard,
      index: number
    ): Record<string, string | number> => {
      const tilt = index % 2 === 0 ? 60 : 60
      const variantRatio =
        card.variants.length <= 1
          ? 0
          : card.activeVariantIndex / (card.variants.length - 1)
      const shadeDelta = Math.round(-20 + variantRatio * 40)
      const color = shadeHexColor(
        overlayPalette[index % overlayPalette.length],
        shadeDelta
      )

      return {
        '--overlay-color': color,
        '--overlay-tilt': `${tilt}deg`,
        zIndex: overlaysList.value.length - index
      }
    }

    watch(
      overlaySource,
      async source => {
        if (source === 'core') {
          try {
            await loadCoreOverlayDefinition()
          } catch (err: unknown) {
            error.value =
              normalizeErrorValue(err) ??
              'Failed to load core overlay definition'
          }
          return
        }

        overlayDefinition.value = ''
      },
      { immediate: true }
    )

    watch(
      ocafileSource,
      async source => {
        if (source === 'example') {
          try {
            await loadOcafileExamples()
            if (selectedOcafileExample.value !== '') {
              await onOcafileExampleChange(selectedOcafileExample.value)
            }
          } catch (err: unknown) {
            error.value =
              normalizeErrorValue(err) ?? 'Failed to load OCAfile examples'
          }
          return
        }

        ocafileInput.value = ''
      },
      { immediate: true }
    )

    watch(overlaysList, newOverlays => {
      if (newOverlays.length === 0) {
        selectedOverlayIndex.value = 0
        if (hasCaptureBase.value) {
          selectedDetailsKind.value = 'capture-base'
        }
        return
      }

      if (selectedOverlayIndex.value >= newOverlays.length) {
        selectedOverlayIndex.value = 0
      }

      if (selectedDetailsKind.value !== 'capture-base') {
        selectedDetailsKind.value = 'overlay'
      }
    })

    return {
      overlaySource,
      overlaySourceOptions,
      overlayFile,
      overlayDefinition,
      overlayLoading,
      ocafileSource,
      ocafileSourceOptions,
      ocafileExamples,
      selectedOcafileExample,
      ocafileExamplesLoading,
      publishLoading,
      publishStatus,
      publishMessage,
      ocafileInput,
      loading,
      error,
      bundleResult,
      tab,
      validationResult,
      validationLoading,
      overlaysList,
      hasCaptureBase,
      selectedOverlayCard,
      selectedDetailsKind,
      selectedDetailsTitle,
      selectedDetailsValue,
      selectedDetailsKey,
      selectedOverlayIndex,
      selectOverlay,
      getOverlayTitle,
      getOverlayVariantCounter,
      getOverlaySwapTransitionName,
      getOverlayStyle,
      switchOverlayVariant,
      publishOcafile,
      onOcafileExampleChange,
      onOverlayFileChange,
      debouncedParse,
      parseAndBuild
    }
  }
})
</script>

<style lang="scss">
.preview-page {
  min-height: 100%;
}

.preview-output-grid {
  align-items: stretch;
}

.preview-card {
  width: 100%;
}

.output-tab-panels {
  height: 70vh;
  min-height: 560px;
}

.output-tab-panels .q-tab-panel {
  height: 100%;
  overflow: auto;
}

.overlay-stack-wrap {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: linear-gradient(140deg, #fff7ed 0%, #eff6ff 100%);
  border: 1px dashed #d4d4d8;
  border-radius: 12px;
}

.overlay-stack {
  width: min(430px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.overlay-layer {
  position: relative;
  width: 350px;
  min-height: 175px;
  border: 0;
  border-radius: 10px;
  margin: -50px 0;
  cursor: pointer;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.25);
  perspective: 400px;
  transform: rotateX(var(--overlay-tilt)) rotateZ(20deg);
  overflow: visible;
  transition: all 0.8s ease;
}

.overlay-layer__panel {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 50px 250px;
  justify-items: start;
  width: 100%;
  min-height: 175px;
  border-radius: inherit;
  padding: 14px 16px;
  color: #ffffff;
  text-align: left;
  background: linear-gradient(
      155deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(15, 23, 42, 0.28) 100%
    ),
    var(--overlay-color);
}

.overlay-layer__swap {
  position: absolute;
  top: 50%;
  z-index: 4;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.22);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.overlay-layer__swap--left {
  left: -14px;
}

.overlay-layer__swap--right {
  right: -14px;
}

.overlay-layer:hover .overlay-layer__swap,
.overlay-layer:focus-within .overlay-layer__swap {
  opacity: 1;
}

.overlay-layer__swap:hover {
  transform: translateY(-50%) scale(1.08);
}

.overlay-layer:hover,
.overlay-layer:focus-visible,
.overlay-layer--active {
  margin: 46px 0;
  transform: rotateX(var(--overlay-tilt)) rotateZ(20deg) translateY(-4px);
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.32);
  z-index: 999 !important;
}

.overlay-layer:first-child:hover,
.overlay-layer:first-child:focus-visible,
.overlay-layer:first-child.overlay-layer--active {
  margin: -38px 0;
}

.capture-base-layer {
  width: 382px;
  min-height: 205px;
  margin: -40px 0 16px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 64px 1fr;
  align-items: center;
  padding: 20px 18px;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  transform: rotateX(50deg) rotateZ(16deg);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.capture-base-layer:hover,
.capture-base-layer:focus-visible,
.capture-base-layer--active {
  transform: rotateX(40deg) rotateZ(10deg) translateY(-4px);
  box-shadow: 0 20px 36px rgba(15, 23, 42, 0.22);
}

.capture-base-layer__number {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.capture-base-layer__title {
  font-size: 1.05rem;
  font-weight: 700;
}

.capture-base-layer__meta {
  margin-top: 8px;
  font-size: 0.82rem;
  color: #475569;
}

.overlay-layer__number {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
}

.overlay-layer__content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
}

.overlay-layer__title {
  text-transform: capitalize;
  font-size: 1rem;
  letter-spacing: 0.01em;
  font-weight: 700;
}

.overlay-layer__meta {
  margin-top: 6px;
  opacity: 0.9;
  font-size: 0.78rem;
}

.overlay-details {
  height: 100%;
  border-radius: 12px;
}

.overlay-detail-fade-enter-active,
.overlay-detail-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.overlay-detail-fade-enter-from,
.overlay-detail-fade-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.overlay-layer-swap-next-enter-active,
.overlay-layer-swap-next-leave-active,
.overlay-layer-swap-prev-enter-active,
.overlay-layer-swap-prev-leave-active {
  transition: opacity 0.34s ease, transform 0.34s ease;
}

.overlay-layer-swap-next-leave-active,
.overlay-layer-swap-prev-leave-active {
  position: absolute;
  inset: 0;
}

.overlay-layer-swap-next-enter-from,
.overlay-layer-swap-prev-leave-to {
  opacity: 0;
  transform: translateX(34px);
}

.overlay-layer-swap-next-leave-to,
.overlay-layer-swap-prev-enter-from {
  opacity: 0;
  transform: translateX(-34px);
}

@media (max-width: 1023px) {
  .output-tab-panels {
    height: 62vh;
    min-height: 420px;
  }

  .overlay-stack-wrap {
    min-height: 420px;
  }

  .overlay-layer {
    width: min(320px, 92%);
    min-height: 150px;
    margin: -42px 0;
  }

  .capture-base-layer {
    width: min(352px, 96%);
    min-height: 180px;
    margin: -30px 0 12px;
    grid-template-columns: 52px 1fr;
  }

  .overlay-layer__panel {
    grid-template-columns: 42px 1fr;
    min-height: 150px;
  }
}
</style>
