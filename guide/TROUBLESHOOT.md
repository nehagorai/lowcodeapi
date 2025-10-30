# Troubleshoot

## DB connection issue

When running an docker instance of mysql database and redis, and when server is running in a local machine, set the DB_HOST is as `127.0.0.1` in `.env`.

There are 4 possible ways application access mysql database.

```
DB_HOST=localhost // for mysql local instance

DB_HOST=127.0.0.1 // for mysql docker instance

DB_HOST=<mysql-docker-name> // for application running using docker compose

DB_HOST=<mysql_ip_host> // for mysql running on different server 
```

Ideal for production

```
DB_HOST=<mysql_ip_host>
```

## Missing Env

## Server

## UI