// Retrieve Elements
const consoleLogList = document.querySelector('.editor__console-logs');
const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');

let cmbLanguage = document.getElementById('selectLanguage');
let cmbTheme = document.getElementById('selectTheme');
let cmbFontsize = document.getElementById('selectFontSize');


// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = '';
let consoleMessages = [];

let editorLib = {
    clearConsoleScreen() {
        consoleMessages.length = 0;

        // Remove all elements in the log list
        while (consoleLogList.firstChild) {
            consoleLogList.removeChild(consoleLogList.firstChild);
        }
    },
    printToConsole() {
        consoleMessages.forEach(log => {
            const newLogItem = document.createElement('li');
            const newLogText = document.createElement('pre');

            newLogText.className = log.class;
            newLogText.textContent = `> ${log.message}`;

            newLogItem.appendChild(newLogText);

            consoleLogList.appendChild(newLogItem);
        })
    },
    init() {
        // Configure Ace

        // Theme
        codeEditor.setTheme("ace/theme/dracula");

        // Set language
        codeEditor.session.setMode("ace/mode/java");

        // Set Options
        codeEditor.setOptions({
            //fontFamily: 'Inconsolata',
            fontSize: '12pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });

        // Set Default Code
        codeEditor.setValue(defaultCode);
    }
}

// Events
executeCodeBtn.addEventListener('click', () => {
    // Clear console messages
    editorLib.clearConsoleScreen();

    // Get input from the code editor
    const userCode = codeEditor.getValue();

    // Run the user code
    try {
        new Function(userCode)();
    } catch (err) {
        console.error(err);
    }

    // Print to the console
    editorLib.printToConsole();
});

resetCodeBtn.addEventListener('click', () => {
    // Clear ace editor
    codeEditor.setValue(defaultCode);

    // Clear console messages
    editorLib.clearConsoleScreen();
})

cmbLanguage.addEventListener('change', (event) => {
    let selectedLanguage = (cmbLanguage.options[cmbLanguage.selectedIndex].value);
    codeEditor.getSession().setMode("ace/mode/" + selectedLanguage);
    codeEditor.setValue('');
    editorLib.clearConsoleScreen();
    console.log(selectedLanguage);
})

cmbTheme.addEventListener('change', (event) => {
    let selectedTheme = (cmbTheme.options[cmbTheme.selectedIndex].value);
    codeEditor.setTheme("ace/theme/" + selectedTheme);
    console.log(selectedTheme);
})

cmbFontsize.addEventListener('change', (event) => {
    let selectedFontsize = (cmbFontsize.options[cmbFontsize.selectedIndex].value);
    codeEditor.setOptions({
        fontSize: `${selectedFontsize}pt`
    });
    console.log(selectedFontsize);
})


editorLib.init();