export interface Sample {
    accession: string;
    taxonId: string;
    scientificName: string;
    specimenId?: any;
    cultureOrStrainId?: any;
    lifeStage?: any;
    sex: OntologyDTO[];
    organism: string;
    commonName: string;
    relationship: Relationship[];
    gal?: any;
    galSampleId?: any;
    collectedBy?: any;
    collectingInstitution?: any;
    collectionDate?: any;
    geographicLocationCountry?: any;
    geographicLocationRegion?: any;
    geographicLocationLatitude?: any;
    geographicLocationLongitude?: any;
    habitat?: any;
    geographicLocationDepth?: any;
    geographicLocationElevation?: any;
    identifiedBy?: any;
    identifierAffiliation?: any;
    specimenVoucher?: any;
    projectName?: any;
    customField: CustomField[];
    experiment: Experiment[];
  }
  
  interface CustomField {
    name: string;
    value: string;
    unit: string;
    ontologyTerms: string[];
  }
  
  interface Relationship {
    source: string;
    type: string;
    target: string;
  }
  
  interface OntologyDTO {
    text: string;
    ontologyTerms: string[];
  }

  interface Experiment {
    study_accession: string;
    sample_accession: string;
    experiment_accession: string;
    run_accession: string;
    tax_id: string;
    scientific_name: string;
    fastq_ftp: string[];
    submitted_ftp: string[];
    sra_ftp: string[];
  }


 export const samples: Sample[] = [
    {
        accession: "SAMEA994731",
        taxonId: "9657",
        scientificName: "mLutLut1",
        specimenId: null,
        cultureOrStrainId: null,
        lifeStage: null,
        sex: [{
            text: "male",
            ontologyTerms: ["http://purl.obolibrary.org/obo/PATO_0000384"]
        }],
        relationship: [{
            source: "SAMEG100003",
            type: "has member",
            target: "SAMEA994731"
        }, {
            source: "SAMN12747921",
            type: "isolate",
            target: "SAMEA994731"
        }],
        organism: "Lutra lutra",
        commonName:"Eurasian river otter",
        gal: null,
        galSampleId: null,
        collectedBy: null,
        collectingInstitution: null,
        collectionDate: null,
        geographicLocationCountry: null,
        geographicLocationRegion: null,
        geographicLocationLatitude: null,
        geographicLocationLongitude: null,
        habitat: null,
        geographicLocationDepth: null,
        geographicLocationElevation: null,
        identifiedBy: null,
        identifierAffiliation: null,
        specimenVoucher: null,
        projectName: null,
        customField: [{
            name: "SRA accession",
            value: "ERS3567211",
            unit: null,
            ontologyTerms: []
        }, {
            name: "common name",
            value: "Eurasian river otter",
            unit: null,
            ontologyTerms: []
        }, {
            name: "date received",
            value: "2018-09-19",
            unit: null,
            ontologyTerms: []
        }, {
            name: "family",
            value: "Mustelidae",
            unit: null,
            ontologyTerms: []
        }, {
            name: "material",
            value: "individual",
            unit: null,
            ontologyTerms: ["http://www.ebi.ac.uk/efo/EFO_0000542"]
        }, {
            name: "order",
            value: "Carnivora",
            unit: null,
            ontologyTerms: ["http://purl.obolibrary.org/obo/NCBITaxon_9657"]
        }, {
            name: "organism",
            value: "Lutra lutra",
            unit: null,
            ontologyTerms: []
        }, {
            name: "provider",
            value: "Frank Hailer",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission description",
            value: "The project's primary goal is to sequence 25 novel genomes representing UK biodiversity, as part of the Wellcome Sanger Institute's wider 25th Anniversary celebrations. This project will be a pathfinder for future long-read sequencing projects to demonstrate the Institute’s capabilities and will provide reference genomes for the global scientific community.",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission identifier",
            value: "GSB-65",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission title",
            value: "25 Genomes Project",
            unit: null,
            ontologyTerms: []
        }, {
            name: "externalReferences",
            value: "https://www.ebi.ac.uk/ena/data/view/ERS3567211",
            unit: null,
            ontologyTerms: []
        }, {
            name: "releaseDate",
            value: "2018-02-01",
            unit: null,
            ontologyTerms: []
        }, {
            name: "updateDate",
            value: "2020-05-20",
            unit: null,
            ontologyTerms: []
        }],
        experiment: [{
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994731",
            experiment_accession: "ERX3338754",
            run_accession: "ERR3313238",
            tax_id: "9657",
            scientific_name: "Lutra lutra",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313238/ERR3313238_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313238/m54097_180801_114742.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313238/m54097_180801_114742.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313238"]
        }]
    },
    {
        accession: "SAMEA994726",
        taxonId: "30640",
        scientificName: "mSciCar1",
        specimenId: null,
        cultureOrStrainId: null,
        lifeStage: null,
        sex: [{
            text: "male",
            ontologyTerms: ["http://purl.obolibrary.org/obo/PATO_0000384"]
        }],
        relationship: [{
            source: "SAMEG100003",
            type: "has member",
            target: "SAMEA994726"
        }],
        organism: "Sciurus carolinensis",
        commonName:"Grey Squirrel",
        gal: null,
        galSampleId: null,
        collectedBy: null,
        collectingInstitution: null,
        collectionDate: null,
        geographicLocationCountry: null,
        geographicLocationRegion: null,
        geographicLocationLatitude: null,
        geographicLocationLongitude: null,
        habitat: null,
        geographicLocationDepth: null,
        geographicLocationElevation: null,
        identifiedBy: null,
        identifierAffiliation: null,
        specimenVoucher: null,
        projectName: null,
        customField: [{
            name: "SRA accession",
            value: "ERS3567197",
            unit: null,
            ontologyTerms: []
        }, {
            name: "common name",
            value: "grey squirrel",
            unit: null,
            ontologyTerms: []
        }, {
            name: "date received",
            value: "2017-10-04",
            unit: null,
            ontologyTerms: []
        }, {
            name: "family",
            value: "Sciuridae",
            unit: null,
            ontologyTerms: []
        }, {
            name: "material",
            value: "individual",
            unit: null,
            ontologyTerms: ["http://www.ebi.ac.uk/efo/EFO_0000542"]
        }, {
            name: "order",
            value: "Rodentia",
            unit: null,
            ontologyTerms: []
        }, {
            name: "organism",
            value: "Sciurus carolinensis",
            unit: null,
            ontologyTerms: ["http://purl.obolibrary.org/obo/NCBITaxon_30640"]
        }, {
            name: "provider",
            value: "Rachel Cripps",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission description",
            value: "The project's primary goal is to sequence 25 novel genomes representing UK biodiversity, as part of the Wellcome Sanger Institute's wider 25th Anniversary celebrations. This project will be a pathfinder for future long-read sequencing projects to demonstrate the Institute’s capabilities and will provide reference genomes for the global scientific community.",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission identifier",
            value: "GSB-65",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission title",
            value: "25 Genomes Project",
            unit: null,
            ontologyTerms: []
        }, {
            name: "externalReferences",
            value: "https://www.ebi.ac.uk/ena/data/view/ERS3567197",
            unit: null,
            ontologyTerms: []
        }, {
            name: "releaseDate",
            value: "2018-02-01",
            unit: null,
            ontologyTerms: []
        }, {
            name: "updateDate",
            value: "2020-05-20",
            unit: null,
            ontologyTerms: []
        }],
        experiment: [{
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994726",
            experiment_accession: "ERX3338758",
            run_accession: "ERR3313242",
            tax_id: "30640",
            scientific_name: "Sciurus carolinensis",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3313242/ERR3313242_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313242/m54097_180803_131457.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313242/m54097_180803_131457.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313242"]
        }]
    },
    {
        accession: "SAMEA994733",
        taxonId: "55149",
        scientificName: "mSciVul1",
        specimenId: null,
        cultureOrStrainId: null,
        lifeStage: null,
        sex: [{
            text: "male",
            ontologyTerms: ["http://purl.obolibrary.org/obo/PATO_0000384"]
        }],
        relationship: [{
            source: "SAMEG100003",
            type: "has member",
            target: "SAMEA994733"
        },
        {
            source: "SAMN12747924",
            type: "isolate",
            target: "SAMEA994733"
        }],
        organism: "Sciurus vulgaris",
        commonName:"Eurasian red squirrel",
        gal: null,
        galSampleId: null,
        collectedBy: null,
        collectingInstitution: null,
        collectionDate: null,
        geographicLocationCountry: null,
        geographicLocationRegion: null,
        geographicLocationLatitude: null,
        geographicLocationLongitude: null,
        habitat: null,
        geographicLocationDepth: null,
        geographicLocationElevation: null,
        identifiedBy: null,
        identifierAffiliation: null,
        specimenVoucher: null,
        projectName: null,
        customField: [{
            name: "SRA accession",
            value: "SRS4362283",
            unit: null,
            ontologyTerms: []
        }, {
            name: "common name",
            value: "Eurasian red squirrel",
            unit: null,
            ontologyTerms: []
        }, {
            name: "date received",
            value: "2017-10-04",
            unit: null,
            ontologyTerms: []
        }, {
            name: "family",
            value: "Sciuridae",
            unit: null,
            ontologyTerms: []
        }, {
            name: "material",
            value: "individual",
            unit: null,
            ontologyTerms: ["http://www.ebi.ac.uk/efo/EFO_0000542"]
        }, {
            name: "order",
            value: "Rodentia",
            unit: null,
            ontologyTerms: []
        }, {
            name: "organism",
            value: "Sciurus vulgaris",
            unit: null,
            ontologyTerms: ["http://purl.obolibrary.org/obo/NCBITaxon_55149"]
        }, {
            name: "provider",
            value: "Rachel Cripps",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission description",
            value: "The project's primary goal is to sequence 25 novel genomes representing UK biodiversity, as part of the Wellcome Sanger Institute's wider 25th Anniversary celebrations. This project will be a pathfinder for future long-read sequencing projects to demonstrate the Institute’s capabilities and will provide reference genomes for the global scientific community.",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission identifier",
            value: "GSB-65",
            unit: null,
            ontologyTerms: []
        }, {
            name: "submission title",
            value: "25 Genomes Project",
            unit: null,
            ontologyTerms: []
        }, {
            name: "externalReferences",
            value: "https://www.ebi.ac.uk/ena/data/view/SRS4362283",
            unit: null,
            ontologyTerms: []
        }, {
            name: "releaseDate",
            value: "2018-02-01",
            unit: null,
            ontologyTerms: []
        }, {
            name: "updateDate",
            value: "2020-05-20",
            unit: null,
            ontologyTerms: []
        }],
        experiment: [{
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3224905",
            run_accession: "ERR3197129",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR319/009/ERR3197129/ERR3197129_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR319/ERR3197129/m54205_180301_123230.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR319/ERR3197129/m54205_180301_123230.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR319/009/ERR3197129"]
        }]
    }
];