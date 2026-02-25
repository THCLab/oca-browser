/* tslint:disable */
/* eslint-disable */

interface OCABundle {
  v: string
  d: string
  capture_base: {
    type: string
    d: string
    attributes: { [attribute_name: string]: string }
  }
  overlays: {
    [key: string]: {
      type: string
      [property: string]: any
    }
  }
}

export enum AttributeType {
  Boolean = 0,
  Binary = 1,
  Text = 2,
  Numeric = 3,
  DateTime = 4
}

export enum Encoding {
  Base64 = 0,
  Utf8 = 1,
  Iso8859_1 = 2,
  Utf16 = 3,
  Utf16Be = 4,
  Utf16Le = 5
}

export function addAttributeToBundle(
  oca_bundle: any,
  attribute_name: string,
  attribute_type: string
): any

export function addOverlayToBundle(
  oca_bundle: any,
  overlay_name: string,
  overlay_type: string,
  overlay_properties: any
): any

export function buildFromOCAfile(ocafile_str: string, overlay_file: string): any

export function bundleToJSON(oca_bundle: any): string

export function createBundleWithAttributes(
  classification: string,
  attributes: any
): any

export function generateOCAfile(bundle: string, overlay_file: string): string

export function getBundleAttributes(oca_bundle: any): any

export function getBundleClassification(oca_bundle: any): string

export function getBundleDigest(oca_bundle: any): string

export function getBundleFlaggedAttributes(oca_bundle: any): any

export function getBundleType(oca_bundle: any): string

export function getBundleVersion(oca_bundle: any): string

export function getOverlayCount(oca_bundle: any): number

export function getOverlayNames(oca_bundle: any): any

export function hasOverlays(oca_bundle: any): boolean

export function init(): void

export function loadBundle(json_str: string, overlay_file: string): any

export function parseOCAfile(ocafile_str: string, overlay_file: string): any

export function removeAttributeFromBundle(
  oca_bundle: any,
  attribute_name: string
): any

export function removeOverlayFromBundle(
  oca_bundle: any,
  overlay_name: string
): any

export function validateBundleSemantics(bundle: any): any

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly addAttributeToBundle: (
    a: any,
    b: number,
    c: number,
    d: number,
    e: number
  ) => [number, number, number]
  readonly addOverlayToBundle: (
    a: any,
    b: number,
    c: number,
    d: number,
    e: number,
    f: any
  ) => [number, number, number]
  readonly buildFromOCAfile: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => [number, number, number]
  readonly bundleToJSON: (a: any) => [number, number, number, number]
  readonly createBundleWithAttributes: (
    a: number,
    b: number,
    c: any
  ) => [number, number, number]
  readonly generateOCAfile: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => [number, number, number, number]
  readonly getBundleAttributes: (a: any) => [number, number, number]
  readonly getBundleClassification: (a: any) => [number, number, number, number]
  readonly getBundleDigest: (a: any) => [number, number, number, number]
  readonly getBundleFlaggedAttributes: (a: any) => [number, number, number]
  readonly getBundleType: (a: any) => [number, number, number, number]
  readonly getBundleVersion: (a: any) => [number, number, number, number]
  readonly getOverlayCount: (a: any) => [number, number, number]
  readonly getOverlayNames: (a: any) => [number, number, number]
  readonly hasOverlays: (a: any) => [number, number, number]
  readonly init: () => void
  readonly loadBundle: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => [number, number, number]
  readonly parseOCAfile: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => [number, number, number]
  readonly removeAttributeFromBundle: (
    a: any,
    b: number,
    c: number
  ) => [number, number, number]
  readonly removeOverlayFromBundle: (
    a: any,
    b: number,
    c: number
  ) => [number, number, number]
  readonly validateBundleSemantics: (a: any) => [number, number, number]
  readonly __wbindgen_malloc: (a: number, b: number) => number
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => number
  readonly __wbindgen_exn_store: (a: number) => void
  readonly __externref_table_alloc: () => number
  readonly __wbindgen_externrefs: WebAssembly.Table
  readonly __wbindgen_free: (a: number, b: number, c: number) => void
  readonly __externref_table_dealloc: (a: number) => void
  readonly __wbindgen_start: () => void
}

export type SyncInitInput = BufferSource | WebAssembly.Module

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput
): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>
): Promise<InitOutput>
