package models

type PluginSignatureStatus string

const (
	PluginSignatureInternal PluginSignatureStatus = "internal" // core plugin, no signature
	PluginSignatureValid    PluginSignatureStatus = "valid"    // signed and accurate MANIFEST
	PluginSignatureInvalid  PluginSignatureStatus = "invalid"  // invalid signature
	PluginSignatureModified PluginSignatureStatus = "modified" // valid signature, but content mismatch
	PluginSignatureUnsigned PluginSignatureStatus = "unsigned" // no MANIFEST file
)

type PluginState string

const (
	PluginStateAlpha PluginState = "alpha"
)

type PluginSignatureType string

const (
	grafanaType PluginSignatureType = "grafana"
	PrivateType PluginSignatureType = "private"
)

type PluginSignatureState struct {
	Status     PluginSignatureStatus
	Type       PluginSignatureType
	SigningOrg string
}
