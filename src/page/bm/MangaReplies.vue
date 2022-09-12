<template>

    <div class="print-console"
         v-if="showLog">
        <div>LOG:</div>
        <div>{{logMsg}}</div>
    </div>

    <el-backtop style="right: 5%; bottom: 5%; z-index: 500"/>
<!--    <el-backtop style="right: 5%; bottom: 5%; z-index: 500" target="#rootBody"/>-->
    <el-affix target=".main-content" :offset="80" style="display: none" @click="scrollReset">
        <el-button type="primary" style="display: inline; padding: 5px; background: dodgerblue">
            CurrentPage: {{currentPage}}
            <br/>
            IsAllLoaded: {{isAllLoaded()}}
        </el-button>
    </el-affix>
    <div class="main-content">
        <!--    <div id="wrapper" class="main-content" :style="{'overflow': 'hidden', 'height': bodyHeight, 'overflow': 'auto'}">-->
        <el-card id="repliesCard" class="box-card">
            <el-page-header @back="goBack">
                <template #content>
                    <span class="text-large font-600 mr-3"> 评论 </span>
                    <span class="text-sm mr-2"
                          style="color: var(--el-text-color-regular);font-size: 15px">共{{total}}条</span>
                    <!--                    <div style="display: inline-block" class="flex-grow"/>-->
                    <!--                    <div style="display: inline-block; flex-grow: 1"></div>-->
                </template>
            </el-page-header>
            <!-- 排序方式 -->
            <div class="order-dropdown">
                <el-dropdown @command="handleOrderSet" trigger="click">
                        <span class="el-dropdown-link">
                        排序<el-icon class="el-icon--right"><arrow-down/></el-icon>
                        </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="hot">按热度</el-dropdown-item>
                            <el-dropdown-item command="time">按时间</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <!-- 评论区 -->
            <ul class="scroll-container"
                v-if="hasMounted"
                v-infinite-scroll="loadNext"
                @scroll="onScroll"
                :infinite-scroll-immediate="false"
                :infinite-scroll-disabled="isAllLoaded() || loading || isIpad"
                :infinite-scroll-distance="0">
                <li v-for="reply in replies" :key="reply.rpId">
                    <el-divider/>
                    <div style="padding: 0 20px">
                        <div class="user-face">
                            <el-avatar :size="48" :src="reply.avatar"/>
                        </div>
                        <div class="reply-content">
                            <div class="user-name">{{reply.user_name}}</div>
                            <div class="reply_text">{{reply.content}}</div>
                            <div class="reply-time">
                                <span>{{reply.time}}</span>
                                <span class="like-icon">▲</span>
                                <span class="reply-like">{{reply.like}}</span>
                            </div>
                            <!-- 评论回复 -->
                            <div style="margin-top: 14px;">
                                <div v-for="sub in reply.replies" :key="sub.rpId"
                                     style="padding: 10px 0">
                                    <div style="position: absolute">
                                        <el-avatar :size="48" :src="sub.avatar"/>
                                    </div>
                                    <div class="reply-content" style="margin-left:64px;">
                                        <div class="user-name">{{sub.user_name}}</div>
                                        <div class="reply_text">{{sub.content}}</div>
                                        <div class="reply-time">
                                            <span>{{sub.time}}</span>
                                            <span class="like-icon">▲</span>
                                            <span class="reply-like">{{sub.like}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div>
                <el-divider v-if="isIpad"/>
                <div class="pagination" v-if="isIpad">
                    <el-pagination background layout="slot, prev, pager, next"
                                   :total="total_nest" :page-sizes="[10, 20, 50]"
                                   v-model:current-page="currentPage" v-model:page-size="pageSize"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {BmApi} from "@/api.js";
    import {scrollIntoView} from "seamless-scroll-polyfill";

    export default {
        name: "MangaReplies",
        data() {
            return {
                hasMounted: false,
                showLog: false,
                logMsg: '',
                epId: this.$route.params.epId,
                total: 0,
                total_nest: 0, // 楼中楼折叠后的层数
                sort: 2, // 0: 按时间, 2: 按热度
                pageSize: 20,
                currentPage: 1,
                loading: false,
                replies: []
            }
        },
        computed: {
            isIpad() {
                var isIpad = (navigator.platform === 'iPad')
                console.log(`isIpad: ${isIpad}`)
                return isIpad
                // return false
            },
            bodyHeight() {
                return document.body.offsetHeight
            },
            scrollEle() {
                return document.documentElement.id
            }
        },
        methods: {
            onScroll() {
                // onScroll(event) {
                //     console.log(event)
                this.printScrollInfo()
                // todo: 手动处理加载
            },
            printScrollInfo() {
                var element = document.querySelector('.scroll-container')
                var a = document.querySelector('#app')
                var b = document.body
                var d = document.documentElement
                let myTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                var text = `scrollHeight - clientHeight - scrollTop`
                text += `\nul:  ${element.scrollHeight} - ${element.clientHeight} - ${element.scrollTop}`
                text += `\napp: ${a.scrollHeight} - ${a.clientHeight} - ${a.scrollTop}`
                text += `\ndoc: ${d.scrollHeight} - ${d.clientHeight} - ${d.scrollTop}`
                text += `\nbdy: ${b.scrollHeight} - ${b.clientHeight} - ${b.scrollTop}`
                text += `\nbodyTop: ${b.scrollTop} - docTop: ${d.scrollTop}`
                text += `\ntop: ${myTop}`
                text += `\nall: ${this.isAllLoaded()} - loading: ${this.loading}`
                text += `\nbodyHeight: ${this.bodyHeight} - ${this.scrollEle}`
                this.printLog(text, true)
            },
            printLog(msg, doClear = false, doConsole = false) {
                if (doConsole) {
                    console.log(msg)
                }
                if (doClear) {
                    this.logMsg = msg + ''
                    return
                }
                this.logMsg += `\n${msg}`
            },
            loadReplies(page, doAppend = false) {
                console.log(`Load replies, page: ${page}`)
                this.printLog(`Load replies, page: ${page}`)
                if (page === 0) {
                    return
                }
                var data = {
                    page: page,
                    page_size: this.pageSize,
                    sort: this.sort
                }
                this.loading = true
                BmApi.getMangaReplies(this.epId, data).then(resp => {
                    this.total = resp.data.total
                    this.total_nest = resp.data.total_nest
                    if (doAppend) {
                        this.replies = this.replies.concat(resp.data.replies)
                    } else {
                        this.replies = resp.data.replies
                    }
                    this.loading = false
                })
            },
            loadNext() {
                // this.printScrollInfo()
                console.log(`Loading next...(current: ${this.currentPage})`)
                this.printLog(`Loading next...(current: ${this.currentPage})`)
                // this.replies = this.replies.concat(this.replies)
                if (this.isAllLoaded()) {
                    console.log(`已全部加载!`)
                    return
                }
                this.currentPage += 1
                this.loadReplies(this.currentPage, true)
            },
            isAllLoaded() {
                var maxPage = Math.ceil(this.total_nest / this.pageSize)
                if (maxPage > 0 && this.currentPage >= maxPage) {
                    this.currentPage = maxPage
                    return true
                }
                return false
            },
            scrollReset() {
                let cardEl = document.querySelector('#repliesCard')
                scrollIntoView(cardEl, {behavior: 'smooth'})
                // document.querySelector('#repliesCard').scrollIntoView({behavior: 'smooth'})
            },
            handleSizeChange(size) {
                this.pageSize = size
                this.currentPage = 1
                this.loadReplies(this.currentPage)
                this.scrollReset()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                this.loadReplies(this.currentPage)
                this.scrollReset()
            },
            handleOrderSet(cmd) {
                var setOrder = 0;
                switch (cmd) {
                    case 'hot':
                        setOrder = 2
                        break
                    case 'time':
                        setOrder = 0
                        break
                    default:
                        setOrder = 2

                }
                if (this.order !== setOrder) {
                    console.log(`Set order: ${cmd}`)
                    this.sort = setOrder
                    this.currentPage = 1
                    this.loadReplies(this.currentPage)
                }
            },
            goBack() {
                this.$router.go(-1)
            }
        },
        mounted() {
            this.hasMounted = true
            console.log(`Platform: ${navigator.platform}`)
            window.addEventListener('scroll', this.onScroll);
            this.loadReplies(1)
        },
        unmounted() {
            window.removeEventListener('scroll', this.onScroll);
        }
    }
</script>

<style scoped>
    .scroll-container {
        padding-left: 0;
        list-style-type: none;
        /*overflow: visible;*/
    }

    .order-dropdown {
        display: inline-block;
        position: absolute;
        right: 60px;
        top: 24px;
        padding: 12px;
        /*vertical-align: center;*/
        /*text-align: right;*/
        /*float: right;*/
    }

    .user-face {
        position: absolute;
        width: 82px;
    }

    .reply-content {
        text-align: left;
        position: relative;
        margin-left: 85px;
    }

    .user-name {
        color: #6d757a;
        font-size: 12px;
        line-height: 18px;
        font-weight: bold;
    }

    .reply_text {
        font-size: 14px;
        padding: 2px 0;
    }

    .reply-time {
        color: #99a2aa;
        font-size: 12px;
        line-height: 14px;
        margin-top: 6px;
    }

    .like-icon {
        margin-left: 4px;
        margin-right: 1px;
    }

    .reply-like {
    }
</style>