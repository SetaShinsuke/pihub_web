<template>
    <div class="parser-content">
        <p style="font-weight: bold;">Parser</p>
        <el-input
                ref="textInput"
                v-model="textContent"
                :autosize="{ minRows: 5}"
                type="textarea"
                placeholder="输入文字:"
                @keydown.enter.shift.exact.prevent="onParseClick"
        />
        <div style="display: block; margin-top: 10px;">
            <el-button
                    type="primary"
                    @click="onParseClick"
                    size="large"
                    plain
                    style="position: relative; right: 0; width: 120px"
            >Parse
            </el-button>
        </div>
        <h4>Result:</h4>
        <p class="text-result">{{parseResult}}</p>
    </div>
</template>

<script>
    import {copyToClipboard} from "@/assets/utils.js";
    import {ElNotification} from 'element-plus'

    export default {
        name: "BookScanParser",
        data() {
            return {
                parseResult: '',
                textContent: ''
                // textContent: '该书的主人公霍尔顿是个中学生，出生于富裕的中产阶级家庭。他虽只有16岁，但比常人高一头，整日穿着风衣，戴着猎帽，游游荡荡，不愿读书。他对学校里的一切——老师、同学、功课、球赛等等，全都腻烦透了，曾是学校击剑队队长，3次被学校开除。\n' +
                //     '又一个学期结束了，他又因5门功课中4门不及格被校方开除。他丝毫不感到难受。在和同房间的同学打了一架后，他深夜离开学校，回到纽约城，但他不敢贸然回家。当天深夜住进了一家小旅馆。他在旅馆里看到的都是些不三不四的人，有穿戴女装的男人，有相互喷水、喷酒的男女，他们寻欢作乐，忸怩作态，使霍尔顿感到恶心和惊讶。他无聊之极，便去夜总会厮混了一阵。回旅馆时，心里仍觉得十分烦闷，糊里糊涂答应电梯工毛里斯，让他叫来了一个妓女（十五块钱到第二天，五块钱一次）。 他一看到妓女又紧张害怕，给了妓女五块钱打发她走了，可妓女要十块钱。后来妓女找毛里斯来找事，毛里斯把霍尔顿打了一顿，拿走了他们要的另外五块钱。\n' +
                //     '第二天是星期天，霍尔顿上街游荡，遇见两个修女，捐了10块钱。后来他和女友萨丽去看了场戏，又去溜冰。看到萨丽那假情假义的样子，霍尔顿很不痛快，两人吵了一场，分了手。接着霍尔顿独自去看了场电影，又到酒吧里和一个老同学一起喝酒，喝得酩酊大醉。他走进厕所，把头伸进盥洗盆里用冷水浸了一阵，才清醒过来。可是走出酒吧后，被冷风一吹，他的头发都结了冰。他想到自己也许会因此患肺炎死去，永远见不着妹妹菲苾了，决定冒险回家和她诀别。\n' +
                //     '霍尔顿偷偷回到家里，幸好父母都出去玩了。他叫醒菲苾，向她诉说了自己的苦闷和理想。他对妹妹说，他将来要当一名“麦田里的守望者”：“有那么一群小孩子在一大块麦田里做游戏。几千几万个小孩子，附近没有一个人——没有一个大人，我是说——除了我。我呢，就在那混帐的悬崖边。我的职务是在那儿守望，要是有哪个孩子往悬崖边奔来，我就把他捉住——我是说孩子们都在狂奔，也不知道自己是在往哪儿跑。我得从什么地方出来，把他们捉住。我整天就干这样的事。我只想当个麦田里的守望者。”后来父母回来了，霍尔顿吓得躲进壁橱。等父母去卧室，他急忙溜出家门，到一个他尊敬的老师家中借宿。可是睡到半夜，他发觉这个老师有可能是个同性恋者，于是只好偷偷逃出来，到车站候车室过夜。\n' +
                //     '霍尔顿不想再回家，也不想再念书了，决定去西部谋生，装做一个又聋又哑的人，但他想在临走前再见妹妹一面，于是托人给她带去一张便条，约她到博物馆的艺术馆门边见面。过了约定时间好一阵，菲苾终于来了，可是拖着一只装满自己衣服的大箱子，她一定要跟哥哥一起去西部。最后，因对妹妹劝说无效，霍尔顿只好放弃西部之行，带她去动物园和公园玩了一阵。菲苾骑上旋转木马，高兴起来。这时下起了大雨，霍尔顿淋着雨坐在长椅上，看菲苾一圈圈转个不停，心里快乐极了，险些大叫大嚷起来，霍尔顿决定不出走了。\n' +
                //     '回家后不久，霍尔顿就生了场大病，又被送到一家疗养院里。出院后将被送到哪所学校，是不是想好好用功学习？霍尔顿对这一切一点儿也不感兴趣。 [2] '
            }
        },
        methods: {
            onParseClick() {
                this.parseResult = this.parseText(this.textContent)
                // this.textContent = result
                console.log('result: ' + this.parseResult)
                copyToClipboard(this.parseResult)
                this.$refs.textInput.focus();
                this.$refs.textInput.select();
                ElNotification({
                    title: '提示',
                    message: "文字已复制",
                    position: 'top-left',
                    duration: 2500,
                    offset: 100
                })
            },
            parseText(content) {
                return content.replaceAll(" ", "").replaceAll(",", "，")
                    .replaceAll("?", "？").replaceAll("\n\n", "\n")
                    .replaceAll("!", "！")
                    .replaceAll("(", "（").replaceAll(")", "）")
            }
        },
        mounted(){
            this.$refs.textInput.focus();
            this.$refs.textInput.select();
        }
    }
</script>

<style scoped>
    .parser-content {
        width: 98vw;
        max-width: 1200px;
        display: block;
        position: relative;
        text-align: left;
        padding-left: 1vw;
    }

    .text-result{
        line-height: 1.5;
        white-space: pre-wrap;
        font-size: 14px;
    }
</style>