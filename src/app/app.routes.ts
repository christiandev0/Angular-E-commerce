import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { CarrelloComponent } from './carrello/carrello.component';
import { OrdineComponent } from './ordine/ordine.component';


export const routes: Routes = [
    {path: 'details', component: DetailsComponent},
    {path: 'details/:FilmId', component: DetailsComponent},
    {path: 'homepage', component: HomeComponent},
    {path: '', redirectTo: 'homepage', pathMatch: 'full'},
    {path: 'catalogo', component: CatalogoComponent},
    {path: 'register', component: AuthComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    {path: 'carrello', component: CarrelloComponent, canActivate: [AuthGuardService]},
    {path: 'ordini', component: OrdineComponent, canActivate: [AuthGuardService]}
];