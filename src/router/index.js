import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue";
import MangaDetail from "@/page/bm/MangaDetail.vue";
// import MangaReplies from "@/page/bm/MangaReplies.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/hello',
            component: HelloWorld
        },
        {
            path: '/manga_detail',
            component: MangaDetail
        // },
        // {
        //     path: '/manga/:manga_id',
        //     component: MangaDetail
        // },
        // {
        //     path: '/bm_ep/:ep_id/replies',
        //     component: MangaReplies
        }
    ]
})

export default router