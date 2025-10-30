# User Guide

## Generate env file

Generate `.env` file for server using the following command.

```
npm run env
```

## Start docker

Start docker instance locally

```
cd docker
docker compose -f docker-compose.dev.yml up
```

## Seed database tables

This step is required **only once** when setting application for the first time.

Switch to `lowcodeapi/server/sql` directory and run the following command in terminal.

```
mysql -h 127.0.0.1 -P 3306 -u lowcodeapi -p lowcodeapi < seed-tables.sql
```

Use your own username, password and database name incase if you have set your own value.

## Create new user

You will need to create user before you can login. Use the following `npm` command inside project directory. Set your `EMAIL`, `PASSWORD`, `FIRST_NAME`, `LAST_NAME` in command line to create a new user. using this email and password you can login into an application

```
EMAIL= PASSWORD= FIRST_NAME= LAST_NAME= npm run create

```

## Install depedencies

```
cd server

npm install
```

```
cd ui
yarn
```

## Run application

Start backend instance

```
cd server

npm run dev
```

Start ui instance

```
npm run dev
```

