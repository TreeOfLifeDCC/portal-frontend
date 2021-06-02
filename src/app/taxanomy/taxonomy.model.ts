export interface TaxonomyDTO {
    parent: string;
    rank: string;
    expanded: boolean;
    childData: TaxonomyChildDTO[];

}

export interface TaxonomyChildDTO {
    key: string;
    doc_count: string;
    commonName: CommonNameDTO;
}

export interface CommonNameDTO {
    buckets: TaxonomyChildDTO[];
}
export interface Taxonomy {
    cellularorganism: TaxonomyDTO[];
    superkingdom: TaxonomyDTO[]; 
    kingdom: TaxonomyDTO[]; 
    subkingdom: TaxonomyDTO[]; 
    superphylum: TaxonomyDTO[];
    phylum: TaxonomyDTO[]; 
    subphylum: TaxonomyDTO[]; 
    superclass: TaxonomyDTO[]; 
    class: TaxonomyDTO[]; 
    subclass: TaxonomyDTO[]; 
    infraclass: TaxonomyDTO[]; 
    cohort: TaxonomyDTO[]; 
    subcohort: TaxonomyDTO[]; 
    superorder: TaxonomyDTO[]; 
    order: TaxonomyDTO[]; 
    parvorder: TaxonomyDTO[]; 
    suborder: TaxonomyDTO[]; 
    infraorder: TaxonomyDTO[]; 
    section: TaxonomyDTO[]; 
    subsection: TaxonomyDTO[]; 
    superfamily: TaxonomyDTO[]; 
    family: TaxonomyDTO[]; 
    subfamily: TaxonomyDTO[]; 
    tribe: TaxonomyDTO[]; 
    subtribe: TaxonomyDTO[]; 
    genus: TaxonomyDTO[]; 
    series: TaxonomyDTO[]; 
    subgenus: TaxonomyDTO[];
    species_group: TaxonomyDTO[]; 
    species_subgroup: TaxonomyDTO[]; 
    species: TaxonomyDTO[]; 
    subspecies: TaxonomyDTO[];
    varietas: TaxonomyDTO[];
    forma: TaxonomyDTO[];
    
}