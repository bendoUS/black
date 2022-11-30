import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, doc, getDoc, onSnapshot,arrayUnion } from 'firebase/firestore';
import { Produits } from '../models/produit';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TraitementService {

  dtb = getFirestore();
  private snap: any;

  myDate = new Date();
  today: any

  constructor(private db: AngularFirestore, private date: DatePipe) { }

  // add 
  add(collectionName: string, model: object) {
    //id = this.db.createId();
    return this.db.collection('/' + collectionName).add(model);
  }

  // get All
  getAll(collectionName: string) {
    return this.db.collection('/' + collectionName).snapshotChanges();
  }
  getAllupdt(collectionName: string) {
    return this.db.collection('/' + collectionName).get();
  }

  // get all From subCollection
  getAllFromSubCollection(collectionName: string,docId:string,subCollectionName:string) {
    return this.db
    .collection(collectionName)
    .doc(docId)
    .collection(subCollectionName)
    .get();
  }

  // get fournisseur
  getDocById(idC: any, collectionName: string) {
    return this.db.collection(collectionName).doc(idC).valueChanges();
  }

  // delete 
  delete(collectionName: string, model: object) {
    return this.db.doc('/' + collectionName + model + '.id').delete();
  }

  // Update doc with model

  update(collectionName:string,docId:string,model : object) {
    return this.db.doc('/'+collectionName+'/'+docId).update(model);
  }

  // update user
  updateUser(produit: Produits) {
    this.delete('user', produit);
    this.add('user', produit);
  }

  //delete
  deleteBydoc(collectionName: string, id: string) {
    return this.db.collection(collectionName).doc(id).delete();
  }


  getStat(collectionName:string,colon:string,dateObject:Date,critere1 : number,critereDifference : number){
    
    //console.log(new Date('2022, 3, 10'))
  return this.db.collection(collectionName,ref => ref
     .where(colon,'<=', moment(dateObject.setDate(dateObject.getDate()- critere1)).toDate())
     .where(colon,'>', moment(dateObject.setDate(dateObject.getDate()- critereDifference)).toDate())
 ).snapshotChanges()
}


// get By Doc
getByDoc(collectionName: string,docId :string){
  return this.db.collection(collectionName).doc(docId).snapshotChanges();
}

// get Sub collection data
getFromSubCollection(collectionName:string,docId:string,subCollection :string){
  return  this.db
          .collection(collectionName)
          .doc(docId)
          .collection(subCollection).snapshotChanges();
}

// get Sub collection data
getFromSubCollectionUpdate(collectionName:string,docId:string,subCollection :string){
  return  this.db
          .collection(collectionName)
          .doc(docId)
          .collection(subCollection).get();
}

// add with subCollection
addSubCollection(collectionName : string,id : string, subCollectionName:string,model : object) {
  //id = this.db.createId();
  return this.db.collection(collectionName+'/'+id+'/'+subCollectionName).add(model).then( () => {
    
    setTimeout(function() {},12000);
  }).catch((error) => {
      console.log(error)
  });
}

// get By any Parameter
getBy(collectionName : string,parametre : string, parametreValue : any){
  return  this.db.collection(collectionName,ref => ref.where(parametre,'==',parametreValue)).snapshotChanges();
}

// get 3 last doc
getLastDoc(collectionName : string,parametre : string, parametreValue : any,dateColon: string,dateReference : Date,limit:number){
  return  this.db.collection(collectionName,ref => ref
    .where(parametre,'==',parametreValue)
    .where(dateColon,'<=', moment(dateReference.setDate(dateReference.getDate())).toDate())
    .limit(limit)
    .orderBy(dateColon,'desc')
  ).snapshotChanges();
  }

  getByMultiParameters(collectionName : string,parametre1 : string, parametreValue1 : any,parametre2 : string, parametreValue2 : any){
    return  this.db.collection(collectionName,ref => ref
      .where(parametre1,'==',parametreValue1)
      .where(parametre2,'==',parametreValue2)
      ).snapshotChanges();
  }

  getDocFromSubCollection(collectionName:string,docId:any,subCollection :string,subDocId:any){ 
    return  this.db
            .collection(collectionName)
            .doc(docId+'/'+subCollection+'/'+subDocId)
            .snapshotChanges();
           
  }

  // get By any parameter with limit defined
   getByLimit(collectionName : string,parametre : string, parametreValue : any,limit:number,dateColon:string){
    return  this.db.collection(collectionName,ref => ref.where(parametre,'==',parametreValue)
    .limit(limit)
    .orderBy(dateColon,'desc'))
    .snapshotChanges();
    }


    // update somme specifics fields in doc
  updateFields(collectionName:string, id:string,param:any){
    return this.db
    .doc(collectionName+'/'+id)
    .update(param) ;
  }

   // update somme specifics fields in subCollection Doc
   updateSubFields(collectionName:string, id:string,subCollectionName:string,subCollectionId:string,param:any){
    return this.db
    .doc(collectionName+'/'+id)
    .collection(subCollectionName)
    .doc(subCollectionId)
    .update(param) ;
  }

  // Update subCollection doc with model
  updateSubDoc(collectionName:string,docId:string,subCollectionName:string,subCollectionId:string,model : object) {
    return this.db
    .doc('/'+collectionName+'/'+docId)
    .collection(subCollectionName)
    .doc(subCollectionId)
    .update(model);
  }


  getBySubField(collectionName : string,docId:string,subCollectionName : string,parametre : string, parametreValue : any){
    return  this.db
    .collection(collectionName)
    .doc(docId)
    .collection(subCollectionName,ref => ref.where(parametre,'==',parametreValue))
    .snapshotChanges();
  }

  getBySubFieldUpdate(collectionName : string,docId:string,subCollectionName : string,parametre : string, parametreValue : any){
    return  this.db
    .collection(collectionName)
    .doc(docId)
    .collection(subCollectionName,ref => ref.where(parametre,'==',parametreValue))
    .get();
  }


  // get By Doc pour Update
  getByDocUpdate(collectionName: string,docId :string){
    return this.db
    
    .doc(collectionName+'/'+docId)
    .get();
  }
  
   // get Doc From SubCollection pour Update

  getDocFromSubCollectionUpdate(collectionName:string,docId:any,subCollection :string,subDocId:any){ 
    return  this.db
            .collection(collectionName)
            .doc(docId+'/'+subCollection+'/'+subDocId)
            .get();
           
  }

  getForAnalyse(collectionName:string,colon:string,date1:Date,date2:Date){
    return this.db.collection(collectionName,ref => ref
      .where(colon,'<', date1)
      .where(colon,'>=', date2)
  ).snapshotChanges()
  }

  getForAnalyseUpdate(collectionName:string,colon:string,date1:Date,date2:Date){
    return this.db.collection(collectionName,ref => ref
      .where(colon,'<', date1)
      .where(colon,'>=', date2)
  ).get()
  }

  // get Data by date
 
  getByDate(collectionName:string,colon:string,dateObject:Date){
    return this.db.collection(collectionName,ref => ref
      .where(colon,'>=', moment(dateObject.setDate(dateObject.getDate())).toDate())
      .where(colon,'<', moment(dateObject.setDate(dateObject.getDate() + 1)).toDate())
    ).snapshotChanges()
  }

  getByDocNewUpdate(collectionName: string,docId :string){
    return this.db.collection(collectionName).doc(docId).get();
  }
  
   // get Last Doc Save
getLastDocSave(collectionName:string,dateColon:string,colonTri:string,limit:number,dateRef:Date){
 
  return  this.db.collection(collectionName,ref => ref
    .where(dateColon,'<=', moment(dateRef.setDate(dateRef.getDate())).toDate())
    .limit(limit)
    .orderBy(colonTri,'desc')
  ).get();
}



}
