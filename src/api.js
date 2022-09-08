import axios from "axios";

let HOST = 'http://192.168.50.96:9292';

export {HOST}

let instance = axios.create({
    baseURL: HOST
})

export class BmApi {
    static getMangaReplies(epId, args) {
        let params = {}
        if (args) {
            ['page', 'page_size', 'sort'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'GET',
            url: '/api/bm_reply?ep_id=' + epId,
            params: params
        })
    }

    static getMangaEps(mangaId) {
        return instance.request({
            method: 'GET',
            url: `/api/bm/${mangaId}`
        })
    }
}