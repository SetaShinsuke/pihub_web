import axios from "axios";

// let HOST = 'http://192.168.50.166:9292';
let HOST = getHost();

export {HOST}

let instance = axios.create({
    baseURL: HOST
})

function getHost() {
    console.log(`Pihub web env: ${process.env.NODE_ENV}`)
    switch (process.env.NODE_ENV) {
        case 'production':
            return window.location.orgin
        case 'dev':
        case 'development':
            return 'http://192.168.50.166:9292'
        default:
            return 'http://192.168.50.166:9292'
    }
}

export class MangaApi {
    static getSubscribedMangas(args) {
        let params = {}
        if (args) {
            ['page', 'page_size', 'sort'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'GET',
            url: '/api/mangas/subscribed',
            params: params
        })
    }

    static searchManga(keyword, args) {
        let params = {keyword: keyword}
        console.log(args)
        if (args) {
            ['platform', 'page', 'page_size', 'search_by'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'GET',
            url: '/api/mangas/search',
            params: params
        })
    }

    static subscribeBm(bmId, args) {
        let params = {bm_id: bmId}
        if (args) {
            ['title', 'cover', 'authors', 'introduction', 'do_subscribe', 'do_pin'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'POST',
            url: '/api/mangas/subscribe/bm',
            params: params
        })
    }

    static getMangaReplies(epId, args) {
        let params = {}
        if (args) {
            ['page', 'page_size', 'sort', 'root_id'].forEach(key => {
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
    static getXgpLists(channels, platform, withDesc = false) {
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

export class DioApi {
    static getAccounts(){
        let params = {}
        return instance.request({
            method: 'GET',
            url: '/api/dio/accounts',
            params: params
        })
    }

    static addAccount(args){
        let params = {}
        if(args){
            ['uid', 'name', 'alt_level', 'platform', 'login_name', 'extra'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'POST',
            url: '/api/dio/accounts',
            params: params
        })
    }

    static editAccount(id, args){
        let params = {}
        if(args){
            ['uid', 'name', 'alt_level', 'platform', 'login_name', 'extra'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'PUT',
            url: `/api/dio/accounts/${id}`,
            params: params
        })
    }
    static removeAccount(id){
        let params = {}
        return instance.request({
            method: 'DELETE',
            url: `/api/dio/accounts/${id}`,
            params: params
        })
    }
}

export class JavApi {
    static getSource(site, javId) {
        let url = `https://${site}/api/source/${javId}`
        console.log(`Jav source url: ${url}`)
        // return axios.get(`/jav_prx/api/javs/source?jav_id=k0k2gh37dnr8ndg&site=watchjavnow.xyz`)
        // return axios.post(url)
        // return axios.post(`/jav_prx/api/source/${javId}`)
        return axios.get(`/jav_prx/v/2lqmxs2zgygj58w`, {timeout: 30_000})
    }
}