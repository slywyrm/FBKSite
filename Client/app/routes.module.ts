import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReelAdminComponent } from './components/admin/reel/reel-admin.component';
import { PortfolioAdminComponent } from './components/admin/portfolio/portfolio-admin.component';
import { PortfolioElAdminComponent } from './components/admin/portfolio/portfolio-el/portfolio-el-admin.component';
import { ServicesAdminComponent } from './components/admin/services/services-admin.component';
import { CompanyAdminComponent } from './components/admin/company/company-admin.component';
import { ContactsAdminComponent } from './components/admin/contacts/contacts-admin.component';
import { AuthGuard } from './shared/auth-guard.service';

const appRoutes: Routes = [
    { 
        path: 'home/:section', 
        component: HomeComponent,
    },
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'reel',
                component: ReelAdminComponent
            },
            {
                path: 'portfolio',
                component: PortfolioAdminComponent
            },
            {
                path: 'portfolio/:id',
                component: PortfolioElAdminComponent
            },
            {
                path: 'company',
                component: CompanyAdminComponent
            },
            {
                path: 'services',
                component: ServicesAdminComponent
            },
            {
                path: 'contacts',
                component: ContactsAdminComponent
            },
            {
                path: '',
                redirectTo: 'reel',
                pathMatch: 'full'
            }
        ]
    },
    { path: '', redirectTo: 'home/reel', pathMatch: 'full' },
    { path: '**', redirectTo: 'home/reel' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}