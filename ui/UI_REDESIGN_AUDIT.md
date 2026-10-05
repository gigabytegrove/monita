# Monita 1.3.8-alpha Web UI redesign audit

This inventory records the exhaustive UI pass for the Monita server Web interface.

The pass was re-run against the actual branch tree after the structural redesign. Every file under `ui/` was reviewed. Text/code/config files were inspected for old visual patterns, stale version strings, default-link styling, local radius/shadow overrides, and legacy layout assumptions. Binary assets were checked by repository identity/role and retained where they remain canonical product assets.

## Design rules applied

- Monita server Web UI only. Android and Home Assistant are out of scope.
- No browser-default blue-link visual language.
- Low-radius, flat workspace geometry instead of bubble/card repetition.
- No decorative elevated cards for ordinary content.
- Chat uses transcript rows rather than speech bubbles.
- Notification history uses feed rows rather than floating cards.
- Dense administration stays table/list oriented.
- PWA/browser asset identity is versioned for 1.3.8-alpha.
- Existing functionality and permission wiring remain connected.
- Versioned browser/PWA assets identify this redesign as Monita 1.3.8-alpha.
- Local component overrides were normalized so lower-traffic screens cannot reintroduce the previous rounded-card visual language.
- The default application image and notification sound remain canonical functional assets and were intentionally not altered by a visual-layout redesign.

## Files reviewed

- `ui/.gitignore`
- `ui/.prettierrc`
- `ui/.yarnrc`
- `ui/UI_REDESIGN_AUDIT.md`
- `ui/eslint.config.mjs`
- `ui/index.html`
- `ui/package.json`
- `ui/public/manifest.json`
- `ui/public/static/defaultapp.png`
- `ui/public/static/monita-icon.svg`
- `ui/public/static/monita-logo.svg`
- `ui/public/static/notification.ogg`
- `ui/public/sw.js`
- `ui/serve.go`
- `ui/serve_test.go`
- `ui/src/CurrentUser.ts`
- `ui/src/ElevateStore.ts`
- `ui/src/admin/SystemAdministration.tsx`
- `ui/src/apiAuth.ts`
- `ui/src/application/AddApplicationDialog.tsx`
- `ui/src/application/AppStore.ts`
- `ui/src/application/Applications.tsx`
- `ui/src/application/ChannelCard.tsx`
- `ui/src/application/ChannelMembersDialog.tsx`
- `ui/src/application/UpdateApplicationDialog.tsx`
- `ui/src/audit/Audit.tsx`
- `ui/src/audit/AuditStore.ts`
- `ui/src/automation/Automation.tsx`
- `ui/src/client/AddClientDialog.tsx`
- `ui/src/client/ClientStore.ts`
- `ui/src/client/Clients.tsx`
- `ui/src/client/ElevateClientDialog.tsx`
- `ui/src/client/UpdateClientDialog.tsx`
- `ui/src/clipboard.ts`
- `ui/src/common/BaseStore.ts`
- `ui/src/common/ConfirmDialog.tsx`
- `ui/src/common/ConnectionErrorBanner.tsx`
- `ui/src/common/Container.tsx`
- `ui/src/common/CopyableSecret.tsx`
- `ui/src/common/DefaultPage.tsx`
- `ui/src/common/ElevationForm.tsx`
- `ui/src/common/LastUsedCell.tsx`
- `ui/src/common/LoadingSpinner.tsx`
- `ui/src/common/Markdown.tsx`
- `ui/src/common/NotificationFields.tsx`
- `ui/src/common/NumberField.tsx`
- `ui/src/common/RemainingTime.tsx`
- `ui/src/common/ScrollUpButton.tsx`
- `ui/src/common/StatCard.tsx`
- `ui/src/common/SurfaceCard.tsx`
- `ui/src/common/TimeAgoFormatter.ts`
- `ui/src/common/TokenConfirmDialog.tsx`
- `ui/src/config.ts`
- `ui/src/dashboard/Dashboard.tsx`
- `ui/src/group/GroupStore.ts`
- `ui/src/group/Groups.tsx`
- `ui/src/index.tsx`
- `ui/src/integration/FirstPartyConnectors.tsx`
- `ui/src/integration/Integrations.tsx`
- `ui/src/layout/Header.tsx`
- `ui/src/layout/Layout.tsx`
- `ui/src/layout/Navigation.tsx`
- `ui/src/layout/theme.ts`
- `ui/src/message/ChatComposer.tsx`
- `ui/src/message/ChatConversation.tsx`
- `ui/src/message/ChatMessage.tsx`
- `ui/src/message/Message.tsx`
- `ui/src/message/MessageCollaboration.tsx`
- `ui/src/message/MessageSearchDialog.tsx`
- `ui/src/message/Messages.tsx`
- `ui/src/message/MessagesStore.ts`
- `ui/src/message/PushMessageDialog.tsx`
- `ui/src/message/WebSocketStore.ts`
- `ui/src/message/extras.ts`
- `ui/src/passkey.ts`
- `ui/src/plugin/PluginDetailView.tsx`
- `ui/src/plugin/PluginStore.ts`
- `ui/src/plugin/Plugins.tsx`
- `ui/src/react-app-env.d.ts`
- `ui/src/reactions.ts`
- `ui/src/registerServiceWorker.ts`
- `ui/src/snack/SnackManager.ts`
- `ui/src/snack/browserNotification.ts`
- `ui/src/stores.tsx`
- `ui/src/tests/application.test.ts`
- `ui/src/tests/authentication.ts`
- `ui/src/tests/client.test.ts`
- `ui/src/tests/dex.ts`
- `ui/src/tests/elevation.test.ts`
- `ui/src/tests/message.test.ts`
- `ui/src/tests/oidc.test.ts`
- `ui/src/tests/plugin.test.ts`
- `ui/src/tests/selector.ts`
- `ui/src/tests/setup.ts`
- `ui/src/tests/user.test.ts`
- `ui/src/tests/utils.ts`
- `ui/src/typedef/notifyjs.d.ts`
- `ui/src/types.ts`
- `ui/src/update/UpdateStatus.tsx`
- `ui/src/update/release.test.ts`
- `ui/src/update/release.ts`
- `ui/src/update/status.test.ts`
- `ui/src/update/status.ts`
- `ui/src/user/AddEditUserDialog.tsx`
- `ui/src/user/Login.tsx`
- `ui/src/user/Register.tsx`
- `ui/src/user/Settings.tsx`
- `ui/src/user/UserStore.ts`
- `ui/src/user/Users.tsx`
- `ui/tsconfig.json`
- `ui/tsconfig.prod.json`
- `ui/tsconfig.test.json`
- `ui/vite-env.d.ts`
- `ui/vite.config.ts`
- `ui/vitest.config.js`
- `ui/yarn.lock`

**Total UI files reviewed: 116.**

Validation branch: `ui/monita-1.4-redesign`.


## Findings corrected during the exhaustive pass

- Removed remaining rounded sub-panels from administration, automation, integrations, settings, plugins, update status, search, chat composer, notification details, and collaboration views.
- Removed the decorative dotted chat wallpaper in favor of the shared workspace background.
- Re-versioned the service-worker shell cache after the redesign.
- Aligned browser tile metadata with the new shell.
- Confirmed browser links inherit the Monita interface color instead of default browser-blue styling.
- Confirmed `VERSION`, `ui/package.json`, PWA manifest asset URLs, login branding, and header branding target 1.3.8-alpha.

The review inventory below is therefore the completion checklist, not merely a planned file list.
