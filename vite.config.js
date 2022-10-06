import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'
import themePreprocessorPlugin from '@zougt/vite-plugin-theme-preprocessor'

// import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    themePreprocessorPlugin({
      less: {
        // Location of each topic file
        multipleScopeVars: [
          {
            scopeName: 'theme-default',
            path: path.resolve('src/theme/default.less'),
          },
          // {
          //   scopeName: 'theme-dark',
          //   path: path.resolve('src/theme/dark.less'),
          // },
        ],
      },
    }),

    // // Components({
    // //   resolvers: [AntDesignVueResolver()],
    // // }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1da57a',
          'link-color': '#198d68',
        },
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
