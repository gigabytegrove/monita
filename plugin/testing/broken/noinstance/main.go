package main

import (
	papiv1 "github.com/gigabytegrove/monita/plugin/api"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() plugin.Info {
	return plugin.Info{
		ModulePath: "github.com/gigabytegrove/monita/plugin/testing/broken/noinstance",
	}
}

func main() {
	panic("this is a broken plugin for testing purposes")
}
