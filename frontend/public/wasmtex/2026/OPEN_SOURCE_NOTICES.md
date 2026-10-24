# LaTeX preview engine notices

ResumeIQ uses the WasmTex host SDK to compile LaTeX in the browser. Resume source is compiled locally in the user's browser; only the compiler and TeX Live package assets are fetched over the network.

## WasmTex SDK

The WasmTex host SDK is MIT licensed. Its license and third-party notices are included beside this file as `WASMTEX-LICENSE` and `THIRD_PARTY_NOTICES.md`. The SDK source revision used by this build is [9c9e1cb07d88e2a94651a603ebd68ad275d7c951](https://github.com/corca-ai/wasmtex/tree/9c9e1cb07d88e2a94651a603ebd68ad275d7c951).

## TeX Live 2026 pdfTeX engine

This directory contains the hash-verified WasmTex TeX Live 2026 engine release `2026-ba0b219814ec7f79`. Engine-specific notices and the release manifest are included here. The pdfTeX engine has GPL-2.0-only terms and additional linked-component notices; see `THIRD_PARTY_NOTICES.md`, `LICENSE-MANIFEST.json`, and the `LICENSES` directory.

The [complete corresponding source archive](https://github.com/corca-ai/wasmtex/releases/download/engine-2026-ba0b219814ec7f79/wasmtex-2026-ba0b219814ec7f79-source.tar.xz) and its SHA-256 receipt are available from the WasmTex release. Engine build receipts and file hashes are in this directory.

TeX Live package and font files are resolved from the compiler's immutable TeX Live 2026 mirror and remain subject to their respective upstream licenses.

## PDF preview renderer

The compiled PDF is rendered with Mozilla PDF.js, licensed under Apache-2.0. Its license is included as `PDFJS-LICENSE`.
