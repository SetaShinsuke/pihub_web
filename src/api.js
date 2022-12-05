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

    static getGames(args) {
        let params = {}
        if (args) {
            ['platform', 'all', 'count', 'limit', 'page'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'GET',
            url: '/api/games',
            params: params
        })
    }

    static addGame(args) {
        let params = {}
        if (args) {
            ['sku', 'platform', 'org_name', 'name', 'cover', 'hl2b_id'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'POST',
            url: '/api/games',
            params: params
        })
    }

    static getGameDetail(gameId) {
        return instance.request({
            method: 'GET',
            url: `/api/games/${gameId}`
        })
    }

    static editGame(gameId, args) {
        let params = {}
        if (args) {
            ['sku', 'platform', 'org_name', 'name', 'cover', 'hl2b_id'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'PUT',
            url: `/api/games/${gameId}`,
            params: params
        })
    }

    static removeGame(gameId) {
        return instance.request({
            method: 'DELETE',
            url: `/api/games/${gameId}`
        })
    }
}

export class AcqApi {
    static getAcqs(args) {
        let params = {}
        if (args) {
            ['account_id', 'item_id', 'item_type', 'format', 'state', 'region', 'extra',
                'price_min', 'price_max', 'price_type', 'date_start', 'date_end',
                'all', 'count', 'limit', 'page'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'GET',
            url: `/api/acquisitions`,
            params: params
        })
    }

    static addAcq(args) {
        let params = {}
        if (args) {
            ['account_id', 'item_id', 'item_type', 'format',
                'acq_price', 'org_price', 'acq_method', 'acq_from',
                'state', 'region', 'extra'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'POST',
            url: `/api/acquisitions`,
            params: params
        })
    }

    static getAcqDetail(acqId){
        return instance.request({
            method: 'GET',
            url: `/api/acquisitions/${acqId}`
        })
    }

    static editAcq(acqId, args) {
        let params = {}
        if (args) {
            ['account_id', 'item_id', 'format',
                'acq_price', 'org_price', 'acq_method', 'acq_from',
                'state', 'region', 'extra'].forEach(key => {
                if (key in args) params[key] = args[key]
            })
        }
        return instance.request({
            method: 'PUT',
            url: `/api/acquisitions/${acqId}`,
            params: params
        })
    }

    static removeAcq(acqId){
        return instance.request({
            method: 'DELETE',
            url: `/api/acquisitions/${acqId}`
        })
    }
}

export class DioApi {
    static getAccounts() {
        let params = {}
        return instance.request({
            method: 'GET',
            url: '/api/dio/accounts',
            params: params
        })
    }

    static addAccount(args) {
        let params = {}
        if (args) {
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

    static editAccount(id, args) {
        let params = {}
        if (args) {
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

    static removeAccount(id) {
        return instance.request({
            method: 'DELETE',
            url: `/api/dio/accounts/${id}`
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