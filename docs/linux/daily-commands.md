---
title: Daily Commands
sidebar_position: 1
---

# Linux — Daily Commands

Commands used constantly while working on Ubuntu — file operations, permissions, processes, ports, and disk usage. Copy-paste first, explanation after.

---

## File & Directory Operations

**List files** (with details, including hidden)
```bash
ls -la
```

**Change directory**
```bash
cd path/to/folder
```

**Create a directory**
```bash
mkdir folder-name
```

**Create nested directories in one go**
```bash
mkdir -p parent/child/grandchild
```

**Create an empty file**
```bash
touch filename.txt
```

**Copy a file/folder**
```bash
cp file.txt destination/
cp -r folder/ destination/   # -r for folders (recursive)
```

**Move / rename**
```bash
mv old-name.txt new-name.txt
mv file.txt destination/
```

**Delete a file**
```bash
rm file.txt
```

**Delete a folder** (careful — no undo)
```bash
rm -rf folder-name
```

**View file content**
```bash
cat file.txt
```

**View large files page by page**
```bash
less file.txt
```

**View first/last lines of a file**
```bash
head -n 20 file.txt
tail -n 20 file.txt
```

**Follow a file live** (great for logs)
```bash
tail -f file.txt
```

**Find files by name**
```bash
find . -name "filename*"
```

**Search inside files** (like grep for text content)
```bash
grep "search-term" file.txt
grep -r "search-term" .     # -r searches recursively in all files
```

---

## Permissions

**View permissions**
```bash
ls -l
```

**Change permissions**
```bash
chmod 755 filename
chmod +x script.sh   # make a script executable
```

**Change ownership**
```bash
chown username:groupname filename
```

**Run a command as superuser**
```bash
sudo command
```

---

## Process Management

**List running processes**
```bash
ps aux
```

**Live process monitor** (like Task Manager)
```bash
top
```
or, if installed (nicer UI):
```bash
htop
```

**Find a process by name**
```bash
ps aux | grep node
```

**Kill a process by PID**
```bash
kill PID
kill -9 PID   # force kill
```

**Kill a process by name**
```bash
pkill node
```

---

## Ports & Network

**Check what's running on a port**
```bash
sudo lsof -i :5000
```

**Alternative (if lsof isn't installed)**
```bash
sudo netstat -tulpn | grep 5000
```

**Kill whatever's using a port**
```bash
sudo kill -9 $(sudo lsof -t -i:5000)
```

**Check your machine's IP**
```bash
ip addr show
```

**Test if a host is reachable**
```bash
ping google.com
```

---

## Disk Usage

**Check overall disk space**
```bash
df -h
```

**Check size of a folder**
```bash
du -sh folder-name
```

**Check size of everything in current directory, sorted**
```bash
du -sh * | sort -rh
```

---

## Environment Variables

**View all environment variables**
```bash
printenv
```

**Set a variable for the current session**
```bash
export MY_VAR=value
```

**Check a specific variable**
```bash
echo $MY_VAR
```

---

## Quick Notes

- `sudo` before a command runs it with admin privileges — required for system-level changes (installing packages, editing system files, killing other users' processes).
- `Ctrl + C` cancels a running command in the terminal.
- `Ctrl + Z` pauses a running command (use `fg` to bring it back, `bg` to resume in background).
- Tab key auto-completes file/folder names — use it constantly to avoid typos.