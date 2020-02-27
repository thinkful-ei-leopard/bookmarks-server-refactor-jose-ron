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

    before('clean the bookmark table before testing', () => knexInstance('bookmarks_table').truncate())

    afterEach('clean the bookmarks table of data', () => knexInstance('bookmarks_table').truncate())
    
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
        context(`Given there are articles in the database`, () => {
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
})