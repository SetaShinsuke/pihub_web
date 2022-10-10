<template>
    <p style="display: none">Manga Detail</p>
    <div class="manga_detail main-content" style="text-align: left">
        <div class="manga_info">
            <img :src="coverUrl" :alt="mangaName" class="manga_cover">
            <div class="manga_intro" style="text-align: left">
                <h1 style="color: #000000de; font-size: 28px;">{{mangaName}}</h1>
                <h2 style="color: #0000008f; font-size: 16px;">{{authors}}</h2>
                <div class="intro_text">{{mangaIntro}}</div>
            </div>
        </div>
    </div>
    <!-- 章节目录 -->
    <div class="main-content" style="text-align: center">
        <div class="ep_item" v-for="ep in epList" :key="ep.ep_id">
            <el-link class="ep_btn" :title="ep.ep_name"
                     :underline="false"
                     :href="getEpUrl(ep.ep_id)">
<!--                     @click="onEpBtnClick(ep.ep_id)">-->
                {{ep.ep_name}}
            </el-link>
        </div>
    </div>
</template>

<script>
    import {BmApi} from "@/api.js";

    export default {
        name: "MangaDetail",
        data() {
            return {
                mangaId: this.$route.params.mangaId,
                mangaName: 'Manga Name',
                mangaIntro: '',
                coverUrl: '',
                authors: [],
                epList: []
            }
        },
        methods: {
            loadMangaDetail() {
                BmApi.getMangaDetail(this.mangaId).then(resp => {
                    var info = resp.data.info
                    this.mangaId = info.comic_id
                    this.mangaName = info.title
                    this.coverUrl = `${info.cover_portrait}@310w.jpg`
                    this.authors = info.authors.join(', ')
                    this.mangaIntro = info.introduction
                    this.epList = resp.data.ep_list
                })
            },
            getEpUrl(epId) {
                var path = `/manga/${this.mangaId}/ep/${epId}/replies`
                return (window.location.href + '').replace(/\/#.*/, '/#' + path)
            },
            onEpBtnClick(epId) {
                this.$router.push(`/manga/${this.mangaId}/ep/${epId}/replies`)
            }
        },
        mounted() {
            this.loadMangaDetail()
        }
    }
</script>

<style scoped>
    .manga_info {
        padding: 20px;
    }

    .manga_cover {
        width: 168px;
        height: 224px;
        display: inline-block;
    }

    .manga_intro {
        display: inline-block;
        padding-left: 28px;
        vertical-align: top;
        font-weight: 400;
        max-width: 610px;
        overflow: hidden;
    }

    .intro_text {
        display: inline-block;
        color: #0000008f;
        font-size: 14px;
        height: 76px;
        vertical-align: top;
        overflow: hidden;
    }

    .ep_item {
        display: inline-block;
        width: 150px;
        max-width: 150px;
        margin: 10px;
    }

    .ep_btn {
        display: inline;
        width: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: left;
    }
</style>