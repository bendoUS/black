import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, map } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';
import { TraitementService } from '../services/traitement.service'
import { Produits, Variante } from '../models/produit';
import { Fournisseur } from '../models/fournisseur';

import * as $ from 'jquery'



@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {


  clientPeriodique: number = 0;
  commandePeriodique: number = 0;
  sum: number = 0;
  percentCommande: any = 0;
  percentClient: any = 0;
  percentVente: any = 0

  myDate1 = new Date();
  myDate2 = new Date();
  myDate3 = new Date();
  myDate4 = new Date();
  myDate5 = new Date();
  myDate6 = new Date();
  myDate7 = new Date();
  myDate8 = new Date();



  term: any;
  deleteTab: any = [];
  produitList: Produits[] = [];
  CommandeNb: number = 0;
  ClientNb: number = 0;
  VenteTotal: number = 247;

  fournisseurObj: Fournisseur = {
    nom: '',
    email: '',
    adresse: '',
    telephone: ''
  }

  idFournisseur: string = '';
  loaderSpinner = true;

  produitObj : Produits = {
    designation : 'Oeuf',
    statut : 'Active',
    quantite: 678,
    categorie : 'Alimentaire',
    dateCreation : '2022/03/19',
    labelVariante :['Taille']
  };

  varianteObj : Variante = {
    proprieteVariante : [],
    quantite:0
  }


  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]> | undefined;

  displayedColumns: string[] = ['select', 'name', 'categorie', 'statut', 'quantite', 'fournisseur'];
  dataSource = new MatTableDataSource<Produits>();
  selection = new SelectionModel<Produits>(true, []);


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private router: Router, private traitement: TraitementService) { }

  ngOnInit(): void {
    $('.stock').addClass('active');
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.getAllProduct();
    this.getStatistic();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  insertTab(id: string) {
    if (this.deleteTab.includes(id) == true) {
      let index = this.deleteTab.indexOf(id);
      if (index !== -1) {
        this.deleteTab.splice(index, 1);
      }
    }
    else {
      this.deleteTab.push(id);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.filtreTexte(["anana"], 'ane'));
    console.log(this.produitList.filter(function (data) {
      return data.designation == "Oeuf";
    }));
  }

  filtreTexte(arr: any, requete: any) {
    console.log(arr.filter((el: any) => el.toLowerCase().indexOf(requete.toLowerCase()) !== -1))
    //return arr.filter((el: string) =>  el.toLowerCase().indexOf(requete.toLowerCase()) !== -1);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }



  changePage(data: any) {
    this.router.navigate(['/', data]);
  }

  changePage2(data1: any, data2: any, param: string) {
    this.router.navigate(['/' + data1 + '/' + data2 + '/' + param]);
  }

  


  getAllProduct(){
    this.traitement.getAll('produit').subscribe(res=>{
        this.produitList = []
        this.produitList = res.map((e:any) => {
          
          const data = e.payload.doc.data();
          data.id    = e.payload.doc.id;
          return data;
        })
        console.log(this.produitList)
        this.loaderSpinner = false
    },err =>{
          console.log("Error while fetching Product data",err)
    })
  }


  delectProduct() {
    for (var i = 0; i < this.deleteTab.length; i++) {
      this.traitement.deleteBydoc('produit', this.deleteTab[i]);
      this.deleteTab.splice(i, 1);
      console.log(this.deleteTab,  this.deleteTab[i]);
    }
  }

  getStatistic() {

    //Nbre Commmande sur periode
    this.traitement.getStat('commande', 'date', this.myDate1,0, 7).subscribe(res => {
      this.commandePeriodique = res.length
    });

    this.traitement.getStat('commande', 'date', this.myDate6,7, 14).subscribe(res => {
      var interm1 = res.length;
      if(interm1 == 0){
        this.percentCommande = 100;
      }
      else{
        this.percentCommande = (this.commandePeriodique * 100) / interm1
        this.percentCommande = parseInt(this.percentCommande, 10)
      }
    });

    // Nbre Nouveaux clients sur periode
    this.traitement.getStat('client', 'createdAt', this.myDate2,0, 7).subscribe(result => {
      this.clientPeriodique = result.length
    });

    this.traitement.getStat('client', 'createdAt', this.myDate7,7, 14).subscribe(res => {
      var interm2 = res.length;
      console.log(interm2)
      if(interm2 == 0){
        this.percentClient = 100;
      }
      else{
        this.percentClient = (this.commandePeriodique * 100) / interm2
        this.percentClient = parseInt(this.percentClient, 10)
      }
    });

    //vente Totale Periodique
    this.traitement.getStat('commande', 'date', this.myDate3,0, 7).subscribe(resultat => {
      var somme = 0;
      resultat.forEach((e: any) => {

        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        somme += Number(data.prixTotal);
      })
      this.sum = somme;
    });

    this.traitement.getStat('commande', 'date', this.myDate8,7, 14).subscribe(resultat => {
      var interm3 = 0;
      
      resultat.forEach((e: any) => {

        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        interm3 += Number(data.prixTotal);
        
      })
      if(interm3 == 0){
        this.percentVente = 100;
      }
      else{
        this.percentVente = (this.sum * 100) / interm3
        this.percentVente = parseInt(this.percentVente, 10)
      }
    });

  }


  /*addProduct() {
    this.router.navigate(['/stock/produit/new']);
  }*/


  addProduct(){
    /*this.traitement.add('produit',this.produitObj).then( res=> {
      console.log('Data Saved');
      this.produitObj.designation = '';
      this.produitObj.statut = '';
      this.produitObj.nomFournisseur = '';
      this.produitObj.dateCreation = '';
      this.produitObj.labelVariante = []
      }).catch((error) => {
        console.log(error)
      });*/
  }
  
   

}
