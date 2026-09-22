import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Modern-kiosk build (Option B): target a modern WebKit2 browser (surf/cog/etc.)
// loading the UI via file://.
// - base './'         : relative asset URLs for file://
// - nodePolyfills()   : provide Buffer/process/stream globals that mqtt v5 needs
//                       (webpack auto-provided these; Vite does not)
// - viteSingleFile()  : inline JS+CSS into index.html. A modern engine runs an
//                       INLINE module script over file:// fine (no external fetch,
//                       so no opaque-origin CORS block on the module).
export default defineConfig(() => ({
  base: './',
  build: {
    // keep the inline bundle un-minified for now so on-device errors are legible
    minify: false,
  },
  define: {
    MQTT_SERVER: JSON.stringify(process.env.MQTT_SERVER || 'localhost'),
  },
  plugins: [
    vue(),
    nodePolyfills(),
    viteSingleFile(),
  ],
  server: {
    host: true,
    port: 8080,
  },
}))
