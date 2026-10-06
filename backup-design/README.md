# Design backup (before the UI v2 refresh)

Exact copies of the files as they were before the visual refresh.

Quick rollback (from the repo root):

    cp backup-design/style.css backup-design/*.html .

Partial rollback without copying anything: delete `ui-v2` from the
`<body class="...">` of any page and that page instantly returns to the old look.
`app.js` was NOT modified; its copy here is for reference only.
