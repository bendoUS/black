import { Component, OnInit, Inject } from '@angular/core';
import { TraitementService } from 'src/app/services/traitement.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-selectprod',
  templateUrl: './selectprod.component.html',
  styleUrls: ['./selectprod.component.scss']
})
export class SelectprodComponent implements OnInit {

  varianteListe :Array<any>= [];
approvisionnementListe :Array<any>= [];
currentCommandeProduct :Array<any>= [];

selectedData: any = []


  constructor(private traitement: TraitementService, public dialogRef: MatDialogRef<SelectprodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    

  ngOnInit(): void {
    this.getForCommande()
  }

  getForCommande(){
    //Recuper tous les Produits
    this.traitement.getAll('produit').subscribe(res=>{
      this.currentCommandeProduct = []
     res.map((e:any) => {
       const data = e.payload.doc.data();
       data.id    = e.payload.doc.id;
       // Recuperer la liste des variantes du produit en cours
       this.traitement.getFromSubCollection('produit',data.id,'variante').subscribe(res1=>{
         this.varianteListe = [];
         res1.forEach((f:any)=>{
           const data1 = f.payload.doc.data()
           data1.id = f.payload.doc.id;
           // Recuperer la liste des approvisionnement de chaque variante
           this.traitement.getBy('approvisionnement','idVariante',data1.id).subscribe(res2 =>{
             this.approvisionnementListe = [];
             res2.forEach((g:any)=>{
               let restant = g.payload.doc.data()['quantite'] - g.payload.doc.data()['quantiteVendu'] 
               // Pour chaque approvionnement à afficher veifier si la quantite restante est superieur à 0 sinon ne pas l'afficher dans la liste
               if(restant > 0){
                 const data2 =  g.payload.doc.data();
                 data2.id =  g.payload.doc.id;
                 data2.quantiteRestante = restant ;
                 this.approvisionnementListe.push(data2)  
               }  
               data1.approListe = this.approvisionnementListe
             })   
           })
           this.varianteListe.push(data1)
           data.varianteListe = this.varianteListe
         })   
       }) 
       this.currentCommandeProduct.push(data)
     })
     console.log(this.currentCommandeProduct)
     
   },err =>{
       console.log("Error while fetching data",err)
   })
 }

 selectApprov(product: any, variante: any, approvionnement: any){
   approvionnement.qttaprd = 1;
   this.selectedData = {productData: product, varianteData: variante, approvData: approvionnement}
   this.data = this.selectedData
  this.dialogRef.close(this.data);
 }

}
