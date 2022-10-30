Tudo isso foi tirado da imersão FullCycle, daquele pessoal que arrasa :)

# Comandos uteis

```shell
# Para não ter que ficar entrando toda hora no container @-@
docker exec -d simulator go run main.go

docker logs container_name

docker compose ps

watch docker compose ps
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

## Exemplos de rotas para o kafa

```json
[
  {
    "clientId":"a",
    "routeId":"1"
  },
  {
    "clientId":"b",
    "routeId":"2"
  },
  {
    "clientId":"c",
    "routeId":"3"
  }
]
```

# Build

Foi usado duas cloud

Primeiro a Confluent cloud para subir o kafka e segundo a GCP para subir os pods de backend e frontend

Ai para isso é necessário atualizar as variaves de ambiente com as credenciais das duas clouds

A Confluent vai gerar os ids 


Se for isso, aqui está a solução

[A Great Solution vm.max_map_count]([https://](https://stackoverflow.com/questions/57998092/docker-compose-error-bootstrap-checks-failed-max-virtual-memory-areas-vm-ma))

Em resumo é isso: 

```shell
sysctl -w vm.max_map_count=262144
```

## Docker buildando e subindo as imagens

```shell
sudo docker build -t williansoncini/imersao-simulator -f Dockerfile.prod .
sudo docker build -t williansoncini/imersao-backend -f Dockerfile.prod .
sudo docker build -t williansoncini/imersao-frontend -f Dockerfile.prod .

sudo docker push williansoncini/imersao-simulator
sudo docker push williansoncini/imersao-backend
sudo docker push williansoncini/imersao-frontend
```

## Helm - Instalando o mongo db no kubernetes

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami

helm install mongodb bitnami/mongodb --set=auth.rootPassword="root",auth.database="nest",auth.username="root"

export MONGODB_PASSWORD=$(kubectl get secret --namespace default mongodb -o jsonpath="{.data.mongodb-passwords}" | base64 -d | awk -F',' '{print $1}')

kubectl run --namespace default mongodb-client --rm --tty -i --restart='Never' --env="MONGODB_ROOT_PASSWORD=$MONGODB_ROOT_PASSWORD" --image docker.io/bitnami/mongodb:6.0.2-debian-11-r1 --command -- bash

mongosh admin --host "mongodb" --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD
```

## Nestjs

Para o nest se conectar corretamente com o kafka que agora está está em núvem, é necessário a configuração de SSL e SASl, então se estiver comentado no código é necessário descomentar, principalmente nos arquivos: `src/main.ts` | `src/routes/routes.module.ts`

## Simulator

Mesmo esquema que o Nestjs, nos arquivos `infra/kafka/consumer.go` e `infra/kafka/producer.go` é necessário descomentar caso queira rodar com kubernetes em produção, mas se for apenas teste, pode deixar comentado

## Kubernetes

### Aplicando os configmaps

```shell
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/frontend/configmap.yaml
kubectl apply -f k8s/simulator/configmap.yaml
```

### Aplicando os deploys

```shell
kubectl apply -f k8s/backend/deploy.yaml
kubectl apply -f k8s/frontend/deploy.yaml
kubectl apply -f k8s/simulator/deploy.yaml
```

### Aplicando os services

Somente o backend vai precisar do loadbalancer, então é somente um service.yml

```shell
kubectl apply -f k8s/backend/service.yaml
```

Mas caso no futuro exista muitos services, é melhor um ingress para redirecionar o trafego através de um único IP

### Pegando o services

Usado principalmente para pegar o IP do loadbalancer do backend

```shell
kubectl get svc
```

### Parar o cluster para não ficar zerado no money

```shell
# Interromper
gcloud dataproc clusters stop cluster-name --region=region

# Iniciar
gcloud dataproc clusters start cluster-name --region=region
```

# Lembrete

Se lembre de pegar as credenciais na núvem para produção :3

Para esse projeto em produção foi utilizado

GCP e ClonfluentCloud 

## GCP

- GoogleMaps API
- Cluster para o kubernetes

# ClonfluentCloud

- Todo o ambiente Kafka (É bem tranquilo de configurar)