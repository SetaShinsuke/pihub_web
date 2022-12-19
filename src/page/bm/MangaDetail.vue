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
        <div v-show="!isInBatch">
            <div class="ep_item" style="display: inline-block" v-for="ep in epList" :key="ep.ep_id">
                <el-link class="ep_btn" :title="ep.ep_name"
                         :underline="false"
                         :href="getEpUrl(ep)">
                    {{ep.ep_name}}
                </el-link>
            </div>
        </div>
        <div v-show="isInBatch">
            <el-checkbox-group v-model="checkedEps" @change="handleCheck">
                <el-checkbox class="ep_item" v-for="ep in epList" border
                             :title="ep.ord" :key="ep.ep_id" :label="ep.short_title">
                    {{ep.ep_name}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
    <!-- 批量操作 -->
    <div class="do-batch" style="margin-bottom: 12px">
        <el-button round @click="handleBatchClick">{{isInBatch?"取消批量操作":"批量操作"}}</el-button>
        <el-button round @click="checkVolHeads">显示卷首</el-button>
        <el-button v-if="isInBatch"
                   round @click="setVolHeads('add')">添加卷首
        </el-button>
        <el-button v-if="isInBatch"
                   round @click="setVolHeads('set')">设置卷首
        </el-button>
    </div>
</template>

<script>
    import {HOST, MangaApi} from "@/api.js";
    import {ElMessage} from "element-plus";

    export default {
        name: "MangaDetail",
        data() {
            return {
                mangaId: this.$route.params.mangaId,
                mangaName: 'Manga Name',
                mangaIntro: '',
                coverUrl: '',
                authors: [],
                epList: [],
                checkedEps: [],
                isInBatch: false
            }
        },
        methods: {
            loadMangaDetail() {
                MangaApi.getMangaDetail(this.mangaId).then(resp => {
                    var info = resp.data.info
                    this.mangaId = info.comic_id
                    this.mangaName = info.title
                    this.coverUrl = `${info.cover_portrait}@310w.jpg`
                    this.authors = info.authors.join(', ')
                    this.mangaIntro = info.introduction
                    this.epList = resp.data.ep_list
                })
            },
            getEpUrl(ep) {
                var path = `/manga/${this.mangaId}/ep/${ep.ep_id}/replies?ep_name=${ep.ep_name}`
                return (window.location.href + '').replace(/\/#.*/, '/#' + path)
            },
            setVolHeads(_mode) {
                var mode = _mode
                if(this.checkedEps.length === 0){
                    mode = 'clear'
                }
                MangaApi.setVolHeads(this.mangaId, this.checkedEps, mode).then(resp => {
                    console.log(resp.data.vol_heads)
                    ElMessage({
                        message: '卷首已设置!',
                        type: 'success'
                    })
                })
            },
            handleBatchClick() {
                this.checkedEps = [];
                this.isInBatch = !this.isInBatch
            },
            handleCheck() {
                console.log(this.checkedEps)
            },
            checkVolHeads(){
                window.open(`${HOST}/api/bm/${this.mangaId}/vol_heads`, '_blank')
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
        /*display: inline-block;*/
        width: 150px;
        max-width: 150px;
        margin: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ep_btn {
        /*display: inline;*/
        width: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        float: left;
    }
</style>