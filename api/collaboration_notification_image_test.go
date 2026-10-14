package api

import (
	"testing"

	"github.com/gigabytegrove/monita/model"
)

func TestCanPostToChannelOwnerWithoutMembership(t *testing.T) {
	app := &model.Application{UserID: 7}
	user := &model.User{ID: 7}

	if !canPostToChannel(app, nil, user) {
		t.Fatal("Channel owner must be allowed to post without a separate membership row")
	}
}

func TestCanPostToChannelAdminWithoutMembership(t *testing.T) {
	app := &model.Application{UserID: 9}
	user := &model.User{ID: 7, Admin: true}

	if !canPostToChannel(app, nil, user) {
		t.Fatal("administrator must be allowed to post without a separate membership row")
	}
}

func TestChannelImageMessageIdentityNotification(t *testing.T) {
	app := &model.Application{Name: "Important Notices"}
	user := &model.User{ID: 7, Name: "brad", DisplayName: "Brad"}

	title, senderID, senderName := channelImageMessageIdentity(
		app,
		user,
		false,
		"Back Doorbell Rung",
	)

	if title != "Back Doorbell Rung" {
		t.Fatalf("expected explicit notification title, got %q", title)
	}
	if senderID != 0 || senderName != "" {
		t.Fatalf(
			"Notification Channel image push must not be treated as a self-authored Chat message: senderID=%d senderName=%q",
			senderID,
			senderName,
		)
	}
}

func TestChannelImageMessageIdentityNotificationDefaultsToChannelName(t *testing.T) {
	app := &model.Application{Name: "Important Notices"}
	user := &model.User{ID: 7, Name: "brad"}

	title, senderID, senderName := channelImageMessageIdentity(app, user, false, "")

	if title != "Important Notices" {
		t.Fatalf("expected Channel name fallback, got %q", title)
	}
	if senderID != 0 || senderName != "" {
		t.Fatal("Notification Channel image push unexpectedly received Chat sender identity")
	}
}

func TestChannelImageMessageIdentityChat(t *testing.T) {
	app := &model.Application{Name: "Family Chat"}
	user := &model.User{ID: 7, Name: "brad", DisplayName: "Brad"}

	title, senderID, senderName := channelImageMessageIdentity(
		app,
		user,
		true,
		"Ignored title",
	)

	if title != "Brad" || senderID != 7 || senderName != "Brad" {
		t.Fatalf(
			"Chat identity changed: title=%q senderID=%d senderName=%q",
			title,
			senderID,
			senderName,
		)
	}
}

func TestMessageControlEnabled(t *testing.T) {
	message := &model.Message{
		Extras: []byte(`{"monita::controls":["assign","attach"]}`),
	}

	if !messageControlEnabled(message, "assign") {
		t.Fatal("assign control should be enabled")
	}
	if !messageControlEnabled(message, "attach") {
		t.Fatal("attach control should be enabled")
	}
	if messageControlEnabled(message, "resolve") {
		t.Fatal("resolve control should not be enabled")
	}
}

func TestMessageControlEnabledDefaultsOff(t *testing.T) {
	if messageControlEnabled(&model.Message{}, "assign") {
		t.Fatal("messages without control metadata must not expose assignment")
	}
	if messageControlEnabled(&model.Message{Extras: []byte(`{"monita::controls":"assign"}`)}, "assign") {
		t.Fatal("malformed control metadata must fail closed")
	}
}

func TestCanManageMessagePermissionMatrix(t *testing.T) {
	app := &model.Application{UserID: 7}
	message := &model.Message{SenderUserID: 12}
	tests := []struct {
		name       string
		user       *model.User
		membership *model.ApplicationMembership
		allow      bool
	}{
		{name: "owner without membership", user: &model.User{ID: 7}, allow: true},
		{name: "admin without membership", user: &model.User{ID: 99, Admin: true}, allow: true},
		{name: "nonmember", user: &model.User{ID: 13}, allow: false},
		{name: "sender with membership", user: &model.User{ID: 12}, membership: &model.ApplicationMembership{EffectiveRole: model.ChannelRoleMember}, allow: true},
		{name: "channel manager", user: &model.User{ID: 13}, membership: &model.ApplicationMembership{EffectiveRole: model.ChannelRoleManager}, allow: true},
		{name: "unrelated member", user: &model.User{ID: 13}, membership: &model.ApplicationMembership{EffectiveRole: model.ChannelRoleMember}, allow: false},
		{name: "nil user", user: nil, membership: &model.ApplicationMembership{EffectiveRole: model.ChannelRoleManager}, allow: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := canManageMessage(app, tt.membership, tt.user, message); got != tt.allow {
				t.Fatalf("canManageMessage()=%v, want %v", got, tt.allow)
			}
		})
	}
}
