import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Using JSON.stringify() is recommended but incompatible with Typescript (apparently)
    // This does NOT work with local dev and must be commented out
    '__APP_VERSION__': process.env.npm_package_version,
}});
