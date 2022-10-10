<template>
    <!--    <el-backtop style="right: 5%; bottom: 5%; z-index: 500" target="#rootBody"/>-->
    <div id="app" class="wrapper">
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
            <el-sub-menu index="manga" :router="true">
                <template #title>Manga</template>
                <el-menu-item index="25539">全职猎人</el-menu-item>
                <el-menu-item index="30221">黑白无双</el-menu-item>
                <el-menu-item index="28376" disabled title="删了一干净">Chainsaw Man</el-menu-item>
                <el-menu-item index="25712">Level E</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="games" :router="true">
                <template #title>Games</template>
                <el-menu-item index="xgp">XGP</el-menu-item>
                <el-menu-item index="hl2b" disabled>HowLongToBeat</el-menu-item>
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
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                activeIndex: '1',
                logMsg: ''
            }
        },
        methods: {
            // keypath: 带有层级的完整key'
            handleSelect(key, keyPath) {
                console.log(`key: ${key}, keyPath: ${keyPath}`)
                switch (keyPath[0]) {
                    case 'manga':
                    case 'games':
                        this.$router.push(`/${keyPath[0]}/${key}`)
                        break
                }
            },
            onHashChange() {
                var currentPath = window.location.hash.slice(1); // 获取输入的路由
                if (this.$router.path !== currentPath) {
                    this.$router.push(currentPath) // 动态跳转
                }
            }
        },
        mounted() {
            window.addEventListener('hashchange', this.onhashchange, false)
        },
        unmounted() {
            window.removeEventListener('hashchange', this.onHashChange)
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
        /*height: 100%;*/
        /*overflow-y: scroll;*/
        /*overflow-y: visible;*/
        /*-webkit-overflow-scrolling: touch;*/
    }

    .flex-grow {
        flex-grow: 1;
    }

    .print-console {
        width: 40%;
        height: 200px;
        background: #2c3e50;
        opacity: 0.8;
        color: white;
        position: fixed;
        bottom: 3%;
        right: 3%;
        overflow: auto;
        padding: 20px;
        font-size: 16px;
        text-align: left;
        z-index: 100;
        white-space: pre;
    }

    .main-content {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 1%;
        padding-bottom: 20px;
        position: relative;
    }

</style>
