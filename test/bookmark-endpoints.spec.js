const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmark.fixtures')


describe.only('Bookmarks Endpoints', function() {
    let knexInstance

    before('make knex instance before tests', () => {
        knexInstance = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('knexInstance', knexInstance)
    })

    after('disconnect from knex Instance after testing', () => knexInstance.destroy())

    before('clean the bookmark table before testing', () => { 
        return knexInstance('bookmarks_table').truncate() })

    afterEach('clean the bookmarks table of data', () => { 
        return knexInstance('bookmarks_table').truncate() })
    
    describe(`GET /articles`, () => {

        context(`Given no bookmarks`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, [])
            })
        })

        context(`Given there are bookmarks in the database.`, () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return knexInstance
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })

            it(`GET /bookmarks responds with 200 and all bookmarks are returned`, () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, testBookmarks)
            })
        })
    })


    describe(`GET /bookmarks/:id`, () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 404`, () => {
                const bookmarkId = 123456
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .expect(404, { error: { message: `bookmark doesn't exist` } })
            })
        })
        context(`Given there are bookmarks in the database`, () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return knexInstance
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })

            it(`Get /bookmarks/:id responds with 200 and the specified bookmark`, () => {
                const bookmarkId = 2
                const expectedBookmark = testBookmarks[bookmarkId - 1]
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .expect(200, expectedBookmark)
            })
        })
    })

    describe.only(`Post /bookmarks`, () => {
        it(`creates a bookmark, responding with 201 and the new bookmark`, function() {
            this.retries(3)
            const newBookmark = {
                title: "twitter",
                url: "www.twitter.com",
                description: "for funsies",
                rating: 5
            }

            return supertest(app)
                .post('/bookmarks')
                .send(newBookmark)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newBookmark.title)
                    expect(res.body.url).to.eql(newBookmark.url)
                    expect(res.body.description).to.eql(newBookmark.description)
                    expect(res.body.rating).to.eql(newBookmark.rating)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                    .get(`/bookmarks/${postRes.body.id}`)
                    .expect(postRes.body)
                    )
        })

        // Testing required fields
        const requiredFields = ['title', 'url', 'rating']

        //looping through required fields array and removing each field once?
        requiredFields.forEach(field => {
            const newBookmark = {
                title: 'grailed',
                url: "www.grailed.com",
                rating: 5
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newBookmark[field]

                return supertest(app)
                    .post('/bookmarks')
                    .send(newBookmark)
                    .expect(400, {
                        error: { message: `missing ${field} in request body` }
                    })
            })
        })
    })

})


