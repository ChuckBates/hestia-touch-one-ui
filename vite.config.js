import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(() => ({
  base: './',
  build: {
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
