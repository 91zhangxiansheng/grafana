import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContextSrv } from '../services/context_srv';

export interface GrafanaRoute<T, Q = any> extends RouteComponentProps<T> {
  // TODO[Router]: annotate types
  $injector: any;
  $rootScope: any;
  $contextSrv: ContextSrv;
  // Object representing current query string
  query: Partial<Record<keyof Q, any>>;
  // String describing current route
  routeInfo?: string;
}

export interface RouteDescriptor {
  path: string;
  reloadOnSearch?: boolean;
  component: React.ComponentType<GrafanaRoute<any, any>>;
  redirectTo?: string;
  roles?: () => string[];
  pageClass?: string;
  routeInfo?: string;
}
