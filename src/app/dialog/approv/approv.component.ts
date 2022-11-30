import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, NumberValueAccessor } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApprovData, Approvisionnement } from 'src/app/models/produit';
import { ProduitComponent } from 'src/app/produit/produit.component';
import { TraitementService } from 'src/app/services/traitement.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-approv',
  templateUrl: './approv.component.html',
  styleUrls: ['./approv.component.scss']
})
export class ApprovComponent implements OnInit {

  quantiteAprv: number = 0
  prixua: number = 0
  prixuv: number = 0
  obsrvt: string = ''
  value = '';
  productLastAppro :any = [];
  VarianteList : any;
  variID: string = ''

  qte1 : number = 0;
  qte2 : number = 0;
  nomFournisseur : string = '';

  appDate: Date = new Date();


  apprObj : Approvisionnement = {
    idProduit: '',
    idVariante: '',
    dateAppro: this.appDate,
    PUAchat: 0,
    puVente: 0,
    quantite: 0,
    quantiteVendu: 0,
    observation: '',
    nomFournisseur: this.nomFournisseur
  }
  
  confirmation: boolean = false;
  loader: boolean = false;
  

  constructor(public dialogRef: MatDialogRef<ProduitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApprovData, private traitement: TraitementService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.VarianteList = this.data;
    console.log(this.VarianteList)
    this.getProductAppro(this.data.idProduit)
  }

  getProductAppro(productId:string){
    this.traitement.getByLimit('approvisionnement','idProduit',productId,10,'dateAppro').subscribe(result => {
      this.productLastAppro = [];
      result.map((e:any) => {
        const data = e.payload.doc.data();
        this.traitement.getDocFromSubCollection('produit',productId,'variante',data['idVariante']).subscribe  (resi=>{ 
          data.varianteName = resi.payload.get('proprieteVariante');
        }) 
        this.productLastAppro.push(data); 
        console.log(this.productLastAppro)
      })
    }); 
  }

  addAppro(){
    
    this.apprObj = {
      idProduit: this.data.idProduit,
      idVariante: this.variID,
      dateAppro: this.appDate,
      PUAchat: this.prixua,
      puVente: this.prixuv,
      quantite: this.quantiteAprv,
      quantiteVendu: 0,
      observation: this.obsrvt,
      nomFournisseur: this.nomFournisseur
    }

    if(this.prixua > this.prixuv){
      this.confirmation = confirm("Le prix d'achat est supérieur au prix de vente, confirmer si vous etes d'accord")
    }
    else{
      this.confirmation = true
    }

    if(this.confirmation == true){
      
      if(this.apprObj.idProduit != '' && this.apprObj.idVariante != '' && this.apprObj.quantite > 0){
        this.loader = true;
        this.traitement.add('approvisionnement',this.apprObj).then( res=> {
    
        // Recupération des anciennes quantités quantités du produit en cours et la variante     
          this.traitement.getByDoc('produit',this.apprObj.idProduit).subscribe( ans => {  
          this.qte1 = ans.payload.get('quantite') + this.apprObj.quantite;        
        });  
         this.traitement.getDocFromSubCollection('produit',this.apprObj.idProduit,'variante',this.apprObj.idVariante).subscribe(uv  =>{
          
           this.qte2 = uv.payload.get('quantite') + this.apprObj.quantite ;
         })
    
        //Update de la quantité générale du produit et celle de la variante
        setTimeout(() => {
            this.traitement.updateFields('produit',this.apprObj.idProduit,{'quantite': this.qte1}).then(res=>{
            console.log('product qty updated');
            }).catch(error => {
            })
    
            this.traitement.updateSubFields('produit',this.apprObj.idProduit,'variante',this.apprObj.idVariante,{'quantite': this.qte2}).then(res1=>{
              console.log('Variante qty updated');
              this.loader = false;
              this.openSnackBar('Approvisionement enrégistrer avec succcès!', 'Fermé')
            }).catch(error => {
            })
        },4000);
      }).catch((error) => {
            console.log(error)
          });
          
          
        }
        else{
          alert('error')
        }
    }
    else{

    }

    
  }


  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = 2000;
    this._snackBar.open(message, action, config);
  }

}
