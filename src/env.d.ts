/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vite' {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
} 