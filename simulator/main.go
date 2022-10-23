package main

import (
	"fmt"
	// route2 "github.com/williansoncini/fullcycle-week/simulator/application/route"
	// ckafka2 "github.com/williansoncini/fullcycle-week/simulator/application/kafka"
	kafka2 "github.com/williansoncini/fullcycle-week/application/kafka"
	"github.com/williansoncini/fullcycle-week/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"log"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)
	// producer := kafka.NewKafkaProducer()

	go consumer.Consume()

	for msg := range msgChan {
		fmt.Println(string(msg.Value))
		go kafka2.Produce(msg)
	}

	// kafka.Publish("Olá", "readtest", producer)

	// route := route2.Route{
	// 	ID: "1",
	// 	ClientID: "1",
	// }

	// route.LoadPositions()
	// stringJson, _ := route.ExportJsonPositions()
	// fmt.Println(stringJson[0])
}

