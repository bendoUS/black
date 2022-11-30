import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProduitComponent } from 'src/app/produit/produit.component';
import { Variante, ApprovData } from 'src/app/models/produit';
import { TraitementService } from 'src/app/services/traitement.service';
import { I } from '@angular/cdk/keycodes';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-variante',
  templateUrl: './variante.component.html',
  styleUrls: ['./variante.component.scss']
})
export class VarianteComponent implements OnInit {

  varianteList: any;
  Vari1 : string = '';
  Vari2 : string = '';
  Vari3 : string = '';

  varianteObj : Variante = {
    proprieteVariante : [],
    quantite: 0
  }
  exec:boolean = false;

  constructor(public dialogRef: MatDialogRef<ProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApprovData, private traitement: TraitementService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.varianteList = this.data;
    console.log(this.data)
  }

  // Add Variante
addVariante(currentProductId : any){

  this.exec = false;

    if(this.varianteList.detailPr.labelVariante.length == 1 && this.Vari1 != ''){
      this.exec = true
    }
    else if(this.varianteList.detailPr.labelVariante.length == 2 && this.Vari1 != '' && this.Vari2 != ''){
      this.exec = true
    }
    else if(this.varianteList.detailPr.labelVariante.length == 3 && this.Vari1 != '' && this.Vari2 != '' && this.Vari3 != ''){
      this.exec = true
    }
    else{
      this.exec = false
    }

    this.varianteObj.proprieteVariante = [this.Vari1, this.Vari2, this.Vari3]
    console.log(this.varianteObj, this.varianteList.detailPr.labelVariante)

    if(this.varianteObj.proprieteVariante.length > 0 && this.exec == true){
      this.traitement.addSubCollection('produit',currentProductId,'variante',this.varianteObj).then( res => {
        this.varianteObj.proprieteVariante = [];
        this.dialogRef.close();
      })
    }
    else{
      this.openSnackBar('Veuillez remplir tous les champs !', 'Fermé')
    }
  
}

openSnackBar(message: string, action: string) {
  let config = new MatSnackBarConfig();
  config.duration = 2000;
  this._snackBar.open(message, action, config);
}


}
