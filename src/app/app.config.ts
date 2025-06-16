import { ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {HttpClient, HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { AlertService } from '../services/alert.service';





const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, './i18n/', '.json');


const AuthInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn)=> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization',`Bearer ${token}`)
      });
      return next(clonedRequest);
    }
  }
  return next(req);
}

const LanguageInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn) => {
  
  if (typeof window !== 'undefined') {
    const currentLang = localStorage.getItem('selectedLang') || 'it';
    const clonedRequest = req.clone({
      headers: req.headers.set('CurrentLanguage', currentLang)
    });
    return next(clonedRequest);
  }

  
  return next(req);
};


const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const alertService = inject(AlertService);
  
  return next(req).pipe(
    
    
    
    catchError((error: HttpErrorResponse) => {
      let customMessage = 'Errore sconosciuto';
      let alertType = 'danger';
      
      if (error.status === 404) {
        customMessage = error.error?.title ? `${error.error.title}: ${error.error.detail}` : 'Risorsa non trovata.';
      } else if (error.status === 500) {
        customMessage = 'Errore interno del server.';
      } else if (error.status === 0) {
        customMessage = 'Server non raggiungibile. Verifica la connessione.';
      } else if (error.status === 400 || error.status === 401) {
        customMessage = `${error.error?.title}: ${error.error?.detail}`;
      }
      else if (error.status === 401 || error.status === 403) {
        customMessage = `${error.error?.title}: ${error.error?.detail}`;
        window.location.href = 'http://localhost:4201/admin';
      }
      
      alertService.showAlert(customMessage, 5000, alertType);
      throw error;  
    })
  );
};





export const appConfig: ApplicationConfig = {
  providers: [ provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([LanguageInterceptor, AuthInterceptor, ErrorInterceptor]), withFetch()),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'it',
    })])
    ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({scrollPositionRestoration: 'top'})), provideClientHydration(withEventReplay())]
};
