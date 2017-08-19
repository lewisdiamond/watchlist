const should = require("chai").should()

describe("watchlist", () => {
    describe("command handler", () => {
        it("should handle adding a movie", done => {
            let title = "Seven psychopaths"
            let handler = require("../src/commands.js")(
                title,
                argv => {
                    argv.title.join(" ").should.equal(title)
                    done()
                },
                argv => {
                    should.fail(
                        "Series",
                        "Movies",
                        "Adding a movie, not a series"
                    )
                    done()
                },
                argv => {
                    should.fail(
                        "Watched",
                        "Movies",
                        "Adding a movie, not marking as watched"
                    )
                    done()
                }
            )
        })

        it("should handle adding a series", done => {
            let title = "Game of thrones"
            let handler = require("../src/commands.js")(
                `s ${title}`,
                argv => {
                    should.fail("Add", "Series", "Adding a series, not a movie")
                    done()
                },
                argv => {
                    argv.title.join(" ").should.equal(title)
                    done()
                },
                argv => {
                    should.fail(
                        "Watched",
                        "Series",
                        "Adding a series, not marking as watched"
                    )
                    done()
                }
            )
        })

        it("should handle marking an item as watched", done => {
            let title = "Game of thrones"
            let handler = require("../src/commands.js")(
                `w ${title}`,
                argv => {
                    should.fail(
                        "Add",
                        "Watched",
                        "Marking as watched, not adding a movie"
                    )
                    done()
                },
                argv => {
                    should.fail(
                        "Series",
                        "Watched",
                        "Marking as watched, not adding a series"
                    )
                    done()
                },
                argv => {
                    argv.title.join(" ").should.equal(title)
                    done()
                }
            )
        })
    })
    describe("List actions", () => {
        it("should add an item to the list", done => {
            const item = {
                Title: "Game of Thrones",
                Year: "2011–",
                imdbID: "tt0944947",
                Type: "series",
                Poster:
                    "https://images-na.ssl-images-amazon.com/images/M/MV5BMjE3NTQ1NDg1Ml5BMl5BanBnXkFtZTgwNzY2NDA0MjI@._V1_SX300.jpg",
            }

            const { add } = require("../src/watchlist.js")({
                get(cb) {
                    cb()
                },
                set(data, cb) {
                    data.should.have.nested.property("list[0].imdbID")
                    data.list[0].should.equal(item)
                    done()
                },
            })
            add(item)
        })

        it("should mark an item as watched", done => {
            const data = {
                list: [
                    {
                        Title: "Game of Thrones",
                        Year: "2011–",
                        imdbID: "tt0944947",
                        Type: "series",
                        Poster:
                            "https://images-na.ssl-images-amazon.com/images/M/MV5BMjE3NTQ1NDg1Ml5BMl5BanBnXkFtZTgwNzY2NDA0MjI@._V1_SX300.jpg",
                    },
                    {
                        Title: "Seven Psychopaths",
                        Year: "2012",
                        imdbID: "tt1931533",
                        Type: "movie",
                        Poster:
                            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgwMzUxMjc0M15BMl5BanBnXkFtZTcwMzQ2MjYyOA@@._V1_SX300.jpg",
                    },
                ],
            }

            const work = new Promise((resolve, reject) => {
                const { watched } = require("../src/watchlist.js")({
                    get(cb) {
                        cb(undefined, data)
                    },
                    set(_data, opts, cb) {
                        cb()
                        resolve(_data)
                    },
                })
                watched(data.list[1])
            })

            work
                .then(retrieved => {
                    retrieved.should.have.nested.property("list[1].watched")
                    retrieved.list[1].watched.should.be.true
                    done()
                })
                .catch(e => {
                    should.fail()
                    console.log(e)
                })
        })

        it("should fetch a movie from omdb", done => {
            const query = "seven psychopaths"
            let queriedUrl
            const {
                fetchItem,
            } = require("../src/watchlist.js")(undefined, "key", undefined, {
                get: url => {
                    queriedUrl = url
                    return {
                        data: {
                            Search: [
                                {
                                    Title: "Seven Psychopaths",
                                    Year: "2012",
                                    imdbID: "tt1931533",
                                    Type: "movie",
                                    Poster:
                                        "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgwMzUxMjc0M15BMl5BanBnXkFtZTcwMzQ2MjYyOA@@._V1_SX300.jpg",
                                },
                            ],
                            totalResults: "1",
                            Response: "True",
                        },
                    }
                },
            })

            fetchItem(query)
                .then(item => {
                    queriedUrl.should.be.equal(
                        "http://www.omdbapi.com/?s=seven psychopaths&type=movie&apikey=key"
                    )
                    done()
                })
                .catch(e => done(e))
        })

    })


    describe('Webtask', () => {
        const webtask = require('../webtask.js')

        it("should format lists for sms", () => {
            const list = [
                { a: "a" },
                { Title: "Test" },
                { b: "b" },
                { Title: "Test2" },
            ]
            const str = webtask.format`List: ${list}`
            str.should.be.equal('List: Test\nTest2')
        })
    })
})
