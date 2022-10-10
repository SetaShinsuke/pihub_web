<template>
    <p>Manga List</p>
    <div class="main-content">
        <!-- 漫画列表 -->
        <div class="manga-list">
            <div class="manga-item" v-for="mangaItem in mangaList" :key="mangaItem.bmId">
                <el-card class="manga-card" :body-style="{padding: '0px'}">
                    <img class="manga-cover" :src="mangaItem.coverUrl" :alt="mangaItem.name">
                    <div style="padding: 14px">
                        <el-link :href="getStoreUrl(mangaItem.bmId)" target="_blank">
                            {{mangaItem.mangaName}}
                        </el-link>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MangaList",
        data() {
            return {
                mangaList: []
            }
        },
        methods: {
            loadMangas(page) {
                console.log('load page: ' + page)
                var seed = {
                    bmId: 25539,
                    mangaName: '全职猎人',
                    coverUrl: 'http://i0.hdslb.com/bfs/manga-static/63eb0d12867473f344186b0f7cb84a19d694d26e.jpg@310w.jpg'
                }
                this.mangaList = [seed, seed, seed]
            },
            getStoreUrl(bmId) {
                var path = `/manga/${bmId}`
                return (window.location.href + '').replace(/\/#.*/, '/#' + path)
            }
        },
        mounted() {
            this.loadMangas(1)
        }
    }
</script>

<style scoped>
    .manga-list {
        padding-left: 0;
        list-style-type: none;
    }

    .manga-item{
        display: inline-block;
        vertical-align: top;
        width: 48%;
        margin: 1%;
        max-width: 250px;
    }

    .manga-card{
        height: 0;
        padding-bottom: 160%;
    }

    .manga-cover {
        width: 100%;
    }
</style>