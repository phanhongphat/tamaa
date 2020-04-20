# Git workflow

## 1. Start a new feature

### Create a feature branch

```
git checkout -b feature/MYFEATURE develop
```

### Share a feature branch

```
git push origin feature/MYFEATURE
```

### Finalize a feature branch

> Note: Create pull request in bitbucket

```
git checkout develop
git merge --no--ff feature/MYFEATURE
```

###Push the merged feature branch

```
git push origin develop
```

## 2. Start a release

### Create a release branch

```
git checkout -b release/1.2.0 develop
```

### Share a release branch

```
git checkout release/1.2.0

git push origin release/1.2.0
```

### Get latest a release branch

```
git checkout relase/1.2.0

git pull --rebase origin relase/1.2.0
```

### Push the merged feature branch

```
git push origin master

git push origin develop

git push origin --tags
```

## 3. Hotfixes

### Create a new hotfix branch

```
git checkout -b hotfix/1.2.1 [commit]
```

### Finalize a hotfix branch

```
git checkout master

git merge --no-ff hotfix/1.2.1

git tag -a 1.2.1

git checkout develop

git merge --no-ff hotfix/1.2.1

git branch -d hotfix/1.2.1
```

### Push the merged hotfix branch

```
git push origin master

git push origin develop

git push origin --tags

git push origin :hotfix/1.2.1(if pushed)
```

## Note:

Define a name for the feature (MYFEATURE):

Example of incorret : feature/userList or feature/user/list

Example of corret : feature/user-list
