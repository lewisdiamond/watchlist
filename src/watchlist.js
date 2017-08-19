"use strict"
module.exports = (storage, apikey, sms, axios = require("axios")) => {
    const _ = require("lodash")

    async function fetchItem(term, type = "movie", all = false) {
        const { data } = await axios.get(`http://www.omdbapi.com/?s=${term}${type?`&type=${type}`:''}&apikey=${apikey}`)
        if (data.Response === "True" && data.totalResults > 0 && data.Search) {
            return all ? data.Search : data.Search[0]
        } else {
            return undefined
        }
    }

    function getStorage() {
        return new Promise((resolve, reject) => {
            storage.get((err, data) => {
                if (err) reject(err)
                else resolve(data || { list: [] })
            })
        })
    }

    function setStorage(data, force = false) {
        return new Promise((resolve, reject) => {
            storage.set(data, { force: force }, err => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    async function add(item) {
        try {
            let data = await getStorage()
            data = data || {}
            data.list = data.list || []
            data.list = _.uniqBy([...data.list, item], i => i.imdbID)
            setStorage(data)
        } catch (e) {
            console.error(e)
        }
    }

    async function watched(item, watched=true) {
        try {
            const data = await getStorage()
            const retrievedItems = data.list.filter(
                i => i.imdbID === item.imdbID
            )
            retrievedItems.forEach(i => (i.watched = watched))
            setStorage(data)
        } catch (e) {
            console.error(e)
        }
    }

    async function clear() {
        try {
            await setStorage({}, true)
        } catch (e) {
            console.error(e)
        }
    }

    async function get() {
        const data = await getStorage()
        return data.list
    }

    async function remove(item) {
        try {
            const data = await getStorage()
            const removed = data.list.filter( i => i.imdbID !== item.imdbID)
            data.list = removed
            setStorage(data)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        fetchItem,
        add,
        watched,
        clear,
        get,
        remove,
    }
}
