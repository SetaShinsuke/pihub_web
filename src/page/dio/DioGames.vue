<template>
    <h4>游戏列表</h4>

    <el-row style="margin-top: 20px">
        <el-col :span="24">
            <el-table :data="games" stripe border
                      size="default" table-layout="auto">
                <el-table-column label="ID" prop="id" align="center"/>
                <el-table-column label="封面" align="center">
                    <template #default="scope">
                        <el-image style="height: 120px" :src="scope.row.cover_url"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="SKU" prop="sku" align="center"/>
                <el-table-column label="名称" prop="name" align="center"/>
                <el-table-column label="原名" prop="org_name" align="center"/>
                <el-table-column label="平台" prop="platform" align="center"/>
                <el-table-column label="HL2B_ID" align="center">
                    <template #default="scope">
                        <el-link :href="`https://howlongtobeat.com/game/${scope.row.hl2b_id}`">HL2B</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button circle size="small" @click="onEditClick(scope.row)"
                                   icon="Edit"/>
                        <el-button circle size="small" @click="onDeleteClick(scope.row.id)"
                                   icon="Delete"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    import {GameApi} from "@/api.js";

    export default {
        name: "DioGames",
        data(){
            return{
                games: [],
                total: 0,
                sort: 2, // 0: 按时间, 2: 按热度
                pageSize: 20,
                currentPage: 1,
                loading: false
            }
        },
        methods:{
            loadGamesCount(){
                GameApi.getGames({count: true}).then(resp => {
                    this.total = resp.data.games
                })
            },
            loadGames(){
                console.log(`Load games, page: ${this.currentPage}`)
                this.loadGamesCount()
                GameApi.getGames({limit: this.pageSize, page: this.currentPage}).then(resp =>{
                    this.games = resp.data.games
                })
            },
            onEditClick(){
                alert('编辑')
            },
            onDeleteClick(){
                alert('删除')
            }
        },
        mounted(){
            this.loadGames()
        }
    }
</script>

<style scoped>

</style>