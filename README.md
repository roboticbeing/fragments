# fragments
backend to my fragments api

# frequently used commands
Run eslint and make sure there are no errors that need to be fixed: ```npm run lint```

pretty-print the JSON (NOTE: the -s option silences the usual output to CURL, only sending the response from the server to jq: ```curl -s localhost:8080 | jq```

The start script runs our server normally; dev runs it via nodemon, which watches the src/** folder for any changes, restarting the server whenever something is updated; debug is the same as dev but also starts the node inspector on port 9229, so that you can attach a debugger (e.g., VSCode):```npm start``` ```npm run dev``` ```npm run debug```
