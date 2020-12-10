#!/bin/bash

prefix="[REPOD REBUILD]"

function prepend() { while read line; do echo "${prefix} ${line}"; done; }

if [ -z $1 ]; then
    echo "Usage is './rebuild.sh <repository> <wehbook (optional)>'" | prepend
else
    cd ~/projects/$1/api
    git stash
    git stash drop
    git pull
    docker build -t $1 .
    docker tag $1 localhost:5000/$1 | prepend
    docker push localhost:5000/$1 | prepend
    docker service update $1 --image localhost:5000/$1:latest | prepend
    if [ ! -z $2 ]; then
        echo "Posting success to Slack Webhook" | prepend
        curl -X POST -H 'Content-type: application/json' --data '{"text":"New '$1' server has been deployed (manual)"}' $2 | prepend
    fi
    yes | docker system prune | prepend
fi
