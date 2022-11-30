export interface Produits {
    designation: string,
    categorie: string,
    statut: string,
    quantite: number,
    dateCreation: any,
    labelVariante: Array<any>
}

export interface Variante {
    proprieteVariante: Array<any>,
    quantite: number
}

export interface ApprovData {
    idProduit: any;
    variante: Array<any>;
}

export interface Approvisionnement {
    idProduit : string;
    idVariante : string;
    dateAppro : Date;
    PUAchat : number;
    puVente : number;
    quantite : number;
    quantiteVendu : number;
    observation : string,
    nomFournisseur: string
}

export interface Client {
    nomComplet : string,
    telephone : string,
    email : string,
    adresse : Array<Adresse>,
    banque : Array<AdressePayement>,
    remarque : string,
    createdAt : any,
    compagnie: string,
    paysCompagnie: string,
    posteClient: string,
    statutClient: string
}

export interface AdressePayement  {
    nomBanque : string,
    numeroCompte : string 
}

export interface Adresse {
    pays : string,
    ville : string,
    bp : string,
    rue : string,
    appartement : string
}


export interface optData {
    idProduit: any;
}