package kafka

import (
	"encoding/json"
	route2 "github.com/williansoncini/fullcycle-week/application/route"
	"github.com/williansoncini/fullcycle-week/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
	"time"
)
// {"clientId":"1", "routeId":"1"}
// {"clientId":"1", "routeId":"2"}
// {"clientId":"1", "routeId":"3"}
// func Produce(msg *ckafka.Message) {
// 	producer := kafka.NewKafkaProducer()
// 	route := route2.NewRoute()
// 	json.Unmarshal(msg.Value, &route)
// 	route.LoadPositions()
// 	positions, err := route.ExportJsonPositions()
// 	if err != nil {
// 		log.Println(err.Error())
// 	}
// 	for _, p := range positions {
// 		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
// 		time.Sleep(time.Millisecond * 500)
// 	}
// }
func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	route := route2.NewRoute()
	json.Unmarshal(msg.Value, &route)
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Println(err.Error())
	}
	for _, p := range positions {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
		time.Sleep(time.Millisecond * 1000)
	}
}