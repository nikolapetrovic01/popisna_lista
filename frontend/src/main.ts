import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideCharts, withDefaultRegisterables} from "ng2-charts";

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideAnimationsAsync(), provideCharts(withDefaultRegisterables())]
}).catch(err => console.error(err));
