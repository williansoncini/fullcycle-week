package kafka

import ckafka "github.com/confluentinc/confluent-kafka-go/kafka"

type KafkaConsumer struct {
	MsgChan chan *ckafka.Message
}

func(k *KafkaConsumer) Consume() {
	configMap := &kafka.ConfigMap{
		"bootsrap.servers": os.Getenv("KafkaBootStrapServers"),
		"group.id": os.GetEnv("KafkaConsumerGroupId"),
	}

	c, err := ckafka.NewConsumer(configMap)
	if err != nil {
		log.Fatalf("Error consuming kafka message: " + err.error())
	}
	topics := []string{os.Getenv("KafkaReadTopic")}
	c.SubscribeTopics(topics, nil)
	fmt.Println("Kafka consumer has been started")
	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			k.MsgChan <- msg
		}
	}
}