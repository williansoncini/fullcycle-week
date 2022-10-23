# Comandos

# Aula 01

```shell
# Subir os containers
docker compose up -d

# Acessar o container do simulador
docker exec -it simulator bash

# Habilitar o go mod
go mod init github.com/williansoncini/fullcycle-week

# Rodar o go
go run main.go

# Kafka

## testes

kafka-console-consumer --bootstrap-server=localhost:9092 --topic=readtest
kafka-console-producer --bootstrap-server=localhost:9092 --topic=readtest

## Produção
kafka-console-producer --bootstrap-server=localhost:9092 --topic=route.new-direction
kafka-console-consumer --bootstrap-server=localhost:9092 --topic=route.new-position --group=terminal
```
# Aula 02

```shell
# Criar o projeto com nest
npx @nestjs/cli new nest-api

docker compose exec app bash

# Administração via nest
nest
nest generate resource routes 
# RestApi



npm i mongoose @nestjs/mongoose --save
```
