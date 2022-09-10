<template>
    <el-backtop :right="100" :bottom="100"/>
    <el-affix target=".main_content" :offset="80">
        <el-button type="primary" style="display: inline">CurrentPage: {{currentPage}}</el-button>
    </el-affix>
    <div class="main_content">
        <el-card class="box-card">
            <el-page-header @back="goBack">
                <template #content>
                    <span class="text-large font-600 mr-3"> 评论 </span>
                    <span class="text-sm mr-2"
                          style="color: var(--el-text-color-regular);font-size: 15px">共{{total}}条</span>
                </template>
            </el-page-header>
            <ul v-infinite-scroll="loadNext"
                :infinite-scroll-immediate="false"
                :infinite-scroll-disabled="isAllLoaded()"
                style="list-style-type: none">
                <li v-for="reply in replies" :key="reply.rpId" style="padding: 0 20px">
                    <el-divider/>
                    <div class="user_face">
                        <el-avatar :size="48" :src="reply.avatar"/>
                    </div>
                    <div class="reply_content">
                        <div class="user_name">{{reply.user_name}}</div>
                        <div class="reply_text">{{reply.content}}</div>
                        <div class="reply_time">{{reply.time}}</div>
                        <!-- 评论回复 -->
                        <div style="margin-top: 14px;">
                            <div v-for="sub in reply.replies" :key="sub.rpId"
                                 style="padding: 10px 0">
                                <div style="position: absolute">
                                    <el-avatar :size="48" :src="sub.avatar"/>
                                </div>
                                <div class="reply_content" style="margin-left:64px;">
                                    <div class="user_name">{{sub.user_name}}</div>
                                    <div class="reply_text">{{sub.content}}</div>
                                    <div class="reply_time">{{reply.time}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <!--            <el-divider style="display: none"/>-->
            <!--            <div class="pagination" style="display: none">-->
            <!--                <el-pagination background layout="slot, prev, pager, next"-->
            <!--                               :total="total" :page-sizes="[10, 20, 50]"-->
            <!--                               v-model:current-page="currentPage" v-model:page-size="pageSize"-->
            <!--                               @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
            <!--                >-->
            <!--                </el-pagination>-->
            <!--            </div>-->
        </el-card>
    </div>
</template>

<script>
    import {BmApi} from "@/api.js";

    export default {
        name: "MangaReplies",
        data() {
            return {
                epId: this.$route.params.epId,
                total: 0,
                sort: 2, // 0: 按时间, 2: 按热度
                pageSize: 20,
                currentPage: 1,
                replies: []
            }
        },
        methods: {
            loadReplies(page, doAppend = false) {
                console.log(`Load replies, page: ${page}`)
                if (page === 0) {
                    return
                }
                var data = {
                    page: page,
                    page_size: this.pageSize,
                    sort: this.sort
                }
                BmApi.getMangaReplies(this.epId, data).then(resp => {
                    this.total = resp.data.total
                    if (doAppend) {
                        this.replies = this.replies.concat(resp.data.replies)
                    } else {
                        this.replies = resp.data.replies
                    }
                })
            },
            loadNext() {
                console.log(`Loading next...(current: ${this.currentPage})`)
                // this.replies = this.replies.concat(this.replies)
                if (this.isAllLoaded()) {
                    console.log(`已全部加载!`)
                    return
                }
                this.currentPage += 1
                this.loadReplies(this.currentPage, true)
            },
            isAllLoaded() {
                var maxPage = Math.ceil(this.total / this.pageSize)
                if (this.currentPage >= maxPage) {
                    this.currentPage = maxPage
                    return true
                }
                return false
            },
            // handleSizeChange(size) {
            //     this.pageSize = size
            //     this.currentPage = 1
            //     this.loadReplies(this.currentPage)
            // },
            // handleCurrentChange(currentPage) {
            //     this.currentPage = currentPage
            //     this.loadReplies(this.currentPage)
            // },
            goBack() {
                this.$router.go(-1)
            }
        },
        mounted() {
            this.loadReplies(1)
        }
    }
</script>

<style scoped>
    .user_face {
        position: absolute;
        width: 82px;
    }

    .reply_content {
        text-align: left;
        position: relative;
        margin-left: 85px;
    }

    .user_name {
        color: #6d757a;
        font-size: 12px;
        line-height: 18px;
        font-weight: bold;
    }

    .reply_text {
        font-size: 14px;
        padding: 2px 0;
    }

    .reply_time {
        color: #99a2aa;
        font-size: 12px;
        line-height: 14px;
        margin-top: 6px;
    }
</style>