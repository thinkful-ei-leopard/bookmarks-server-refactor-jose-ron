const BookmarksService = {
    getAllBookmarks(knexInstance) {
        return knexInstance
            .select('*')
            .from('bookmarks_table')
    },
}

module.exports = BookmarksService