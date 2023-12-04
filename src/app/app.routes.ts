import { Routes } from '@angular/router';

export const routes: Routes = [

    {path: 'task-list', loadComponent: () => import('./shared/components/task-list/task-list.component').then(mod => mod.TaskListComponent)},
];
