package tasks

// Task types
const (
	// TaskSendRequest is the task type for sending a request to a given endpoint with a given header and body
	TaskSendRequest = "send-request"

	// TaskCron is the task to periodically run a task based on a cron spec
	TaskCron = "cron"
)
