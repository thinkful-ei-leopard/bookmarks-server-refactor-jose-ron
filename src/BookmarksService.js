const BookmarksService = {
    getAllBookmarks(knexInstance) {
        return knexInstance
            .select('*')
            .from('bookmarks_table')
    },
    getById(knexInstance, id) {
        return knexInstance
            .from('bookmarks_table')
            .select('*')
            .where('id', id)
            .first()
    },
}

module.exports = BookmarksService