<template>
    <div style="text-align: center; min-height: 900px">
        <el-radio-group v-model="platform" size="large"
                        @change="onLabelChange"
                        fill="#107C10">
            <el-radio-button label="Console"/>
            <el-radio-button label="PC"/>
            <el-radio-button label="Cloud"/>
        </el-radio-group>
        <div class="xgp-channels" style="text-align: left;"
             v-loading.fullscreen.lock="loading"
        >
            <!--            <div class="loading-wrapper"-->
            <!--                 v-loading="loading"-->
            <!--                 element-loading-background="rgba(122, 122, 122, 0)"-->
            <!--            >-->
            <!--            </div>-->
            <div class="channel-item" v-for="channel in channels" :key="channel.info.name">
                <div class="list-title">
                    <h4 class="list-title-text xbox-green">{{channel.info.title}}</h4>
                </div>
                <div class="channel-content">
                    <div class="game-item" v-for="game in channel['games']" :key="game.id">
                        <el-card class="game-card" :body-style="{padding: '0px'}">
                            <img :src="game.images.cover.url" class="game-cover"/>
                            <div style="padding: 14px">
                                <el-link :href="getStoreUrl(game)" target="_blank">{{game.title}}</el-link>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {GameApi} from "@/api.js";

    export default {
        name: "XgpList",
        data() {
            return {
                presetChannels: ['leaving_soon', 'recently_added', 'coming_soon', 'day_one_releases'],
                platform: 'Console',
                channels: [],
                loading: false
            }
        },
        computed: {},
        methods: {
            loadGames() {
                this.loading = true
                let channelsStr = this.presetChannels.join(',')
                let platform = this.platform.toLowerCase()
                GameApi.getXgpLists(channelsStr, platform).then(resp => {
                        this.loading = false
                        this.channels = resp.data.channels
                    }
                )
            },
            onLabelChange(label) {
                console.log(`Change label: ${label}`)
                this.loadGames()
            },
            getStoreUrl(gameDetail) {
                // 微软商店地址
                var storeName = gameDetail.title.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/gi, '')
                var storeUrl = `https://www.xbox.com/en-us/games/store/${storeName}/${gameDetail.id}`
                return storeUrl
            }
        },
        mounted() {
            this.loadGames()
        }
    }
</script>

<style scoped>
    .list-title {
        text-align: left;
        padding: 0 20px 20px 20px
    }

    .list-title-text {

    }

    .xbox-green {
        color: #107C10
    }

    .loading-wrapper {
        height: 500px;
        width: 800px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
    }

    .game-item {
        display: inline-block;
        vertical-align: top;
    }

    .game-card {
        width: 200px;
        height: 380px;
        margin: 10px;
    }

    .game-cover {
        width: 100%;
        display: block;
    }
</style>