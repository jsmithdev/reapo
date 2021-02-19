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
        'open-file-man',
        'sfdx-org-open',
        'archive',
    ],
    "receive": [
        "error",
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
        'open-salesforce',
        'readme',
        'git-status',
        'archive-res',
    ]
}

module.exports = {
    validChannels,
}