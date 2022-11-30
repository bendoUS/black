import { Component, OnInit } from '@angular/core';
import { Client, AdressePayement } from '../models/produit';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { TraitementService } from '../services/traitement.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-createclient',
  templateUrl: './createclient.component.html',
  styleUrls: ['./createclient.component.scss']
})
export class CreateclientComponent implements OnInit {

  

  nomComplet: string = '';
  email: string = '';
  phone: string = '';
  pays: string = '';
  ville: string = '';
  compagnie: string = '';
  poste: string = '';
  adress: string = '';
  banque: string = '';
  bp: string = '';
  compteNum: string = '';
  statut: string = '';
  remarque: string = '';
  banqueInfo: any = []
  adressInfo: any = []

  clientObj: Client = {
    nomComplet: '',
    telephone: '',
    email: '',
    adresse: [],
    banque: [],
    remarque: '',
    createdAt: null,
    compagnie: '',
    paysCompagnie: '',
    posteClient: '',
    statutClient: '',
  }

  constructor(private traitment: TraitementService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  addClient() {

    this.adressInfo = [ this.pays, this.ville, this.adress, this.bp]
    this.banqueInfo = [this.banque, this.compteNum ]
    
    this.clientObj = {
      adresse: this.adressInfo,
      banque: this.banqueInfo,
      compagnie: this.compagnie,
      createdAt: new Date(),
      email: this.email,
      nomComplet: this.nomComplet,
      paysCompagnie: this.pays,
      posteClient: this.poste,
      remarque: this.remarque,
      statutClient: 'Active',
      telephone: this.phone
    }

    

    if(this.clientObj.nomComplet != "" && this.clientObj.email != "" && this.phone != "" && this.pays != "" && this.ville != "" && this.adress != ""){
      this.traitment.add('client',this.clientObj).then( res=> {
        this.openSnackBar('Client enrégistrer avec succcès!', 'Fermé')
        this.router.navigate(['/client']);
        }).catch((error) => {
          console.log(error)
        });
    }
    else{
      this.openSnackBar('Veuillez remplir tous les champs !', 'Fermé')
    }
  }

  changePage(data: any){
    this.router.navigate(['/', data]);
  }


  openSnackBar(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = 2000;
    this._snackBar.open(message, action, config);
  }

  

}
