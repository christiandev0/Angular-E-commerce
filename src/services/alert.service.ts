import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertContainer: HTMLElement | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    
    if (this.isBrowser) {
      
      setTimeout(() => {
        this.createAlertContainer();
      });
    }
  }
 
  private createAlertContainer(): void {
    if (!this.isBrowser) return;
    
   
    this.alertContainer = document.getElementById('alert-container');
    
    if (!this.alertContainer) {
      
      this.alertContainer = document.createElement('div');
      this.alertContainer.id = 'alert-container';
      this.alertContainer.style.position = 'fixed';
      this.alertContainer.style.top = '20px';
      this.alertContainer.style.right = '20px';
      this.alertContainer.style.zIndex = '9999';
      document.body.appendChild(this.alertContainer);
    }
  }

  
  showAlert(message: string, duration: number = 5000, type: string): void {
    if (!this.isBrowser) return;
    
    if (!this.alertContainer) {
      this.createAlertContainer();
    }

   
    if (!this.alertContainer) return;

    
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} alert-dismissible fade show`;
    alertEl.setAttribute('role', 'alert');
    
    
    let prefix = '';
    if (type === 'danger') prefix = 'Errore: ';
    else if (type === 'success') prefix = 'Successo: ';
    else if (type === 'warning') prefix = '⚠️ Attenzione: ';
    else if (type === 'info') prefix = 'Info: ';

    alertEl.innerHTML = `
      ${prefix}${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    
    this.alertContainer.appendChild(alertEl);

    
    setTimeout(() => {
      this.removeAlert(alertEl);
    }, duration);
  }

  
  private removeAlert(alertEl: HTMLElement): void {
    if (!this.isBrowser) return;
    
    alertEl.classList.remove('show');
    setTimeout(() => {
      if (alertEl.parentElement) {
        alertEl.remove();
      }
    }, 150);
  }
  
  
  
}