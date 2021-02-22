package coreplugin

import (
	"context"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/plugins/backendplugin/instrumentation"
	backendmodels "github.com/grafana/grafana/pkg/plugins/backendplugin/models"
	pluginmodels "github.com/grafana/grafana/pkg/plugins/models"
)

// corePlugin represents a plugin that's part of Grafana core.
type corePlugin struct {
	isTSDBPlugin bool
	pluginID     string
	logger       log.Logger
	backend.CheckHealthHandler
	backend.CallResourceHandler
	backend.QueryDataHandler
}

// New returns a new backendmodels.PluginFactoryFunc for creating a core (built-in) backendmodels.Plugin.
func New(opts backend.ServeOpts) backendmodels.PluginFactoryFunc {
	return func(pluginID string, logger log.Logger, env []string) (backendmodels.Plugin, error) {
		return &corePlugin{
			pluginID:            pluginID,
			logger:              logger,
			CheckHealthHandler:  opts.CheckHealthHandler,
			CallResourceHandler: opts.CallResourceHandler,
			QueryDataHandler:    opts.QueryDataHandler,
		}, nil
	}
}

func (cp *corePlugin) PluginID() string {
	return cp.pluginID
}

func (cp *corePlugin) Logger() log.Logger {
	return cp.logger
}

func (cp *corePlugin) CanHandleTSDBQueries() bool {
	return cp.isTSDBPlugin
}

func (cp *corePlugin) TSDBQuery(ctx context.Context, dsInfo *models.DataSource,
	tsdbQuery pluginmodels.TSDBQuery) (pluginmodels.TSDBResponse, error) {
	// TODO: Inline the adapter
	adapter := newQueryEndpointAdapter(cp.pluginID, cp.logger, instrumentation.InstrumentQueryDataHandler(
		cp.QueryDataHandler))
	return adapter.TSDBQuery(ctx, dsInfo, tsdbQuery)
}

func (cp *corePlugin) Start(ctx context.Context) error {
	if cp.QueryDataHandler != nil {
		cp.isTSDBPlugin = true
	}
	return nil
}

func (cp *corePlugin) Stop(ctx context.Context) error {
	return nil
}

func (cp *corePlugin) IsManaged() bool {
	return true
}

func (cp *corePlugin) Exited() bool {
	return false
}

func (cp *corePlugin) CollectMetrics(ctx context.Context) (*backend.CollectMetricsResult, error) {
	return nil, backendmodels.ErrMethodNotImplemented
}

func (cp *corePlugin) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	if cp.CheckHealthHandler != nil {
		return cp.CheckHealthHandler.CheckHealth(ctx, req)
	}

	return nil, backendmodels.ErrMethodNotImplemented
}

func (cp *corePlugin) CallResource(ctx context.Context, req *backend.CallResourceRequest, sender backend.CallResourceResponseSender) error {
	if cp.CallResourceHandler != nil {
		return cp.CallResourceHandler.CallResource(ctx, req, sender)
	}

	return backendmodels.ErrMethodNotImplemented
}
