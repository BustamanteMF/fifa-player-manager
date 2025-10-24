import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';

// Component imports 
import { LoginComponent } from './components/login/login.component';
import { PlayerListComponent } from './components/player-list/player-list';
//import { PlayerFormComponent } from './components/player-form/player-form';
//import { PlayerDetailComponent } from './components/player-detail/player-detail';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'players', component: PlayerListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full'}
    //{ path: 'login', loadComponent: () => import ('./components/login/login.component').then(m => m.LoginComponent) },
    //{ path: 'players', loadComponent: () => import ('./components/player-list/player-list').then(m => m.PlayerListComponent), canActivate: [AuthGuard] },
    /*
    { path: 'players/new', loadComponent: () => import ('./components/player-form/player-form').then(m => m.PlayerFormComponent), canActivate: [AuthGuard] },
    { path: 'players/edit/:id', loadComponent: () => import ('./components/player-form/player-form').then(m => m.PlayerFormComponent), canActivate: [AuthGuard] },
    { path: 'players/:id', loadComponent: () => import ('./components/player-detail/player-detail').then(m => m.PlayerDetailComponent), canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full'}
    */
   /*
    { path: 'players', component: PlayerListComponent, canActivate: [AuthGuard] },
    { path: 'players/new', component: PlayerFormComponent, canActivate: [AuthGuard] },
    { path: 'players/edit/:id', component: PlayerFormComponent, canActivate: [AuthGuard] },
    { path: 'players/:id', component: PlayerDetailComponent, canActivate: [AuthGuard] },
    */
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }