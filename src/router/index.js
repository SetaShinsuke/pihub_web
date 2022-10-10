import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue";
import MangaDetail from "@/page/bm/MangaDetail.vue";
import MangaList from "@/page/bm/MangaList.vue";
import MangaReplies from "@/page/bm/MangaReplies.vue";
import XgpList from "@/page/games/XgpList.vue";

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
            path: '/manga/:mangaId/ep/:epId/replies',
            component: MangaReplies
        },
        {
            path: '/games/xgp',
            component: XgpList
        }
    ],
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    }
})

export default router