const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, 'src', 'assets', 'questions.json');
const outputPath = path.join(__dirname, 'questions_reponses.txt');

try {
    const data = fs.readFileSync(questionsPath, 'utf8');
    const questions = JSON.parse(data);

    let output = "LISTE COMPLÈTE DES QUESTIONS ET RÉPONSES QCM ANDROID/KOTLIN\n";
    output += "===========================================================\n\n";

    questions.forEach((q, index) => {
        output += `Question ${q.id} :\n`;
        output += `${q.question}\n\n`;

        // Process options
        q.options.forEach((opt, i) => {
            const letter = String.fromCharCode(65 + i); // A, B, C...
            const isCorrect = q.correctAnswers.includes(i);
            const mark = isCorrect ? " [CORRECT]" : "";
            output += `${letter}. ${opt}${mark}\n`;
        });

        output += `\nRéponses correctes : ${q.correctAnswers.map(i => String.fromCharCode(65 + i)).join(', ')}\n`;

        if (q.explanation) {
            output += `Explication : ${q.explanation}\n`;
        }

        output += "\n-----------------------------------------------------------\n\n";
    });

    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`Successfully exported ${questions.length} questions to ${outputPath}`);

} catch (err) {
    console.error('Error processing file:', err);
}
