import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe, registerLocaleData } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockComponent } from './stock/stock.component';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProduitComponent } from './produit/produit.component';
import { VarianteComponent } from './dialog/variante/variante.component';
import { ApprovComponent } from './dialog/approv/approv.component';
import { ClientComponent } from './client/client.component';
import { CommandeComponent } from './commande/commande.component';
import { AnalyseComponent } from './analyse/analyse.component';
import { LoginComponent } from './login/login.component';
import { DetailclientComponent } from './detailclient/detailclient.component';
import { CommandedetailComponent } from './commandedetail/commandedetail.component';
import { ApprovisComponent } from './approvis/approvis.component';
import { AprovdtlComponent } from './btmsheet/aprovdtl/aprovdtl.component';
import { CreatecommandeComponent } from './createcommande/createcommande.component';
import { CreateclientComponent } from './createclient/createclient.component';
import { AddarticleComponent } from './addarticle/addarticle.component';
import { UpdatevarComponent } from './dialog/updatevar/updatevar.component';
import { SelectprodComponent } from './dialog/selectprod/selectprod.component';
import { MomentDatePipe } from './pipe/moment-date.pipe';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrderQuantitePipe } from './pipe/order-quantite.pipe';
import { OrderAlphaPipe } from './pipe/order-alpha.pipe';
import { AddoptComponent } from './dialog/addopt/addopt.component';
import { UpdateclientComponent } from './dialog/updateclient/updateclient.component';


@NgModule({
  declarations: [
    AppComponent,
    StockComponent,
    MenuComponent,
    ProduitComponent,
    VarianteComponent,
    ApprovComponent,
    ClientComponent,
    CommandeComponent,
    AnalyseComponent,
    LoginComponent,
    DetailclientComponent,
    CommandedetailComponent,
    ApprovisComponent,
    AprovdtlComponent,
    CreatecommandeComponent,
    CreateclientComponent,
    AddarticleComponent,
    UpdatevarComponent,
    SelectprodComponent,
    MomentDatePipe,
    InvoiceComponent,
    OrderQuantitePipe,
    OrderAlphaPipe,
    AddoptComponent,
    UpdateclientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDqdZVMjrIL45mq_slid4azOXuIwxru2Kk",
      authDomain: "metaagro-2b5f6.firebaseapp.com",
      projectId: "metaagro-2b5f6",
      storageBucket: "metaagro-2b5f6.appspot.com",
      messagingSenderId: "421762116313",
      appId: "1:421762116313:web:e4ab3e410890a520906cc8",
      measurementId: "G-004YY388SE"
    }),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSelectModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    Ng2SearchPipeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
