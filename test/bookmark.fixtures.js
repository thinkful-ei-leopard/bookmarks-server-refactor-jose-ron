function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: "google",
            url: "www.google.com",
            description: "search engine",
            rating: 5,
        },
        {
            id: 2,
            title: "yahoo",
            url: "www.yahoo.com",
            description: "terrible site",
            rating: 1,
        },
        {
            id: 3,
            title: "instagram",
            url: "www.instagram.com",
            description: "ok site i guess",
            rating: 3,
        },
    ]
}

module.exports = {
    makeBookmarksArray
}