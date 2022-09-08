import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue";
import MangaDetail from "@/page/bm/MangaDetail.vue";
import MangaList from "@/page/bm/MangaList.vue";
import MangaReplies from "@/page/bm/MangaReplies.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/hello',
            component: HelloWorld
        },
        {
            path: '/mangaList',
            component: MangaList
        },
        {
            path: '/manga/:mangaId',
            component: MangaDetail
        },
        {
            path: '/bm_ep/:epId/replies',
            component: MangaReplies
        }
    ]
})

export default router