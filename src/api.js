import axios from "axios";

let HOST = 'http://192.168.50.96:9292';

export {HOST}

let instance = axios.create({
    baseURL: HOST
})

export class BmApi {
    static getMangaReplies(epId) {
        return instance.request({
            method: 'GET',
            url: '/api/bm_reply?ep_id=' + epId
        })
    }

    static getMangaEps(mangaId) {
        return instance.request({
            method: 'GET',
            url: `/api/bm/${mangaId}`
        })
    }
}