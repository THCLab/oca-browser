<template>
  <q-page class="experience-page">
    <q-dialog
      v-model="jsonDialog.open"
      transition-show="scale"
      transition-hide="scale">
      <q-card class="json-dialog">
        <q-card-section class="json-dialog__header">
          <div class="text-subtitle1">{{ jsonDialog.title }}</div>
          <q-btn flat round dense icon="close" @click="closeJsonDialog" />
        </q-card-section>
        <q-separator dark />
        <q-card-section class="json-dialog__body">
          <JsonViewer
            theme="json-theme"
            :value="jsonDialog.payload"
            :expand-depth="6" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <transition name="toast">
      <div
        v-if="copyToast"
        class="copy-toast"
        :class="`copy-toast--${copyToast.intent}`">
        <span>{{ copyToast.message }}</span>
        <button
          class="toast-close"
          aria-label="Dismiss notification"
          @click="dismissToast">
          ×
        </button>
      </div>
    </transition>

    <section class="hero glass-panel glass-panel--strong">
      <div class="hero__text">
        <p class="pill-badge">OCA Browser</p>
        <h1>Preview & Validate your OCA bundle in one flow</h1>
        <p>
          Paste an OCAfile, upload a bundle, or continue with an example.
          Visualise the overlay stack, inspect every SAID, and confirm semantic
          integrity before sharing it with the world.
        </p>
        <div class="hero__actions">
          <button class="cta-button" @click="scrollToForm">Start now</button>
          <a
            class="cta-button cta-button--ghost"
            href="https://oca.colossi.network"
            target="_blank"
            rel="noopener">
            Documentation
          </a>
        </div>
      </div>
    </section>

    <section
      v-if="!hasResults"
      ref="formSection"
      class="glass-panel input-panel">
      <div class="panel-title">
        <div>
          <h2>OCAFILE or OCA Bundle input</h2>
          <p class="text-muted">
            Paste OCAFILE or OCA BUNDLE (json) directly, upload a file or simply
            select an example to get started.
          </p>
        </div>
        <div class="tab-switch">
          <button
            :class="{ 'is-active': ocafileInputMethod === 'paste' }"
            @click="ocafileInputMethod = 'paste'">
            Paste OCAFILE or OCA Bundle Json
          </button>
          <button
            :class="{ 'is-active': ocafileInputMethod === 'upload' }"
            @click="ocafileInputMethod = 'upload'">
            Upload file
          </button>
        </div>
      </div>

      <div v-if="ocafileInputMethod === 'paste'" class="example-select">
        <div class="label">Examples</div>
        <q-select
          v-model="selectedOcafileExample"
          :options="ocafileExampleOptions"
          :popup-content-class="'select-popup'"
          outlined
          dense
          emit-value
          map-options
          clearable
          placeholder="Select example OCAFILE"
          dark />
        <small class="example-hint">
          Pick an included example or leave empty to paste your own OCAFILE or
          OCA bundle.
        </small>
      </div>

      <div v-if="repositoryUrl" class="bundle-said-fetch">
        <div class="label">Load from repository</div>
        <div class="bundle-said-fetch__controls">
          <input
            v-model="bundleSaidInput"
            type="text"
            placeholder="Enter bundle SAID" />
          <button
            class="cta-button"
            :disabled="!canFetchBySaid"
            @click="fetchBundleBySaid">
            {{ bundleSaidLoading ? 'Loading…' : 'Load bundle' }}
          </button>
        </div>
        <small class="text-muted">Repository: {{ repositoryUrl }}</small>
      </div>

      <div v-if="ocafileInputMethod === 'paste'" class="input-shell">
        <textarea
          v-model="ocafileInput"
          rows="14"
          placeholder="Paste your OCAfile or bundle JSON here..."></textarea>
      </div>

      <div
        v-else
        class="upload-drop"
        @dragover.prevent
        @drop.prevent="onDropFile">
        <input
          ref="bundleFileInput"
          type="file"
          class="sr-only"
          accept=".ocafile,.bundle,.txt,.json"
          @change="onBundleFileChange" />
        <Upload class="upload-icon" />
        <p>
          {{
            bundleFileName || 'Drag & drop a .ocafile, .bundle, or .json file'
          }}
        </p>
        <button
          class="cta-button cta-button--ghost"
          @click="bundleFileInput?.click()">
          Select file
        </button>
      </div>

      <button
        class="settings-toggle"
        @click="showAdvancedSettings = !showAdvancedSettings">
        <span>{{ showAdvancedSettings ? 'Hide' : 'Additional settings' }}</span>
        <svg
          :class="{ 'is-open': showAdvancedSettings }"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <transition name="advanced">
        <div v-if="showAdvancedSettings" class="panel-grid advanced-panel">
          <div>
            <p class="label">Overlay definition</p>
            <div class="tab-switch tab-switch--compact">
              <button
                :class="{ 'is-active': overlaySource === 'upload' }"
                @click="overlaySource = 'upload'">
                Upload
              </button>
              <button
                :class="{ 'is-active': overlaySource === 'core' }"
                @click="overlaySource = 'core'">
                Use core
              </button>
            </div>
            <div v-if="overlaySource === 'upload'" class="input-shell small">
              <input
                type="file"
                accept=".overlayfile,.json,.yaml,.yml,.txt"
                @change="onOverlayFileChange" />
            </div>
            <p v-else class="text-muted">
              `semantic.overlayfile` from the repository will be preloaded.
            </p>
          </div>
        </div>
      </transition>

      <div class="actions">
        <button
          class="cta-button"
          :disabled="!canProcess || loading"
          @click="processBundle()">
          <Eye class="icon-sm" />
          Preview & Validate
        </button>
        <button class="cta-button cta-button--ghost" @click="resetFlows">
          Reset
        </button>
        <span class="text-muted">{{ ocafileInput.length }} characters</span>
      </div>

      <p v-if="error" class="error-text">
        <AlertCircle class="icon-sm" />
        {{ error }}
      </p>
    </section>

    <section v-if="hasResults" ref="resultsSection" class="results-panel">
      <div class="results-head">
        <div>
          <h2>OCA bundle overview</h2>
          <p class="text-muted">
            Switch between the 3D overlay stack and OCAFILE.
          </p>
        </div>
      </div>

      <div v-if="bundleResult" class="glass-panel bundle-summary">
        <div class="bundle-summary__head">
          <p class="pill-badge">OCA bundle</p>
          <h3>Bundle details</h3>
        </div>
        <div class="bundle-summary__stats">
          <div>
            <p class="label">Overlays</p>
            <strong>{{ overlaysCount }}</strong>
          </div>
          <div>
            <p class="label">Bundle SAID</p>
            <div class="said-row">
              <span class="text-mono">{{ bundleSaidSnippet }}</span>
              <button
                class="icon-button"
                :disabled="!bundleSaid"
                aria-label="Copy bundle SAID"
                @click="bundleSaid && copy(bundleSaid)">
                <Copy class="icon-sm" />
              </button>
            </div>
          </div>
        </div>
        <div class="bundle-summary__actions">
          <button
            class="cta-button"
            :disabled="!canPublishBundle"
            @click="publishBundle">
            {{ publishing ? 'Publishing…' : 'Publish to Repository' }}
          </button>
          <span v-if="repositoryUrl" class="text-muted">
            Target: {{ repositoryUrl }}
          </span>
          <span v-else class="text-muted"> Repository URL not configured </span>
        </div>
      </div>

      <div class="card-grid card-grid--two-columns">
        <div class="glass-panel viz-panel">
          <div class="viz-panel__head">
            <div class="view-toggle tab-switch tab-switch--compact">
              <button
                :class="{ 'is-active': viewMode === 'preview' }"
                @click="switchViewMode('preview')">
                <Layout class="icon-sm" />
                Preview
              </button>
              <button
                :class="{ 'is-active': viewMode === 'code' }"
                @click="switchViewMode('code')">
                <Code2 class="icon-sm" />
                Code
              </button>
            </div>
          </div>
          <OverlayStack3D
            v-if="viewMode === 'preview'"
            :cards="stackCards"
            :selected-index="selectedOverlayIndex"
            :show-capture-base="hasCaptureBase"
            :capture-base-selected="selectedDetailsKind === 'capture-base'"
            @select="selectOverlay"
            @cycle="cycleVariant"
            @select-capture="toggleCaptureSelection" />
          <div v-else class="code-panel">
            <textarea
              v-model="ocafileInput"
              rows="18"
              class="code-panel__area"></textarea>
            <div class="code-panel__meta">
              {{ ocafileInput.length }} characters
            </div>
          </div>
        </div>

        <div class="glass-panel details-panel">
          <div class="details-panel__header">
            <h4>{{ selectedDetailsTitle }}</h4>
          </div>
          <div
            v-if="
              selectedDetailsKind === 'capture-base' &&
              bundleResult?.capture_base
            "
            class="details-panel__body">
            <p class="text-muted">Capture base SAID</p>
            <p class="text-mono">
              {{ bundleResult.capture_base.d || 'Unavailable' }}
            </p>
            <div class="details-panel__json">
              <JsonViewer
                theme="json-theme"
                :value="bundleResult.capture_base"
                :expand-depth="3" />
              <button
                class="json-expand"
                @click="
                  openJsonDialog(bundleResult.capture_base, 'Capture base JSON')
                ">
                <Maximize2 class="icon-sm" />
                Expand
              </button>
            </div>
          </div>
          <div v-else-if="selectedOverlayCard" class="details-panel__body">
            <div class="details-row">
              <span class="label">Overlay</span>
              <span>{{
                getOverlayTitle(selectedOverlayCard, selectedOverlayIndex)
              }}</span>
            </div>
            <div v-if="currentOverlaySaid" class="details-row">
              <span class="label">SAID</span>
              <div class="said-row">
                <span class="text-mono">
                  {{ formatSaidSnippet(currentOverlaySaid) }}
                </span>
                <button
                  class="icon-button"
                  aria-label="Copy SAID"
                  @click="copy(currentOverlaySaid)">
                  <Copy class="icon-sm" />
                </button>
              </div>
            </div>
            <div v-if="attributeList.length" class="details-attributes">
              <p class="label">Attributes</p>
              <ul>
                <li v-for="attr in attributeList" :key="attr.key">
                  <strong>{{ attr.key }}</strong>
                  <span>{{ attr.value }}</span>
                </li>
              </ul>
            </div>
            <div class="details-panel__json">
              <JsonViewer
                theme="json-theme"
                :value="selectedOverlayCard.overlay"
                :expand-depth="3" />
              <button
                class="json-expand"
                @click="
                  openJsonDialog(
                    selectedOverlayCard.overlay,
                    getOverlayTitle(selectedOverlayCard, selectedOverlayIndex)
                  )
                ">
                <Maximize2 class="icon-sm" />
                Expand
              </button>
            </div>
          </div>
          <div v-else class="details-placeholder">
            <p>Select an overlay or capture base to inspect details.</p>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import JsonViewer from 'vue-json-viewer'
import OverlayStack3D from 'components/preview/OverlayStack3D.vue'
import {
  Upload,
  Eye,
  AlertCircle,
  Layout,
  Code2,
  Copy,
  Maximize2
} from 'lucide-vue-next'
import {
  loadOcaJsApi,
  normalizeErrorValue,
  isValidationResult
} from 'src/lib/oca-js'
import type { Config } from '@/types/config'

declare const config: Config

type InputMethod = 'paste' | 'upload'
type OverlaySource = 'upload' | 'core'

interface OcafileExampleEntry {
  file: string
  label: string
}

interface OcaJsResult {
  capture_base?: Record<string, unknown>
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

interface StackCardViewModel {
  typeKey: string
  title: string
  subtitle?: string
  said?: string
  paletteColor: string
  variantCount: number
  activeVariantIndex: number
}

interface ValidationSummary {
  valid: boolean
  message: string
  bundleSaid?: string
  errors?: string[]
}

const CORE_OVERLAY_URL = '/overlayfiles/semantic.overlayfile'

const ocafileInputMethod = ref<InputMethod>('paste')
const overlaySource = ref<OverlaySource>('core')
const ocafileInput = ref('')
const bundleFileName = ref('')
const bundleFileInput = ref<HTMLInputElement | null>(null)
const ocafileExamples = ref<OcafileExampleEntry[]>([])
const selectedOcafileExample = ref('')
const bundleSaidInput = ref('')
const bundleSaidLoading = ref(false)
const ocafileExampleOptions = computed(() =>
  ocafileExamples.value.map(entry => ({
    label: entry.label,
    value: entry.file
  }))
)
const ocafileExamplesLoading = ref(false)
const overlayFile = ref<File | null>(null)
const overlayDefinition = ref('')
const overlayLoading = ref(false)
const bundleResult = ref<OcaJsResult | null>(null)
const validationSummary = ref<ValidationSummary | null>(null)
const loading = ref(false)
const error = ref('')
const selectedOverlayIndex = ref(-1)
const selectedDetailsKind = ref<'overlay' | 'capture-base'>('overlay')
const viewMode = ref<'preview' | 'code'>('preview')
const activeVariantByType = ref<Record<string, number>>({})
const showAdvancedSettings = ref(false)
const jsonDialog = ref<{
  open: boolean
  title: string
  payload: unknown | null
}>({
  open: false,
  title: '',
  payload: null
})

const publishing = ref(false)

const overlayPalette = [
  'linear-gradient(135deg,#f97316,#fb923c)',
  'linear-gradient(135deg,#2563eb,#3b82f6)',
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#9333ea,#c084fc)',
  'linear-gradient(135deg,#0ea5e9,#67e8f9)',
  'linear-gradient(135deg,#f43f5e,#fb7185)'
]

const formSection = ref<HTMLElement | null>(null)
const resultsSection = ref<HTMLElement | null>(null)
type ToastIntent = 'success' | 'error'
interface ToastPayload {
  message: string
  intent: ToastIntent
}

const copyToast = ref<ToastPayload | null>(null)
let copyToastTimer: ReturnType<typeof setTimeout> | null = null
const looksLikeJsonPayload = (value: string) => {
  const trimmed = value.trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[')
}

const tryParseBundleJson = (value: string): OcaJsResult | null => {
  try {
    const parsed = JSON.parse(value) as unknown
    if (parsed && typeof parsed === 'object') {
      return parsed as OcaJsResult
    }
    return null
  } catch {
    return null
  }
}

const scrollToForm = () => {
  formSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const formatSaidSnippet = (value?: string | null) => {
  if (!value) {
    return ''
  }
  return value.length <= 6 ? value : `${value.slice(0, 6)}…`
}

const openJsonDialog = (payload: unknown, title: string) => {
  jsonDialog.value = {
    open: true,
    payload,
    title
  }
}

const closeJsonDialog = () => {
  jsonDialog.value.open = false
}

const hasResults = computed(() => bundleResult.value !== null)

const canProcess = computed(() => {
  if (loading.value || overlayLoading.value) {
    return false
  }
  if (overlayDefinition.value.trim() === '') {
    return false
  }
  return ocafileInput.value.trim() !== ''
})

const overlayEntries = computed<OverlayEntry[]>(() => {
  if (!bundleResult.value?.overlays) {
    return []
  }
  if (Array.isArray(bundleResult.value.overlays)) {
    return bundleResult.value.overlays
  }
  return Object.values(bundleResult.value.overlays)
})

const overlaysList = computed<OverlayCard[]>(() => {
  const groups = new Map<string, OverlayEntry[]>()
  overlayEntries.value.forEach(entry => {
    const { typeKey } = parseOverlayType(entry)
    const existing = groups.get(typeKey)
    if (existing) {
      existing.push(entry)
    } else {
      groups.set(typeKey, [entry])
    }
  })
  return Array.from(groups.entries()).map(([typeKey, variants]) => {
    const activeIndex = activeVariantByType.value[typeKey] || 0
    const overlay = variants[activeIndex] ?? variants[0]
    const { typeName, version } = parseOverlayType(overlay)
    return {
      typeKey,
      typeName,
      version,
      variants,
      activeVariantIndex: Math.min(activeIndex, variants.length - 1),
      overlay
    }
  })
})

const stackCards = computed<StackCardViewModel[]>(() =>
  overlaysList.value.map((card, index) => ({
    typeKey: card.typeKey,
    title: getOverlayTitle(card, index),
    subtitle:
      typeof card.overlay.language === 'string'
        ? String(card.overlay.language)
        : undefined,
    said: findSaid(card.overlay),
    paletteColor: overlayPalette[index % overlayPalette.length],
    variantCount: card.variants.length,
    activeVariantIndex: card.activeVariantIndex
  }))
)

const selectedOverlayCard = computed(() => {
  const idx = selectedOverlayIndex.value
  if (idx < 0 || idx >= overlaysList.value.length) {
    return null
  }
  return overlaysList.value[idx]
})
const selectedOverlay = computed(
  () => selectedOverlayCard.value?.overlay ?? null
)
const hasCaptureBase = computed(() => Boolean(bundleResult.value?.capture_base))
const repositoryUrl = computed(() => {
  try {
    const raw = config?.env?.OCA_REPOSITORY_URLS ?? ''
    const first = raw
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean)[0]
    return first ?? ''
  } catch (err) {
    console.warn('Failed to resolve repository URL', err)
    return ''
  }
})
const bundleSaid = computed(() => {
  if (validationSummary.value?.bundleSaid) {
    return validationSummary.value.bundleSaid
  }
  if (bundleResult.value) {
    return findSaid(bundleResult.value)
  }
  return undefined
})
const overlaysCount = computed(() => overlaysList.value.length)
const bundleSaidSnippet = computed(() =>
  bundleSaid.value ? formatSaidSnippet(bundleSaid.value) : 'Unavailable'
)
const bundlesBaseUrl = computed(() => {
  if (!repositoryUrl.value) {
    return ''
  }
  const normalized = repositoryUrl.value.replace(/\/+$/, '')
  if (/\/oca-bundles(\/|$)/.test(normalized)) {
    return normalized
  }
  if (/\/api\//.test(normalized)) {
    return `${normalized}/oca-bundles`
  }
  return `${normalized}/api/v2/oca-bundles`
})
const canFetchBySaid = computed(() => {
  if (bundlesBaseUrl.value === '') {
    return false
  }
  if (bundleSaidLoading.value) {
    return false
  }
  return bundleSaidInput.value.trim().length > 0
})
const canPublishBundle = computed(
  () =>
    bundlesBaseUrl.value !== '' &&
    ocafileInput.value.trim() !== '' &&
    !publishing.value
)

const selectedDetailsTitle = computed(() =>
  selectedDetailsKind.value === 'capture-base'
    ? 'Capture base details'
    : 'Overlay details'
)

const currentOverlaySaid = computed(() =>
  selectedOverlay.value ? findSaid(selectedOverlay.value) : ''
)

const attributeList = computed(() => {
  const overlay = selectedOverlay.value
  if (!overlay || typeof overlay !== 'object') {
    return []
  }
  const attrs = (overlay as Record<string, unknown>).attributes
  if (!attrs || typeof attrs !== 'object') {
    return []
  }
  return Object.entries(attrs as Record<string, unknown>).map(
    ([key, value]) => ({
      key,
      value: String(value)
    })
  )
})

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

const onOverlayFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  overlayDefinition.value = ''
  if (!file) {
    return
  }
  try {
    overlayDefinition.value = await file.text()
    overlayFile.value = file
  } catch (err: unknown) {
    overlayFile.value = null
    error.value =
      normalizeErrorValue(err) ?? 'Failed to read overlay definition file'
  }
}

const onBundleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    bundleFileName.value = ''
    return
  }
  try {
    bundleFileName.value = file.name
    ocafileInput.value = await file.text()
  } catch (err) {
    bundleFileName.value = ''
    error.value = normalizeErrorValue(err) ?? 'Failed to read bundle file'
  }
}

const onDropFile = async (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file) {
    return
  }
  const fileEvent = new Event('change')
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  if (bundleFileInput.value) {
    bundleFileInput.value.files = dataTransfer.files
    bundleFileInput.value.dispatchEvent(fileEvent)
  }
  try {
    bundleFileName.value = file.name
    ocafileInput.value = await file.text()
  } catch (err) {
    error.value = normalizeErrorValue(err) ?? 'Failed to read bundle file'
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
    const payload = (await response.json()) as Array<
      OcafileExampleEntry | string
    >
    ocafileExamples.value = payload.map(item =>
      typeof item === 'string' ? { file: item, label: item } : item
    )
  } finally {
    ocafileExamplesLoading.value = false
  }
}

const onOcafileExampleChange = async (fileName: string) => {
  if (!fileName) {
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
      normalizeErrorValue(err) ?? `Failed to load example OCAfile: ${fileName}`
  }
}

const fetchBundleBySaid = async () => {
  if (bundlesBaseUrl.value === '') {
    showToast('Repository URL not configured', 'error')
    return
  }
  const said = bundleSaidInput.value.trim()
  if (said === '') {
    showToast('Provide a bundle SAID', 'error')
    return
  }
  bundleSaidLoading.value = true
  try {
    const base = bundlesBaseUrl.value
    const encoded = encodeURIComponent(said)
    const url = `${base}/${encoded}/ocafile`
    const response = await fetch(url, { headers: { accept: '*/*' } })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Bundle not found in repository')
    }
    const content = await response.text()
    ocafileInputMethod.value = 'paste'
    ocafileInput.value = content
    bundleFileName.value = `${said}.ocafile`
    bundleSaidInput.value = ''
    await processBundle({ skipScroll: true })
  } catch (err) {
    error.value =
      normalizeErrorValue(err) ?? 'Failed to load bundle from repository'
  } finally {
    bundleSaidLoading.value = false
  }
}

const processBundle = async (options?: { skipScroll?: boolean }) => {
  const { skipScroll = false } = options ?? {}
  if (!canProcess.value) {
    return
  }
  loading.value = true
  error.value = ''
  try {
    const api = await loadOcaJsApi()
    const overlay = overlayDefinition.value.trim()
    let ocafile = ocafileInput.value.trim()
    let bundleFromJson: OcaJsResult | null = null

    if (looksLikeJsonPayload(ocafile)) {
      const parsed = tryParseBundleJson(ocafile)
      if (parsed) {
        bundleFromJson = parsed
        try {
          const generated = api.generateOCAfile(parsed)
          if (typeof generated === 'string' && generated.trim() !== '') {
            ocafile = generated
            ocafileInput.value = generated
          }
        } catch (err) {
          console.warn('Failed to generate OCAfile from bundle JSON', err)
        }
      }
    }

    let normalized: OcaJsResult | null = null

    try {
      const parseResult = api.parseOCAfile(ocafile, overlay)
      const parseError = getResultError(parseResult, 'Failed to parse OCAfile')
      if (parseError) {
        throw new Error(parseError)
      }
      const buildResult = api.buildFromOCAfile(ocafile, overlay)
      const buildError = getResultError(
        buildResult,
        'Failed to build OCABundle'
      )
      if (buildError) {
        throw new Error(buildError)
      }
      normalized = normalizeBundleResult(buildResult) as OcaJsResult
    } catch (err) {
      if (bundleFromJson) {
        normalized = bundleFromJson
        console.warn('Falling back to provided bundle JSON', err)
      } else {
        throw err
      }
    }

    if (!normalized && bundleFromJson) {
      normalized = bundleFromJson
    }

    if (!normalized) {
      throw new Error('Failed to process OCABundle')
    }

    bundleResult.value = normalized
    selectedOverlayIndex.value = 0
    selectedDetailsKind.value =
      overlayEntries.value.length > 0 ? 'overlay' : 'capture-base'
    activeVariantByType.value = {}
    viewMode.value = 'preview'
    runValidation(api, normalized)
    await nextTick()
    if (!skipScroll) {
      resultsSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  } catch (err: unknown) {
    error.value = normalizeErrorValue(err) ?? 'Failed to process bundle'
    bundleResult.value = null
    validationSummary.value = null
  } finally {
    loading.value = false
  }
}

const runValidation = (
  api: Awaited<ReturnType<typeof loadOcaJsApi>>,
  bundle: unknown
) => {
  const validation = api.validateBundleSemantics(bundle)
  if (!isValidationResult(validation)) {
    validationSummary.value = {
      valid: false,
      message: 'Validation returned an unexpected response'
    }
    return
  }
  validationSummary.value = {
    valid: validation.valid,
    message: validation.valid
      ? 'Bundle integrity confirmed. SAIDs match their content.'
      : 'Integrity check failed. See reported issues below.',
    bundleSaid: findSaid(bundle),
    errors: validation.errors
  }
}

const getResultError = (result: unknown, operation: string): string | null => {
  if (typeof result !== 'object' || result === null) {
    return null
  }
  const payload = result as { error?: unknown; Err?: unknown; errors?: unknown }
  const message =
    normalizeErrorValue(payload.error) ??
    normalizeErrorValue(payload.Err) ??
    normalizeErrorValue(payload.errors)
  return message ? `${operation}: ${message}` : null
}

const normalizeBundleResult = (result: unknown): unknown => {
  if (typeof result !== 'string') {
    return result
  }
  const trimmed = result.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return result
  }
  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    return result
  }
}

const parseOverlayType = (overlay: OverlayEntry) => {
  const fallback = {
    typeKey: 'overlay/unknown',
    typeName: 'unknown',
    version: ''
  }
  const value = overlay.type
  if (typeof value !== 'string') {
    return fallback
  }
  const parts = value.split('/').filter(Boolean)
  if (parts.length < 2) {
    return { typeKey: value, typeName: value, version: '' }
  }
  return {
    typeKey: parts.slice(0, 2).join('/'),
    typeName: parts[1],
    version: parts.slice(2).join('/')
  }
}

const selectOverlay = (index: number) => {
  if (
    selectedDetailsKind.value === 'overlay' &&
    selectedOverlayIndex.value === index
  ) {
    selectedOverlayIndex.value = -1
    return
  }
  selectedOverlayIndex.value = index
  selectedDetailsKind.value = 'overlay'
}

const toggleCaptureSelection = () => {
  if (selectedDetailsKind.value === 'capture-base') {
    selectedDetailsKind.value = 'overlay'
    selectedOverlayIndex.value = -1
    return
  }
  selectedDetailsKind.value = 'capture-base'
}

const cycleVariant = ({
  typeKey,
  direction
}: {
  typeKey: string
  direction: 'next' | 'prev'
}) => {
  const card = overlaysList.value.find(item => item.typeKey === typeKey)
  if (!card || card.variants.length <= 1) {
    return
  }
  const modifier = direction === 'next' ? 1 : -1
  const nextIndex =
    (card.activeVariantIndex + modifier + card.variants.length) %
    card.variants.length
  activeVariantByType.value = {
    ...activeVariantByType.value,
    [typeKey]: nextIndex
  }
}

const resetFlows = () => {
  ocafileInput.value = ''
  bundleFileName.value = ''
  bundleResult.value = null
  validationSummary.value = null
  selectedOverlayIndex.value = -1
  selectedDetailsKind.value = 'overlay'
  viewMode.value = 'preview'
  activeVariantByType.value = {}
  publishing.value = false
}

const copy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    showToast('Copied to clipboard', 'success')
  } catch (err) {
    console.warn('Failed to copy', err)
    showToast('Unable to copy content', 'error')
  }
}

const dismissToast = () => {
  copyToast.value = null
  if (copyToastTimer !== null) {
    window.clearTimeout(copyToastTimer)
    copyToastTimer = null
  }
}

const showToast = (message: string, intent: ToastIntent) => {
  copyToast.value = { message, intent }
  if (copyToastTimer !== null) {
    window.clearTimeout(copyToastTimer)
    copyToastTimer = null
  }
  if (intent === 'error') {
    return
  }
  copyToastTimer = window.setTimeout(() => {
    copyToast.value = null
    copyToastTimer = null
  }, 4000)
}

const switchViewMode = async (mode: 'preview' | 'code') => {
  if (viewMode.value === mode) {
    return
  }
  const currentY = window.scrollY
  viewMode.value = mode
  await nextTick()
  window.scrollTo({ top: currentY })
}

const findSaid = (source: unknown): string | undefined => {
  if (!source || typeof source === 'string') {
    return typeof source === 'string' && source.trim() !== ''
      ? source.trim()
      : undefined
  }
  if (typeof source !== 'object') {
    return undefined
  }
  const keys = ['said', 'SAID', 'digest', 'd', 'id']
  for (const key of keys) {
    const value = (source as Record<string, unknown>)[key]
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim()
    }
  }
  const nestedKeys = ['data', 'bundle', 'result', 'value', 'payload']
  for (const key of nestedKeys) {
    const nested = (source as Record<string, unknown>)[key]
    const found = findSaid(nested)
    if (found) {
      return found
    }
  }
  return undefined
}

const getOverlayTitle = (card: OverlayCard, index: number) => {
  const base = card.typeName || `Overlay ${index + 1}`
  return card.version ? `${base} (${card.version})` : base
}

const publishBundle = async () => {
  const ocafilePayload = ocafileInput.value.trim()
  if (bundlesBaseUrl.value === '' || ocafilePayload === '') {
    showToast(
      'Provide an OCAfile and repository URL before publishing',
      'error'
    )
    return
  }
  publishing.value = true
  try {
    const response = await fetch(bundlesBaseUrl.value, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: ocafilePayload
    })
    const raw = await response.text()
    type RepositoryResponse = { success?: boolean; errors?: unknown }
    let payload: RepositoryResponse | null = null
    try {
      payload = raw ? (JSON.parse(raw) as RepositoryResponse) : null
    } catch {
      payload = null
    }
    const successFlag =
      typeof payload?.success === 'boolean' ? payload.success : undefined
    const errorsList = Array.isArray(payload?.errors) ? payload?.errors : []
    if (!response.ok || successFlag === false) {
      const errorMessage =
        (errorsList.length > 0 ? errorsList.map(String).join('\n') : raw) ||
        'Failed to publish OCAfile'
      throw new Error(errorMessage)
    }
    showToast('OCAfile published successfully', 'success')
  } catch (err) {
    showToast(normalizeErrorValue(err) ?? 'Failed to publish OCAfile', 'error')
  } finally {
    publishing.value = false
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
          normalizeErrorValue(err) ?? 'Failed to load core overlay definition'
      }
      return
    }
    overlayDefinition.value = ''
  },
  { immediate: true }
)

watch(
  () => selectedOcafileExample.value,
  value => {
    if (value) {
      void onOcafileExampleChange(value)
    }
  }
)

watch(overlaysList, newList => {
  if (newList.length === 0) {
    selectedOverlayIndex.value = -1
    selectedDetailsKind.value = hasCaptureBase.value
      ? 'capture-base'
      : 'overlay'
    return
  }
  if (selectedOverlayIndex.value >= newList.length) {
    selectedOverlayIndex.value = newList.length - 1
  }
  if (selectedOverlayIndex.value < -1) {
    selectedOverlayIndex.value = -1
  }
  if (selectedDetailsKind.value === 'capture-base' && !hasCaptureBase.value) {
    selectedDetailsKind.value = 'overlay'
  }
})

watch(
  () => viewMode.value,
  newMode => {
    if (newMode === 'preview' && hasResults.value) {
      void processBundle({ skipScroll: true })
    }
  }
)

onMounted(() => {
  void loadOcafileExamples()
})
</script>

<style scoped>
.experience-page {
  padding: clamp(1.5rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #fff;
}

.copy-toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 0.9rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.35);
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.copy-toast--success {
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.4);
}

.copy-toast--error {
  background: rgba(248, 113, 113, 0.25);
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
}

.toast-close {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.toast-close:hover {
  opacity: 0.9;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: clamp(1.5rem, 3vw, 3rem);
}

.hero h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
}

.hero__text p {
  max-width: 640px;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.hero__stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.hero__label {
  color: rgba(255, 255, 255, 0.6);
}

.input-panel {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.input-shell textarea {
  min-height: 280px;
}

.example-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-select .label {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}
.example-select :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.example-select :deep(.q-field__native),
.example-select :deep(.q-field__input) {
  color: #fff;
}
.example-select :deep(.q-icon),
.example-select :deep(.q-field__marginal) {
  color: rgba(255, 255, 255, 0.7);
}

.bundle-said-fetch {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bundle-said-fetch__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.bundle-said-fetch__controls input {
  flex: 1;
  min-width: 220px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  padding: 0.75rem 1rem;
}

.example-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-select .label {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}

.example-select .example-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.example-select :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.example-select :deep(.q-field__native),
.example-select :deep(.q-field__input) {
  color: #fff;
}

.example-select :deep(.q-icon),
.example-select :deep(.q-field__marginal) {
  color: rgba(255, 255, 255, 0.7);
}

.upload-drop {
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  width: 42px;
  height: 42px;
}

.panel-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.panel-grid .label {
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}

.panel-grid select,
.panel-grid input[type='file'] {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #fff;
}

.tab-switch--compact button {
  padding: 0.35rem 1rem;
}

.settings-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.settings-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.settings-toggle svg {
  transition: transform 0.2s ease;
}

.settings-toggle svg.is-open {
  transform: rotate(180deg);
}

.advanced-panel {
  width: 100%;
}

.advanced-enter-active,
.advanced-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.advanced-enter-from,
.advanced-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.error-text {
  color: #f87171;
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.results-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bundle-summary {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
}

.bundle-summary__head h3 {
  margin: 0.25rem 0 0;
}

.bundle-summary__stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.bundle-summary__stats > div {
  min-width: 180px;
}

.bundle-summary__stats strong {
  display: block;
  font-size: 1.4rem;
}

.bundle-summary__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.viz-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.code-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.code-panel__area {
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-family: 'Space Mono', monospace;
  padding: 1rem;
  resize: none;
}

.code-panel__meta {
  margin: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.viz-panel__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem;
}

.viz-panel__head .pill-badge {
  border-radius: 999px;
}

.details-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.details-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
}

.details-panel__body {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.details-panel__json {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.json-expand {
  align-self: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
}

.json-theme {
  background: #050f1f;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #fff;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-number-float {
      color: #fc1e70;
    }
    &.jv-number-integer {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.details-row .label {
  color: rgba(255, 255, 255, 0.6);
}

.said-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.details-attributes ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.details-attributes li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
}

.details-placeholder {
  margin-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.json-dialog {
  width: min(900px, 90vw);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: rgba(5, 15, 31, 0.95);
  color: #fff;
}

.json-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.json-dialog__body {
  max-height: 75vh;
  overflow: auto;
}

.info-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.info-tags span {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
}

.error-list {
  grid-column: span 2;
  list-style: disc;
  padding-left: 1.25rem;
}

.icon-sm {
  width: 18px;
  height: 18px;
}

.icon-lg {
  width: 36px;
  height: 36px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .said-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
