package tasks

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hibiken/asynq"
)

type RequestPayload struct {
	Endpoint string
	Header   string
	Body     string
}

func NewRequestSenderTask(endpoint string, header string, body string) (*asynq.Task, error) {
	payload, err := json.Marshal(RequestPayload{
		Endpoint: endpoint,
		Header:   header,
		Body:     body,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TaskSendRequest, payload), nil
}

func HandleRequestSenderTask(ctx context.Context, t *asynq.Task) error {
	var p RequestPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("failed to parse task payload: %v", err)
	}

	// Simulate sending a request
	fmt.Printf("[%s] Sending request to %s with header %s and body %s\n", time.Now().Format("15:04:05"), p.Endpoint, p.Header, p.Body)
	return nil
}
