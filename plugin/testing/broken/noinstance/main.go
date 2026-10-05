package main

import (
	papiv1 "github.com/gigabytegrove/monita/plugin/api"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() papiv1.Info {
	return papiv1.Info{
		ModulePath: "github.com/gigabytegrove/monita/plugin/testing/broken/noinstance",
	}
}

func main() {
	panic("this is a broken plugin for testing purposes")
}
