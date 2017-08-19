"use strict"
require("babel-polyfill")
const _ = require("lodash")

function format(strs, ...subs) {
    let ret = strs[0]
    let isItemList = s => _.some(s, i => _.get(i, "Title"))
    let formatList = s =>
        _.chain(s)
            .map(i => (i.watched?'>':'')+i.Title)
            .filter(i => i && i.length > 0)
            .join(", ")
            .value() || "empty"
    for (let [i, obj] of subs.entries()) {
        ret += isItemList(obj) ? formatList(obj) : obj
        ret += strs[i+1]
    }
    return ret
}

module.exports = async function(ctx, cb) {
    try {
        const commands = require("./src/commands.js")
        const { apikey, smskey} = ctx.secrets
        const { text } = ctx.query
        const {
            add,
            watched,
            fetchItem,
            get,
            clear,
            remove,
        } = require("./src/watchlist.js")(ctx.storage, apikey)
        const sms = require("./src/sms.js")(smskey)
        function notFound(query) {
            cb(sms(`${query} not found`))
        }
        async function addItem(title, type) {
            try {
                const item = await fetchItem(title, type)
                if (item) {
                    await add(item)
                    cb(null, sms(`Successfully added ${item.Title}`))
                } else {
                    notFound(title)
                }
            } catch(e) {
                sms(`Sorry, something broke, can't add that title`)
                cb(e)
            }
        }
        async function markWatched(title, iswatched=true) {
            try {
                const items = await fetchItem(title, null, true)
                const data = await get()
                const item = _.head(
                    _.intersectionBy(items, data, i => i.imdbID)
                )
                if (item) {
                    await watched(item, iswatched)
                    cb(null, sms(`Marked ${item.Title} as ${iswatched?'watched':'not watched'}`))
                } else {
                    notFound(title)
                }
            } catch (e) {
                sms('Sorry, something broke while marking that as watched')
                cb(e)
            }
        }
        commands(
            text,
            //add
            async title => await addItem(title)
            ,
            //addSeries
            async title => await addItem(title, 'series')
            ,
            //watched
            async title => await markWatched(title)
            ,
            //get
            async () => {
                const list = await get()
                sms(format`Your list is: ${list}`)
                cb(null, list)
            },
            //clear
            async () => {
                await clear()
                cb(null, sms(`Cleared your list`))
            },
            //unwatch
            async title => await markWatched(title, false)
            ,
            //remove
            async title => {
                const items = await fetchItem(title, null, true)
                const data = await get()
                const item = _.head(
                    _.intersectionBy(items, data, i => i.imdbID)
                )
                if (item) {
                    await remove(item)
                    cb(sms(`Removed ${item.Title} from your list`))
                } else {
                    notFound(title)
                }
            }
        )
    } catch (err) {
        console.log(err)
        cb(err)
    }
}
module.exports.format = format
