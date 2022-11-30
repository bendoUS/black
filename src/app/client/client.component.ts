import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {startWith, map} from 'rxjs/operators';
import { Router,NavigationStart} from '@angular/router';
import * as $ from 'jquery'
import Chart from 'chart.js/auto';
import { TraitementService } from '../services/traitement.service';
import { Client } from '../models/produit';
import * as moment from 'moment'

export interface PeriodicElement {
  name: string;
  position: number;
  categorie: string;
  statut: string;
  quantite: number;
  fournisseur: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', categorie: 'Oeuf', statut: 'Active', quantite: 12, fournisseur: 'EraSlim'},
  {position: 2, name: 'Helium', categorie: 'Oeuf', statut: 'Archive',  quantite: 1, fournisseur: 'EraSlim'},
  {position: 3, name: 'Lithium', categorie: 'Oeuf', statut: 'Active', quantite: 3, fournisseur: 'EraSlim'},
  {position: 4, name: 'Beryllium', categorie: 'Oeuf', statut: 'Ebauche', quantite: 5, fournisseur: 'EraSlim'},
  {position: 5, name: 'Boron', categorie: 'Oeuf', statut: 'Attente', quantite: 7, fournisseur: 'EraSlim'},
];

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  cli: any;
  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]> | undefined;
  lineChart: any = [];

  myDate5 = new Date();
  loaderSpinner = true;

  displayedColumns: string[] = ['select', 'name', 'categorie', 'statut', 'quantite', 'fournisseur'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  allClient : Array<any>= [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private router: Router, private traitement: TraitementService) { }

  ngOnInit(): void {
    $('.client').addClass('active');
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    
    this.getAllClient()
    //this.openChart()
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  changePage(data: any) {
    this.router.navigate(['/', data]);
  }

  changePage2(data1: any, data2: any, param:string) {
    this.router.navigate(['/' + data1 + '/' + data2 + '/'+param]);
  }


  openChart() {

    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        datasets: [{
          label: 'First dataset',
          data: [0, 20, 10, 30],
          borderColor: '#4a69bd',
          fill: false,
          tension: 0.2,
          pointStyle: 'cross'
        }],
        labels: ['January', 'February', 'March', 'April']
      },
      options: {
        scales: {
          x: {
            display: false,
            ticks: {
              stepSize: 2
            },
            grid: {
              display: false

            },
          },
          y: {
            display: false,
            grid: {
              display: false
            },
            ticks: {
              stepSize: 20
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


  testfunc(){
    
  }

  changePage3(data1: string, data2: string) {
    this.router.navigate(['/' + data1 + '/' + data2]);
  }


  getAllClient(){

    //Recuper tous les clients
    this.traitement.getAll('client').subscribe(res=>{
      this.allClient = []
      res.map((e:any) => {

        const data = e.payload.doc.data();
        data.id    = e.payload.doc.id;
         
        // Recuperer le prix total des commandes du client
        this.traitement.getBy('commande','idClient',data.id).subscribe(result => {
          var tot= 0;
          result.forEach((e:any) => {  
            tot += e.payload.doc.data()['prixTotal'];
          })
          data.som =tot 
        }); 

        // Recuper la date de la dernière commande du client
        this.traitement.getLastDoc('commande','idClient',data.id,'date',this.myDate5,1).subscribe(resL => {
          var lastCommande : string = '';
          resL.forEach((f:any) => {  
              lastCommande = f.payload.doc.data()['date']; 
          })
          data.derniereCommande = lastCommande
        });


        this.allClient.push(data);
        
      })
     
      this.loaderSpinner = false

  },err =>{
        console.log("Error while fetching User data",err)
  })
  }


}
