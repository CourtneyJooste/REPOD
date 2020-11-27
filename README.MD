# Docker Registry and Container Updater

Requirements:

- Docker
- Docker Registry
- Docker Compose

### Description

The aim of this project is to host a local Docker repository that will host the Docker images on the host server alongside a git repository of the source code of another project.

If the remote HEAD on git is updated, the REPOD daemon will pull the changes and rebuild the source code into a Docker container.

The Docker container will then tag and update the private local repository with the new image.

The REPOD daemon will then restart the Docker service with the given tag which will gracefully self-heal and update each replica in the swarm with the new Docker image.

The REPOD daemon can optionally post a success message to a Slack webhook.

Finally the REPOD daemon will prune the Docker system to remove all unused containers, networks and images (both dangling and unreferenced).

### Set-up

Create a .env file in the base directory of this app.

The contents should be as follows

```
TAG=The tag of the repository. See the Tag section
REFRESH_RATE=The refresh rate in minutes (optional)
SLACK_WEBHOOK=The slack webhook to post to on success (optional)
```

```bash
# Running
$ docker-compose up -d

# Stopping
$ docker-compose down
```

## REPOD

Requirements:

- NodeJS
- PM2 (recommended to run the process in a separate thread)
- Yarn Package Manager

```bash
# Running
$ pm2 start repod.js

# Stopping
$ pm2 stop repod

# Restarting
$ pm2 reload repod

# View REPOD Logs
$ pm2 log repod --lines <count>
```

# Tag

The most vital element to be considered is the tag of the repository.
The tag will represent both the name of the image as well as the default location.
Examples using a tag will be explained below in Example Usage

# Example Usage

In the .env file in the root directory of this app, set the contents to:

```
TAG=myapp
```

## Running your app

```bash
# Launch the private repository
$ cd ./path/to/this/repo
$ docker-compose up -d

# Clone the repository you want to host
$ git clone <git remote> ~/projects/myapp/api
$ cd ~/projects/myapp/api
$ git checkout <branch to watch>

# Build the repository with docker and push to the private repository
$ docker build -t myapp .
$ docker tag myapp localhost:5000/myapp
$ docker push localhost:5000/myapp

# (Optional, skip if already have a swarm) Create a Docker swarm
$ docker swarm init

# (Optional) If the step above fails, you may need to specify an IP for the swarm
$ docker swarm init --advertise-addr=your-ip-here

# Launch a service hosted on port 4500 with 3 replicas
$ docker service create -p 4500:4500 --replicas=3 --name myapp localhost:5000/myapp

# Monitor for updates to the HEAD of the same branch you checked out to
$ cd ./path/to/this/repo
$ pm2 start start.sh --name "repod" -x -- --prod
```

# Manual Commands

## Manual Rebuild

```bash
# Ensure the repod daemon is running

# Build the repository with docker and push to the private repository
$ yarn rebuild
```

## Manual Reboot Swarm

```bash
# Ensure the repod daemon and docker swarms are running

# Scale swarm up and down (using 3 replicas)
$ docker service scale myservice=0
$ docker service scale myservice=3
```

## TODO

- helper scripts using env variables
- starting up instructions for nginx
- instructions for redis
