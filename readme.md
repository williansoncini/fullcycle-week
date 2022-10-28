# Comandos uteis

```shell
# Para não ter que ficar entrando toda hora no container @-@
docker exec -d simulator go run main.go

docker logs container_name

docker compose ps
```

# Informações uteis

## Host

Para tudo funcionar normalmente é necessário colocar um host no seu DNS interno

Arquivo /etc/hosts

Adicione essa linha

`172.17.0.1      host.docker.internal`

## Kafa e Go

Se der problema com as localizações na hora de atualizar o mapa ou na hora de plotar os dados no ES

Valide as posições de latitude e longitude na aplicação `go` pode estar com a posição invertida

## Elastic Search

Pode dar problema no es01 por conta da vm.max_map_count

Para validar se é isso mesmo, da uma olhada nos logs

```shell
docker logs es01
```

Se for isso, aqui está a solução

[A Great Solution vm.max_map_count]([https://](https://stackoverflow.com/questions/57998092/docker-compose-error-bootstrap-checks-failed-max-virtual-memory-areas-vm-ma))

Em resumo é isso: 

```shell
sysctl -w vm.max_map_count=262144
```
