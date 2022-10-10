import axios from "axios";

// let HOST = 'http://192.168.50.166:9292';
let HOST = getHost();

export {HOST}

let instance = axios.create({
    baseURL: HOST
})

function getHost() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return window.location.orgin
        case 'dev':
            return 'http://192.168.50.166:9292'
        default:
            return 'http://192.168.50.166:9292'
    }
}

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

    static getMangaDetail(mangaId) {
        return instance.request({
            method: 'GET',
            url: `/api/bm/${mangaId}`
        })
    }
}

export class GameApi {
    static getXgpLists(channels, platform, withDesc = false){
        let params = {
            channels: channels,
            platform: platform,
            with_desc: withDesc
        }
        return instance.request({
            method: 'GET',
            url: '/api/xgp/list',
            params: params
        })
    }
}