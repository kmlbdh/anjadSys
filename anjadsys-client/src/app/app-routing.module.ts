import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/core/components/admin/admin.module')
      .then(m => m.AdminModule),
  },
  {
    path: 'agent',
    loadChildren: () => import('./modules/core/components/agent/agent.module')
      .then(m => m.AgentModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
