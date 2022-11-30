export interface Commande {
    date: any;
    etatPayement: boolean;
    idClient: string;
    paye: number;
    expedition: number;
    prixTotal: number;
    refCommande: string;
    remarque: string;
    statut: boolean;
    typeReglement: string;
    reduction:  number;
    numero : number
}

export interface detailPayement {

    datePayement: any;
    montantPaye: number
}

export interface detailCommandes {
    variante: Array<any>;
    quantite: number;
    idApprovisionnement: string
}
