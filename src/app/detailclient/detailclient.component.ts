import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { TraitementService } from '../services/traitement.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateclientComponent } from '../dialog/updateclient/updateclient.component';


@Component({
  selector: 'app-detailclient',
  templateUrl: './detailclient.component.html',
  styleUrls: ['./detailclient.component.scss']
})
export class DetailclientComponent implements OnInit {

  detailClient: any = [];
  totalCommandeAPayer: number = 0;
  paye: number = 0;
  detailLastCommande: Array<any> = [];
  restant: number = 0;
  detailPayement: any = [];
  myDate4 = new Date();
  NbreTotalCommande: number = 0;
  nbreTotalPaye: number = 0;
  nbreTotalRestant: number = 0;
  idCli: any = ''


  constructor(private route: ActivatedRoute, private router: Router, private traitement: TraitementService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getClient(this.route.snapshot.paramMap.get('id'));
    this.idCli = this.route.snapshot.paramMap.get('id');
  }

  changePage(data: any) {
    this.router.navigate(['/', data]);
  }

  getClient(idClient: any) {

    // Recuper les Informations de base du clients
    this.traitement.getByDoc('client', idClient).subscribe(res => {
      this.detailClient = res.payload.data();
      const id = res.payload.id;
      console.log(this.detailClient)
    });

    // Recuperer Tout ce qui concerne le payement du client
    this.traitement.getBy('commande', 'idClient', idClient).subscribe(result => {
      this.totalCommandeAPayer = 0;
      this.paye = 0;
      this.restant = 0;
      this.detailPayement = [];
      result.forEach((e: any) => {
        this.detailPayement = e.payload.doc.data();
        console.log(this.detailPayement)
        this.totalCommandeAPayer += this.detailPayement['prixTotal'] + this.detailPayement['expedition'];
        this.paye += this.detailPayement['paye'];
      })
      this.restant = this.totalCommandeAPayer - this.paye
    });

    // Recuperer les 3 dernières commandes du client suivant la date actuelle
    this.traitement.getLastDoc('commande', 'idClient', idClient, 'date', this.myDate4, 3).subscribe(resL => {
      this.detailLastCommande = []
      resL.forEach((s: any) => {
        var data = s.payload.doc.data()
        data.id = s.payload.doc.id
        this.detailLastCommande.push(data);
        console.log(this.detailLastCommande)
      })
    });


    // recuperer nombres commandes Paye du client en cours
    this.traitement.getByMultiParameters('commande', 'etatPayement', true, 'idClient', idClient).subscribe(m => {
      this.nbreTotalPaye = 0;
      m.forEach((k: any) => {
        this.nbreTotalPaye += 1;
      })
    })

    // recuperer nombres commandes impayé du client en cours
    this.traitement.getByMultiParameters('commande', 'etatPayement', false, 'idClient', idClient).subscribe(n => {
      this.nbreTotalRestant = 0;
      n.forEach((k: any) => {
        this.nbreTotalRestant += 1;
      })
      this.NbreTotalCommande = this.nbreTotalPaye + this.nbreTotalRestant;
    })




  }

  changePage3(data1: string, data2: string) {
    this.router.navigate(['/' + data1 + '/' + data2]);
  }

  changePage2(data1: string, data2: string, params: string) {
    this.router.navigate(['/' + data1 + '/' + data2 + '/' + params]);
  }



  copydToClipboard() {
    var text = this.detailClient.email + ' ' + this.detailClient.nomComplet + ' ' + this.detailClient.adresse[2] + ' ' + this.detailClient.adresse[3] + ' ' + this.detailClient.adresse[1] + ', ' + this.detailClient.adresse[0] + ' ' + this.detailClient.telephone;
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }


  updateClientDetail() {

    /*let clientInfo = { email: this.detailClient.email, nomComplet: this.detailClient.nomComplet, email: this.detailClient.email, nomComplet: this.detailClient.nomComplet }*/

    const dialogRef = this.dialog.open(UpdateclientComponent,
      {
        data: { clientInfo: this.detailClient, idClient: this.idCli }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
