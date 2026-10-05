package api

import (
	"crypto/sha256"
	"encoding/hex"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRuntimeAssetName(t *testing.T) {
	name, err := runtimeAssetName("linux", "amd64")
	require.NoError(t, err)
	assert.Equal(t, "monita-linux-amd64", name)

	name, err = runtimeAssetName("linux", "arm64")
	require.NoError(t, err)
	assert.Equal(t, "monita-linux-arm64", name)

	_, err = runtimeAssetName("linux", "386")
	assert.Error(t, err)

	_, err = runtimeAssetName("windows", "amd64")
	assert.Error(t, err)
}

func TestVerifyReleaseChecksum(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "monita-linux-amd64")
	content := []byte("monita-runtime")
	require.NoError(t, os.WriteFile(path, content, 0o600))

	sum := sha256.Sum256(content)
	checksums := hex.EncodeToString(sum[:]) + "  monita-linux-amd64\n"

	require.NoError(t, verifyReleaseChecksum(path, checksums, "monita-linux-amd64"))
	assert.Error(t, verifyReleaseChecksum(path, checksums, "monita-linux-arm64"))
}

func TestFinalizeRestartMarksUpdateCompleted(t *testing.T) {
	dir := t.TempDir()
	api := UpdateAPI{
		StatusFile: filepath.Join(dir, "status.json"),
		RuntimeDir: filepath.Join(dir, "runtime"),
		Repository: "gigabytegrove/monita",
	}

	started := time.Now().UTC().Add(-time.Minute)
	require.NoError(t, api.writeStatus(managedUpdateStatus{
		Ready:     true,
		State:     "restarting",
		Version:   "1.1.2",
		Step:      "Restarting Monita",
		Progress:  98,
		StartedAt: &started,
	}))

	api.finalizeRestart()

	status, err := api.readStatus()
	require.NoError(t, err)
	assert.Equal(t, "completed", status.State)
	assert.Equal(t, 100, status.Progress)
	assert.Equal(t, "Update complete", status.Step)
	require.NotNil(t, status.FinishedAt)
}

func TestUpdateStateActive(t *testing.T) {
	for _, state := range []string{"preparing", "downloading", "verifying", "installing", "restarting"} {
		assert.True(t, updateStateActive(state), state)
	}
	for _, state := range []string{"", "idle", "completed", "failed"} {
		assert.False(t, updateStateActive(state), state)
	}
}

func TestUpdateVersionPatternAcceptsReleaseChannels(t *testing.T) {
	for _, version := range []string{
		"1.3.8",
		"1.3.9-alpha",
		"1.3.9-alpha.2",
		"1.3.9-beta.1",
		"1.3.9-rc.1",
		"1.3.9+build.7",
	} {
		assert.True(t, updateVersionPattern.MatchString(version), version)
	}

	for _, version := range []string{
		"v1.3.9-alpha",
		"1.3",
		"1.3.9-",
		"master-local",
		"1.3.9 alpha",
	} {
		assert.False(t, updateVersionPattern.MatchString(version), version)
	}
}
