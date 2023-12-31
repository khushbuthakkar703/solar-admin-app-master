import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoPreloading, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, MinimalRouterStateSerializer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { Config, EvaluateAppConfig } from 'ng-shared/config';
import { AppComponent } from 'ng-shared/core/containers/app.component';
import { CoreModule } from 'ng-shared/core/core.module';
import { logger } from 'ng-shared/core/meta.reducers';
import { APP_TOKEN, HEADER_APPS_TOKEN, REDUCER_TOKEN } from 'ng-shared/core/tokens';

import { environment } from '../environments/environment';
import { headerAppsLinks, routes } from './evaluate-app.routes';

// entry point into Angular bootstrap
@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    EffectsModule.forRoot([]),
    RouterModule.forRoot(routes, {
    preloadingStrategy: NoPreloading,
    useHash: false,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
  }),
    // Turned off: does not work correctly anyways.
    // Note: there may be conflict with Sentry
    // ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    StoreModule.forRoot(REDUCER_TOKEN, {
      metaReducers: !environment.production ? [logger] : [],
      runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }
    }),
    StoreRouterConnectingModule.forRoot({ serializer: MinimalRouterStateSerializer }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    { provide: EvaluateAppConfig, useExisting: Config },
    { provide: APP_TOKEN, useValue: 'evaluate' },
    { provide: HEADER_APPS_TOKEN, useValue: headerAppsLinks }
  ]
})
export class EvaluateAppModule {}
