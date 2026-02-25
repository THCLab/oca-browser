/* @ts-self-types="./oca_js.d.ts" */

/**
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const AttributeType = Object.freeze({
  Boolean: 0,
  0: 'Boolean',
  Binary: 1,
  1: 'Binary',
  Text: 2,
  2: 'Text',
  Numeric: 3,
  3: 'Numeric',
  DateTime: 4,
  4: 'DateTime'
})

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const Encoding = Object.freeze({
  Base64: 0,
  0: 'Base64',
  Utf8: 1,
  1: 'Utf8',
  Iso8859_1: 2,
  2: 'Iso8859_1',
  Utf16: 3,
  3: 'Utf16',
  Utf16Be: 4,
  4: 'Utf16Be',
  Utf16Le: 5,
  5: 'Utf16Le'
})

/**
 * @param {any} oca_bundle
 * @param {string} attribute_name
 * @param {string} attribute_type
 * @returns {any}
 */
export function addAttributeToBundle(
  oca_bundle,
  attribute_name,
  attribute_type
) {
  const ptr0 = passStringToWasm0(
    attribute_name,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ptr1 = passStringToWasm0(
    attribute_type,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len1 = WASM_VECTOR_LEN
  const ret = wasm.addAttributeToBundle(oca_bundle, ptr0, len0, ptr1, len1)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @param {string} overlay_name
 * @param {string} overlay_type
 * @param {any} overlay_properties
 * @returns {any}
 */
export function addOverlayToBundle(
  oca_bundle,
  overlay_name,
  overlay_type,
  overlay_properties
) {
  const ptr0 = passStringToWasm0(
    overlay_name,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ptr1 = passStringToWasm0(
    overlay_type,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len1 = WASM_VECTOR_LEN
  const ret = wasm.addOverlayToBundle(
    oca_bundle,
    ptr0,
    len0,
    ptr1,
    len1,
    overlay_properties
  )
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {string} ocafile_str
 * @param {string} overlay_file
 * @returns {any}
 */
export function buildFromOCAfile(ocafile_str, overlay_file) {
  const ptr0 = passStringToWasm0(
    ocafile_str,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ptr1 = passStringToWasm0(
    overlay_file,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len1 = WASM_VECTOR_LEN
  const ret = wasm.buildFromOCAfile(ptr0, len0, ptr1, len1)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @returns {string}
 */
export function bundleToJSON(oca_bundle) {
  let deferred2_0
  let deferred2_1
  try {
    const ret = wasm.bundleToJSON(oca_bundle)
    var ptr1 = ret[0]
    var len1 = ret[1]
    if (ret[3]) {
      ptr1 = 0
      len1 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {string} classification
 * @param {any} attributes
 * @returns {any}
 */
export function createBundleWithAttributes(classification, attributes) {
  const ptr0 = passStringToWasm0(
    classification,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ret = wasm.createBundleWithAttributes(ptr0, len0, attributes)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {string} bundle
 * @param {string} overlay_file
 * @returns {string}
 */
export function generateOCAfile(bundle, overlay_file) {
  let deferred4_0
  let deferred4_1
  try {
    const ptr0 = passStringToWasm0(
      bundle,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    )
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(
      overlay_file,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    )
    const len1 = WASM_VECTOR_LEN
    const ret = wasm.generateOCAfile(ptr0, len0, ptr1, len1)
    var ptr3 = ret[0]
    var len3 = ret[1]
    if (ret[3]) {
      ptr3 = 0
      len3 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred4_0 = ptr3
    deferred4_1 = len3
    return getStringFromWasm0(ptr3, len3)
  } finally {
    wasm.__wbindgen_free(deferred4_0, deferred4_1, 1)
  }
}

/**
 * @param {any} oca_bundle
 * @returns {any}
 */
export function getBundleAttributes(oca_bundle) {
  const ret = wasm.getBundleAttributes(oca_bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @returns {string}
 */
export function getBundleClassification(oca_bundle) {
  let deferred2_0
  let deferred2_1
  try {
    const ret = wasm.getBundleClassification(oca_bundle)
    var ptr1 = ret[0]
    var len1 = ret[1]
    if (ret[3]) {
      ptr1 = 0
      len1 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {any} oca_bundle
 * @returns {string}
 */
export function getBundleDigest(oca_bundle) {
  let deferred2_0
  let deferred2_1
  try {
    const ret = wasm.getBundleDigest(oca_bundle)
    var ptr1 = ret[0]
    var len1 = ret[1]
    if (ret[3]) {
      ptr1 = 0
      len1 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {any} oca_bundle
 * @returns {any}
 */
export function getBundleFlaggedAttributes(oca_bundle) {
  const ret = wasm.getBundleFlaggedAttributes(oca_bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @returns {string}
 */
export function getBundleType(oca_bundle) {
  let deferred2_0
  let deferred2_1
  try {
    const ret = wasm.getBundleType(oca_bundle)
    var ptr1 = ret[0]
    var len1 = ret[1]
    if (ret[3]) {
      ptr1 = 0
      len1 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {any} oca_bundle
 * @returns {string}
 */
export function getBundleVersion(oca_bundle) {
  let deferred2_0
  let deferred2_1
  try {
    const ret = wasm.getBundleVersion(oca_bundle)
    var ptr1 = ret[0]
    var len1 = ret[1]
    if (ret[3]) {
      ptr1 = 0
      len1 = 0
      throw takeFromExternrefTable0(ret[2])
    }
    deferred2_0 = ptr1
    deferred2_1 = len1
    return getStringFromWasm0(ptr1, len1)
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {any} oca_bundle
 * @returns {number}
 */
export function getOverlayCount(oca_bundle) {
  const ret = wasm.getOverlayCount(oca_bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return ret[0] >>> 0
}

/**
 * @param {any} oca_bundle
 * @returns {any}
 */
export function getOverlayNames(oca_bundle) {
  const ret = wasm.getOverlayNames(oca_bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @returns {boolean}
 */
export function hasOverlays(oca_bundle) {
  const ret = wasm.hasOverlays(oca_bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return ret[0] !== 0
}

export function init() {
  wasm.init()
}

/**
 * @param {string} json_str
 * @param {string} overlay_file
 * @returns {any}
 */
export function loadBundle(json_str, overlay_file) {
  const ptr0 = passStringToWasm0(
    json_str,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ptr1 = passStringToWasm0(
    overlay_file,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len1 = WASM_VECTOR_LEN
  const ret = wasm.loadBundle(ptr0, len0, ptr1, len1)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {string} ocafile_str
 * @param {string} overlay_file
 * @returns {any}
 */
export function parseOCAfile(ocafile_str, overlay_file) {
  const ptr0 = passStringToWasm0(
    ocafile_str,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ptr1 = passStringToWasm0(
    overlay_file,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len1 = WASM_VECTOR_LEN
  const ret = wasm.parseOCAfile(ptr0, len0, ptr1, len1)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @param {string} attribute_name
 * @returns {any}
 */
export function removeAttributeFromBundle(oca_bundle, attribute_name) {
  const ptr0 = passStringToWasm0(
    attribute_name,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ret = wasm.removeAttributeFromBundle(oca_bundle, ptr0, len0)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} oca_bundle
 * @param {string} overlay_name
 * @returns {any}
 */
export function removeOverlayFromBundle(oca_bundle, overlay_name) {
  const ptr0 = passStringToWasm0(
    overlay_name,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc
  )
  const len0 = WASM_VECTOR_LEN
  const ret = wasm.removeOverlayFromBundle(oca_bundle, ptr0, len0)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

/**
 * @param {any} bundle
 * @returns {any}
 */
export function validateBundleSemantics(bundle) {
  const ret = wasm.validateBundleSemantics(bundle)
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1])
  }
  return takeFromExternrefTable0(ret[0])
}

function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_Error_fe3709820da6d9f4: function (arg0, arg1) {
      const ret = Error(getStringFromWasm0(arg0, arg1))
      return ret
    },
    __wbg_Number_7f57e747646990d6: function (arg0) {
      const ret = Number(arg0)
      return ret
    },
    __wbg_String_8564e559799eccda: function (arg0, arg1) {
      const ret = String(arg1)
      const ptr1 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      )
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_bigint_get_as_i64_29047dd6a3491265: function (arg0, arg1) {
      const v = arg1
      const ret = typeof v === 'bigint' ? v : undefined
      getDataViewMemory0().setBigInt64(
        arg0 + 8 * 1,
        isLikeNone(ret) ? BigInt(0) : ret,
        true
      )
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true)
    },
    __wbg___wbindgen_boolean_get_ff8209d052ce1cc3: function (arg0) {
      const v = arg0
      const ret = typeof v === 'boolean' ? v : undefined
      return isLikeNone(ret) ? 0xffffff : ret ? 1 : 0
    },
    __wbg___wbindgen_debug_string_a1b3fd0656850da8: function (arg0, arg1) {
      const ret = debugString(arg1)
      const ptr1 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      )
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_in_5ba21a357fd4699f: function (arg0, arg1) {
      const ret = arg0 in arg1
      return ret
    },
    __wbg___wbindgen_is_bigint_a6cfc71108ea453a: function (arg0) {
      const ret = typeof arg0 === 'bigint'
      return ret
    },
    __wbg___wbindgen_is_function_82aa5b8e9371b250: function (arg0) {
      const ret = typeof arg0 === 'function'
      return ret
    },
    __wbg___wbindgen_is_object_61452b678ecf7ecf: function (arg0) {
      const val = arg0
      const ret = typeof val === 'object' && val !== null
      return ret
    },
    __wbg___wbindgen_is_string_91960b7ba9d4d76b: function (arg0) {
      const ret = typeof arg0 === 'string'
      return ret
    },
    __wbg___wbindgen_jsval_eq_ee9380582e278327: function (arg0, arg1) {
      const ret = arg0 === arg1
      return ret
    },
    __wbg___wbindgen_jsval_loose_eq_cfddc78de4a067b0: function (arg0, arg1) {
      const ret = arg0 == arg1
      return ret
    },
    __wbg___wbindgen_number_get_eb70a740eef5cf3a: function (arg0, arg1) {
      const obj = arg1
      const ret = typeof obj === 'number' ? obj : undefined
      getDataViewMemory0().setFloat64(
        arg0 + 8 * 1,
        isLikeNone(ret) ? 0 : ret,
        true
      )
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true)
    },
    __wbg___wbindgen_string_get_aab6399cd8ec8844: function (arg0, arg1) {
      const obj = arg1
      const ret = typeof obj === 'string' ? obj : undefined
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(
            ret,
            wasm.__wbindgen_malloc,
            wasm.__wbindgen_realloc
          )
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_throw_83ebd457a191bc2a: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1))
    },
    __wbg_call_a3e856c036847f30: function () {
      return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1)
        return ret
      }, arguments)
    },
    __wbg_done_f9e33fcfdacdad82: function (arg0) {
      const ret = arg0.done
      return ret
    },
    __wbg_entries_95c8dc6ea5bcb5d3: function (arg0) {
      const ret = Object.entries(arg0)
      return ret
    },
    __wbg_error_a6fa202b58aa1cd3: function (arg0, arg1) {
      let deferred0_0
      let deferred0_1
      try {
        deferred0_0 = arg0
        deferred0_1 = arg1
        console.error(getStringFromWasm0(arg0, arg1))
      } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1)
      }
    },
    __wbg_get_3c8961765646956e: function () {
      return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1)
        return ret
      }, arguments)
    },
    __wbg_get_5aaf989b657a0cbd: function (arg0, arg1) {
      const ret = arg0[arg1 >>> 0]
      return ret
    },
    __wbg_get_unchecked_fb17614cc2ea6bd4: function (arg0, arg1) {
      const ret = arg0[arg1 >>> 0]
      return ret
    },
    __wbg_instanceof_ArrayBuffer_5947ef6d17a07122: function (arg0) {
      let result
      try {
        result = arg0 instanceof ArrayBuffer
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_Map_21a1cbb0613d7d2f: function (arg0) {
      let result
      try {
        result = arg0 instanceof Map
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_Uint8Array_c21f42d2acffa054: function (arg0) {
      let result
      try {
        result = arg0 instanceof Uint8Array
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_isArray_65307171a630ba34: function (arg0) {
      const ret = Array.isArray(arg0)
      return ret
    },
    __wbg_isSafeInteger_2b254ea166877b36: function (arg0) {
      const ret = Number.isSafeInteger(arg0)
      return ret
    },
    __wbg_iterator_b3054eb88cb59de4: function () {
      const ret = Symbol.iterator
      return ret
    },
    __wbg_length_684e7f4ac265724c: function (arg0) {
      const ret = arg0.length
      return ret
    },
    __wbg_length_a4c11dc94fe5e775: function (arg0) {
      const ret = arg0.length
      return ret
    },
    __wbg_new_18cda2e4779f118c: function (arg0) {
      const ret = new Uint8Array(arg0)
      return ret
    },
    __wbg_new_227d7c05414eb861: function () {
      const ret = new Error()
      return ret
    },
    __wbg_new_2e5db3ea23dcc1a1: function () {
      const ret = new Array()
      return ret
    },
    __wbg_new_31d07d7329f84e37: function () {
      const ret = new Map()
      return ret
    },
    __wbg_new_5c365a7570baea64: function () {
      const ret = new Object()
      return ret
    },
    __wbg_next_2ae970b266acf6e5: function (arg0) {
      const ret = arg0.next
      return ret
    },
    __wbg_next_6ce141aa72ac5eeb: function () {
      return handleError(function (arg0) {
        const ret = arg0.next()
        return ret
      }, arguments)
    },
    __wbg_prototypesetcall_7c3092bff32833dc: function (arg0, arg1, arg2) {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2)
    },
    __wbg_set_0992bb8f727d2d33: function (arg0, arg1, arg2) {
      const ret = arg0.set(arg1, arg2)
      return ret
    },
    __wbg_set_6be42768c690e380: function (arg0, arg1, arg2) {
      arg0[arg1] = arg2
    },
    __wbg_set_c7d56bae406212ae: function (arg0, arg1, arg2) {
      arg0[arg1 >>> 0] = arg2
    },
    __wbg_stack_3b0d974bbf31e44f: function (arg0, arg1) {
      const ret = arg1.stack
      const ptr1 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      )
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_value_69c16823ba9b4739: function (arg0) {
      const ret = arg0.value
      return ret
    },
    __wbindgen_cast_0000000000000001: function (arg0) {
      // Cast intrinsic for `F64 -> Externref`.
      const ret = arg0
      return ret
    },
    __wbindgen_cast_0000000000000002: function (arg0) {
      // Cast intrinsic for `I64 -> Externref`.
      const ret = arg0
      return ret
    },
    __wbindgen_cast_0000000000000003: function (arg0, arg1) {
      // Cast intrinsic for `Ref(String) -> Externref`.
      const ret = getStringFromWasm0(arg0, arg1)
      return ret
    },
    __wbindgen_cast_0000000000000004: function (arg0) {
      // Cast intrinsic for `U64 -> Externref`.
      const ret = BigInt.asUintN(64, arg0)
      return ret
    },
    __wbindgen_init_externref_table: function () {
      const table = wasm.__wbindgen_externrefs
      const offset = table.grow(4)
      table.set(0, undefined)
      table.set(offset + 0, undefined)
      table.set(offset + 1, null)
      table.set(offset + 2, true)
      table.set(offset + 3, false)
    }
  }
  return {
    __proto__: null,
    './oca_js_bg.js': import0
  }
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc()
  wasm.__wbindgen_externrefs.set(idx, obj)
  return idx
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`
  }
  if (type == 'string') {
    return `"${val}"`
  }
  if (type == 'symbol') {
    const description = val.description
    if (description == null) {
      return 'Symbol'
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == 'function') {
    const name = val.name
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`
    } else {
      return 'Function'
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = '['
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i])
    }
    debug += ']'
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')'
    } catch (_) {
      return 'Object'
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len)
}

let cachedDataViewMemory0 = null
function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer)
  }
  return cachedDataViewMemory0
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return decodeText(ptr, len)
}

let cachedUint8ArrayMemory0 = null
function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8ArrayMemory0
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    const idx = addToExternrefTable0(e)
    wasm.__wbindgen_exn_store(idx)
  }
}

function isLikeNone(x) {
  return x === undefined || x === null
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8ArrayMemory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len)
    const ret = cachedTextEncoder.encodeInto(arg, view)

    offset += ret.written
    ptr = realloc(ptr, len, offset, 1) >>> 0
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx)
  wasm.__externref_table_dealloc(idx)
  return value
}

let cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
})
cachedTextDecoder.decode()
const MAX_SAFARI_DECODE_BYTES = 2146435072
let numBytesDecoded = 0
function decodeText(ptr, len) {
  numBytesDecoded += len
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder('utf-8', {
      ignoreBOM: true,
      fatal: true
    })
    cachedTextDecoder.decode()
    numBytesDecoded = len
  }
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len)
  )
}

const cachedTextEncoder = new TextEncoder()

if (!('encodeInto' in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg)
    view.set(buf)
    return {
      read: arg.length,
      written: buf.length
    }
  }
}

let WASM_VECTOR_LEN = 0

let wasmModule, wasm
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports
  wasmModule = module
  cachedDataViewMemory0 = null
  cachedUint8ArrayMemory0 = null
  wasm.__wbindgen_start()
  return wasm
}

async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports)
      } catch (e) {
        const validResponse = module.ok && expectedResponseType(module.type)

        if (
          validResponse &&
          module.headers.get('Content-Type') !== 'application/wasm'
        ) {
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            e
          )
        } else {
          throw e
        }
      }
    }

    const bytes = await module.arrayBuffer()
    return await WebAssembly.instantiate(bytes, imports)
  } else {
    const instance = await WebAssembly.instantiate(module, imports)

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module }
    } else {
      return instance
    }
  }

  function expectedResponseType(type) {
    switch (type) {
      case 'basic':
      case 'cors':
      case 'default':
        return true
    }
    return false
  }
}

function initSync(module) {
  if (wasm !== undefined) return wasm

  if (module !== undefined) {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ;({ module } = module)
    } else {
      console.warn(
        'using deprecated parameters for `initSync()`; pass a single object instead'
      )
    }
  }

  const imports = __wbg_get_imports()
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module)
  }
  const instance = new WebAssembly.Instance(module, imports)
  return __wbg_finalize_init(instance, module)
}

async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm

  if (module_or_path !== undefined) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ;({ module_or_path } = module_or_path)
    } else {
      console.warn(
        'using deprecated parameters for the initialization function; pass a single object instead'
      )
    }
  }

  if (module_or_path === undefined) {
    module_or_path = new URL('oca_js_bg.wasm', import.meta.url)
  }
  const imports = __wbg_get_imports()

  if (
    typeof module_or_path === 'string' ||
    (typeof Request === 'function' && module_or_path instanceof Request) ||
    (typeof URL === 'function' && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path)
  }

  const { instance, module } = await __wbg_load(await module_or_path, imports)

  return __wbg_finalize_init(instance, module)
}

export { initSync, __wbg_init as default }
