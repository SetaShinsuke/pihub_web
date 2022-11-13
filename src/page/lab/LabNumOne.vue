<template>
    <el-button @click="loadJav">加载</el-button>
</template>

<script>
    import {JavApi} from "@/api.js";

    export default {
        name: "LabNumOne",
        data() {
            return {}
        },
        methods: {
            loadJav(){
                console.log('Loading jav...')
                JavApi.getSource('watchjavnow.xyz', 'k0k2gh37dnr8ndg').then(resp => {
                    console.log('Jav source loaded: ')
                    console.log(resp.data)
                })
            }
        }
    }
</script>

<style scoped>

</style>