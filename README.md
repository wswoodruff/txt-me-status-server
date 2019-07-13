# txt-me-status-server

You'll want this server to be available to the [txt-me](https://github.com/wswoodruff/txt-me) client

## routes

#### watch
`get` `/status/{listenerId?}`

Serves an `SSE` response via [susie](https://github.com/mtharrison/susie) given an optional `listenerId`
  
#### update
`post` `/status/{listenerId?}`

This will be called by Twilio when you pass it on the client as the status server url.
