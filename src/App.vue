<template>
    <!--  <img alt="Vue logo" src="./assets/logo.png">-->
    <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div id="app_in">
        <h1>Hello App!</h1>
        <p>
            <!--使用 router-link 组件进行导航 -->
            <!--通过传递 `to` 来指定链接 -->
            <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
            <router-link to="/hello">Go to Hello</router-link>
            <router-link to="/manga_detail">Go to Manga Detail</router-link>
        </p>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>
</template>

<script>
    // import HelloWorld from './components/HelloWorld.vue'

    export default {
        // name: 'App',
        // components: {
        //   HelloWorld
        // }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
