## Development
```
docker compose -p todo-app up -d
```
## Production
```
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml -p todo-app-prod  up -d
```


```shell
export $(grep MODE .env | xargs) && docker buildx build --platform linux/amd64,linux/arm64 --build-arg MODE=$MODE -t ivladii/todo-backend-dev:latest --push ./backend
```

```shell
docker buildx build --platform linux/amd64,linux/arm64 -t ivladii/todo-frontend-dev:latest --push ./frontend
```
