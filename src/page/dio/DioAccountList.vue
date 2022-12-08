<template>
    <div class="card-root">
        <!--        <el-card shadow="never" class="accounts-card">-->
        <el-page-header @back="goBack" v-if="false">
            <template #content>
                <div>
                    <span class="text-large font-600 mr-3">账号列表</span>
                </div>
            </template>
        </el-page-header>

        <h4>账号列表</h4>

        <div style="text-align: right">
            <el-button round type="primary" @click="onAddClick">添加账号</el-button>
        </div>

        <el-row style="margin-top: 20px">
            <el-col :span="24">
                <el-table :data="accounts" stripe border
                          size="default" table-layout="auto">
                    <el-table-column label="ID" prop="id" align="center"/>
                    <el-table-column label="UID" prop="uid" align="center"/>
                    <el-table-column label="名称" prop="name" align="center"/>
                    <el-table-column label="平台" prop="platform" align="center"/>
                    <el-table-column label="优先级" prop="alt_level" align="center"/>
                    <el-table-column v-if="false" label="登录名" prop="login_name" align="center"/>
                    <el-table-column label="备注" prop="extra" align="center"/>
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
        <!--        </el-card>-->
    </div>

    <el-dialog v-model="isDeleteDialogVisible" width="350px" :align-center="false">
        <template #header="{ titleClass }">
            <div class="my-header">
                <span :class="titleClass" style="color: #f56c6c;">警告</span>
            </div>
        </template>
        <span>确认移除账号 ( ID = {{deletingId}} ) 吗？</span>
        <template #footer>
            <el-button @click="isDeleteDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="onConfirmDelete" ref="btnConfirm">移除</el-button>
        </template>
    </el-dialog>

    <el-dialog :title="getDialogTitle()" v-model="isDialogVisible"
               @close="onDialogClose" :close-on-click-modal="false"
               style="width: 80%; max-width: 400px">
        <el-form :model="accountForm" label-position="right" v-if="accountForm" label-width="70px">
            <el-form-item label="ID:" v-if="accountForm.id">
                <span>{{accountForm.id}}</span>
            </el-form-item>
            <el-form-item label="UID:">
                <el-input v-model="accountForm.uid" style="width: 60%" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="Name:">
                <el-input v-model="accountForm.name" style="width: 60%" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="Platform:">
                <el-input v-model="accountForm.platform" style="width: 60%" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="Alt_level:">
                <el-input v-model="accountForm.alt_level" style="width: 30%" auto-complete="off"
                          type="number"
                          step="1"/>
            </el-form-item>
            <el-form-item label="备注:">
                <el-input v-model="accountForm.extra" auto-complete="off"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="onCancelClick">取消</el-button>
            <el-button type="primary" @click="onConfirmClick" ref="btnConfirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import {DioApi} from "@/api.js";
    import {ElMessage} from 'element-plus'

    export default {
        name: "DioAccountList",
        data() {
            return {
                accounts: [],
                emptyAccount: {
                    id: null,
                    uid: '',
                    name: '',
                    platform: '',
                    alt_level: 0,
                    extra: ''
                },
                isDialogVisible: false,
                accountForm: {...this.emptyAccount},
                isDeleteDialogVisible: false,
                deletingId: null
            }
        },
        methods: {
            loadAccounts() {
                DioApi.getAccounts().then(resp => {
                    this.accounts = resp.data.accounts
                })
            },
            addAccount() {
                DioApi.addAccount(this.accountForm).then(resp => {
                    console.log(resp.data)
                    if (resp.data.account) {
                        ElMessage({
                            message: '账号已添加!',
                            type: 'success'
                        })
                        this.isDialogVisible = false
                        this.loadAccounts()
                    } else {
                        ElMessage({
                            message: '账号添加失败, 请重试!',
                            type: 'error'
                        })
                    }
                })
            },
            editAccount() {
                DioApi.editAccount(this.accountForm.id, this.accountForm).then(resp => {
                    console.log(resp.data)
                    if (resp.data.account) {
                        ElMessage({
                            message: '账号已修改!',
                            type: 'success'
                        })
                        this.isDialogVisible = false
                        this.loadAccounts()
                    } else {
                        ElMessage({
                            message: '账号修改失败, 请重试!',
                            type: 'error'
                        })
                    }
                })
            },
            removeAccount(){
                DioApi.removeAccount(this.deletingId).then(resp => {
                    console.log(resp.data)
                    if (resp.data.status === 'ok') {
                        ElMessage({
                            message: '账号已移除!',
                            type: 'success'
                        })
                        this.isDeleteDialogVisible = false
                        this.loadAccounts()
                    } else {
                        ElMessage({
                            message: '账号移除失败, 请重试!',
                            type: 'error'
                        })
                    }
                })
            },
            getDialogTitle() {
                var dialogTitle = '添加账号'
                if (this.accountForm && this.accountForm.id) {
                    dialogTitle = '编辑账号'
                }
                return dialogTitle
            },
            onDeleteClick(id) {
                this.deletingId = id
                this.isDeleteDialogVisible = true
            },
            onConfirmDelete() {
                console.log('delete id ' + this.deletingId)
                this.removeAccount()
            },
            onEditClick(account) {
                console.log(account)
                this.accountForm = {...account}
                this.isDialogVisible = true
            },
            onAddClick() {
                this.accountForm = {...this.emptyAccount}
                this.isDialogVisible = true
            },
            onDialogClose() {
                this.accountForm = {...this.emptyAccount}
            },
            onCancelClick() {
                this.isDialogVisible = false
            },
            onConfirmClick() {
                if (this.accountForm.id) {
                    this.editAccount()
                } else {
                    this.addAccount()
                }
            }
        },
        mounted() {
            this.loadAccounts()
        }
    }
</script>

<style scoped>
    .card-root {
        width: 98%;
        margin: 0 auto;
        padding-bottom: 20px;
        position: relative;
    }

</style>