import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { MenuComponent } from './menu/menu.component';
import { ProduitComponent } from './produit/produit.component'
import { ClientComponent } from './client/client.component'
import { CommandeComponent } from './commande/commande.component'
import { AnalyseComponent } from './analyse/analyse.component'
import { DetailclientComponent } from './detailclient/detailclient.component'
import { CommandedetailComponent } from './commandedetail/commandedetail.component'
import { ApprovisComponent } from './approvis/approvis.component'
import { CreatecommandeComponent } from './createcommande/createcommande.component'
import { CreateclientComponent } from './createclient/createclient.component'
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {path: '', component: StockComponent },
  {path: 'menu', component: MenuComponent },
  {path: 'stock', component: StockComponent },
  {path: 'stock/produit/:id', component: ProduitComponent },
  {path: 'client', component: ClientComponent },
  {path: 'commande/:search', component: CommandeComponent },
  {path: 'analyse', component: AnalyseComponent },
  {path: 'client/detailClient/:id', component: DetailclientComponent },
  {path: 'commande/detailcommande/:id', component: CommandedetailComponent },
  {path: 'approvisionnement', component: ApprovisComponent },
  {path: 'create', component: CreatecommandeComponent },
  {path: 'client/create', component: CreateclientComponent },
  {path: 'commande/invoice/:id', component: InvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
