
## Setup Matching Service
Ensure your current working directory is the `matching-service` folder.
```
npm install
npm ./index.js
```
This project uses NodeJS version v18.16.1.


## Testing Matching Service
1. Open 2 browser tabs and navigate to `http://localhost:4000`.

1. Select a difficulty level and click the `Start Match` button to begin.

1. The matching service will match 2 users who have selected the same difficulty level. The match result will be shown on the same page.

1. There is a time limit of 30s for finding a match. If there is no match within the time limit, the match will fail and the user can try again.


Note: The UI prevents the user from clicking the `Start Match` button while waiting for a match or after a successful match. If the match failed, the user can click the `Start Match` button to try again **without refreshing** the page. If the match is successful, a page refresh is required to try matching again.

Note: The server distinguishes clients by the socket connection they make to the server. Hence, it is an error for a single client to make multiple socket connections to the server. The server will treat each of these connections as a separate client and attempt to match them together. Currently the UI prevents such erroneous behaviour, but it is not foolproof as someone can always use the browser's developer console to create multiple socket connections.

