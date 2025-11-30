/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PREFIX: string
  readonly VITE_API_URL: string
  readonly VITE_ADMIN_URL: string
  readonly VITE_ADMIN_PREFIX: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_API_CATEGORIES_ENDPOINT: string
  readonly VITE_API_SUBCATEGORIES_ENDPOINT: string
  readonly VITE_API_PRODUCTS_ENDPOINT: string
  readonly VITE_API_GOVERNORATES_ENDPOINT: string
  readonly VITE_API_CITIES_ENDPOINT: string
  readonly VITE_API_VENDORS_ENDPOINT: string
  readonly VITE_CATEGORIES_URL: string
  readonly VITE_PRODUCTS_URL: string
  readonly VITE_CART_URL: string
  readonly VITE_PROFILE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
