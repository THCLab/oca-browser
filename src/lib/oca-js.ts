interface ValidationResult {
  valid: boolean
  errors: string[]
}

interface OcaJsModule {
  default: (input?: unknown) => Promise<unknown>
  parseOCAfile: (ocafileStr: string, overlayFileStr?: string | null) => unknown
  buildFromOCAfile: (ocafileStr: string, overlaysDir?: string | null) => unknown
  validateBundleSemantics: (bundle: unknown) => unknown
  loadBundle: (json_str: string, overlay_file?: string | null) => unknown
}

interface OcaJsApi {
  parseOCAfile: OcaJsModule['parseOCAfile']
  buildFromOCAfile: OcaJsModule['buildFromOCAfile']
  validateBundleSemantics: OcaJsModule['validateBundleSemantics']
  loadBundle: OcaJsModule['loadBundle']
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

function isValidationResult(result: unknown): result is ValidationResult {
  if (typeof result !== 'object' || result === null) {
    return false
  }

  const value = result as { valid?: unknown; errors?: unknown }
  return typeof value.valid === 'boolean' && Array.isArray(value.errors)
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
    validateBundleSemantics: module.validateBundleSemantics,
    loadBundle: module.loadBundle
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

export {
  loadOcaJsApi,
  normalizeErrorValue,
  isValidationResult,
  ValidationResult,
  OcaJsApi,
  OcaJsModule
}
