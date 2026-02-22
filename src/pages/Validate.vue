<template>
  <q-page class="q-pa-md validate-page">
    <div class="row q-col-gutter-lg validate-grid">
      <!-- Left Panel: Input -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="input-card">
          <q-card-section class="bg-grey-2">
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6">OCA Bundle Input</div>
                <div class="text-caption text-grey-7">
                  Paste JSON or upload a bundle file to validate
                </div>
              </div>
              <q-btn
                dense
                round
                flat
                icon="help_outline"
                @click="inputHelpExpanded = !inputHelpExpanded" />
            </div>
            <q-slide-transition>
              <div
                v-show="inputHelpExpanded"
                class="text-body2 q-mt-sm text-grey-8">
                Validates bundle structure, overlays, and semantic integrity
                using the latest oca.js WASM module.
              </div>
            </q-slide-transition>
          </q-card-section>

          <q-card-section>
            <q-btn-toggle
              v-model="inputMode"
              :options="inputOptions"
              toggle-color="primary"
              outline
              class="q-mb-md" />

            <template v-if="inputMode === 'text'">
              <q-input
                v-model="bundleInput"
                outlined
                type="textarea"
                placeholder="Paste OCA bundle JSON here..."
                :rows="18"
                class="input-textarea"
                label="OCA Bundle JSON" />
            </template>

            <template v-else>
              <q-file
                v-model="bundleFile"
                filled
                label="Select OCA bundle file (.bundle, .json, .txt)"
                accept=".bundle,.json,.txt"
                clearable
                @update:model-value="handleFileChange">
                <template #prepend>
                  <q-icon name="upload_file" />
                </template>
              </q-file>
              <div v-if="filePreview" class="q-mt-sm">
                <div class="text-caption text-grey-7 q-mb-xs">
                  File preview:
                </div>
                <q-input
                  :model-value="filePreview"
                  filled
                  dense
                  readonly
                  type="textarea"
                  :rows="6"
                  class="input-textarea" />
              </div>
            </template>
          </q-card-section>

          <q-card-section class="q-pt-none">
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

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              label="Validate"
              color="primary"
              icon="check_circle"
              :loading="loading"
              :disable="!canValidate"
              @click="validate" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Right Panel: Results -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="result-card">
          <q-card-section class="bg-grey-2">
            <div class="text-h6">Validation Result</div>
          </q-card-section>

          <q-card-section>
            <!-- Loading State -->
            <div
              v-if="loading"
              class="column items-center justify-center q-py-xl">
              <q-spinner size="4em" color="primary" />
              <div class="text-subtitle1 q-mt-md text-grey-7">
                Validating bundle...
              </div>
            </div>

            <!-- Success State -->
            <div v-else-if="validationResult?.valid">
              <div class="q-mb-lg">
                <q-banner class="bg-green-1 text-green-10" rounded dense>
                  <template #avatar>
                    <q-icon name="check_circle" color="green-10" />
                  </template>
                  <div>
                    <div class="text-subtitle2">Bundle is valid</div>
                    <div class="text-body2 text-mono q-mt-xs">
                      SAID: {{ validationResult.said ?? 'Unavailable' }}
                    </div>
                  </div>
                </q-banner>
                <div class="text-subtitle2 text-grey-7 q-mt-md">
                  OCA Bundle SAID
                </div>
                <div class="text-h5 text-primary text-mono q-mt-xs">
                  {{ validationResult.said ?? 'SAID unavailable' }}
                </div>
              </div>

              <q-separator class="q-mb-md" />

              <div class="text-subtitle2 text-grey-7 q-mb-sm">Overlays</div>
              <div v-if="validationResult.overlays?.length">
                <q-list separator bordered>
                  <q-expansion-item
                    v-for="(overlay, index) in validationResult.overlays"
                    :key="`overlay-${index}-${overlay.said ?? ''}`"
                    dense-toggle
                    header-class="text-primary">
                    <template #header>
                      <q-item-section avatar>
                        <q-avatar
                          color="primary"
                          text-color="white"
                          size="32px">
                          {{ index + 1 }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ overlay.name }}</q-item-label>
                        <q-item-label caption class="text-grey-6">
                          {{ overlay.typePath ?? 'Overlay type unavailable' }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-caption text-mono text-grey-7">
                          SAID: {{ overlay.said ?? 'Unavailable' }}
                        </div>
                      </q-item-section>
                    </template>
                    <json-viewer :value="overlay.details" :expand-depth="2" />
                  </q-expansion-item>
                </q-list>
              </div>
              <div v-else class="text-grey-6 q-pa-md bg-grey-2 rounded-borders">
                No overlays found in this bundle.
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="validationResult?.errors">
              <q-banner class="bg-red-1 text-negative" rounded>
                <template #avatar>
                  <q-icon name="error" color="negative" />
                </template>
                <div class="text-subtitle2">Validation Failed</div>
              </q-banner>
              <q-list dense bordered separator class="q-mt-md">
                <q-item
                  v-for="(errorMsg, idx) in validationResult.errors"
                  :key="idx">
                  <q-item-section avatar>
                    <q-icon name="warning" color="negative" />
                  </q-item-section>
                  <q-item-section>{{ errorMsg }}</q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Exception State -->
            <div v-else-if="error">
              <q-banner class="bg-red-1 text-negative" rounded>
                <template #avatar>
                  <q-icon name="error" color="negative" />
                </template>
                <div class="text-subtitle2">Error</div>
                <div>{{ error }}</div>
                <div v-if="stackTrace" class="q-mt-md">
                  <q-expansion-item
                    dense
                    label="Stack trace"
                    header-class="text-negative">
                    <pre class="stack-trace text-caption">{{ stackTrace }}</pre>
                  </q-expansion-item>
                </div>
              </q-banner>
            </div>

            <!-- Empty State -->
            <div
              v-else
              class="column items-center justify-center q-py-xl text-center">
              <q-icon name="assignment" size="64px" color="grey-4" />
              <div class="text-h6 text-grey-6 q-mt-md">No Validation Yet</div>
              <div class="text-body2 text-grey-5 q-mt-sm">
                Paste or upload an OCA bundle to validate its structure and
                semantics.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import JsonViewer from 'vue-json-viewer'
import {
  loadOcaJsApi,
  normalizeErrorValue,
  isValidationResult
} from 'src/lib/oca-js'

type InputMode = 'text' | 'file'
type OverlayEntry = Record<string, unknown>

interface OverlaySummary {
  name: string
  typePath?: string
  said?: string
  details: unknown
}

interface ValidationResult {
  valid: boolean
  said?: string
  overlays?: OverlaySummary[]
  errors?: string[]
  bundle?: unknown
}

const SAID_KEYS = ['said', 'SAID', 'digest', 'd', 'id']
const NESTED_KEYS = ['data', 'bundle', 'result', 'value', 'payload']
const CORE_OVERLAY_URL = '/overlayfiles/semantic.overlayfile'

function isOverlayMap(value: unknown): value is Map<string, unknown> {
  return value instanceof Map
}

function getOverlayField(entry: unknown, key: string): unknown {
  if (isOverlayMap(entry)) {
    return entry.get(key)
  }

  if (typeof entry === 'object' && entry !== null) {
    return (entry as Record<string, unknown>)[key]
  }

  return undefined
}

function findSaid(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }

  if (typeof value !== 'object') {
    return undefined
  }

  for (const key of SAID_KEYS) {
    const candidate = getOverlayField(value, key)
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim()
      if (trimmed !== '') {
        return trimmed
      }
    }
  }

  for (const key of NESTED_KEYS) {
    const nestedSource = getOverlayField(value, key)
    if (nestedSource !== undefined) {
      const nested = findSaid(nestedSource)
      if (nested !== undefined) {
        return nested
      }
    }
  }

  return undefined
}

function collectOverlayEntries(bundle: unknown): unknown[] {
  if (bundle === null || typeof bundle !== 'object') {
    return []
  }

  const overlays = getOverlayField(bundle, 'overlays')

  if (Array.isArray(overlays)) {
    return overlays
  }

  if (isOverlayMap(overlays)) {
    return Array.from(overlays.values())
  }

  if (typeof overlays === 'object' && overlays !== null) {
    return Object.values(overlays)
  }

  return []
}

function overlayDisplayName(overlay: unknown, index: number): string {
  const typeValue = getOverlayField(overlay, 'type') as string | undefined
  if (typeof typeValue === 'string' && typeValue.trim() !== '') {
    return typeValue.trim()
  }

  const kindValue = getOverlayField(overlay, 'kind') as string | undefined
  if (typeof kindValue === 'string' && kindValue.trim() !== '') {
    return kindValue.trim()
  }

  return `Overlay ${index + 1}`
}

function toPlainJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(item => toPlainJsonValue(item))
  }

  if (isOverlayMap(value)) {
    const plain: OverlayEntry = {}
    value.forEach((mapValue, mapKey) => {
      plain[String(mapKey)] = toPlainJsonValue(mapValue)
    })
    return plain
  }

  if (typeof value === 'object' && value !== null) {
    const plain: OverlayEntry = {}
    const source = value as Record<string, unknown>
    Object.keys(source).forEach(key => {
      plain[key] = toPlainJsonValue(source[key])
    })
    return plain
  }

  return value
}

function extractBundleSaid(bundle: unknown): string | undefined {
  return findSaid(bundle)
}

function extractOverlaysWithSaid(bundle: unknown): OverlaySummary[] {
  const entries = collectOverlayEntries(bundle)
  return entries
    .filter(
      (entry): entry is OverlayEntry =>
        typeof entry === 'object' && entry !== null && !Array.isArray(entry)
    )
    .map((entry, index) => {
      const typeValue = getOverlayField(entry, 'type') as string | undefined
      const kindValue = getOverlayField(entry, 'kind') as string | undefined
      const details = toPlainJsonValue(entry)

      return {
        name: overlayDisplayName(entry, index),
        typePath: typeValue ?? kindValue,
        said: findSaid(entry),
        details
      }
    })
}

export default defineComponent({
  name: 'Validate',
  components: { JsonViewer },
  setup() {
    const inputMode = ref<InputMode>('text')
    const bundleInput = ref('')
    const bundleFile = ref<File | null>(null)
    const loading = ref(false)
    const validationResult = ref<ValidationResult | null>(null)
    const error = ref('')
    const stackTrace = ref('')
    const inputHelpExpanded = ref(true)

    const overlaySource = ref<'upload' | 'core'>('core')
    const overlaySourceOptions = [
      { label: 'Upload file', value: 'upload' },
      { label: 'Use core overlay', value: 'core' }
    ]
    const overlayFile = ref<File | null>(null)
    const overlayDefinition = ref('')
    const overlayLoading = ref(false)

    const inputOptions = [
      { label: 'Paste JSON', value: 'text' },
      { label: 'Upload file', value: 'file' }
    ]

    const canValidate = computed(() => {
      if (loading.value || overlayLoading.value) {
        return false
      }
      if (overlayDefinition.value.trim() === '') {
        return false
      }
      if (inputMode.value === 'text') {
        return bundleInput.value.trim().length > 0
      }
      return bundleFile.value !== null
    })

    const filePreview = computed(() => {
      if (inputMode.value === 'file' && bundleInput.value) {
        const preview = bundleInput.value.slice(0, 500)
        return bundleInput.value.length > 500 ? preview + '...' : preview
      }
      return ''
    })

    const handleFileChange = async (file: File | null) => {
      bundleFile.value = file
      if (file === null) {
        bundleInput.value = ''
        return
      }

      try {
        bundleInput.value = await file.text()
      } catch (err: unknown) {
        bundleInput.value = ''
        bundleFile.value = null
        error.value = `Failed to read file: ${file.name}`
      }
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

    const validate = async () => {
      if (!canValidate.value) {
        return
      }

      loading.value = true
      error.value = ''
      stackTrace.value = ''
      validationResult.value = null

      try {
        const api = await loadOcaJsApi()
        const jsonStr =
          inputMode.value === 'file'
            ? bundleInput.value
            : bundleInput.value.trim()
        const overlayStr = overlayDefinition.value.trim()
        const bundle = api.loadBundle(
          jsonStr,
          overlayStr === '' ? null : overlayStr
        )
        const result = api.validateBundleSemantics(bundle)

        if (isValidationResult(result)) {
          if (result.valid) {
            validationResult.value = {
              valid: true,
              bundle,
              said: extractBundleSaid(bundle),
              overlays: extractOverlaysWithSaid(bundle)
            }
            return
          }
          validationResult.value = {
            valid: false,
            errors: result.errors
          }
        } else {
          error.value = 'Validation returned an unexpected response'
        }
      } catch (err: unknown) {
        error.value = normalizeErrorValue(err) ?? 'Validation failed'
        if (err instanceof Error && err.stack) {
          stackTrace.value = err.stack
        }
      } finally {
        loading.value = false
      }
    }

    return {
      inputMode,
      bundleInput,
      bundleFile,
      filePreview,
      inputOptions,
      overlaySource,
      overlaySourceOptions,
      overlayFile,
      overlayLoading,
      loading,
      validationResult,
      error,
      stackTrace,
      inputHelpExpanded,
      canValidate,
      handleFileChange,
      onOverlayFileChange,
      validate
    }
  }
})
</script>

<style lang="scss" scoped>
.validate-page {
  min-height: calc(100vh - 100px);
}

.validate-grid {
  min-height: 100%;
}

.input-card,
.result-card {
  border-radius: 12px;
  min-height: 600px;
}

.input-textarea {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.text-mono {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}

.stack-trace {
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  margin: 0;
}

.rounded-borders {
  border-radius: 8px;
}

@media (max-width: 1023px) {
  .input-card,
  .result-card {
    min-height: auto;
  }
}
</style>
