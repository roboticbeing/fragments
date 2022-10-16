# fragments
backend to my fragments api

# frequently used commands
Run eslint and make sure there are no errors that need to be fixed: ```npm run lint```

pretty-print the JSON (NOTE: the -s option silences the usual output to CURL, only sending the response from the server to jq: ```curl -s localhost:8080 | jq```

The start script runs our server normally; dev runs it via nodemon, which watches the src/** folder for any changes, restarting the server whenever something is updated; debug is the same as dev but also starts the node inspector on port 9229, so that you can attach a debugger (e.g., VSCode):```npm start``` ```npm run dev``` ```npm run debug```

# starting up an EC2 instance
1. Go to AWS Learner Lab, start it, then click on AWS Console.
2. Click EC2
3. Run ```ssh -i ~/.ssh/dps955-key-pair.pem ec2-user@[id]```
4. Remember to stop the lab

Optional: update source code
1. Run ```npm pack``` in fragments repo
2. Run ```scp -i dps955-key-pair.pem fragments-0.0.1.tgz ec2-user@[id]:```
3. Connect to the EC2 instance and run ```tar -xvzf fragments-0.0.1.tgz```

# docker
1. Build an image -> AWS: ```sudo service docker start``` then ```docker build -t fragments:latest .```
2. Run container ```docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest```
3. Run ```docker kill [id]```
