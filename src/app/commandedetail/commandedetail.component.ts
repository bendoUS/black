import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { TraitementService } from '../services/traitement.service';
import * as moment from 'moment';
import { detailPayement } from '../models/commande';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-commandedetail',
  templateUrl: './commandedetail.component.html',
  styleUrls: ['./commandedetail.component.scss']
})
export class CommandedetailComponent implements OnInit {

  detailCommande: Array<any> = [];
  currentCommandeClient: any = [];
  currentCommande: any = [];
  commandeDate: string = '';
  idcomande: any = this.route.snapshot.paramMap.get('id');
  sommePaye: any = 0;

  totalPAiement: number = 0

  constructor(private route: ActivatedRoute, private router: Router, private traitement: TraitementService) { }

  ngOnInit(): void {
    this.getCommande(this.route.snapshot.paramMap.get('id'))
  }

  detailPayementCommandeObj: detailPayement = {
    datePayement: new Date(),
    montantPaye: 23000
  }


  getCommande(idCommande: any) {
    this.detailCommande = [];
    // Recuperer les informations de base de la commande
    this.traitement.getByDoc('commande', idCommande).subscribe(res => {
      this.currentCommande = res.payload.data();
      const id = res.payload.id;
      console.log(this.currentCommande)
      this.commandeDate = moment(this.currentCommande.date.toDate()).locale('fr').format('dddd, D MMMM YYYY')
      // Recuperer les infos du client à qui la commande
      this.traitement.getByDoc('client', res.payload.get('idClient')).subscribe(resultat => {
        this.currentCommandeClient = resultat.payload.data()

      })
      // Recuperer les details de la commande cas par cas
      this.traitement.getFromSubCollection('commande', id, 'detailCommande').subscribe(result => {
        this.detailCommande = [];
        result.map(e => {
          const data = e.payload.doc.data();
          this.traitement.getByDoc('produit', data['variante'][0]).subscribe(resultat => {
            data['produitDesignation'] = resultat.payload.get('designation')
          })

          this.traitement.getDocFromSubCollection('produit', data['variante'][0], 'variante', data['variante'][1]).subscribe(resultat1 => {
            data['varianteName'] = resultat1.payload.get('proprieteVariante');
            data['quantiteDisponible'] = resultat1.payload.get('quantite');
          })

          this.traitement.getBy('approvisionnement', 'idVariante', data['variante'][1]).subscribe(resultat2 => {
            resultat2.forEach((j: any) => {
              data['puVente'] = j.payload.doc.data()['puVente'];
            })
          });

          this.detailCommande.push(data);

          console.log(this.detailCommande)
        })
      })

      this.traitement.getBy('user', 'uid', res.payload.get('userID')).subscribe(rEmail => {
        rEmail.forEach(rE => {
          this.currentCommande.userName = rE.payload.doc.get('name')
        })
      })

    });
  }

  traiterCommande() {
    let confimation = confirm("Confirmer le traitement de la livraison")
    if (confimation == true) {
      this.idcomande = this.route.snapshot.paramMap.get('id');
      let userData: any = localStorage.getItem('user')
      let userId = JSON.parse(userData).uid

      this.traitement.updateFields('commande', this.idcomande, { 'statut': true, 'dateTraitement': new Date(), 'userID': userId }).then(result => {
        console.log('Commande Traité');
      })
    }
    else {

    }

  }

  changePage(data: any) {
    this.router.navigate(['/', data]);
  }

  async newPay() {

    let somNewPay = prompt('Somme payé', '0')
    if (somNewPay == null) {
      this.sommePaye = this.sommePaye
    }
    else {
      this.sommePaye = parseInt(somNewPay)
    }

    this.detailPayementCommandeObj = {
      datePayement: new Date(),
      montantPaye: this.sommePaye
    }


    await this.traitement.addSubCollection('commande', this.idcomande, 'detailPayement', this.detailPayementCommandeObj).then(res => {
      console.log('New pay saved');
      this.traitement.getByDocUpdate('commande', this.idcomande).subscribe(back => {
        const restant = (back.get('prixTotal') + back.get('expedition')) - (back.get('paye') + back.get('reduction'));
        const newPaye = back.get('paye') + this.detailPayementCommandeObj.montantPaye
        if (restant > this.detailPayementCommandeObj.montantPaye) {
          this.traitement.updateFields('commande', this.idcomande, { 'paye': newPaye }).then(up => {
            console.log('Paye updated')
          })
        } else {
          this.traitement.updateFields('commande', this.idcomande, { 'paye': newPaye, 'etatPayement': true }).then(up1 => {
            console.log('Paye & etatPayement Updated')
          })
        }
      })
    })
  }

  changePage2(data1: string) {
    this.router.navigate(['/' + data1 + '/' + this.idcomande]);
  }

  changePage3(data1: string, data2: string) {
    this.router.navigate(['/' + data1 + '/' + data2]);
  }

  convertPDF() {

    var allTempItem = []
    var tempItem = []

    for (var i = 0; i < this.detailCommande.length; i++) {
      var variante = "";
      if (this.detailCommande[i].varianteName) {
        for (var e = 0; e < this.detailCommande[i].varianteName.length; e++) {
          variante = variante + this.detailCommande[i].varianteName[e]
        }
      }

      tempItem = [this.detailCommande[i].produitDesignation, variante, this.detailCommande[i].puVente, this.detailCommande[i].quantite, this.detailCommande[i].quantite * this.detailCommande[i].puVente]
      allTempItem.push(tempItem)
      console.log(allTempItem)
    }

    allTempItem.push(["", "", "", "Réduction", this.currentCommande.reduction])
    allTempItem.push(["", "", "", "Expédition", this.currentCommande.expedition])
    allTempItem.push(["", "", "", "TOTAL", this.currentCommande.prixTotal - this.currentCommande.reduction])

    var doc = new jsPDF();

    var niceimage = new Image();
    niceimage.src = '../../assets/KAFED_AGRO-removebg-preview.png';

    doc.setFontSize(9);
    //doc.addFont("Roboto.TTF", "Roboto", "normal", "WinAnsiEncoding")
    //doc.setFont('Roboto', 'normal')
    doc.text('Producteur agricole', 90, 30);
    doc.addImage(niceimage, 'JPEG', 70, 10, 75, 15);


    doc.setFontSize(8);
    //doc.setFont('Roboto', 'normal')
    doc.text('Afoutou Trésor', 15, 44);
    doc.text('koueteedem@gmail.com', 15, 48);
    doc.text('+228 90093935', 15, 52);

    doc.text(this.commandeDate, 160, 44);
    doc.text(this.currentCommandeClient.nomComplet, 160, 48);
    doc.text('#' + this.currentCommande.refCommande, 160, 52);



    autoTable(doc, {
      startY: 65,
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index >= rows.length - 3) {
          data.cell.styles.fillColor = [255, 255, 255];
        }
        if (data.row.index >= rows.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = "black";
        }
      },
      headStyles: {
        fillColor: "#0a3d62",
        fontSize: 10
      },
      styles: {
        fontSize: 7
      },
      head: [['Produit', 'Variante', 'Prix unitaire', 'Quantité', 'Total']],
      body: allTempItem,
    })

    doc.save('Facture_' + this.commandeDate + '_' + this.currentCommandeClient.nomComplet + '.pdf');
  }



}
