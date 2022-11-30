import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Variante } from 'src/app/models/produit';
import { ProduitComponent } from 'src/app/produit/produit.component';
import { TraitementService } from 'src/app/services/traitement.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-updatevar',
  templateUrl: './updatevar.component.html',
  styleUrls: ['./updatevar.component.scss']
})
export class UpdatevarComponent implements OnInit {

  varianteDetail: any;
  Vari1 : string = '';
  Vari2 : string = '';
  Vari3 : string = '';
  varianteObj : any = {
    proprieteVariante : []
  }
  exec:boolean = false;

  constructor(public dialogRef: MatDialogRef<ProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Variante, private traitement: TraitementService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.varianteDetail = this.data
    this.varianteObj.proprieteVariante = this.varianteDetail.varianteId.proprieteVariante
    console.log(this.varianteDetail)
    
    this.Vari1 = this.varianteDetail.varianteId.proprieteVariante[0]
    this.Vari2 = this.varianteDetail.varianteId.proprieteVariante[1]
    this.Vari3 = this.varianteDetail.varianteId.proprieteVariante[2]
  }

  updateVariante(){

    this.exec = false;

    if(this.varianteDetail.labelVariant.length == 1 && this.Vari1 != ''){
      this.varianteObj.proprieteVariante = [this.Vari1]
      this.exec = true
    }
    else if(this.varianteDetail.labelVariant.length == 2 && this.Vari1 != '' && this.Vari2 != ''){
      this.varianteObj.proprieteVariante = [this.Vari1, this.Vari2]
      this.exec = true
    }
    else if(this.varianteDetail.labelVariant.length == 3 && this.Vari1 != '' && this.Vari2 != '' && this.Vari3 != ''){
      this.varianteObj.proprieteVariante = [this.Vari1, this.Vari2, this.Vari3]
      this.exec = true
    }
    else{
      this.exec = false
    }

    if(this.varianteDetail.labelVariant.length > 0 && this.exec == true){
      this.updateInf()
    }
    else{
      this.openSnackBar('Veuillez remplir tous les champs !', 'Fermé', 2000)
    }
    console.log(this.varianteDetail)
  }

  updateInf(){
    this.traitement.updateSubDoc('produit',this.varianteDetail.idProduit,'variante',this.varianteDetail.varianteId.varianteId,this.varianteObj).then(res=>{
      this.dialogRef.close();
    }).catch( error =>{ 
      this.openSnackBar("Une erreure s'est produite", 'Fermé', 3000)
    })
  }

  openSnackBar(message: string, action: string, duration: number) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
    this._snackBar.open(message, action, config);
  }

}
