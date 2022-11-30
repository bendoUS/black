import { F } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as $ from 'jquery';
import * as moment from 'moment';
import { TraitementService } from '../services/traitement.service';
import {FormGroup, FormControl} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.scss']
})
export class AnalyseComponent implements OnInit {

  lineChart: any = [];
  commandeChart: any = [];
  tauxClientsChart: any = [];

  sumAnalyse: any = [];
  nbrCommandeAnalyse: any = [];
  nbrClientAnalyse: any = [];

  Date1: Date = new Date();
  Date2: Date = new Date();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  max : number = 0 ;
 tab : any = [];
 tab1 : any = [];
 tabA: any = [];

 etatApproData : any = [];
 etatApproJournalierData : any = [];
 productSellList : Array<any>= [];
 etatCommandeJournalierData : any = [];
 etatCommandeJournalierList : any = [];
 etatCommandeData : any = [];
 etatCommandeList : any = [];


 produitList: any = []
  productGet: boolean = false
  tab2: any = [];

  constructor(private traitement: TraitementService) { }

  ngOnInit(): void {
    $('.analyse').addClass('active');
    this.analysePeriodique(this.Date1, this.Date2);
    this.etatJournalierCommande(this.Date1)

    this.getAllProduct()
    this.getMostSell(this.Date1, this.Date2);
  }

  applyDate(){

    if (this.lineChart) {
      this.lineChart.clear();
      this.lineChart.destroy();
      delete this.lineChart;
    }

    if (this.commandeChart) {
      this.commandeChart.clear();
      this.commandeChart.destroy();
      delete this.commandeChart;
    }

    if (this.tauxClientsChart) {
      this.tauxClientsChart.clear();
      this.tauxClientsChart.destroy();
      delete this.tauxClientsChart;
    }

    
    if(this.range.value.start != null && this.range.value.end != null){
      this.etatPeriodiqueCommande(this.range.value.start, this.range.value.end)
      this.etatPeriodiqueAppro(this.range.value.start, this.range.value.end)
      this.getMostSell(this.range.value.start, this.range.value.end);
      this.analysePeriodique(this.range.value.start, this.range.value.end)
    }
    else if(this.range.value.start != null && this.range.value.end == null){
      this.etatJournalierCommande(this.range.value.start)
      this.etatJournalierAppro(this.range.value.start)
      this.getMostSell(this.range.value.start, this.range.value.start);
      //this.etatJournalierCommande()
    }
    else{

    }

    //this.analysePeriodique(this.range.value.start, this.range.value.end);
    //this.getMostSell(this.range.value.start, this.range.value.end)
  }
  analysePeriodique(choix1: Date, choix2: Date) {

    // Calcul de la durée d'intervalle
    let intervalle = (choix2.getTime() - choix1.getTime()) / 4

    // Calcul des limites d'intervalle
    let inc = moment(choix1.setTime(choix1.getTime())).toDate();
    let inc1 = moment(choix1.setTime(choix1.getTime()) + intervalle).toDate();
    let inc2 = moment(choix1.setTime(choix1.getTime()) + (intervalle * 2)).toDate();
    let inc3 = moment(choix1.setTime(choix1.getTime()) + (intervalle * 3)).toDate();
    let inc4 = moment(choix1.setTime(choix1.getTime()) + (intervalle * 4)).toDate();

    // Calcul de la somme des ventes et le nombre de commande sur la 1ere intervalle
    this.traitement.getForAnalyse('commande', 'date', inc1, inc).subscribe(resultat => {
      var somme1 = 0; var nbre1 = 0;this.sumAnalyse = [];this.nbrCommandeAnalyse = [];this.nbrClientAnalyse = [];
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        somme1 += (data.prixTotal + data.expedition) - data.reduction;
        nbre1 += 1;
      })
      this.sumAnalyse.push({ sommeVenteA: somme1, dateA: inc1 });
      this.nbrCommandeAnalyse.push({ commandeCountA: nbre1, dateA: inc1 });
    });
    // Calcul du nombre de nouveaux clients sur la 1ere intervalle
    this.traitement.getForAnalyse('client', 'createdAt', inc1, inc).subscribe(resultat => {
      var nbre11 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        nbre11 += 1;
      })
      this.nbrClientAnalyse.push({ clientCountA: nbre11, dateA: inc1 });
    });

    // Calcul de la somme des ventes et le nombre de commande sur la 2eme intervalle
    this.traitement.getForAnalyse('commande', 'date', inc2, inc1).subscribe(resultat => {
      var somme2 = 0; var nbre2 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        somme2 += (data.prixTotal + data.expedition) - data.reduction;
        nbre2 += 1;
      })
      this.sumAnalyse.push({ sommeVenteB: somme2, dateB: inc2 });
      this.nbrCommandeAnalyse.push({ commandeCountB: nbre2, dateB: inc2 })
    });
    // Calcul du nombre de nouveaux clients sur la 2eme intervalle
    this.traitement.getForAnalyse('client', 'createdAt', inc2, inc1).subscribe(resultat => {
      var nbre21 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        nbre21 += 1;
      })
      this.nbrClientAnalyse.push({ clientCountB: nbre21, dateB: inc2 });
    });

    // Calcul de la somme des ventes et le nombre de commande sur la 3eme intervalle
    this.traitement.getForAnalyse('commande', 'date', inc3, inc2).subscribe(resultat => {
      var somme3 = 0; var nbre3 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        somme3 += (data.prixTotal + data.expedition) - data.reduction;
        nbre3 += 1;
      })
      this.sumAnalyse.push({ sommeVenteC: somme3, dateC: inc3 });
      this.nbrCommandeAnalyse.push({ commandeCountC: nbre3, dateC: inc3 })
    });
    // Calcul du nombre de nouveaux clients sur la 3eme intervalle
    this.traitement.getForAnalyse('client', 'createdAt', inc3, inc2).subscribe(resultat => {
      var nbre31 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        nbre31 += 1;
      })
      this.nbrClientAnalyse.push({ clientCountC: nbre31, dateC: inc3 });
    });

    // Calcul de la somme des ventes et le nombre de commande sur la 4eme intervalle
    this.traitement.getForAnalyse('commande', 'date', inc4, inc3).subscribe(resultat => {
      var somme4 = 0; var nbre4 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        somme4 += (data.prixTotal + data.expedition) - data.reduction;
        nbre4 += 1
      });
      this.sumAnalyse.push({ sommeVenteD: somme4, dateD: inc4 });
      this.nbrCommandeAnalyse.push({ commandeCountD: nbre4, dateD: inc4 })
    });
    // Calcul du nombre de nouveaux clients sur la 4eme intervalle
    this.traitement.getForAnalyse('client', 'createdAt', inc4, inc3).subscribe(resultat => {
      var nbre41 = 0;
      resultat.forEach((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        nbre41 += 1;
      })
      this.nbrClientAnalyse.push({ clientCountD: nbre41, dateD: inc4 });
      this.openChart(this.sumAnalyse);
      this.CommandesChart(this.nbrCommandeAnalyse);
      this.ClientsChart(this.nbrClientAnalyse);
    });
    
  }

  


  






// Rapport journalier des ventes
  etatJournalierCommande(dateRapport:Date){
  
    this.traitement.getByDate('commande','date',dateRapport).subscribe(resultat => {
      var somme1 =0;var nbre1=0;var somme2 = 0; var somme3=0;
      this.etatCommandeJournalierList = [];
      resultat.forEach((e:any) => {
        // Recuperation de chaque commande avec insertion des deatils du client et du montant restant à payer
       const data = e.payload.doc.data();
       data.id    = e.payload.doc.id;
       data.restant = (data['prixTotal'] + data['expedition']) - (data['reduction'] + data['paye']);

       this.traitement.getByDoc('client',data['idClient']).subscribe(resultatC => {
        data.clientInfos = resultatC.payload.data();
      })
       // Calcul de la vente totale , Total des restants à payer et total des montants déja payés
       this.etatCommandeJournalierList.push(data)
       somme1 += (data.prixTotal+data.expedition) - data.reduction;
       somme2 += data.restant;
       somme3 += data.paye
       nbre1 += 1;
     })
       this.etatCommandeJournalierData.push({sommeVente:somme1,totalRestant:somme2,totalPaye:somme3,commandeCount:nbre1,commandeList:this.etatCommandeJournalierList});
       
       //this.nbrCommandeAnalyse.push({commandeCountA:nbre1,dateA:inc1});   
   });
   this.etatCommandeData = this.etatCommandeJournalierData;
  }

  // Rapport des ventes sur une période donnée
  etatPeriodiqueCommande(choixA:Date,choixB:Date){
    this.etatCommandeData = []
    // Convertion des dates en format firebase
     let inc   = moment(choixA.setDate(choixA.getDate())).toDate();
     let inc1  = moment(choixB.setDate(choixB.getDate())).toDate();

      // Recuperation des commandes de l'intervalle
      this.traitement.getForAnalyse('commande','date',inc1,inc).subscribe(resultat => {
        var somme1 =0;var nbre1=0;var somme2 = 0; var somme3=0;
        this.etatCommandeList = [];
        resultat.forEach((e:any) => {
          // Recuperation de chaque commande avec insertion des deatils du client et du montant restant à payer
         const data = e.payload.doc.data();
         data.id    = e.payload.doc.id;
         data.restant = (data['prixTotal'] + data['expedition']) - (data['reduction'] + data['paye']);

         this.traitement.getByDoc('client',data['idClient']).subscribe(resultatC => {
          data.clientInfos = resultatC.payload.data();
        })
         // Calcul de la vente totale , Total des restants à payer et total des montants déja payés
         this.etatCommandeList.push(data)
         somme1 += (data.prixTotal+data.expedition) - data.reduction;   
         somme2 += data.restant;
         somme3 += data.paye
         nbre1 += 1;
       })
         this.etatCommandeData.push({sommeVente:somme1,totalRestant:somme2,totalPaye:somme3,commandeCount:nbre1,commandeList:this.etatCommandeList});
         
         //this.nbrCommandeAnalyse.push({commandeCountA:nbre1,dateA:inc1});   
     });
     this.etatCommandeData = this.etatCommandeData;
  }
  
  
  
  // Rapport journalier des approvisionnements
  etatJournalierAppro(dateRapportA:Date){
    this.etatApproData = []

    this.traitement.getByDate('approvisionnement','dateAppro',dateRapportA).subscribe(resultat => {
      console.log(resultat.length)
      resultat.forEach(async(e:any) => {
        
        // Recuperation de chaque commande avec insertion des deatils du produit et calcul de la quantité restante à vendre
       const data = e.payload.doc.data();
       console.log(data)
       data.id    = e.payload.doc.id;
       data.restantAVendre = data['quantite'] - data['quantiteVendu'] ;

       this.traitement.getByDoc('produit',data['idProduit']).subscribe( resultatC => {
        data.Product =   resultatC.payload.data();
      })

      this.traitement.getDocFromSubCollection('produit',data['idProduit'],'variante',data['idVariante']).subscribe( resultatD => {
        data.varianteName =  resultatD.payload.get('proprieteVariante');
      })
       this.etatApproJournalierData.push( await data)  
     })     
   });
   this.etatApproData = this.etatApproJournalierData;
   console.log(this.etatApproJournalierData);
   
  }

  // Rapport des approvisionnements sur une période
 etatPeriodiqueAppro(choixC:Date,choixD:Date){
  this.etatApproData = []
    // Convertion des dates en format firebase
     let inc   = moment(choixC.setDate(choixC.getDate())).toDate();
     let inc1  = moment(choixD.setDate(choixD.getDate())).toDate();

      // Recuperation des Appro de l'intervalle
      this.traitement.getForAnalyse('approvisionnement','dateAppro',inc1,inc).subscribe(resultat => {

        resultat.forEach(async (e:any) => {
          // Recuperation de chaque Appro avec insertion des deatils du produit et calcul de la quantité restante à vendre
         const data = e.payload.doc.data();
         data.id    = e.payload.doc.id;
         data.restantAVendre = data['quantite'] - data['quantiteVendu'] ;

        this.traitement.getByDoc('produit',data['idProduit']).subscribe( resultatC => {
            data.Product =   resultatC.payload.data();
        })

        this.traitement.getDocFromSubCollection('produit',data['idProduit'],'variante',data['idVariante']).subscribe( resultatD => {
          data.varianteName =  resultatD.payload.get('proprieteVariante');
        })
        this.etatApproData.push( await data);
       })
     });
  }

  convertPDF() {
    if(this.range.value.start != null && this.range.value.end != null){
      var rappItems = this.etatCommandeData[0];
    }
    else if(this.range.value.start != null && this.range.value.end == null){
      var rappItems = this.etatCommandeData[1];
    }
    else{

    }
    
    var allTempItem:any = []
    var tempItem: any = [];
    
    for (var i = 0; i < rappItems.commandeList.length; i++) {
      /*var variante = "";
      if (rappItems[i].varianteName) {
        for (var e = 0; e < rappItems[i].varianteName.length; e++) {
          variante = variante + rappItems[i].varianteName[e]
        }
      }*/
      var stat = ""
      if(rappItems.commandeList[i].statut == true){
         stat = 'Traitée'
      }
      else{
        stat = 'Non traitée'
      }

      if(this.range.value.start != null && this.range.value.end != null){
        tempItem = ['#'+rappItems.commandeList[i].refCommande, rappItems.commandeList[i].clientInfos.nomComplet, moment(rappItems.commandeList[i].date.toDate()).locale('fr').format('dddd, D MMMM YYYY'), rappItems.commandeList[i].prixTotal, rappItems.commandeList[i].paye, rappItems.commandeList[i].restant, stat]
      }
      else if(this.range.value.start != null && this.range.value.end == null){
        tempItem = ['#'+rappItems.commandeList[i].refCommande, rappItems.commandeList[i].clientInfos.nomComplet, rappItems.commandeList[i].prixTotal, rappItems.commandeList[i].paye, rappItems.commandeList[i].restant, stat]
      }
      else{
  
      }
      
      allTempItem.push(tempItem)
      console.log(allTempItem)
    }

    allTempItem.push(["", "", "", "", "", "Commandes totale", rappItems.commandeCount])
    allTempItem.push(["", "", "", "", "", "Chiffre d'affaire", rappItems.sommeVente+' CFA'])
    allTempItem.push(["", "", "", "", "", "Somme total reçu", rappItems.totalPaye+' CFA'])
    allTempItem.push(["", "", "", "", "", "Somme total restant", rappItems.totalRestant+' CFA'])
    
    var doc = new jsPDF();
    var headInf: string[][] = []

    var niceimage = new Image();
    niceimage.src = '../../assets/KAFED_AGRO-removebg-preview.png';

    doc.setFontSize(9);
    doc.addFont("Roboto.TTF", "Roboto", "normal", "WinAnsiEncoding")
    doc.setFont('Roboto', 'normal')
    doc.setTextColor('#5A5A5A')
    doc.text('Producteur agricole', 93, 30);
    doc.addImage(niceimage, 'JPEG', 70, 10, 75, 15);

    doc.setFontSize(8);
    
    doc.setFont('Roboto', 'normal')
    doc.text('Afoutou Trésor, koueteedem@gmail.com, +228 90093935', 73, 35);

    //doc.text(this.commandeDate, 160, 44);
    doc.setTextColor('black')

    if(this.range.value.start != null && this.range.value.end != null){
      doc.text("Rapport sur les commandes du "+ moment(this.range.value.start).locale('fr').format('dddd, D MMMM YYYY') + " au " + moment(this.range.value.end).locale('fr').format('dddd, D MMMM YYYY'), 60, 60);
      headInf = [['Réference', 'Nom du client', 'Date', 'Prix Total', 'Paye', 'Restant', 'Statut']]
    }
    else if(this.range.value.start != null && this.range.value.end == null){
      doc.text("Rapport sur les commandes du "+ moment(new Date(new Date(this.range.value.start).setDate(new Date(this.range.value.start).getDate() - 1))).locale('fr').format('dddd, D MMMM YYYY'), 74, 60);
      headInf = [['Réference', 'Nom du client', 'Prix Total', 'Paye', 'Restant', 'Statut']]
    }
    else{

    }

    autoTable(doc, {
      startY: 65,
      didParseCell: function (data) {
        var rows = data.table.body;
        if (data.row.index >= rows.length - 4) {
          data.cell.styles.fillColor = [255, 255, 255];
        }
        if (data.row.index >= rows.length - 4) {
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
      head: headInf,
      body: allTempItem,
    })

    doc.save('Rapport_KAFEDAGRO_'+ this.range.value.start + '_au_' + this.range.value.end +'.pdf');
  }

  convertApproPDF() {
    
    var rappItems = this.etatApproData;
    var allTempItem:any = []
    var tempItem: any = [];
    
    for (var i = 0; i < rappItems.length; i++) {
      var variante = "";
      if (rappItems[i].varianteName) {
        for (var e = 0; e < rappItems[i].varianteName.length; e++) {
          variante = variante + " " +rappItems[i].varianteName[e]
        }
      }

      if(this.range.value.start != null && this.range.value.end != null){
        if(rappItems[i].Product)
        tempItem = [rappItems[i].Product.designation, variante, moment(rappItems[i].dateAppro.toDate()).locale('fr').format('dddd, D MMMM YYYY'), rappItems[i].quantite, rappItems[i].restantAVendre, rappItems[i].quantiteVendu, rappItems[i].PUAchat, rappItems[i].puVente, rappItems[i].Product.nomFournisseur]
      }
      else if(this.range.value.start != null && this.range.value.end == null){
        if(rappItems[i].Product)
        tempItem = [rappItems[i].Product.designation, variante, rappItems[i].quantite, rappItems[i].restantAVendre, rappItems[i].quantiteVendu, rappItems[i].PUAchat, rappItems[i].puVente, rappItems[i].Product.nomFournisseur]
      }
      else{
  
      }
      
      allTempItem.push(tempItem)
      console.log(allTempItem)
    }

    
    var doc = new jsPDF();
    var headInf: string[][] = []

    var niceimage = new Image();
    niceimage.src = '../../assets/KAFED_AGRO-removebg-preview.png';

    doc.setFontSize(9);
    doc.addFont("Roboto.TTF", "Roboto", "normal", "WinAnsiEncoding")
    doc.setFont('Roboto', 'normal')
    doc.setTextColor('#5A5A5A')
    doc.text('Producteur agricole', 93, 30);
    doc.addImage(niceimage, 'JPEG', 70, 10, 75, 15);

    doc.setFontSize(8);
    
    doc.setFont('Roboto', 'normal')
    doc.text('Afoutou Trésor, koueteedem@gmail.com, +228 90093935', 73, 35);

    //doc.text(this.commandeDate, 160, 44);
    doc.setTextColor('black')

    if(this.range.value.start != null && this.range.value.end != null){
      doc.text("Rapport sur les approvisionement du "+ moment(this.range.value.start).locale('fr').format('dddd, D MMMM YYYY') + " au " + moment(this.range.value.end).locale('fr').format('dddd, D MMMM YYYY'), 60, 60);
      headInf = [["Produit", "Variante", "Date", "Quantité T", "Quantité R", "Quantité V", "Prix A", "Prix V", "Fournisseur"]]
    }
    else if(this.range.value.start != null && this.range.value.end == null){
      doc.text("Rapport sur les commandes du "+ moment(new Date(new Date(this.range.value.start).setDate(new Date(this.range.value.start).getDate() - 1))).locale('fr').format('dddd, D MMMM YYYY'), 74, 60);
      headInf = [["Produit", "Variante", "Quantité total", "Quantité restant", "Quantité vendu", "Prix unitaire A", "Prix unitaire V", "Fournisseur"]]
    }
    else{

    }

    autoTable(doc, {
      startY: 65,
      headStyles: {
        fillColor: "#0a3d62",
        fontSize: 8
      },
      styles: {
        fontSize: 7
      },
      head: headInf,
      body: allTempItem,
    })

    doc.save('Rapport_KAFEDAGRO_'+ this.range.value.start + '_au_' + this.range.value.end +'.pdf');
  }

  getAllProduct(){
    this.traitement.getAll('produit').subscribe(res=>{
      this.produitList = []
      this.produitList = res.map((e:any) => {
        const data = e.payload.doc.data();
        data.id    = e.payload.doc.id;
        return {productName: data.designation, productId: data.id};
      })
      this.productGet = true;
      //console.log(this.produitList)
  },err =>{
        console.log("Error while fetching Product data",err)
  })
  
  }

  async getMostSell(choixY: Date, choixZ: Date) {

    let inc = moment(choixY.setDate(choixY.getDate())).toDate();
    let inc1 = moment(choixZ.setDate(choixZ.getDate())).toDate();
    

    this.traitement.getForAnalyseUpdate('commande', 'date', inc1, inc).subscribe(async resultat => {
      this.tabA = [];
      resultat.forEach((e: any) => {
        const data = e.data();
        data.id = e.id; var trouve: boolean = false;
        this.tabA.push(data)
      })
      if(resultat.docs.length == this.tabA.length){
        this.getDetailCommande();
      }
    });
  }

  getDetailCommande(){
    var countTab = 0
    this.tab2 = []
    for(var i = 0; i<this.tabA.length; i++){
      this.traitement.getFromSubCollectionUpdate('commande', this.tabA[i].id, 'detailCommande').subscribe(result => {
        countTab = countTab + 1
        result.forEach((f: any) => {
          this.tab2.push({productId: f.data().variante[0], quantite: f.data().quantite });
        })
        if(this.tabA.length == countTab){
          this.organize(this.tab2);
        }
      })
      
    }
  }

  organize(data:any) {
    console.log(data)
    var tab1:any = []
    var countTab2 = 0
    for (var i = 0; i < data.length; i++) {
      var trouve: boolean = false;

      for(var j = 0; j<tab1.length; j++){
        var newQ: number = 0
        if(data[i].productId == tab1[j].productId){
          
          if(data[i].quantite == undefined){
            data[i].quantite = 0
          }
          if(tab1[j].quantite != null){
            newQ = Number(tab1[j].quantite) + Number(data[i].quantite)
          }
          else{
            newQ = Number(data[i].quantite)
          }
          
          trouve = true;
          tab1[j].quantite = newQ
        }
        
      }
        if(trouve != true){
         tab1.push({productName: data[i].productName, productId: data[i].productId, quantite: data[i].quantite})
        }
        countTab2 += 1
        if(data.length == countTab2){
          this.getName(tab1)
        }
      }
  }

  getName(data:any){
    this.tabA = []
    if(this.productGet == true){
      for(var i = 0; i<data.length; i++){
        for(var j = 0; j< this.produitList.length; j++){
          if(data[i].productId == this.produitList[j].productId){
            data[i].productName = this.produitList[j].productName
            this.tabA.push(data[i])
          }
        }
        
      }
    }
    //console.log(this.tabA)
  }















  openChart(data: any) {
    this.lineChart = []
    if(this.lineChart.length == 0){
      this.lineChart = new Chart('lineChart', {
        type: 'line',
        data: {
          datasets: [{
            label: 'First dataset',
            data: [data[0].sommeVenteA, data[1].sommeVenteB, data[2].sommeVenteC, data[3].sommeVenteD],
            borderColor: '#4a69bd',
            pointStyle: 'cross'
          }],
          labels: [moment(data[0].dateA).locale('fr').format(' D MMMM'), moment(data[1].dateB).locale('fr').format(' D MMMM'), moment(data[2].dateC).locale('fr').format(' D MMMM'), moment(data[3].dateC).locale('fr').format(' D MMMM')]
        },
        options: {
          scales: {
            x: {
              ticks: {
                stepSize: 2
              },
              grid: {
                display: false
  
              },
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                stepSize: 100000
              },
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    }
    else{

    }
    
    this.lineChart.render();
    this.lineChart.update();

  }

  CommandesChart(data: any) {
    this.commandeChart = []
    if(this.commandeChart.length == 0){
    this.commandeChart = new Chart('ComandeChart', {
      type: 'line',
      data: {
        datasets: [{
          label: 'First dataset',
          data: [data[0].commandeCountA, data[1].commandeCountB, data[2].commandeCountC, data[3].commandeCountD],
          borderColor: '#4a69bd',
          pointStyle: 'cross'
        }],
        labels: [moment(data[0].dateA).locale('fr').format(' D MMMM'), moment(data[1].dateB).locale('fr').format(' D MMMM'), moment(data[2].dateC).locale('fr').format(' D MMMM'), moment(data[3].dateC).locale('fr').format(' D MMMM')]
      },
      options: {
        scales: {
          x: {
            ticks: {
              stepSize: 2
            },
            grid: {
              display: false

            },
          },
          y: {
            grid: {
              display: false
            },
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }else{

  }
    this.commandeChart.render();
    this.commandeChart.update();
  }

  ClientsChart(data: any) {
    this.tauxClientsChart = []
    if(this.tauxClientsChart.length == 0){
    this.tauxClientsChart = new Chart('tauxClientsChart', {
      type: 'line',
      data: {
        datasets: [{
          label: 'First dataset',
          data: [data[0].clientCountA, data[1].clientCountB, data[2].clientCountC, data[3].clientCountD],
          borderColor: '#4a69bd',
          pointStyle: 'cross'
        }],
        labels: [moment(data[0].dateA).locale('fr').format(' D MMMM'), moment(data[1].dateB).locale('fr').format(' D MMMM'), moment(data[2].dateC).locale('fr').format(' D MMMM'), moment(data[3].dateC).locale('fr').format(' D MMMM')]
      },
      options: {
        scales: {
          x: {
            ticks: {
              stepSize: 2
            },
            grid: {
              display: false

            },
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              stepSize: 1
            },
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })}
    this.tauxClientsChart.render();
    this.tauxClientsChart.update();
  }


  public ngOnDestroy() {
    if (this.lineChart) {
      this.lineChart.clear();
      this.lineChart.destroy();
      delete this.lineChart;
    }

    if (this.commandeChart) {
      this.commandeChart.clear();
      this.commandeChart.destroy();
      delete this.commandeChart;
    }

    if (this.tauxClientsChart) {
      this.tauxClientsChart.clear();
      this.tauxClientsChart.destroy();
      delete this.tauxClientsChart;
    }
  }

}
