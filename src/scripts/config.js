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
    ]
}

module.exports = {
    validChannels,
}