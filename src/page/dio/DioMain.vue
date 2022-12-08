<template>
    <p>交易记录</p>

    <div style="text-align: right">
        <el-button id="btn-add" round type="primary" @click="onAddClick">添加交易记录</el-button>
    </div>

    <el-row id="acq-table-games" style="margin-top: 20px">
        <el-col :span="24">
            <el-table :data="acqs" stripe border
                      size="default" table-layout="auto">
                <el-table-column label="ID" prop="id" align="center"/>
                <el-table-column label="封面" align="center">
                    <template #default="scope">
                        <el-image style="height: 120px" fit="contain"
                                  :src="scope.row.item?.cover_url"/>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template #default="scope">
                        {{scope.row.item?.name}}
                    </template>
                </el-table-column>
                <el-table-column label="原名" align="center">
                    <template #default="scope">
                        {{scope.row.item?.org_name}}
                    </template>
                </el-table-column>
                <el-table-column label="平台" align="center">
                    <template #default="scope">
                        {{scope.row.item?.platform}}
                    </template>
                </el-table-column>
                <el-table-column label="账号" align="center">
                    <template #default="scope">
                        {{scope.row.account?.name}}
                    </template>
                </el-table-column>
                <el-table-column label="购买价格" align="center">
                    <template #default="scope">
                        {{$filters.toRmb(scope.row.acq_price.toFixed(2))}}
                    </template>
                </el-table-column>
                <el-table-column label="原价" align="center">
                    <template #default="scope">
                        {{$filters.toRmb(scope.row.org_price)}}
                    </template>
                </el-table-column>
                <el-table-column label="折扣" align="center">
                    <template #default="scope">
                        {{$filters.toRmb(scope.row.discount)}}
                        (-{{scope.row.discount_percent.toFixed(0)}}%)
                    </template>
                </el-table-column>
                <el-table-column label="入库日期" align="center">
                    <template #default="scope">
                        {{$filters.formatDate(scope.row.acq_date)}}
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
    <div class="pagination" style="margin-top: 20px; margin-bottom: 20px">
        <el-pagination background layout="slot, sizes, prev, pager, next, jumper"
                       :total="total" :page-sizes="[10, 20, 50]"
                       v-model:current-page="currentPage" v-model:page-size="pageSize"
                       :hide-on-single-page="false"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialogVisible" width="350px" :align-center="false">
        <template #header="{ titleClass }">
            <div class="my-header">
                <span :class="titleClass" style="color: #f56c6c;">警告</span>
            </div>
        </template>
        <span>确认移除记录 ( ID = {{deletingId}} ) 吗？</span>
        <template #footer>
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="onConfirmDelete" ref="btnConfirm">移除</el-button>
        </template>
    </el-dialog>

    <!-- 添加/编辑表单 -->
    <div class="edit-form">
        <el-dialog :title="getDialogTitle()" v-model="dialogVisible"
                   @open="onDialogOpen"
                   @closed="onDialogClose" :close-on-click-modal="false"
                   style="width: 80%; max-width: 800px">
            <el-form :model="acqForm" label-position="right" v-if="acqForm"
                     label-width="auto">
                <el-form-item label="ID:" v-if="acqForm.id">
                    <span>{{acqForm.id}}</span>
                </el-form-item>
                <el-form-item label="账号:">
                    <el-select v-model="acqForm.account_id" style="width: 60%" placeholder="选择账号">
                        <el-option
                                v-for="account in accounts"
                                :title="account.id"
                                :key="account.id"
                                :label="`${account.name} | ${account.platform}`"
                                :value="account.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型:">
                    <el-radio-group v-model="acqForm.item_type" size="small">
                        <el-radio label="Game"/>
                        <el-radio label="Book" disabled/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="游戏ID:">
                    <el-select v-model="acqForm.item.id" clearable placeholder="添加游戏"
                               :change="onGameSelect">
                        <el-option
                                v-for="game in games"
                                :title="game.name" :label="game.name"
                                :key="game.id" :value="game.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="游戏名称:">
                    <el-input v-model="acqForm.item.name" style="width: 80%" auto-complete="off"/>
                </el-form-item>
                <el-form-item label="SKU:">
                    <el-input v-model="acqForm.item.sku" style="width: 80%" auto-complete="off"/>
                </el-form-item>
                <el-form-item label="游戏平台:">
                    <el-input v-model="acqForm.item.platform" style="width: 80%"
                              auto-complete="off"/>
                </el-form-item>
                <el-form-item label="封面URL:">
                    <el-input v-model="acqForm.item.cover_url" style="width: 100%"
                              auto-complete="off"/>
                </el-form-item>
                <el-form-item label="HL2B_ID:">
                    <el-input v-model="acqForm.item.hl2b_id" style="width: 40%"
                              auto-complete="off"/>
                </el-form-item>
                <el-form-item label="获取方式:">
                    <el-select v-model="acqForm.acq_method" style="width: 60%" placeholder="获取方式">
                        <el-option
                                v-for="item in ['buy', 'free', 'vip', 'gift', 'send_away']"
                                :key="item" :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="获取来源:">
                    <el-input v-model="acqForm.acq_from" style="width: 100%"
                              auto-complete="off"/>
                </el-form-item>
                <el-form-item label="获取价格/原价:">
                    <el-row style="width: 100%" :gutter="10" justify="space-between">
                        <el-col :span="7">
                            <el-select v-model="currency" style="width: 100%" placeholder="币种">
                                <el-option
                                        v-for="item in ['CNY', 'HKD', 'USD', 'JPY', 'MXN']"
                                        :key="item" :value="item"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <el-input-number v-model="acqForm.acq_price"
                                             :controls="false"
                                             style="width: 100%;"/>
                        </el-col>
                        <el-col :span="1">
                            <span>/</span>
                        </el-col>
                        <el-col :span="8">
                            <el-input-number v-model="acqForm.org_price"
                                             :controls="false"
                                             style="width: 100%;"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="获取日期:">
                    <el-date-picker
                            v-model="acqForm.acq_date" type="date" placeholder="选择日期"/>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="acqForm.extra" auto-complete="off"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="onCancelClick">取消</el-button>
                <el-button type="primary" @click="onConfirmClick" ref="btnConfirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {AcqApi, DioApi, GameApi} from "@/api.js";
    import {ElMessage} from "element-plus";

    export default {
        name: "DioMain",
        data() {
            return {
                acqs: [],
                accounts: [],
                games: [],
                total: 0,
                orderBy: null, // 0: 按时间, 2: 按热度
                orderType: null,
                pageSize: 20,
                currentPage: 1,
                loading: false,
                deletingId: null,
                deleteDialogVisible: false,
                dialogVisible: false,
                emptyGame: {
                    id: null,
                    sku: '',
                    platform: '',
                    name: '',
                    org_name: '',
                    cover_url: '',
                    game_type: 'game',
                    hl2b_id: null
                },
                emptyAcq: {
                    id: null,
                    item_type: 'Game',
                    item: {...this.emptyGame},
                    account_id: null,
                    acq_method: null,
                    acq_from: null,
                    acq_price: null,
                    org_price: null,
                    extra: '',
                    format: 'digital',
                    region: null,
                    state: 'undecided'
                },
                acqForm: {...this.emptyAcq},
                currency: 'CNY'
            }
        },
        methods: {
            loadAcqCount() {
                AcqApi.getAcqs({count: true}).then(resp => {
                    this.total = resp.data.acquisitions
                })
            },
            loadAcquisitions() {
                console.log(`Load acquisitions, page: ${this.currentPage}`)
                this.loadAcqCount()
                AcqApi.getAcqs({limit: this.pageSize, page: this.currentPage}).then(resp => {
                    this.acqs = resp.data.acquisitions
                })
            },
            removeAcquisition() {
                AcqApi.removeAcq(this.deletingId).then(resp => {
                    console.log(resp.data)
                    if (resp.data.status === 'ok') {
                        ElMessage({
                            message: '记录已移除!',
                            type: 'success'
                        })
                        this.deleteDialogVisible = false
                        this.loadAcquisitions()
                    } else {
                        ElMessage({
                            message: '账号记录失败, 请重试!',
                            type: 'error'
                        })
                    }
                })
            },
            loadAccounts() {
                DioApi.getAccounts().then(resp => {
                    this.accounts = resp.data.accounts
                })
            },
            loadGames() {
                GameApi.getGames({all: true}).then(resp => {
                    this.games = resp.data.games
                })
            },
            onEditClick(acquisition) {
                console.log('Edit: ' + acquisition.id)
                this.acqForm = {...acquisition}
                this.dialogVisible = true
            },
            onGameSelect(gameId) {
                alert(gameId)
                this.games.forEach(game => {
                    if (game.id === gameId) {
                        this.acqForm.item = {...game}
                    }
                })
            },
            onAddClick() {
                this.acqForm = {...this.emptyAcq}
                this.dialogVisible = true
            },
            onDialogOpen() {
                this.loadAccounts()
                this.loadGames()
            },
            onDialogClose() {
                this.acqForm = {...this.emptyAcq}
            },
            onCancelClick() {
                this.dialogVisible = false
            },
            onConfirmClick() {
                console.log(this.acqForm)
                // todo: 算汇率
                // if (this.acqForm.id) {
                //     this.editAccount()
                // } else {
                //     this.addAccount()
                // }
            },
            onDeleteClick(id) {
                this.deletingId = id
                this.deleteDialogVisible = true
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                this.loadAcquisitions()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                console.log(`Current page change: ${this.currentPage}`)
                this.loadAcquisitions()
            },
            onConfirmDelete() {
                console.log('delete id ' + this.deletingId)
                this.removeAcquisition()
            },
            getDialogTitle() {
                var dialogTitle = '添加交易记录'
                if (this.acqForm && this.acqForm.id) {
                    dialogTitle = '编辑交易记录'
                }
                return dialogTitle
            }
        },
        mounted() {
            this.loadAcquisitions()
            this.onAddClick()
        }
    }
</script>

<style scoped>

</style>