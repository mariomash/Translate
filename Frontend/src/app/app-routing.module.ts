import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateComponent } from './translate/translate.component';

const routes: Routes = [
  {
    path: '',
    component: TranslateComponent,
    pathMatch: 'full',
    data: {
      title: `${environment.appName}`,
      runGuardsAndResolvers: 'always'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
