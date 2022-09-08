const {defineConfig} = require('@vue/cli-service')
// 构建工具-配置
module.exports = defineConfig({
    transpileDependencies: true,
    // publicPath: '/', // default: '/'
    publicPath: getPublicPath(), // default: '/'
    outputDir: 'dist', // default: 'dist'
    assetsDir: 'assets', // default: ''
    indexPath: 'index.html', // default: 'index.html'
    // devServer: {
    //   proxy: 'http://192.168.50.96:9292'
    // }
})

console.log(`${getPublicPath()}`)

// 配置构建文件目录, 默认在根目录，打包的时候设定为当前目录
function getPublicPath() {
    console.log(`-------\n${process.env.NODE_ENV}\n--------`)
    switch (process.env.NODE_ENV) {
        case 'production':
            return '/pages'
        case 'dev':
            return '/'
        default:
            return '/'
    }
}
