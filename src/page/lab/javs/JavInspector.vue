<template>
    <h2>Jav Inspector</h2>
    <div style="max-width: 1200px; text-align: center">
        <el-descriptions
                class="margin-top"
                title="With border"
                :column="1">
            <template #extra>
                <el-button type="primary" @click="onDownloadClick">Download</el-button>
            </template>
            <el-descriptions-item label="标题">{{videoTitle}}</el-descriptions-item>
            <el-descriptions-item label="演员">{{actors.join(', ')}}</el-descriptions-item>
            <el-descriptions-item label="测试">
                <el-input v-model="testStr" placeholder="请输入"></el-input>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script>
    export default {
        name: "JavInspector",
        data() {
            return {
                videoUrl: null,
                videoTitle: '',
                actors: [],
                testStr: ''
            }
        },
        methods: {
            onDownloadClick() {
                // alert(`Down: ${this.videoUrl}`)
                alert(this.testStr)
            }
        },
        mounted() {
            // site, jav_id; title, actors
            console.log(`Query: `, this.$route.query)
        }
    }
</script>

<style scoped>

</style>