generatePdfDefinition: function(data, userDetails, appraisalInfo) {
    return {
        content: [
            { text: 'WALCHAND INSTITUTE OF TECHNOLOGY, SOLAPUR', style: 'header' },
            { text: '(An Autonomous Institute)', alignment: 'center', fontSize: 10 },
            { text: 'Faculty Performance Appraisal Report', style: 'subheader' },
            { text: `Academic Year: ${appraisalInfo.academic_year}`, alignment: 'center', margin: [0, 0, 0, 20] },

            {
                columns: [
                    { text: `Name: ${userDetails.name}`, bold: true },
                    { text: `Department: ${userDetails.department}`, bold: true, alignment: 'right' }
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },

            // PART 1: AICTE 360 DEGREE FEEDBACK
            { text: 'Summary of AICTE 360 Degree Feedback', style: 'sectionHeader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto'],
                    body: [
                        ['No', 'Category', 'Maximum Points'],
                        ['1', 'Teaching Process', ''],
                        ['2', 'Students\' Feedback', ''],
                        ['3', 'Departmental Activities summarized by Head of Department', ''],
                        ['4', 'Institute Activities summarized by Head of Institute', ''],
                        ['5', 'Contribution to Society', ''],
                        ['6', 'Annual Confidential Report maintained at institute level', ''],
                        [{ text: 'Total out of 100', colSpan: 3, alignment: 'center' }, {}, {}]
                    ]
                }
            },

            // PART 2: Points Obtained by Faculty
            { text: '\nSummary of Points Obtained by Faculty in assessment of PBAS', style: 'sectionHeader' },
            { text: `Year: ${appraisalInfo.academic_year}`, margin: [0, 0, 0, 10], bold: true },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto'],
                    body: [
                        ['No', 'Description', 'Obtained Points'],
                        ['I', 'AICTE 360 DEGREE FEEDBACK', ''],
                        ['II', 'Trainings Undergone', ''],
                        ['III', 'Research and Academic Contributions', ''],
                        ['IV', 'Innovative Teaching and E-Learning Material', ''],
                        [{ text: 'Total Points', colSpan: 3, alignment: 'center' }, {}, {}]
                    ]
                }
            },

            // Signatures
            { text: '\nSignatures:', bold: true, margin: [0, 20, 0, 5] },
            {
                columns: [
                    { text: 'Institute Representative-1\nPBAS Assessment', alignment: 'left' },
                    { text: 'Institute Representative-2\nPBAS Assessment', alignment: 'center' },
                    { text: 'Principal\nInstitute Seal', alignment: 'right' }
                ]
            }
        ],
        styles: {
            header: { fontSize: 16, bold: true, alignment: 'center' },
            subheader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 5, 0, 5] },
            sectionHeader: { fontSize: 12, bold: true, margin: [0, 15, 0, 5], color: '#003366' },
            tableHeader: { bold: true, fontSize: 10, fillColor: '#f2f2f2' }
        }
    };
}