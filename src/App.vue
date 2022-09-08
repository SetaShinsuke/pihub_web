<template>
    <!--  <img alt="Vue logo" src="./assets/logo.png">-->
    <!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div id="app">
        <h1>Hello App!</h1>
        <p>
            <!--使用 router-link 组件进行导航 -->
            <!--通过传递 `to` 来指定链接 -->
            <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
            <router-link to="/hello">Go to Hello</router-link>
            <br/>
            <router-link to="/manga_list">Go to Manga List</router-link>
            <br/>
            <router-link to="/bm_ep/267082/replies">Replies</router-link>
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
        mounted() {
            window.addEventListener('hashchange', () => {
                var currentPath = window.location.hash.slice(1); // 获取输入的路由
                if (this.$router.path !== currentPath) {
                    this.$router.push(currentPath); // 动态跳转
                }
            }, false);
        }
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
