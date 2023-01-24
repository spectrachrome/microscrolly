import vue from '@vitejs/plugin-vue2'

export default {
    build: {

        /** If you set esmExternals to true, this plugins assumes that 
             all external dependencies are ES modules */
        
        commonjsOptions: {
            esmExternals: true 
        },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js'
        }
    },
    plugins: [vue()]
}