const fs = require('fs');
const path = require('path');


const logFilePath = path.join(__dirname, '../../logs.txt');

function logAction(actionDescription) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${actionDescription}\n`;

    
    fs.appendFile(logFilePath, logMessage, 'utf8', (err) => {
        if (err) {
            console.error('Помилка запису в лог-файл:', err);
            return;
        }
        
    });
}

module.exports = { logAction };