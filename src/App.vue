<template>
    <div id="app">
        <el-menu
                :default-active="activeIndex"
                :router="false"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                @select="handleSelect"
                style="margin-bottom: 20px"
        >
            <div style="text-align: center; height: 50px">
                <span style="font-weight: bold; line-height: 50px; vertical-align: middle">PIHUB</span>
            </div>
            <div class="flex-grow"/>
            <el-sub-menu index="1" :router="true">
                <template #title>Manga</template>
                <el-menu-item index="25539">全职猎人</el-menu-item>
                <el-menu-item index="30221">黑白无双</el-menu-item>
                <el-menu-item index="28376" disabled title="删了一干净">Chainsaw Man</el-menu-item>
                <el-menu-item index="25712">Level E</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2" disabled>Others</el-menu-item>
        </el-menu>
        <!--        <p>-->
        <!--            <router-link to="/manga">MangaList</router-link>-->
        <!--            <br/>-->
        <!--            <router-link to="/manga/25539/ep/267082/replies">Replies</router-link>-->
        <!--        </p>-->
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                activeIndex: '1'
            }
        },
        methods: {
            // keypath: 带有层级的完整key'
            handleSelect(key, keyPath) {
                console.log(`key: ${key}, keyPath: ${keyPath}`)
                this.$router.push(`/manga/${key}`)
            }
        },
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
        /*margin-top: 60px;*/
    }

    .flex-grow {
        flex-grow: 1;
    }

    .main_content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
    }
</style>
