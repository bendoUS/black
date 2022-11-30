import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DetailclientComponent } from 'src/app/detailclient/detailclient.component';
import { TraitementService } from 'src/app/services/traitement.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-updateclient',
  templateUrl: './updateclient.component.html',
  styleUrls: ['./updateclient.component.scss']
})
export class UpdateclientComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetailclientComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private traitement: TraitementService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.data.clientInfo, this.data.idClient)
  }

  updateDetailClient(){

    var clientId:string = this.data.idClient
    var newClientData: any = this.data.clientInfo

    if(clientId != "" && newClientData.nomComplet != "" && newClientData.email != "" && newClientData.telephone != "" && newClientData.adresse[0] != "" && newClientData.adresse[1] != "" && newClientData.adresse[2] != ""){
      this.traitement.updateFields('client',clientId,{adresse:newClientData.adresse,banque:newClientData.banque,compagnie:newClientData.compagnie,email:newClientData.email,nomComplet:newClientData.nomComplet,paysCompagnie:newClientData.paysCompagnie,posteClient:newClientData.posteClient,remarque:newClientData.remarque,statutClient:newClientData.statutClient,telephone:newClientData.telephone}).then((result)=>{

        this.dialogRef.close();
  
      }).catch((e)=>{})
    }
    else{
      this.openSnackBar("Veuillez remplir les informations importantes", 'Fermé', 3000)
    }



    /**/
  }



  openSnackBar(message: string, action: string, duration: number) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
    this._snackBar.open(message, action, config);
  }

  

}
