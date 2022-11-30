import { Component, OnInit, Inject } from '@angular/core';
import { TraitementService } from 'src/app/services/traitement.service';
import { arrayUnion } from 'firebase/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { ProduitComponent } from 'src/app/produit/produit.component';
import { optData } from 'src/app/models/produit';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-addopt',
  templateUrl: './addopt.component.html',
  styleUrls: ['./addopt.component.scss']
})
export class AddoptComponent implements OnInit {

  option: string = "";
  defaut: string = ""

  constructor(public dialogRef: MatDialogRef<ProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: optData,private traitement: TraitementService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.data)
    //this.updateVariante('CnLal7T9dKlYNxsTvwOk','TOGO','king');
  }

  


  updateVariante(){

   let productId = this.data.idProduit;
   let newLabelVariante = this.option;
   let newLabelDefaultValue = this.defaut;

   if( productId != "" && this.option != "" && newLabelDefaultValue != ""){
    this.traitement.updateFields('produit',productId,{labelVariante : arrayUnion(newLabelVariante)}).then(result => {
      console.log('Variante label list updated');
      this.setVarianteDefaultValue(productId,newLabelDefaultValue)
    }).catch(error => { })
   }
   else{
    this.openSnackBar('Veuillez remplir tous les champs !', 'Fermé', 2000)
   }

  }

  openSnackBar(message: string, action: string, duration: number) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
    this._snackBar.open(message, action, config);
  }

  setVarianteDefaultValue(productId:any,newLabelDefaultValue:string){

    //Recuper toutes les variantes du produit
    this.traitement.getAllFromSubCollection('produit',productId,'variante').subscribe(res=>{
      res.forEach((e:any) => {
        const data = e.data();
        data.id    = e.id;
        // Ajout de la valeur par defaut à tous les tableaux de propriete Variante
        this.traitement.updateSubFields('produit',productId,'variante',data.id,{proprieteVariante : arrayUnion(newLabelDefaultValue)}).then(r => {
          this.dialogRef.close();
          console.log(' New Variante Default Value Add')
        });    
      }) 

    },err =>{
          console.log("Error while fetching User data",err)
    })
    }

}
