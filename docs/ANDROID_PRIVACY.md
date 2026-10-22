# Monita for Android — Privacy Policy

_Last updated: October 22, 2026_

Monita for Android is a client for a Monita-compatible self-hosted notification and messaging server. It does not operate a mandatory central account service, contain advertising SDKs, or include third-party usage analytics.

## Information processed

The app stores the address of the server you choose, account/session credentials, identity and server-capability information, and preferences needed for connectivity and notifications. It may cache message text, attached images, device-local protected-channel settings, and diagnostic logs in Android-private storage.

The app exchanges notification messages, chats, channel membership information, images/attachments, and account or administrative requests with the configured server when needed to provide its functions. Your chosen server's operator controls that server's data and retention practices.

## Device authentication and network connections

Monita uses Android's authentication APIs for optional local App Lock and protected Channels; Monita does not receive your biometric templates, PIN, or device password. Protected notification content is redacted until unlocked.

Messages and attachments can be shown as Android system notifications. Some media may be fetched from HTTP(S) URLs supplied by the configured server. For remote connections, use a trusted HTTPS server; local-network HTTP is also supported for self-hosting.

## Diagnostics and sharing

Local logs are intended for troubleshooting. Sensitive tokens and full message bodies are excluded from normal transport logging. Diagnostics are not automatically uploaded to Gigabyte Grove. If you send a diagnostic log to a support contact, the recipient can process the information you choose to share.

Monita does not sell user data.

## Deletion and control

You may sign out and clear locally stored app data using Android settings. For data stored on your self-hosted server—including accounts, chats and attachments—contact the operator or administrator of that server and use its administrative/deletion controls. Uninstalling the Android client does not erase server data.

## Third-party services

Google Play, Android, your device manufacturer, your network provider, any separately configured identity provider, and your chosen server operator may process information under their own privacy policies.

## Contact and source

Project source and issues: https://github.com/gigabytegrove/monita

Monita is developed by Gigabyte Grove as a customized open-source notification client. See the associated source repository's license and attribution materials.
