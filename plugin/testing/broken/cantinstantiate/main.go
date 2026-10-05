package main

import (
	"errors"

	papiv1 "github.com/gigabytegrove/monita/plugin/api"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() plugin.Info {
	return plugin.Info{
		ModulePath: "github.com/gigabytegrove/monita/plugin/testing/broken/noinstance",
	}
}

// Plugin is plugin instance
type Plugin struct{}

// Enable implements plugin.Plugin
func (c *Plugin) Enable() error {
	return errors.New("cannot instantiate")
}

// Disable implements plugin.Plugin
func (c *Plugin) Disable() error {
	return nil
}

// NewMonitaPluginInstance is the Monita ABI entrypoint for creating a plugin instance.
func NewMonitaPluginInstance(ctx plugin.UserContext) plugin.Plugin {
	return &Plugin{}
}

func main() {
	panic("this is a broken plugin for testing purposes")
}
