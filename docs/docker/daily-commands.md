---
title: Daily Commands
sidebar_position: 1
---

# Docker — Daily Commands

Commands I use constantly while building and debugging containers. Copy-paste first, explanation after.

---

## Images

**Build an image**
```bash
docker build -t app-name .
```
`-t` tags the image with a name. `.` means "use the Dockerfile in the current folder."

**Build without cache** (use when changes aren't reflecting after a rebuild)
```bash
docker build --no-cache -t app-name .
```

**List all images**
```bash
docker images
```

**Remove an image**
```bash
docker rmi image-name
```

**Remove all unused images**
```bash
docker image prune -a
```

---

## Containers

**Run a container**
```bash
docker run -p 5000:5000 app-name
```
`-p host_port:container_port` maps the port so you can access it from your browser.

**Run in detached mode** (runs in background, gives terminal back)
```bash
docker run -d -p 5000:5000 app-name
```

**Run with a name** (easier to reference later than a random ID)
```bash
docker run -d -p 5000:5000 --name my-app app-name
```

**Run with env variables**
```bash
docker run -d -p 5000:5000 --env-file .env app-name
```

**List running containers**
```bash
docker ps
```

**List all containers** (including stopped ones)
```bash
docker ps -a
```

**Stop a container**
```bash
docker stop container-name-or-id
```

**Start a stopped container**
```bash
docker start container-name-or-id
```

**Restart a container**
```bash
docker restart container-name-or-id
```

**Remove a container**
```bash
docker rm container-name-or-id
```

**Stop and remove in one shot**
```bash
docker rm -f container-name-or-id
```

---

## Logs & Debugging

**View logs**
```bash
docker logs container-name-or-id
```

**Follow logs live** (like `tail -f`)
```bash
docker logs -f container-name-or-id
```

**Get a shell inside a running container**
```bash
docker exec -it container-name-or-id sh
```
Use `bash` instead of `sh` if the base image has bash installed (e.g. Debian-based images).

**Inspect container details** (IP, mounts, env vars, etc.)
```bash
docker inspect container-name-or-id
```

**Check resource usage** (CPU, memory per container)
```bash
docker stats
```

---

## Cleanup

**Remove all stopped containers**
```bash
docker container prune
```

**Remove all unused images, containers, networks** (careful — this is broad)
```bash
docker system prune
```

**Remove everything unused, including volumes** (be extra careful — deletes volume data)
```bash
docker system prune -a --volumes
```

**Check disk space used by Docker**
```bash
docker system df
```

---

## Volumes

**List volumes**
```bash
docker volume ls
```

**Remove a volume**
```bash
docker volume rm volume-name
```

**Remove all unused volumes**
```bash
docker volume prune
```

---

## Networks

**List networks**
```bash
docker network ls
```

**Create a network** (useful when connecting containers manually, outside compose)
```bash
docker network create my-network
```

**Run a container on a specific network**
```bash
docker run -d --network my-network --name my-app app-name
```

---

## Quick Troubleshooting Notes

- **Port already in use** → something else (maybe an old container) is bound to that port. Run `docker ps` to check, or `lsof -i :PORT` on Linux.
- **Changes not reflecting after rebuild** → try `docker build --no-cache`, or make sure you're not running an old container (`docker ps -a`, remove the stale one).
- **Container exits immediately** → check `docker logs container-name` right after it exits, the error is usually there.
- **Can't connect to another container** → containers on different networks can't see each other by default. Use `docker network ls` / `docker inspect` to check, or use Docker Compose which handles this automatically.