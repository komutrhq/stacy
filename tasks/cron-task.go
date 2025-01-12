package tasks

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hibiken/asynq"
)

type CronPayload struct {
	ID       string
	CronSpec string
	Action   string
	Payload  RequestPayload
}

func NewCronTask(ID string, CronSpec string,
	Action string,
	Payload RequestPayload) (*asynq.Task, error) {
	payload, err := json.Marshal(CronPayload{
		ID:       ID,
		CronSpec: CronSpec,
		Action:   Action,
		Payload:  Payload,
	})
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TaskCron, payload), nil
}

func HandleCronTask(ctx context.Context, t *asynq.Task) error {
	// Simulate handling a cron scheduler task
	fmt.Printf("[%s] Handling cron task %s %s\n", time.Now().Format("15:04:05"))
	return nil
}
