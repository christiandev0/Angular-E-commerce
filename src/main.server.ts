import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);
if (process.env['NODE_ENV'] !== 'production') {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  }
  
export default bootstrap;
