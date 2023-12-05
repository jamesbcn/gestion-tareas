import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';


export const routes: Routes = [

    {path: '', redirectTo: 'task-list', pathMatch: 'full'},
    {path: 'task-list', canActivate: [AuthGuard], loadComponent: () => import('./shared/components/task-list/task-list.component').then(mod => mod.TaskListComponent)},
    {path: 'login', loadComponent: () => import('./auth/login/login.component').then(mod => mod.LoginComponent)}
];
