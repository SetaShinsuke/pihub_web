<template>
    <h1 style="margin-top: 30px">订阅漫画</h1>
    <el-drawer
            class="search-drawer"
            v-model="isSearching"
            title="搜索漫画"
            direction="ttb"
            :close-on-press-escape="false"
            :before-close="onSearchClose"
            @opened="onDrawerOpen"
            size="600px">
        <!--todo: 按 bm_id 搜索-->
        <div>
            <el-input
                    ref="searchInput"
                    v-model="searchText"
                    class="search-input"
                    @keyup.enter="onSearchClick"
                    placeholder="请输入关键词"
                    clearable>
                <template #append>
                    <el-button icon="Search" @click="onSearchClick"/>
                </template>
            </el-input>
        </div>
        <!-- 搜索列表 -->
        <div class="search-result">
            <div class="manga-item" v-for="mangaItem in searchResults" :key="mangaItem.bm_id">
                <el-card class="manga-card" :body-style="{padding: '0px'}"
                         v-if="mangaItem.bm_id > 0">
                    <div class="bm-item-content">
                        <img class="manga-cover" :src="mangaItem.cover_portrait"
                             :alt="mangaItem.title">
                        <el-link class="manga-card-title"
                                 :href="getStoreUrl(mangaItem.bm_id)"
                                 :title="mangaItem.title"
                                 target="_blank">
                            {{mangaItem.title.substring(0, 9)}}
                        </el-link>
                        <el-popconfirm title="确定添加到订阅吗?"
                                       width="200px"
                                       confirm-button-type="primary"
                                       @confirm="onSubscribe(mangaItem, true)">
                            <template #reference>
                                <el-icon class="option-icon">
                                    <Plus/>
                                </el-icon>
                            </template>
                        </el-popconfirm>
                    </div>
                </el-card>
            </div>
        </div>
    </el-drawer>
    <div class="main-content">
        <!-- 漫画列表 -->
        <div class="manga-list" style="text-align: left">
            <div class="manga-item" v-for="mangaItem in mangaList" :key="mangaItem.bm_id">
                <el-card class="manga-card" :body-style="{padding: '0px'}"
                         v-if="mangaItem.bm_id > 0">
                    <div class="bm-item-content">
                        <img class="manga-cover" :src="mangaItem.cover" :alt="mangaItem.title">
                        <el-link class="manga-card-title"
                                 :href="getStoreUrl(mangaItem.bm_id)"
                                 :title="mangaItem.title"
                                 target="_blank">
                            {{mangaItem.title.substring(0, 9)}}
                        </el-link>
                        <el-popconfirm title="确定取消订阅吗?"
                                       width="200px"
                                       confirm-button-type="danger"
                                       @confirm="onSubscribe(mangaItem, false)">
                            <template #reference>
                                <el-icon class="option-icon">
                                    <MoreFilled/>
                                </el-icon>
                            </template>
                        </el-popconfirm>
                    </div>
                </el-card>
                <!-- 添加 -->
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
    import {ElMessageBox, ElMessage} from 'element-plus'

    export default {
        name: "MangaList",
        data() {
            return {
                isSearching: false,
                mangaList: [],
                searchText: '',
                searchResults: []
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
            onSubscribe(manga, doSubscribe){
                console.log(`${doSubscribe?"S":"Uns"}ubcribe manga: ${manga.title}`)
                // todo: 订阅/退订
                var args = {}
                if(doSubscribe){
                    args = {
                        title: manga.title,
                        cover: manga.cover_portrait,
                        authors: manga.authors,
                    }
                }
                args['do_subscribe'] = doSubscribe
                MangaApi.subscribeBm(manga.bm_id, args).then(resp => {
                    console.log(`Subscribed size: ${resp.data.manga}`)
                    this.loadMangas(1)
                    this.isSearching = false
                    ElMessage({
                        message: `${doSubscribe?"订阅":"退订"}成功!`,
                        type: 'success',
                    })
                })
            },
            onAddClick() {
                // this.$router.push(`/manga/search`)
                this.isSearching = true
            },
            onDrawerOpen(){
                this.$refs.searchInput.focus()
            },
            search(keyword) {
                console.log(`Search: ${keyword}`)
                MangaApi.searchManga(keyword).then(resp => {
                    // console.log(resp.data.list)
                    this.searchResults = resp.data.list
                })
            },
            onSearchClick() {
                this.$refs.searchInput.focus()
                this.$refs.searchInput.select()
                this.search(this.searchText)
            },
            onSearchClose(done) {
                // todo: 检查输入框是否为空
                ElMessageBox.confirm('确定关闭搜索吗?',
                    {
                        confirmButtonText: '关闭',
                        cancelButtonText: '取消',
                    }).then(() => {
                    done()
                }).catch(() => {
                    // catch error
                })
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
        padding-bottom: 162%;
        text-align: left;
        position: relative;
    }

    .manga-card-title {
        font-size: 14px;
        margin: 3% 6% 3% 6%;
        /*max-lines: 1;*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #000000de;
    }

    .manga-cover {
        width: 100%;
    }

    .card-options {
        padding-right: 8px;
        text-align: right;
        color: #00000050;
        font-size: 20px;
    }

    .option-icon {
        color: #00000077;
        font-size: 16px;
        cursor: pointer;
        position: absolute;
        right: 6px;
        bottom: 4px;
        padding: 4px;
    }

    .search-input {
        width: 80%;
        max-width: 400px;
    }

    .search-result {
        text-align: left;
        padding-top: 20px;
    }
</style>