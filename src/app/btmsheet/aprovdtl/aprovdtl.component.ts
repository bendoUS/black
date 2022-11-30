import { Component, OnInit, Inject } from '@angular/core';
import { TraitementService } from 'src/app/services/traitement.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-aprovdtl',
  templateUrl: './aprovdtl.component.html',
  styleUrls: ['./aprovdtl.component.scss']
})
export class AprovdtlComponent implements OnInit {

  commandeImpaye: number = 0;
  approVariantePropriete: any;
  approProductName: any;
  benefAttendu: number = 0;
  benefFait: number = 0;
  stockInitial: number = 0;
  stockVendu: number = 0;
  stockRestant: number = 0;
  quantiteApproCommande: number = 0
  historique: Array<any> = [];
  detailAppro: any = [];
  ApprovDate: string = '';
 

  constructor(private traitement: TraitementService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: string, private route: ActivatedRoute, private router: Router, private _bottomSheetRef: MatBottomSheetRef<AprovdtlComponent>) { }

  ngOnInit(): void {
    this.getAppro(this.data);
    console.log(this.data)
  }

  // Get current Appro

  getAppro(idAppro: any) {

    // Recuperation de l'approvisionnement Selectionné
    this.traitement.getByDoc('approvisionnement', idAppro).subscribe(res => {
      this.detailAppro = res.payload.data();
      this.ApprovDate = moment(this.detailAppro.dateAppro.toDate()).locale('fr').format('dddd, D MMMM YYYY')
      console.log(this.detailAppro)
      const id = res.payload.id;
      // Calcul de la quantité restante pour cet approvisionnement
      let restant = Number(res.payload.get('quantite')) - Number(res.payload.get('quantiteVendu'));
      // Calcul du benef Total à réaliser
      let benefA = (Number(res.payload.get('quantite')) * res.payload.get('puVente')) - (Number(res.payload.get('quantite')) * res.payload.get('PUAchat'));
      // Calcul du benef déja realisé
      let benefB = (Number(res.payload.get('quantiteVendu')) * res.payload.get('puVente')) - (Number(res.payload.get('quantiteVendu')) * res.payload.get('PUAchat'));
      // Recuperation du nom du produit
      this.traitement.getByDoc('produit', res.payload.get('idProduit')).subscribe(resultat2 => {
        this.approProductName = resultat2.payload.get('designation');
      })
      // Recuperation de la variante
      this.traitement.getDocFromSubCollection('produit', res.payload.get('idProduit'), 'variante', res.payload.get('idVariante')).subscribe(resultat3 => {
        this.approVariantePropriete = resultat3.payload.get('proprieteVariante');
      })

      this.stockInitial = res.payload.get('quantite');
      this.stockVendu = res.payload.get('quantiteVendu')
      this.stockRestant = restant;
      this.benefAttendu = benefA;
      this.benefFait = benefB;
    });

    // Récuperation des details à afficher dans l'historique

    this.traitement.getAllupdt('commande').subscribe(back => { // Parcours complet de toutes les commandes
      console.log(back)
      this.commandeImpaye = 0
      back.forEach((r: any) => {
        const content = r.data()
        console.log(r.id)
        content.id = r.id
        this.historique = []
        // Recuperation des commandes concerné par l'approvisionnement selectionné
        this.traitement.getBySubFieldUpdate('commande', r.id, 'detailCommande', 'idApprovisionnement', idAppro).subscribe(back1 => {
          this.quantiteApproCommande = 0
          back1.forEach((repons: any) => {
            this.quantiteApproCommande = repons.data()['quantite'];
            content.quantite = repons.data()['quantite']

            if (content.etatPayement == false) {
              this.commandeImpaye += 1;
            }
            this.historique.push(content);
           
          })
          
        })
        

      })
    })

    

  }


  changePage2(data1: string, data2: string, params: string) {
    this._bottomSheetRef.dismiss();
    this.router.navigate(['/' + data1 + '/' + data2 + '/' + params]);
  }

}
