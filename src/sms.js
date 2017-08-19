module.exports = (key, axios) => {
    axios = axios || require('axios')
    return async (text) => {
        const event = 'respond'
        console.log(`https://maker.ifttt.com/trigger/${event}/with/key/${key}?value1=${text}`)
        const resp = await axios.get(`https://maker.ifttt.com/trigger/${event}/with/key/${key}?value1=${text}`)
        return text
    }

}
