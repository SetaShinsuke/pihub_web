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
                        <!-- todo: 修改状态 -->
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
                   style="width: 90%; max-width: 700px">
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
                               @change="onGameSelect">
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
                <el-form-item label="游戏原名:">
                    <el-input v-model="acqForm.item.org_name" style="width: 80%" auto-complete="off"/>
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
                    <el-input v-model="acqForm.acq_from" style="width: 60%"
                              auto-complete="off"/>
                </el-form-item>
                <el-form-item label="价格/原价:">
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
                            <el-input-number :model-value="acqForm.acq_price/100"
                                             @change="(newVal, oldVal) => {acqForm.acq_price = newVal*100}"
                                             :controls="false" placeholder="获取价格"
                                             :precision="2" :step="1"
                                             style="width: 100%;"/>
                        </el-col>
                        <el-col :span="1">
                            <span>/</span>
                        </el-col>
                        <el-col :span="8">
                            <el-input-number :model-value="acqForm.org_price/100"
                                             @change="(newVal, oldVal) => {acqForm.org_price = newVal*100}"
                                             :controls="false" placeholder="原价"
                                             :precision="2" :step="1"
                                             style="width: 100%;"/>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="形式:">
                    <el-radio-group v-model="acqForm.media_format" size="small">
                        <el-radio label="digital" name="数字版"/>
                        <el-radio label="physical" name="实体版"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="区服:">
                    <el-select v-model="acqForm.region" placeholder="选择区服"
                               filterable allow-create default-first-option>
                        <el-option
                                v-for="item in ['NONE', 'CN', 'HK', 'JP', 'US', 'MX', 'AF'].reverse()"
                                :key="item" :value="item"
                        />
                    </el-select>
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
    import {AcqApi, DioApi, GameApi, UtilsApi} from "@/api.js";
    import {ElMessage, ElMessageBox} from "element-plus";

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
                    item: this.$utils.copyObject(this.emptyGame),
                    account_id: null,
                    acq_method: null,
                    acq_from: null,
                    acq_date: null,
                    acq_price: null,
                    org_price: null,
                    extra: '',
                    media_format: 'digital',
                    region: null,
                    state: 'undecided'
                },
                acqForm: this.$utils.copyObject(this.emptyAcq),
                currency: 'CNY'
            }
        },
        methods: {
            // region: APIs
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
            addAcquisition(args){
                AcqApi.addAcq(args).then(resp => {
                    console.log(resp.data)
                    if (resp.data.acquisition) {
                        ElMessage({
                            message: '记录已添加!',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.loadAcquisitions()
                    } else {
                        ElMessage({
                            message: '交易添加失败, 请重试!',
                            type: 'error'
                        })
                    }
                })
            },
            editAcquisitions(acqId, args){
                AcqApi.editAcq(acqId, args).then(resp => {
                    console.log(resp.data)
                    if (resp.data.acquisition) {
                        ElMessage({
                            message: '记录已修改!',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.loadAcquisitions()
                    } else {
                        ElMessage({
                            message: '交易修改失败, 请重试!',
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
            // endregion
            onEditClick(acquisition) {
                console.log('Edit: ' + acquisition.id)
                this.acqForm = this.$utils.copyObject(acquisition)
                this.dialogVisible = true
            },
            onGameSelect(gameId) {
                this.games.forEach(game => {
                    if (game.id === gameId) {
                        this.acqForm.item = this.$utils.copyObject(game)
                    }
                })
            },
            onAddClick() {
                this.acqForm = this.$utils.copyObject(this.emptyAcq)
                this.dialogVisible = true
            },
            onDialogOpen() {
                this.loadAccounts()
                this.loadGames()
            },
            onDialogClose() {
                this.acqForm = this.$utils.copyObject(this.emptyAcq)
                this.currency = 'CNY'
            },
            onCancelClick() {
                this.dialogVisible = false
            },
            onConfirmClick() {
                console.log(this.acqForm)
                // 1. 创建游戏；2.算汇率
                var callback = (resp)=>{
                    if(resp.data.game){
                        this.acqForm.item_id = resp.data.game.id
                        // 算汇率
                        var crcCallback = (rate) => {
                            this.acqForm.acq_price = parseInt(this.acqForm.acq_price / rate)
                            this.acqForm.org_price = parseInt(this.acqForm.org_price / rate)

                            if(this.acqForm.id){
                                this.editAcquisitions(this.acqForm.id, this.acqForm)
                            }else {
                                this.addAcquisition(this.acqForm)
                                // todo: routes 刷新掉 /new
                            }
                        }
                        if(this.currency ==='CNY'){
                            crcCallback(1)
                        }else {
                            UtilsApi.getExchangeRate().then(crcResp =>{
                                let rates = crcResp.data.rates
                                crcCallback(rates[this.currency])
                            })
                        }
                    }else {
                        ElMessageBox.alert('游戏编辑失败!', '提示', {
                            // if you want to disable its autofocus
                            // autofocus: false,
                            type: 'error',
                            confirmButtonText: '确定',
                        })
                    }
                }
                let gameId = this.acqForm.item?.id
                if(gameId){
                    GameApi.editGame(gameId, this.acqForm.item).then(callback)
                }else {
                    GameApi.addGame(this.acqForm.item).then(callback)
                }
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
            // this.onAddClick()
            if(/\/new/.test(this.$route.path)){
                this.onAddClick()
                // 根据 query 填选表单
                let query = this.$route.query
                if(query.sku) this.acqForm.item.sku = query.sku
                if(query.platform) this.acqForm.item.platform = query.platform
                if(query.name) this.acqForm.item.name = query.name
                if(query.org_name) this.acqForm.item.org_name = query.org_name
                if(query.account_id) this.acqForm.account_id = query.account_id
                if(query.acq_method) this.acqForm.acq_method = query.acq_method
                if(query.acq_from) this.acqForm.acq_from = query.acq_from
                if(query.acq_date) this.acqForm.acq_date = query.acq_date
                if(query.currency) this.currency = query.currency
                if(query.acq_price) this.acqForm.acq_price = query.acq_price
                if(query.org_price) this.acqForm.org_price = query.org_price
                if(query.extra) this.acqForm.extra = query.extra
                if(query.media_format) this.acqForm.media_format = query.media_format
                if(query.region) this.acqForm.region = query.region
                if(query.state) this.acqForm.state = query.state
            }
        },
        unmounted() {
            this.acqForm = null
            this.emptyAcq = null
            this.emptyGame = null
        }
    }
</script>

<style scoped>

</style>