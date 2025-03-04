## Development
```
docker compose -p todo-app up
```
## Production
```
docker-compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml -p todo-app-prod  up -d
```
