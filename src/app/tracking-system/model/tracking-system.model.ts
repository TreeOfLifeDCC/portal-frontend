export interface Sample {
    organism: string;
    common_name: string;
    metadata_submitted_to_biosamples: string;
    raw_data_submitted_to_ena: string;
    mapped_reads_submitted_to_ena: string;
    assemblies_submitted_to_ena: string;
    annotation_submitted_to_ena: string;
}


export const samples: Sample[] = [
    {
        organism: 'Lutra lutra',
        common_name: 'Eurasian river otter',
        metadata_submitted_to_biosamples: 'Done',
        raw_data_submitted_to_ena: 'Done',
        mapped_reads_submitted_to_ena: 'Done',
        assemblies_submitted_to_ena: 'Waiting',
        annotation_submitted_to_ena: 'Waiting'
    },
    {
        organism: 'Sciurus carolinensis',
        common_name: 'grey squirrel',
        metadata_submitted_to_biosamples: 'Done',
        raw_data_submitted_to_ena: 'Done',
        mapped_reads_submitted_to_ena: 'Done',
        assemblies_submitted_to_ena: 'Waiting',
        annotation_submitted_to_ena: 'Waiting'
    },
    {
        organism: 'Sciurus vulgaris',
        common_name: 'Eurasian red squirrel',
        metadata_submitted_to_biosamples: 'Done',
        raw_data_submitted_to_ena: 'Done',
        mapped_reads_submitted_to_ena: 'Done',
        assemblies_submitted_to_ena: 'Waiting',
        annotation_submitted_to_ena: 'Waiting'
    }
];
