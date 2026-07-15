---
title: Daily Commands
sidebar_position: 1
---

# Git — Daily Commands

Commands used constantly while working with Git — initial setup, branching, undoing mistakes, and the stuff I'd otherwise have to re-Google every time. Copy-paste first, explanation after.

---

## Initial Setup

**Set your global name and email** (shows up on every commit)
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Set the default branch name for new repos**
```bash
git config --global init.defaultBranch main
```

**Set your default editor** (used for commit messages, rebase, etc.)
```bash
git config --global core.editor "code --wait"
```

**Check your current config**
```bash
git config --list
```

**Generate an SSH key** (so you don't have to type a password every push)
```bash
ssh-keygen -t ed25519 -C "you@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Copy your public key** (to paste into GitHub → Settings → SSH and GPG keys)
```bash
cat ~/.ssh/id_ed25519.pub
```

**Test the SSH connection**
```bash
ssh -T git@github.com
```

---

## Daily Basics

**Initialize a new repo**
```bash
git init
```

**Clone a repo**
```bash
git clone git@github.com:username/repo.git
```

**Check status** (what's staged, unstaged, untracked)
```bash
git status
```

**Stage changes**
```bash
git add file.txt
git add .          # stage everything
```

**Commit staged changes**
```bash
git commit -m "message"
```

**Edit the last commit** (message or forgotten files, before pushing)
```bash
git commit --amend
```

**See unstaged changes**
```bash
git diff
```

**See staged changes**
```bash
git diff --staged
```

**View commit history**
```bash
git log --oneline --graph --all
```

---

## Branching

**List branches**
```bash
git branch
```

**Create a branch**
```bash
git branch feature-name
```

**Switch to a branch**
```bash
git switch feature-name
```

**Create and switch in one step**
```bash
git switch -c feature-name
```

**Rename a branch**
```bash
git branch -m old-name new-name
```

**Delete a local branch**
```bash
git branch -d feature-name    # safe — refuses if unmerged
git branch -D feature-name    # force delete
```

**Delete a remote branch**
```bash
git push origin --delete feature-name
```

---

## Merging & Rebasing

**Merge a branch into your current branch**
```bash
git merge feature-name
```

**Rebase your current branch onto another**
```bash
git rebase main
```

**Interactive rebase** (squash, reorder, or edit the last N commits)
```bash
git rebase -i HEAD~3
```

**Continue after resolving a conflict**
```bash
git rebase --continue    # if rebasing
git merge --continue     # if merging
```

**Abort and back out entirely**
```bash
git rebase --abort
git merge --abort
```

> **Merge vs rebase, quickly:** merge keeps full history and adds a merge commit — safe for shared branches. Rebase rewrites your branch's commits on top of another, giving a cleaner linear history — fine for your own unpushed branches, risky on anything others have already pulled.

---

## Remotes

**View configured remotes**
```bash
git remote -v
```

**Add a remote**
```bash
git remote add origin git@github.com:username/repo.git
```

**Fetch changes without merging**
```bash
git fetch
```

**Pull (fetch + merge)**
```bash
git pull
```

**Pull with rebase instead of merge** (avoids extra merge commits)
```bash
git pull --rebase
```

**Push**
```bash
git push
```

**Push a new branch and set upstream tracking**
```bash
git push -u origin feature-name
```

**Force-push safely** (fails if someone else pushed in the meantime, unlike plain `--force`)
```bash
git push --force-with-lease
```

---

## Undoing Things

**Unstage a file** (keep the changes)
```bash
git restore --staged file.txt
```

**Discard local changes to a file** (changes are gone — careful)
```bash
git restore file.txt
```

**Undo the last commit, keep changes staged**
```bash
git reset --soft HEAD~1
```

**Undo the last commit, keep changes unstaged**
```bash
git reset HEAD~1
```

**Undo the last commit and discard the changes entirely** (careful — no undo)
```bash
git reset --hard HEAD~1
```

**Revert a commit safely** (creates a new commit that undoes it — fine for shared/pushed history)
```bash
git revert <commit-hash>
```

**Recover something you thought you lost**
```bash
git reflog
git reset --hard <hash-from-reflog>
```

---

## Stashing

**Stash current changes**
```bash
git stash
```

**Stash including untracked files**
```bash
git stash -u
```

**List stashes**
```bash
git stash list
```

**Reapply the latest stash, keep it in the list**
```bash
git stash apply
```

**Reapply the latest stash and remove it**
```bash
git stash pop
```

**Delete a stash**
```bash
git stash drop
```

---

## Inspecting History

**Readable log with branches**
```bash
git log --oneline --graph --decorate --all
```

**See who last changed each line of a file**
```bash
git blame file.txt
```

**Show a specific commit's full diff**
```bash
git show <commit-hash>
```

**Search commit messages**
```bash
git log --grep="keyword"
```

**See a file's full change history**
```bash
git log -p -- file.txt
```

---

## Tags

**List tags**
```bash
git tag
```

**Create a lightweight tag**
```bash
git tag v1.0.0
```

**Create an annotated tag** (with a message — preferred for releases)
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
```

**Push a tag**
```bash
git push origin v1.0.0
```

**Push all tags**
```bash
git push origin --tags
```

**Delete a tag**
```bash
git tag -d v1.0.0
```

---

## Quick Troubleshooting Notes

- **Detached HEAD** — you're not on any branch, just a specific commit. If you've made commits here you want to keep, run `git switch -c new-branch` right away to save them onto a real branch before switching away.
- **Committed to the wrong branch** (not pushed yet) → `git branch correct-branch` to save a branch at the current point, then `git reset --hard HEAD~1` on the wrong branch to remove the commit, then `git switch correct-branch`.
- **Accidentally pushed a secret** → rotate/revoke the secret immediately — pushing a fix doesn't remove it from history. Removing it fully needs `git filter-repo` or the BFG Repo-Cleaner, followed by a force-push.
- **Merge conflict panic** → open the conflicted file, find the `<<<<<<<` / `=======` / `>>>>>>>` markers, manually decide what stays, delete the markers, then `git add <file>` and finish with `git commit` (merge) or `git rebase --continue` (rebase).
- **Forgot to `.gitignore` something already tracked** (like `node_modules`) → add it to `.gitignore`, then `git rm -r --cached node_modules` and commit.
- **Repo feels bloated** → `git count-objects -vH` shows total size; `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n -r | head` finds the largest files in history.
