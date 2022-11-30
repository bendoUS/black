import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, map } from 'rxjs/operators';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as $ from 'jquery'
import Chart from 'chart.js/auto';
import { TraitementService } from '../services/traitement.service';



export interface PeriodicElement {
  name: string;
  position: number;
  categorie: string;
  statut: string;
  quantite: number;
  fournisseur: string;
}



const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', categorie: 'Oeuf', statut: 'Active', quantite: 12, fournisseur: 'EraSlim' },
  { position: 2, name: 'Helium', categorie: 'Oeuf', statut: 'Archive', quantite: 1, fournisseur: 'EraSlim' },
  { position: 3, name: 'Lithium', categorie: 'Oeuf', statut: 'Active', quantite: 3, fournisseur: 'EraSlim' },
  { position: 4, name: 'Beryllium', categorie: 'Oeuf', statut: 'Ebauche', quantite: 5, fournisseur: 'EraSlim' },
  { position: 5, name: 'Boron', categorie: 'Oeuf', statut: 'Attente', quantite: 7, fournisseur: 'EraSlim' },
];

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {

  nbCommandeValide: number = 0
  nbCommandeInvalide: number = 0

  allCommande: Array<any> = [];
  cmdCharts: any = [];
  control = new FormControl();
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  filteredStreets: Observable<string[]> | undefined;

  displayedColumns: string[] = ['select', 'name', 'categorie', 'statut', 'quantite', 'fournisseur'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  cmd: any;
  loaderSpinner = true;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  

  constructor(private route: ActivatedRoute, private router: Router, private traitement: TraitementService) {
    
   }

  ngOnInit(): void {
    $('.stock').removeClass('active');
    $('.client').removeClass('active');
    $('.commande').removeClass('active');
    $('.analyse').removeClass('active');
    $('.approvisionnement').removeClass('active');
    $('.deconnexion').removeClass('active');
    
    $('.commande').addClass('active');

    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    if(this.route.snapshot.paramMap.get('search') == 'all'){
      this.cmd = ''
    }
    else{
      this.cmd = this.route.snapshot.paramMap.get('search')
    }

    

    this.getAllCommande()

    this.route.params.subscribe(routeParams => {
      if(routeParams['search'] == 'all'){
        this.cmd = ''
      }
      
    });

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


  changePage(data: string) {
    this.router.navigate(['/', data]);
  }

  changePage2(data1: string, data2: string, params: string) {
    this.router.navigate(['/' + data1 + '/' + data2 + '/' + params]);
  }

  changePage3(data1: string, data2: string) {
    this.router.navigate(['/' + data1 + '/' + data2]);
  }


  applyDate(){
    
  }




  getAllCommande() {
    this.traitement.getAll('commande').subscribe(res => {
      this.allCommande = [];
      res.map((e: any) => {

        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        this.traitement.getByDoc('client', data['idClient']).subscribe(result => {
          data.nomClient = result.payload.get('nomComplet');

        });

        this.allCommande.push(data);

      })
    }, err => {
      console.log("Error while fetching User data", err)
    })

    // recuperer nombre total commandes payé 
    this.traitement.getBy('commande', 'etatPayement', true).subscribe(o => {
      this.nbCommandeValide = 0;
      o.forEach((k: any) => {
        this.nbCommandeValide += 1;
      })
    })

    // recuperer nombre total commandes impayé 
    this.traitement.getBy('commande', 'etatPayement', false).subscribe(q => {
      this.nbCommandeInvalide = 0;
      q.forEach((j: any) => {
        this.nbCommandeInvalide += 1;
      })
      this.openChart(this.nbCommandeInvalide, this.nbCommandeValide)
    })

    this.loaderSpinner = false


  }


  openChart(invalid: number, valid: number) {

    this.cmdCharts = new Chart('cmdChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'First dataset',
          data: [invalid, valid],
          backgroundColor: [
            '#4a69bd',
            '#2ecc71'
          ],
        }],
        labels: ['En cour', 'Terminer']
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
    this.cmdCharts.render();
    this.cmdCharts.update();

  }

  public ngOnDestroy() {
    if (this.cmdCharts) {
      this.cmdCharts.clear();
      this.cmdCharts.destroy();
      delete this.cmdCharts;
    }
  }

  



}
