package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/url"

	papiv1 "github.com/gigabytegrove/monita/plugin/api"
	"github.com/gin-gonic/gin"
)

// GetMonitaPluginInfo returns the Monita plugin ABI information.
func GetMonitaPluginInfo() papiv1.Info {
	return papiv1.Info{
		ModulePath: "github.com/gigabytegrove/monita/plugin/example/echo",
		Name:       "test plugin",
	}
}

// EchoPlugin is the Monita plugin instance.
type EchoPlugin struct {
	msgHandler     papiv1.MessageHandler
	storageHandler papiv1.StorageHandler
	config         *Config
	basePath       string
}

// SetStorageHandler implements papiv1.Storager
func (c *EchoPlugin) SetStorageHandler(h papiv1.StorageHandler) {
	c.storageHandler = h
}

// SetMessageHandler implements papiv1.Messenger.
func (c *EchoPlugin) SetMessageHandler(h papiv1.MessageHandler) {
	c.msgHandler = h
}

// Storage defines the plugin storage scheme
type Storage struct {
	CalledTimes int `json:"called_times"`
}

// Config defines the plugin config scheme
type Config struct {
	MagicString string `yaml:"magic_string"`
}

// DefaultConfig implements papiv1.Configurer
func (c *EchoPlugin) DefaultConfig() any {
	return &Config{
		MagicString: "hello world",
	}
}

// ValidateAndSetConfig implements papiv1.Configurer
func (c *EchoPlugin) ValidateAndSetConfig(config any) error {
	c.config = config.(*Config)
	return nil
}

// Enable enables the papiv1.
func (c *EchoPlugin) Enable() error {
	log.Println("echo plugin enabled")
	return nil
}

// Disable disables the papiv1.
func (c *EchoPlugin) Disable() error {
	log.Println("echo plugin disbled")
	return nil
}

// RegisterWebhook implements papiv1.Webhooker.
func (c *EchoPlugin) RegisterWebhook(baseURL string, g *gin.RouterGroup) {
	c.basePath = baseURL
	g.GET("/echo", func(ctx *gin.Context) {
		storage, _ := c.storageHandler.Load()
		conf := new(Storage)
		json.Unmarshal(storage, conf)
		conf.CalledTimes++
		newStorage, _ := json.Marshal(conf)
		c.storageHandler.Save(newStorage)

		c.msgHandler.SendMessage(papiv1.Message{
			Title:    "Hello received",
			Message:  fmt.Sprintf("echo server received a hello message %d times", conf.CalledTimes),
			Priority: 2,
			Extras: map[string]any{
				"plugin::name": "echo",
			},
		})
		ctx.Writer.WriteString(fmt.Sprintf("Magic string is: %s\r\nEcho server running at %secho", c.config.MagicString, c.basePath))
	})
}

// GetDisplay implements papiv1.Displayer.
func (c *EchoPlugin) GetDisplay(location *url.URL) string {
	loc := &url.URL{
		Path: c.basePath,
	}
	if location != nil {
		loc.Scheme = location.Scheme
		loc.Host = location.Host
	}
	loc = loc.ResolveReference(&url.URL{
		Path: "echo",
	})
	return "Echo plugin running at: " + loc.String()
}

// NewMonitaPluginInstance is the Monita ABI entrypoint for creating a plugin instance.
func NewMonitaPluginInstance(ctx papiv1.UserContext) papiv1.Plugin {
	return &EchoPlugin{}
}

func main() {
	panic("this should be built as go plugin")
}
