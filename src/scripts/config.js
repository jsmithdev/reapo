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
        "get-issues",
        "get-directories",
        "restart",
        "quit",
    ],
    "receive": [
        "directories",
        "get-projects-res",
        "get-issues-res",
        "select-parent-directory-res",
        "home-dir-res",
        "archive-res",
        "mk-dir-res",
        "vs-code-res",
    ]
}

module.exports = {
    validChannels,
}