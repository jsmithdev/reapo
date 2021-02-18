// allowed channels 
const validChannels = {
    "send": [
        "select-parent-directory",
        "terminal-popout",
        "vs-code",
        "archive",
        "mk-dir",
        "mkdir",
        "get-projects",
        "get-directories",
        "restart",
        "quit",
        "get-issues",
        "execute",
        'open-browser',
    ],
    "receive": [
        "directories",
        "get-projects-res",
        "select-parent-directory-res",
        "home-dir-res",
        "archive-res",
        "mk-dir-res",
        "vs-code-res",
        "get-issues-res",
        "git-url",
        "list-files",
    ]
}

module.exports = {
    validChannels,
}