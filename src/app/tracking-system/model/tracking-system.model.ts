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
    trackingSystem: string;
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
        commonName: "Eurasian river otter",
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
        experiment: [
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338754",
                run_accession: "ERR3313238",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313238/ERR3313238_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313238/m54097_180801_114742.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313238/m54097_180801_114742.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313238"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338755",
                run_accession: "ERR3313239",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313239/ERR3313239_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313239/m54097_180801_220251.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313239/m54097_180801_220251.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313239"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338756",
                run_accession: "ERR3313240",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3313240/ERR3313240_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313240/m54097_180802_082112.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313240/m54097_180802_082112.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/000/ERR3313240"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338757",
                run_accession: "ERR3313241",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313241/ERR3313241_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313241/m54097_180802_183954.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313241/m54097_180802_183954.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313241"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338762",
                run_accession: "ERR3313246",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3313246/ERR3313246_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313246/m54097_180805_164844.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313246/m54097_180805_164844.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/006/ERR3313246"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338843",
                run_accession: "ERR3313327",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3313327/ERR3313327_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313327/m54205_180731_110006.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313327/m54205_180731_110006.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/007/ERR3313327"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338846",
                run_accession: "ERR3313330",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3313330/ERR3313330_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313330/m54205_180801_224705.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313330/m54205_180801_224705.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/000/ERR3313330"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338849",
                run_accession: "ERR3313333",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3313333/ERR3313333_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313333/m54205_180803_132151.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313333/m54205_180803_132151.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/003/ERR3313333"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338850",
                run_accession: "ERR3313334",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3313334/ERR3313334_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313334/m54205_180803_233646.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313334/m54205_180803_233646.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/004/ERR3313334"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338851",
                run_accession: "ERR3313335",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3313335/ERR3313335_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313335/m54205_180804_095539.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313335/m54205_180804_095539.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/005/ERR3313335"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338852",
                run_accession: "ERR3313336",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3313336/ERR3313336_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313336/m54205_180804_201216.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313336/m54205_180804_201216.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/006/ERR3313336"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338853",
                run_accession: "ERR3313337",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3313337/ERR3313337_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313337/m54205_180806_100814.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313337/m54205_180806_100814.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/007/ERR3313337"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338854",
                run_accession: "ERR3313338",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313338/ERR3313338_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313338/m54205_180806_202251.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313338/m54205_180806_202251.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313338"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338855",
                run_accession: "ERR3313339",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313339/ERR3313339_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313339/m54205_180807_064031.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313339/m54205_180807_064031.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313339"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338856",
                run_accession: "ERR3313340",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3313340/ERR3313340_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313340/m54205_180807_165736.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313340/m54205_180807_165736.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/000/ERR3313340"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3338857",
                run_accession: "ERR3313341",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313341/ERR3313341_subreads.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313341/m54205_180808_101541.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313341/m54205_180808_101541.subreads.bam.bai"],
                sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313341"]
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341655",
                run_accession: "ERR3316145",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316145/ERR3316145_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316145/ERR3316145_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316145/26447_1#1.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341656",
                run_accession: "ERR3316146",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316146/ERR3316146_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316146/ERR3316146_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316146/26447_1#2.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341657",
                run_accession: "ERR3316147",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3316147/ERR3316147_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3316147/ERR3316147_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316147/26447_1#3.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341658",
                run_accession: "ERR3316148",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3316148/ERR3316148_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3316148/ERR3316148_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316148/26447_1#4.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341679",
                run_accession: "ERR3316169",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3316169/ERR3316169_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3316169/ERR3316169_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316169/26530_1#1.cram"],
                sra_ftp: []
            }, {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341680",
                run_accession: "ERR3316170",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3316170/ERR3316170_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3316170/ERR3316170_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316170/26530_1#2.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341681",
                run_accession: "ERR3316171",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3316171/ERR3316171_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3316171/ERR3316171_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316171/26530_1#3.cram"],
                sra_ftp: []
            },
            {
                study_accession: "PRJEB22206",
                sample_accession: "SAMEA994731",
                experiment_accession: "ERX3341682",
                run_accession: "ERR3316172",
                tax_id: "9657",
                scientific_name: "Lutra lutra",
                fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3316172/ERR3316172_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3316172/ERR3316172_2.fastq.gz"],
                submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316172/26530_1#4.cram"],
                sra_ftp: []
            }
        ],
        trackingSystem: "Completed"
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
        commonName: "Grey Squirrel",
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
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313242/m54097_180803_131457.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313242/m54097_180803_131457.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313242"]
        },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338015", run_accession: "ERR3312499", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3312499/ERR3312499_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3312499/ERR3312499_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3312499/28852_5#1.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338016", run_accession: "ERR3312500", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3312500/ERR3312500_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3312500/ERR3312500_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3312500/28852_6#1.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338759", run_accession: "ERR3313243", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3313243/ERR3313243_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313243/m54097_180804_095540.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313243/m54097_180804_095540.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/003/ERR3313243"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338760", run_accession: "ERR3313244", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3313244/ERR3313244_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313244/m54097_180804_201334.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313244/m54097_180804_201334.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/004/ERR3313244"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338761", run_accession: "ERR3313245", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3313245/ERR3313245_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313245/m54097_180805_063119.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313245/m54097_180805_063119.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/005/ERR3313245"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338763", run_accession: "ERR3313247", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3313247/ERR3313247_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313247/m54097_180806_030555.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313247/m54097_180806_030555.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/007/ERR3313247"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338764", run_accession: "ERR3313248", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313248/ERR3313248_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313248/m54097_180806_132257.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313248/m54097_180806_132257.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313248"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338765", run_accession: "ERR3313249", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313249/ERR3313249_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313249/m54097_180807_095701.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313249/m54097_180807_095701.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313249"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338766", run_accession: "ERR3313250", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3313250/ERR3313250_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313250/m54097_180808_161956.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313250/m54097_180808_161956.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/000/ERR3313250"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338767", run_accession: "ERR3313251", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313251/ERR3313251_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313251/m54097_180809_022908.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313251/m54097_180809_022908.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313251"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338768", run_accession: "ERR3313252", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3313252/ERR3313252_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313252/m54097_180809_154045.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313252/m54097_180809_154045.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313252"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338769", run_accession: "ERR3313253", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3313253/ERR3313253_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313253/m54097_180810_151930.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313253/m54097_180810_151930.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/003/ERR3313253"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338770", run_accession: "ERR3313254", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3313254/ERR3313254_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313254/m54097_180811_013158.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313254/m54097_180811_013158.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/004/ERR3313254"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338771", run_accession: "ERR3313255", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3313255/ERR3313255_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313255/m54097_180811_114717.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313255/m54097_180811_114717.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/005/ERR3313255"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338845", run_accession: "ERR3313329", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313329/ERR3313329_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313329/m54205_180801_123407.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313329/m54205_180801_123407.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313329"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338847", run_accession: "ERR3313331", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313331/ERR3313331_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313331/m54205_180802_122310.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313331/m54205_180802_122310.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313331"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338764", run_accession: "ERR3313248", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313248/ERR3313248_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313248/m54097_180806_132257.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313248/m54097_180806_132257.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313248"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338765", run_accession: "ERR3313249", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313249/ERR3313249_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313249/m54097_180807_095701.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313249/m54097_180807_095701.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313249"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338766", run_accession: "ERR3313250", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/000/ERR3313250/ERR3313250_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313250/m54097_180808_161956.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313250/m54097_180808_161956.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/000/ERR3313250"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338767", run_accession: "ERR3313251", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313251/ERR3313251_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313251/m54097_180809_022908.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313251/m54097_180809_022908.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313251"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338768", run_accession: "ERR3313252", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3313252/ERR3313252_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313252/m54097_180809_154045.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313252/m54097_180809_154045.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313252"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338769", run_accession: "ERR3313253", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3313253/ERR3313253_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313253/m54097_180810_151930.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313253/m54097_180810_151930.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/003/ERR3313253"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338770", run_accession: "ERR3313254", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3313254/ERR3313254_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313254/m54097_180811_013158.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313254/m54097_180811_013158.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/004/ERR3313254"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338771", run_accession: "ERR3313255", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3313255/ERR3313255_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313255/m54097_180811_114717.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313255/m54097_180811_114717.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/005/ERR3313255"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338845", run_accession: "ERR3313329", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/009/ERR3313329/ERR3313329_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313329/m54205_180801_123407.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313329/m54205_180801_123407.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/009/ERR3313329"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338847", run_accession: "ERR3313331", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/001/ERR3313331/ERR3313331_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313331/m54205_180802_122310.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313331/m54205_180802_122310.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/001/ERR3313331"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338848", run_accession: "ERR3313332", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3313332/ERR3313332_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313332/m54205_180802_223847.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313332/m54205_180802_223847.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313332"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338858", run_accession: "ERR3313342", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/002/ERR3313342/ERR3313342_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313342/m54205_180808_202926.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313342/m54205_180808_202926.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/002/ERR3313342"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338859", run_accession: "ERR3313343", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3313343/ERR3313343_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313343/m54205_180809_064441.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313343/m54205_180809_064441.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/003/ERR3313343"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338860", run_accession: "ERR3313344", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3313344/ERR3313344_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313344/m54205_180809_165916.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313344/m54205_180809_165916.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/004/ERR3313344"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338861", run_accession: "ERR3313345", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3313345/ERR3313345_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313345/m54205_180810_111106.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313345/m54205_180810_111106.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/005/ERR3313345"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338862", run_accession: "ERR3313346", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3313346/ERR3313346_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313346/m54205_180810_212317.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313346/m54205_180810_212317.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/006/ERR3313346"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338863", run_accession: "ERR3313347", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/007/ERR3313347/ERR3313347_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313347/m54205_180811_073628.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313347/m54205_180811_073628.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/007/ERR3313347"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3338864", run_accession: "ERR3313348", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/008/ERR3313348/ERR3313348_subreads.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313348/m54205_180811_174942.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3313348/m54205_180811_174942.subreads.bam.bai"], sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR331/008/ERR3313348"] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341663", run_accession: "ERR3316153", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3316153/ERR3316153_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3316153/ERR3316153_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316153/26447_3#1.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341664", run_accession: "ERR3316154", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3316154/ERR3316154_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3316154/ERR3316154_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316154/26447_3#2.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341665", run_accession: "ERR3316155", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316155/ERR3316155_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316155/ERR3316155_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316155/26447_3#3.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341666", run_accession: "ERR3316156", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316156/ERR3316156_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316156/ERR3316156_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316156/26447_3#4.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341683", run_accession: "ERR3316173", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3316173/ERR3316173_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/003/ERR3316173/ERR3316173_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316173/26530_8#1.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341684", run_accession: "ERR3316174", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3316174/ERR3316174_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/004/ERR3316174/ERR3316174_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316174/26530_8#2.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341685", run_accession: "ERR3316175", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316175/ERR3316175_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/005/ERR3316175/ERR3316175_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316175/26530_8#3.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3341686", run_accession: "ERR3316176", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316176/ERR3316176_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR331/006/ERR3316176/ERR3316176_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR331/ERR3316176/26530_8#4.cram"], sra_ftp: [] },
        { study_accession: "PRJEB22206", sample_accession: "SAMEA994726", experiment_accession: "ERX3863398", run_accession: "ERR3850937", tax_id: "30640", scientific_name: "Sciurus carolinensis", fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR385/007/ERR3850937/ERR3850937_1.fastq.gz", "ftp.sra.ebi.ac.uk/vol1/fastq/ERR385/007/ERR3850937/ERR3850937_2.fastq.gz"], submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR385/ERR3850937/30075_3#1.cram"], sra_ftp: [] }
        ],
        trackingSystem: "Completed"

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
        commonName: "Eurasian red squirrel",
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
            experiment_accession: "ERX3176811",
            run_accession: "ERR3147845",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/005/ERR3147845/ERR3147845_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147845/m54097_180129_125343.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147845/m54097_180129_125343.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/005/ERR3147845"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3176812",
            run_accession: "ERR3147846",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/006/ERR3147846/ERR3147846_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147846/m54097_180129_230019.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147846/m54097_180129_230019.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/006/ERR3147846"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3176813",
            run_accession: "ERR3147847",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/007/ERR3147847/ERR3147847_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147847/m54097_180130_133514.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147847/m54097_180130_133514.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/007/ERR3147847"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3176814",
            run_accession: "ERR3147848",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/008/ERR3147848/ERR3147848_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147848/m54097_180130_234234.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147848/m54097_180130_234234.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/008/ERR3147848"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3176815",
            run_accession: "ERR3147849",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/009/ERR3147849/ERR3147849_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147849/m54097_180131_155908.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147849/m54097_180131_155908.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/009/ERR3147849"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3176816",
            run_accession: "ERR3147850",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR314/000/ERR3147850/ERR3147850_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147850/m54097_180201_020554.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR314/ERR3147850/m54097_180201_020554.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR314/000/ERR3147850"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180106",
            run_accession: "ERR3151029",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/009/ERR3151029/ERR3151029_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151029/m54097_180204_103935.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151029/m54097_180204_103935.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/009/ERR3151029"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180108",
            run_accession: "ERR3151031",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/001/ERR3151031/ERR3151031_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151031/m54097_180205_110913.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151031/m54097_180205_110913.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/001/ERR3151031"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180109",
            run_accession: "ERR3151032",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/002/ERR3151032/ERR3151032_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151032/m54097_180205_211600.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151032/m54097_180205_211600.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/002/ERR3151032"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180110",
            run_accession: "ERR3151033",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/003/ERR3151033/ERR3151033_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151033/m54097_180206_124118.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151033/m54097_180206_124118.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/003/ERR3151033"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180115",
            run_accession: "ERR3151038",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/008/ERR3151038/ERR3151038_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151038/m54205_180206_124432.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151038/m54205_180206_124432.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/008/ERR3151038"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180116",
            run_accession: "ERR3151039",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/009/ERR3151039/ERR3151039_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151039/m54205_180206_225021.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151039/m54205_180206_225021.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/009/ERR3151039"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180117",
            run_accession: "ERR3151040",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/000/ERR3151040/ERR3151040_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151040/m54205_180207_090003.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151040/m54205_180207_090003.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/000/ERR3151040"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180118",
            run_accession: "ERR3151041",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/001/ERR3151041/ERR3151041_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151041/m54205_180207_190956.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151041/m54205_180207_190956.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/001/ERR3151041"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180120",
            run_accession: "ERR3151043",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/003/ERR3151043/ERR3151043_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151043/m54205_180210_112817.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151043/m54205_180210_112817.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/003/ERR3151043"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3180121",
            run_accession: "ERR3151044",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR315/004/ERR3151044/ERR3151044_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151044/m54205_180210_213800.subreads.bam","ftp.sra.ebi.ac.uk/vol1/run/ERR315/ERR3151044/m54205_180210_213800.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR315/004/ERR3151044"]
        },
        {
            study_accession: "PRJEB22206",
            sample_accession: "SAMEA994733",
            experiment_accession: "ERX3224905",
            run_accession: "ERR3197129",
            tax_id: "55149",
            scientific_name: "Sciurus vulgaris",
            fastq_ftp: ["ftp.sra.ebi.ac.uk/vol1/fastq/ERR319/009/ERR3197129/ERR3197129_subreads.fastq.gz"],
            submitted_ftp: ["ftp.sra.ebi.ac.uk/vol1/run/ERR319/ERR3197129/m54205_180301_123230.subreads.bam", "ftp.sra.ebi.ac.uk/vol1/run/ERR319/ERR3197129/m54205_180301_123230.subreads.bam.bai"],
            sra_ftp: ["ftp.sra.ebi.ac.uk/vol1/err/ERR319/009/ERR3197129"]
        }
        ],
        trackingSystem: "Completed"
    }
];