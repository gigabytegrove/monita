package main

import (
	papiv1 "github.com/gigabytegrove/monita/plugin/api"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() papiv1.Info {
	return papiv1.Info{
		ModulePath: "github.com/gigabytegrove/monita/plugin/testing/broken/malformedconstructor",
	}
}

// Plugin is plugin instance
type Plugin struct{}

// Enable implements papiv1.Plugin
func (c *Plugin) Enable() error {
	return nil
}

// Disable implements papiv1.Plugin
func (c *Plugin) Disable() error {
	return nil
}

// NewMonitaPluginInstance is the Monita ABI entrypoint for creating a plugin instance.
func NewMonitaPluginInstance(ctx papiv1.UserContext) any {
	return &Plugin{}
}

func main() {
	panic("this is a broken plugin for testing purposes")
}
