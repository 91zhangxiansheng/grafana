import { getLocationService } from '@grafana/runtime';
import { coreModule } from '../core';
import { RouteProvider } from './patch/RouteProvider';
import { RouteParamsProvider } from './patch/RouteParamsProvider';

const registerInterceptedLinkDirective = () => {
  coreModule.directive('a', () => {
    return {
      restrict: 'E', // only Elements (<a>),
      link: (scope, elm, attr) => {
        // every time you click on the link
        elm.on('click', ($event) => {
          const href = elm.attr('href');
          if (href) {
            $event.preventDefault();
            $event.stopPropagation();

            // TODO: refactor to one method insted of chain
            getLocationService().getHistory().push(elm.attr('href'));
            return false;
          }

          return true;
        });
      },
    };
  });
};

// Neutralizing Angular’s location tampering
// https://stackoverflow.com/a/19825756
const tamperAngularLocation = () => {
  coreModule.config([
    '$provide',
    ($provide: any) => {
      $provide.decorator('$browser', [
        '$delegate',
        ($delegate: any) => {
          $delegate.onUrlChange = () => {};
          $delegate.url = () => '';

          return $delegate;
        },
      ]);
    },
  ]);
};
// Intercepting $location service with implementation based on history
const interceptAngularLocation = () => {
  // debugger;
  coreModule.config([
    '$provide',
    ($provide: any) => {
      $provide.decorator('$location', [
        '$delegate',
        ($delegate: any) => {
          $delegate = getLocationService();
          return $delegate;
        },
      ]);
    },
  ]);
  coreModule.provider('$route', RouteProvider);
  coreModule.provider('$routeParams', RouteParamsProvider);
};

const bridgeReactAngularRouting = () => {
  registerInterceptedLinkDirective();
  tamperAngularLocation();
  interceptAngularLocation();
};

export default bridgeReactAngularRouting;
