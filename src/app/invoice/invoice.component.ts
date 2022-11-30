import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TraitementService } from '../services/traitement.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as $ from 'jquery'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2PDF from "html2canvas";



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  detailCommande: Array<any> = [];
  currentCommande: any = [];
  commandeDate: string = '';
  currentCommandeClient: any = [];

  elem: any;

  @ViewChild('content')
  content!: ElementRef;
  max: number = 0;
  tabA: any = [];
  tab1: any = [];
  tab2: any = [];

  LastQttInfo: any = []
  LastIdInfo: any = []
  productName: any = []

  produitList: any = []
  productGet: boolean = false


  constructor(private route: ActivatedRoute, private router: Router, private traitement: TraitementService) { }

  ngOnInit(): void {
    this.getAllProduct()
    this.getMostSell(new Date('2022, 3, 1'), new Date('2022, 3, 31'));
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


  /*-----------------------------------------------------------------------------------*/



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
    this.tab2 = []
    var tab3:any = []
    var tab4:any = []
    var countTab = 0
    for(var i = 0; i<this.tabA.length; i++){
      //console.log(this.tabA.length)
      this.traitement.getFromSubCollectionUpdate('commande', this.tabA[i].id, 'detailCommande').subscribe(result => {
        countTab += 1
        //console.log(2)
        result.forEach((f: any) => {
          this.tab2.push({productId: f.data().variante[0], quantite: f.data().quantite });
        })
        if(this.tabA.length == countTab){
          //console.log(this.tabA, this.tab2)
          this.organize(this.tab2);
        }
      })
      
      
    }
  }


  organize(data:any) {
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
  }
}

