<template>
    <p>Manga Replies</p>
    <div v-for="reply in replies" :key="reply.rpId">
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
                <div v-for="sub in reply.replies" :key="sub.rpId" style="padding: 10px 0">
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
                replies: []
            }
        },
        methods: {
            loadReplies(page) {
                var data = {
                    page: page,
                    page_size: this.pageSize,
                    sort: this.sort
                }
                BmApi.getMangaReplies(this.epId, data).then(resp => {
                    this.total = resp.data.total
                    this.replies = resp.data.replies
                })
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

    .reply_time{
        color: #99a2aa;
        font-size: 12px;
        line-height: 14px;
        margin-top: 6px;
    }
</style>