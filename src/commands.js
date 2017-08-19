"use strict";

module.exports = (input, add, addSeries, watched, get, clear, unwatch, remove) => {
    
    console.log(input)
    const makeTitle = (argv) => argv.title.join(" ")
    const yargs = require('yargs')
        .command(['add <title...>', '*'], 'Add a movie', {}, (argv) => { add(makeTitle(argv)) })
        .command(['series <title...>', 's', 'serie'], 'Add a series', {}, (argv) => { addSeries(makeTitle(argv)) })
        .command(['watched <title...>', 'watch', 'w'], 'Mark a movie or series as watched', {}, (argv) => { watched(makeTitle(argv)) })
        .command(['get', 'g'], 'Get the list of unwatched', {}, () => { get() })
        .command(['clear', 'c'], 'Clear the list', {}, () => { clear() })
        .command(['unwatch <title...>', 'u'], 'Unmark an item previously marked as watched', {}, (argv) => { unwatch(makeTitle(argv)) })
        .command(['remove <title...>', 'r', 'rm'], 'Remove an item', {}, (argv) => { remove(makeTitle(argv)) })
        .help()
        .parse(input.toLowerCase())
}
