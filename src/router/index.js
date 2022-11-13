import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue";
import MangaDetail from "@/page/bm/MangaDetail.vue";
import MangaList from "@/page/bm/MangaList.vue";
import MangaReplies from "@/page/bm/MangaReplies.vue";
import XgpList from "@/page/games/XgpList.vue";
import LabNumOne from "@/page/lab/LabNumOne.vue";
import JavInspector from "@/page/lab/javs/JavInspector.vue";
import BookScanParser from "@/page/util_pages/BookScanParser.vue";
import DioMain from "@/page/dio/DioMain.vue";
import DioSearch from "@/page/dio/DioSearch.vue";
import DioAccountList from "@/page/dio/DioAccountList.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: MangaList
        },
        {
            path: '/hello',
            component: HelloWorld
        },
        {
            path: '/manga',
            component: MangaList
        },
        {
            path: '/manga/:mangaId',
            component: MangaDetail
        },
        {
            path: '/manga/:mangaId/ep/:epId/replies/:rootReplyId',
            component: MangaReplies
        },
        {
            path: '/manga/:mangaId/ep/:epId/replies',
            component: MangaReplies
        },
        {
            path: '/games/xgp',
            component: XgpList
        },
        {
            path: '/dio',
            component: DioMain
        },
        {
            path: '/dio/main',
            component: DioMain
        },
        {
            path: '/dio/search',
            component: DioSearch
        },
        {
            path: '/dio/accounts',
            component: DioAccountList
        },
        {
            path: '/utils/book_scan_parser',
            component: BookScanParser
        },
        {
            path: `/lab/lab_1`,
            component: LabNumOne
        },
        {
            path: `/jav/inspector`,
            component: JavInspector
        }
    ],
    scrollBehavior() {
        // always scroll to top
        return {top: 0}
    }
})

export default router