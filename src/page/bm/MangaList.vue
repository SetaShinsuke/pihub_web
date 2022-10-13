<template>
    <h1 style="margin-top: 30px">订阅漫画</h1>
    <div class="main-content">
        <!-- 漫画列表 -->
        <div class="manga-list" style="text-align: left">
            <div class="manga-item" v-for="mangaItem in mangaList" :key="mangaItem.bm_id">
                <el-card class="manga-card" :body-style="{padding: '0px'}"
                         v-if="mangaItem.bm_id > 0">
                    <div class="bm-item-content">
                        <img class="manga-cover" :src="mangaItem.cover" :alt="mangaItem.title">
                        <div style="padding: 14px">
                            <el-link :href="getStoreUrl(mangaItem.bm_id)" target="_blank">
                                {{mangaItem.title}}
                            </el-link>
                        </div>
                    </div>
                </el-card>
                <div class="add-item manga-card" v-if="mangaItem.bm_id === -1"
                     style="text-align: center;">
                    <el-icon id="plus-icon" :size="100" color="#bbbbbb"
                             style="margin-top: 50%; cursor: pointer" @click="onAddClick">
                        <CirclePlus/>
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {MangaApi} from "@/api.js";

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
                MangaApi.getSubscribedMangas().then(resp => {
                    this.mangaList = resp.data.mangas
                    this.mangaList.push({'bm_id': -1})
                    console.log(this.mangaList)
                })
            },
            getStoreUrl(bmId) {
                var path = `/manga/${bmId}`
                return (window.location.href + '').replace(/\/#.*/, '/#' + path)
            },
            onAddClick(){
                // (window.location.href + '').replace(/\/#.*/, '/#/manga/search')
                this.$router.push(`/manga/search`)
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

    .manga-item {
        display: inline-block;
        vertical-align: top;
        width: 48%;
        margin: 1%;
        max-width: 168px;
    }

    .manga-card {
        height: 0;
        padding-bottom: 160%;
    }

    .manga-cover {
        width: 100%;
    }
</style>