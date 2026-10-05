package main

import (
	"time"

	papiv1 "github.com/gigabytegrove/monita/plugin/api"
	"github.com/robfig/cron"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() plugin.Info {
	return plugin.Info{
		Name:        "clock",
		Description: "Sends an hourly reminder",
		ModulePath:  "github.com/gigabytegrove/monita/example/clock",
	}
}

// Plugin is plugin instance
type Plugin struct {
	msgHandler  plugin.MessageHandler
	enabled     bool
	cronHandler *cron.Cron
}

// Enable implements plugin.Plugin
func (c *Plugin) Enable() error {
	c.enabled = true
	c.cronHandler = cron.New()
	c.cronHandler.AddFunc("0 0 * * *", func() {
		c.msgHandler.SendMessage(plugin.Message{
			Title:   "Tick Tock!",
			Message: time.Now().Format("It is 15:04:05 now."),
		})
	})
	c.cronHandler.Start()
	return nil
}

// Disable implements plugin.Plugin
func (c *Plugin) Disable() error {
	if c.cronHandler != nil {
		c.cronHandler.Stop()
	}
	c.enabled = false
	return nil
}

// SetMessageHandler implements plugin.Messenger.
func (c *Plugin) SetMessageHandler(h plugin.MessageHandler) {
	c.msgHandler = h
}

// NewMonitaPluginInstance is the Monita ABI entrypoint for creating a plugin instance.
func NewMonitaPluginInstance(ctx plugin.UserContext) plugin.Plugin {
	p := &Plugin{}

	return p
}

func main() {
	panic("this should be built as go plugin")
}
