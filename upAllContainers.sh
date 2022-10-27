docker compose -f apache-kafka/docker-compose.yml down
docker compose -f apache-kafka/docker-compose.yml up -d

docker compose -f simulator/docker-compose.yml down
docker compose -f simulator/docker-compose.yml up -d
docker exec -d simulator go run main.go

docker compose -f nest-api/docker-compose.yml down
docker compose -f nest-api/docker-compose.yml up -d

docker compose -f react-frontend/docker-compose.yml down
docker compose -f react-frontend/docker-compose.yml up -d