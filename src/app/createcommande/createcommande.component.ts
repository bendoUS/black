import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { detailPayement, Commande } from '../models/commande';
import { TraitementService } from '../services/traitement.service';
import { SelectprodComponent } from '../dialog/selectprod/selectprod.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';



@Component({
  selector: 'app-createcommande',
  templateUrl: './createcommande.component.html',
  styleUrls: ['./createcommande.component.scss']
})

export class CreatecommandeComponent implements OnInit {

  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]> | undefined;
  customer: any = [];
  protected commandeId: any;
  public productList: any = [];
  reduction: any = 0;
  expedition: any = 0;
  sommePaye: any = 0;
  sousTotal: any = 0
  allClient: Array<any> = [];
  myDate5 = new Date();
  pokemonControl = new FormControl();
  detailPayementCommandeObj: detailPayement = {
    datePayement: new Date(),
    montantPaye: 0
  }
  nextProduct: any;

  appDate: Date = new Date();
  
  detailCommandeX: Array<any> = [];
  varianteListe: Array<any> = [];
  approvisionnementListe: Array<any> = [];
  currentCommandeProduct: Array<any> = [];
  loader = false;

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.nomComplet.toLowerCase().includes(filterValue));
  }

  CommandeNumber : number = 1;

  commandeObj: Commande = {
    date: new Date(),
    etatPayement: false,
    idClient: '',
    paye: this.detailPayementCommandeObj['montantPaye'],
    prixTotal: 0,
    expedition: 0,
    refCommande: '',
    remarque: '',
    statut: false,
    typeReglement: 'Espèce',
    reduction: this.reduction,
    numero : this.CommandeNumber
  };

  constructor(private route: ActivatedRoute, private router: Router,private traitement: TraitementService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getForCommande()
    this.getCommandeNumber()

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.getAllClient()
  }

  getAllClient() {
    //Recuper tous les clients
    this.traitement.getAll('client').subscribe(res => {
      this.allClient = []
      res.map((e: any) => {

        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;

        // Recuperer le prix total des commandes du client
        this.traitement.getBy('commande', 'idClient', data.id).subscribe(result => {
          var tot = 0;
          result.forEach((e: any) => {
            tot += e.payload.doc.data()['prixTotal'];
          })
          data.som = tot
        });

        // Recuper la date de la dernière commande du client
        this.traitement.getLastDoc('commande', 'idClient', data.id, 'date', this.myDate5, 1).subscribe(resL => {
          var lastCommande: string = '';
          resL.forEach((f: any) => {
            lastCommande = f.payload.doc.data()['date'];
          })
          data.derniereCommande = lastCommande
        });

        this.allClient.push(data);
        this.options.push(data);

      })
    }, err => {
      console.log("Error while fetching User data", err)
    })
  }

  selectedClient(data: any) {
    this.customer = data;
    console.log(data)
  }


  addCommande() {

    this.loader = true
      this.commandeObj = {
        date: new Date(),
        etatPayement: false,
        idClient: this.customer.id,
        paye: this.detailPayementCommandeObj.montantPaye,
        prixTotal: (this.sousTotal + this.expedition - this.reduction),
        expedition: this.expedition,
        refCommande: '',
        remarque: this.commandeObj.remarque,
        statut: false,
        typeReglement: 'Espèce',
        reduction: this.reduction,
        numero : this.CommandeNumber
      };
    if(this.productList.length > 0 && this.commandeObj.idClient != ''){
      
      
      for(var r = 0; r <this.productList.length; r++){
        let newAdd = {
          variante: [this.productList[r].productData.id, this.productList[r].varianteData.id],
          quantite: this.productList[r].approvData.qttaprd,
          idApprovisionnement: this.productList[r].approvData.id
        }
        this.detailCommandeX.push(newAdd)
      }
  
      this.detailPayementCommandeObj = {
        datePayement: new Date(),
        montantPaye: this.sommePaye
      }
  
      this.commandeObj = {
        date: new Date(),
        etatPayement: false,
        idClient: this.customer.id,
        paye: this.detailPayementCommandeObj.montantPaye,
        prixTotal: (this.sousTotal + this.expedition - this.reduction),
        expedition: this.expedition,
        refCommande: '',
        remarque: this.commandeObj.remarque,
        statut: false,
        typeReglement: 'Espèce',
        reduction: this.reduction,
        numero : this.CommandeNumber
      };
  
      if (this.sommePaye == (this.sousTotal + this.expedition - this.reduction)) {
        this.commandeObj.etatPayement = true;
      }
  
      this.traitement.add('commande', this.commandeObj).then(res => {
        this.commandeId = res.id;
  
        // Parcours de la commande Pour actualiser la quantité des produits et variantes concernés et enregistrer les details de la commande
        for (var i = 0; i < this.detailCommandeX.length; i++) {
          this.ajustement(i);
        }
        // Enregistrement du Premier Payement
        this.traitement.addSubCollection('commande', this.commandeId, 'detailPayement', this.detailPayementCommandeObj).then(result5 => {
          console.log('Payement Saved');
        })
        // Insertion de la reference de Commande
        this.traitement.updateFields('commande', this.commandeId, { 'refCommande': this.commandeId }).then(result6 => {
          console.log('Reference commande insert');
        })
        console.log('Data Saved');
      }).catch((error) => {
        console.log(error)
      });
    }
    else{
      this.openSnackBar('Veuillez rentrer toutes les infomations', 'Fermé', 4000)
    }
    
    

  }

  async ajustement(idata: number) {

    // Mise à jour de la quantité des produits achetés
    await this.traitement.getByDocUpdate('produit', this.detailCommandeX[idata].variante[0]).subscribe(back1 => {
      let qte1 = back1.get('quantite') - this.detailCommandeX[idata]['quantite'];

      this.traitement.updateFields('produit', this.detailCommandeX[idata].variante[0], { 'quantite': qte1 }).then(res1 => {
        console.log('Product qty updated');
        return false
      }).catch(error => {
      })
    })
    // Mise à jour de la quantité des variantes choisies
    await this.traitement.getDocFromSubCollectionUpdate('produit', this.detailCommandeX[idata].variante[0], 'variante', this.detailCommandeX[idata].variante[1]).subscribe(back2 => {
      let qte2 = back2.get('quantite') - this.detailCommandeX[idata]['quantite'];

      this.traitement.updateSubFields('produit', this.detailCommandeX[idata].variante[0], 'variante', this.detailCommandeX[idata].variante[1], { 'quantite': qte2 }).then(res2 => {
        console.log('Variante qty updated');
        return false
      }).catch(error => {
      })
    })
    // Mise à jour des quantités vendues Niveau approvisionnement 
    await this.traitement.getByDocUpdate('approvisionnement', this.detailCommandeX[idata].idApprovisionnement).subscribe(back3 => {
      let qte3 = back3.get('quantiteVendu') + this.detailCommandeX[idata]['quantite'];

      this.traitement.updateFields('approvisionnement', this.detailCommandeX[idata].idApprovisionnement, { 'quantiteVendu': qte3 }).then(res3 => {
        this.loader = false
        this.openSnackBar('commande enrégistrer avec succès', 'Fermé', 4000)
        console.log('Approvisionnement Qty updated');
        return false
      }).catch(error => {
      })
    })
    // Enregistrement des détails de la commande ligne par ligne
    await this.traitement.addSubCollection('commande', this.commandeId, 'detailCommande', this.detailCommandeX[idata]).then(result => {
      console.log('Payement Saved');
    })

  }


  getForCommande() {
    //Recuper tous les Produits
    this.traitement.getAll('produit').subscribe(res => {
      this.currentCommandeProduct = []
      res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        // Recuperer la liste des variantes du produit en cours
        this.traitement.getFromSubCollection('produit', data.id, 'variante').subscribe(res1 => {
          this.varianteListe = [];
          res1.forEach((f: any) => {
            const data1 = f.payload.doc.data()
            data1.id = f.payload.doc.id;
            // Recuperer la liste des approvisionnement de chaque variante
            this.traitement.getBy('approvisionnement', 'idVariante', data1.id).subscribe(res2 => {
              this.approvisionnementListe = [];
              res2.forEach((g: any) => {
                let restant = g.payload.doc.data()['quantite'] - g.payload.doc.data()['quantiteVendu']
                // Pour chaque approvionnement à afficher veifier si la quantite restante est superieur à 0 sinon ne pas l'afficher dans la liste
                if (restant > 0) {
                  const data2 = g.payload.doc.data();
                  data2.id = g.payload.doc.id;
                  data2.quantiteRestante = restant;
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

    }, err => {
      console.log("Error while fetching data", err)
    })
  }

  addProd() {
    const dialogRef = this.dialog.open(SelectprodComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addProdList(result);
      }
    });
  }

  addProdList(prod: any) {
    this.productList.push(prod);
    this.sumSousTotal();
    console.log(this.productList)
  }

  removeprodListItem(itemIndex: number) {
    if (itemIndex == 0) {
      this.productList.shift()
    }
    else {
      this.productList.splice(itemIndex, itemIndex);
    }
    this.sumSousTotal();
    console.log(this.productList)
  }

  AddGift() {
    let redu: any = prompt("Ajouter une réduction à cette commande", '0')
    if (redu == null) {
      this.reduction = this.reduction
    }
    else {
      this.reduction = parseInt(redu)
    }
  }
  AddShip() {
    let expe: any = prompt("Ajouter un tarif d'expédition", '0')
    if (expe == null) {
      this.expedition = this.expedition
    }
    else {
      this.expedition = parseInt(expe)
    }

  }
  Addpaiement() {
    let pay: any = prompt("Ajouter la somme reçu", '0')
    if (pay == null) {
      this.sommePaye = this.sommePaye
    }
    else {
      this.sommePaye = parseInt(pay)
    }
  }

  sumSousTotal() {
    this.sousTotal = 0
    for (var i = 0; i < this.productList.length; i++) {
      this.sousTotal += this.productList[i].approvData.puVente * this.productList[i].approvData.qttaprd
    }
    console.log(this.sousTotal)
  }

  changePage(data: any){
    this.router.navigate(['/', data]);
  }

  changePage3(data1: string, data2: string) {
    this.router.navigate(['/' + data1 + '/' + data2]);
  }
 
  openSnackBar(message: string, action: string, duration: number) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
    this._snackBar.open(message, action, config);
  }

  
  
  getCommandeNumber(){ 
    return this.traitement.getLastDocSave('commande','date','date',1,new Date()).subscribe(async e=>{
       e.forEach(result=>{
         if(result.exists){
           this.CommandeNumber = result.get('numero') + 1
           console.log(this.CommandeNumber)
         }else{
           this.CommandeNumber = 1 
         }
       })   
     })
   }



}
