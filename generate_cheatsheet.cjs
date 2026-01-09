const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'mots_cles_qcm.txt');
const outputPath = path.join(__dirname, 'cheatsheet.html');

const content = fs.readFileSync(inputPath, 'utf8');

// Parse the file
// Split by separator line
const rawBlocks = content.split('----------------------------------------');

let htmlCards = '';

rawBlocks.forEach(block => {
    let lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return;

    // First line is question title
    let title = lines[0];

    // Remaining lines are answers
    let answers = lines.slice(1).map(l => {
        // Remove leading "- " if present
        return l.replace(/^-\s*/, '');
    });

    htmlCards += `
    <div class="card">
        <div class="question">${title}</div>
        <ul class="answers">
            ${answers.map(a => `<li>${a}</li>`).join('')}
        </ul>
    </div>
    `;
});

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>QCM Mots Clés</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
            background-color: #1e1e1e;
            color: #e0e0e0;
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px; /* Small font to fit many columns */
        }

        .container {
            column-count: 3;
            column-gap: 20px;
            column-rule: 1px solid #444; /* line between columns */
            width: 100%;
        }

        /* Specific fix for printing/pdf generation to respect columns */
        @media print {
            @page {
                size: A4 portrait;
                margin: 1cm;
            }
            body {
                background-color: #1e1e1e;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
            }
            .container {
                column-count: 3;
            }
        }

        .card {
            background-color: #252526; /* Slightly lighter than bg */
            border: 1px solid #3e3e42;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 12px;
            break-inside: avoid-column; /* Crucial: do not split cards across columns */
            page-break-inside: avoid;
            display: inline-block; /* Helps with column behavior sometimes */
            width: 100%; /* Fix inline-block width */
            box-sizing: border-box;
        }

        .question {
            font-weight: 700;
            color: #ff6b6b; /* Redish color for question title to stand out */
            margin-bottom: 4px;
            border-bottom: 1px solid #333;
            padding-bottom: 4px;
        }

        .answers {
            list-style-type: none; /* No bullets, cleaner look? Or use dashes */
            padding-left: 0;
            margin: 0;
        }

        .answers li {
            position: relative;
            padding-left: 10px;
            margin-bottom: 2px;
            line-height: 1.3;
            color: #dcdcdc; /* White-ish */
        }

        .answers li::before {
            content: "-";
            position: absolute;
            left: 0;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        ${htmlCards}
    </div>
</body>
</html>
`;

fs.writeFileSync(outputPath, htmlContent);
console.log(`HTML generated at ${outputPath}`);
