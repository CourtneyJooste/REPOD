#!/bin/bash

prefix="[REPOD GITCHECK]"

function prepend() { while read line; do echo "${prefix} ${line}"; done; }

if [ -z $1 ]; then
    echo "Usage is './gitcheck.sh <repository> <wehbook (optional)>'" | prepend
else
    cd ~/projects/$1/api
    if [ $(git rev-parse HEAD) = $(git ls-remote $(git rev-parse --abbrev-ref @{u} | sed 's/\// /g') | cut -f1) ]; then
        echo Repository is up-to-date | prepend
    else
        git stash
        git stash drop
        git pull
        docker build -t $1 .
        docker tag $1 localhost:5000/$1 | prepend
        docker push localhost:5000/$1 | prepend
        docker service update $1 --image localhost:5000/$1:latest | prepend
        if [ ! -z $2 ]; then
            echo "Posting success to Slack Webhook" | prepend
            curl -X POST -H 'Content-type: application/json' --data '{"text":"New '$1' server has been deployed"}' $2 | prepend
        fi
        yes | docker system prune | prepend
    fi
fi
