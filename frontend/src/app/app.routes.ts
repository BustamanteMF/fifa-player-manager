import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-guard';

export const routes: Routes = [
	{ path: 'login', loadComponent: () => import ('./components/login/login.component').then(m => m.LoginComponent) },
	{ path: 'players', loadComponent: () => import ('./components/player-list/player-list').then(m => m.PlayerListComponent), canActivate: [AuthGuard] },
	{ path: 'players/new', loadComponent: () => import ('./components/player-form/player-form').then(m => m.PlayerFormComponent), canActivate: [AuthGuard] },
	{ path: 'players/edit/:id', loadComponent: () => import ('./components/player-form/player-form').then(m => m.PlayerFormComponent), canActivate: [AuthGuard] },
	{ path: 'players/:id', loadComponent: () => import ('./components/player-detail/player-detail').then(m => m.PlayerDetailComponent), canActivate: [AuthGuard] },
	{ path: '', redirectTo: '/login', pathMatch: 'full'}
];
