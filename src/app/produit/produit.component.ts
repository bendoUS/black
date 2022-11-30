import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TraitementService } from '../services/traitement.service'
import { Variante, ApprovData } from '../models/produit';
import { Produits } from '../models/produit';
import { AddoptComponent } from '../dialog/addopt/addopt.component';


import { VarianteComponent } from '../dialog/variante/variante.component';
import { ApprovComponent } from '../dialog/approv/approv.component';
import { UpdatevarComponent } from '../dialog/updatevar/updatevar.component';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss']
})
export class ProduitComponent implements OnInit {

  idProduit: any = this.route.snapshot.paramMap.get('id');

  produitObj: Produits = {
    designation: '',
    statut: '',
    quantite: 0,
    categorie: '',
    dateCreation: '',
    labelVariante: []
  };

  detailProduct: any = [];
  listeVariante: Array<any> = [];

  noVariant = true;
  value = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  allFruits: any = [];

  varianteObj: Variante = {
    proprieteVariante: ["Très grand"],
    quantite: 100
  }

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;
  produitList: any[] | undefined;

  constructor(private router: Router, public dialog: MatDialog, private route: ActivatedRoute, private traitement: TraitementService, private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    //this.addVariante(this.route.snapshot.paramMap.get('id'))
    if (this.route.snapshot.paramMap.get('id') == 'New') {
      this.detailProduct = {
        designation: 'Nouveau Porduit',
        statut: '',
        quantite: 0,
        categorie: '',
        dateCreation: '',
        labelVariante: []
      }
    }
    else {
      this.getProduct(this.route.snapshot.paramMap.get('id'));
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (this.detailProduct.labelVariante.includes(value) == true) {
      // Clear the input value
      event.chipInput!.clear();
      return;
    }
    if (value) {
      this.detailProduct.labelVariante.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {

    const index = this.detailProduct.labelVariante.indexOf(fruit);

    if (index >= 0) {
      this.detailProduct.labelVariante.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.detailProduct.labelVariante.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  changePage(data: any) {
    this.router.navigate(['/', data]);
  }


  createVariante() {
    const dialogRef = this.dialog.open(VarianteComponent,
      {
        data: { idProduit: this.idProduit, variante: this.listeVariante, detailPr: this.detailProduct }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateVar(idVar: any) {
    //console.log(this.detailProduct.labelVariante)
    const dialogRef = this.dialog.open(UpdatevarComponent,
      {
        data: { idProduit: this.idProduit, varianteId: idVar, labelVariant: this.detailProduct.labelVariante}
      });
  }

  createApprov() {
    const dialogRef = this.dialog.open(ApprovComponent,
      {
        data: { idProduit: this.idProduit, variante: this.listeVariante }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getProduct(idProduct: any) {
    this.traitement.getByDoc('produit', idProduct).subscribe(res => {
      this.detailProduct = res.payload.data();
      const id = res.payload.id;

      this.traitement.getFromSubCollection('produit', id, 'variante').subscribe(result => {
        this.listeVariante = []
        result.map(e => {
          const data = e.payload.doc.data();
          data['varianteId'] = e.payload.doc.id;
          this.listeVariante.push(data);
        })
        console.log(this.listeVariante)
      })

    });

  }



  // Add Product with Variante labels
  addProduct() {

    if (this.route.snapshot.paramMap.get('id') == 'New') {
      this.detailProduct = {
        designation: this.detailProduct.designation,
        statut: this.detailProduct.statut,
        quantite: 0,
        categorie: this.detailProduct.categorie,
        dateCreation: new Date(),
        labelVariante: this.detailProduct.labelVariante
      }


      this.traitement.add('produit', this.detailProduct).then(res => {
        this.router.navigate(['/stock']);
      }).catch((error) => {
        console.log(error)
      });
    }
    else {
      this.updateProduct(this.route.snapshot.paramMap.get('id'));

    }

  }

  updateProduct(productId: any) {

    //this.detailProduct = [];

    this.detailProduct = {
      designation: this.detailProduct.designation,
      statut: this.detailProduct.statut,
      categorie: this.detailProduct.categorie
    }

    console.log(this.detailProduct)

    this.traitement.update('produit', productId, this.detailProduct).then(res => {
      console.log('updated');
    }).catch(error => { })
  }



  addOption() {
    if(this.detailProduct.labelVariante.length <= 2){
      const dialogRef = this.dialog.open(AddoptComponent,
        {
          data: { idProduit: this.idProduit }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
    else{
      this.openSnackBar("Vous ne pouvez plus ajouter d'option", 'Fermé', 2000)
    }
    
  }

  openSnackBar(message: string, action: string, duration: number) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
    this._snackBar.open(message, action, config);
  }


  
  }