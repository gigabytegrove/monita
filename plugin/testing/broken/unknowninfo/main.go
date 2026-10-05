package main

// GetMonitaPluginInfo returns the Monita plugin ABI information
func GetMonitaPluginInfo() string {
	return "github.com/gigabytegrove/monita/plugin/testing/broken/unknowninfo"
}

func main() {
	panic("this is a broken plugin for testing purposes")
}
