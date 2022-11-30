import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {AprovdtlComponent} from '../btmsheet/aprovdtl/aprovdtl.component'
import * as $ from 'jquery'
import { TraitementService } from '../services/traitement.service';

@Component({
  selector: 'app-approvis',
  templateUrl: './approvis.component.html',
  styleUrls: ['./approvis.component.scss']
})
export class ApprovisComponent implements OnInit {

  allAppro : Array<any>= [];
  term: any;
  loaderSpinner = true;

  constructor(private _bottomSheet: MatBottomSheet, private traitment: TraitementService) { }


  ngOnInit(): void {
    $('.approvisionnement').addClass('active');
    this.getAllAppro()
  }


  // get All Appro
  getAllAppro(){
    //Recuper tous les clients
    this.traitment.getAll('approvisionnement').subscribe(res=>{
      this.allAppro = []
      let qteRestante = 0;
      let marge = 0;
      res.map((e:any) => {

        const data = e.payload.doc.data();
        data.id    = e.payload.doc.id;
        
        qteRestante = Number(e.payload.doc.data()['quantite']) - Number(e.payload.doc.data()['quantiteVendu']);

        marge =  (Number(e.payload.doc.data()['quantite'])* e.payload.doc.data()['puVente']) - (Number(e.payload.doc.data()['quantite']) * e.payload.doc.data()['PUAchat']) ;

        data.qteRestante = qteRestante;
        data.marge = marge
        
        this.traitment.getDocFromSubCollection('produit',data.idProduit,'variante',data.idVariante).subscribe(resultat1  =>{
          data.varianteName = resultat1.payload.get('proprieteVariante');
        })
        this.allAppro.push(data);
        this.loaderSpinner = false;
      })
  },err =>{
        console.log("Error while fetching User data",err)
  })
  }

  showApprovDetail(id: string){
    this._bottomSheet.open(AprovdtlComponent, {
      data: id,
    });
  }

}
