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

//Setup Compiler
const JDOODLE_ENDPOINT = "https://api.jdoodle.com/v1/execute";
const JDOODLE_CLIENT_ID = "76f090eecbfe8c99a9a24dc18c90d020";
const JDOODLE_CLIENT_SECRET = "2205bcdd4aaa033be8f7d679a8b59e13afb63040af48414843ec851e3b8f5350";
const PROXY_CORS = "https://cors-anywhere.herokuapp.com/";

const langs = [
    {
        name: "java",
        version: 4
    },
    {
        name: "javascript",
        version: 0
    },
    {
        name: "python3",
        version: 4
    },
    {
        name: "c",
        version: 5
    },
    {
        name: "cpp",
        version: 5
    }
];

//Get selected language for compiler
const getCompilerLang = function () {
    let langObj;
    const selectedLang = (cmbLanguage.options[cmbLanguage.selectedIndex].value);

    if (selectedLang == 'javascript') {
        langObj = langs.find(o => o.name === 'javascript');
    }
    else if (selectedLang == 'java') {
        langObj = langs.find(o => o.name === 'java');
    }
    else if (selectedLang == 'python') {
        langObj = langs.find(o => o.name === 'python3');
    }
    else if (selectedLang == 'c_cpp') {
        if ((cmbLanguage.options[cmbLanguage.selectedIndex].textContent) == 'c')
            langObj = langs.find(o => o.name === 'c');
        else
            langObj = langs.find(o => o.name === 'cpp');
    }

    return langObj;

}

let editorLib = {
    clearConsoleScreen() {
        consoleMessages.length = 0;

        // Remove all elements in the log list
        while (consoleLogList.firstChild) {
            consoleLogList.removeChild(consoleLogList.firstChild);
        }
    },
    printToConsole(logStyle = 'log log--default') {
        consoleMessages.forEach(log => {
            const newLogItem = document.createElement('li');
            const newLogText = document.createElement('pre');

            newLogText.className = logStyle;
            newLogText.textContent = `> ${log.message}`;

            newLogItem.appendChild(newLogText);
            consoleLogList.appendChild(newLogItem);
        })
    },
    init() {
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

//search for restricted word
const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'i').test(s);

const detectRestrictions = function (userCode) {
    //detect restricted functions
    var ul = document.getElementById("funcs");
    var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        // do something with items[i], which is a <li> element
        if (wordInString(userCode, items[i].innerText))
            console.log(items[i].innerText + " is restricted!");
    }

    //detect restricted libs
    var ul = document.getElementById("libs");
    var items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
        // do something with items[i], which is a <li> element
        if (wordInString(userCode, items[i].innerText))
            console.log(items[i].innerText + " is restricted!");
    }

    editorLib.printToConsole('log log--error');
}

var examTimer = function(date){
    // Update the count down every 1 second
    var x = setInterval(function() {
        var countDownDate = new Date(date).getTime();
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("remaining").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("remaining").innerHTML = "EXPIRED";
        }
    }, 1000)
}

const setQuestions = function(){
    const questionsDiv = document.getElementsByClassName('questions')[0];
              
    for(let i = 0; i < examObj.questions.length; i++){
        var a = document.createElement('a');
        var linkText = document.createTextNode(`q${i+1}`);
        a.appendChild(linkText);
        a.title = i+1;
        a.href = "/student-main/exam/ans/" + examObj._id + "/" + `${i+1}`;

        questionsDiv.appendChild(a);
    }
}

const setQuestionsInstructor = function(){
    const questionsDiv = document.getElementsByClassName('questions')[0];
              
    for(let i = 0; i < examObj.questions.length; i++){
        var a = document.createElement('a');
        var linkText = document.createTextNode(`q${i+1}`);
        a.appendChild(linkText);
        a.title = i+1;
        a.href = "/instructor-main/exam/ans/" + examObj._id + "/" + `${i+1}`;

        questionsDiv.appendChild(a);
    }
}

const setQuestionsForAsses = function(){
    const questionsDiv = document.getElementsByClassName('questions')[0];
              
    for(let i = 0; i < examObj.questions.length; i++){
        var a = document.createElement('a');
        var linkText = document.createTextNode(`q${i+1}`);
        a.appendChild(linkText);
        a.title = i+1;
        a.href = "/instructor-main/exam/" + examObj._id + "/" + studentObj._id + "/" + `${i+1}`;

        questionsDiv.appendChild(a);
    }
}

let i = 0;
const addQuestions = function(){
    const questionsDiv = document.getElementsByClassName('questions')[0];
    if( i <= 0)
        i = examObj.questions.length + 1;
    
    fetch('/instructor-main/' + examObj._id + '/add-question', {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
      }).then(res => {
        var a = document.createElement('a');
        var linkText = document.createTextNode(`q${i}`);
        a.appendChild(linkText);
        a.title = i;
        a.href = "/instructor-main/exam/ans/" + examObj._id + "/" + `${i}`;
    
        questionsDiv.appendChild(a);

        i++;
      });
    
}

// Events
executeCodeBtn.addEventListener('click', () => {
    // Clear console messages
    editorLib.clearConsoleScreen();

    // Get input from the code editor
    const userCode = codeEditor.getValue();

    //Get selected language for compiler
    let langObj = getCompilerLang();

    //detect restricted usages
    //detectRestrictions(userCode);

    //if no restricted usage and user code is not empty
    if (consoleMessages.length == 0 && userCode.length > 0) {
        if (langObj.name == 'javascript') {
            // Run the user code
            try {
                new Function(userCode)();
            } catch (err) {
                console.error(err);
            }

            editorLib.printToConsole();
        }
        else {
            axios({
                method: 'post',
                url: PROXY_CORS + JDOODLE_ENDPOINT,
                data: {
                    script: userCode,
                    language: langObj.name,
                    versionIndex: langObj.version,
                    clientId: JDOODLE_CLIENT_ID,
                    clientSecret: JDOODLE_CLIENT_SECRET
                },
            })
                .then((response) => {
                    console.log(response.data.output);
                    editorLib.printToConsole();

                }, (error) => {
                    console.log(error);
                });
        }
    }

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
    //codeEditor.setValue('');
    //editorLib.clearConsoleScreen();
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

const saveCode = function(code){
    let data = {answer: code};

    fetch('/student-main/exam/' + examObj._id + '/' + qnum, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      
    });
}

const setCode = function(code){
    let data = {content: code};

    fetch('/instructor-main/exam/' + examObj._id + '/' + qnum, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      
    });
}

const setExamLanguage = function(){
    let selectedLanguage = (cmbLanguage.options[cmbLanguage.selectedIndex].value);
    let data = {language: selectedLanguage};

    fetch('/instructor-main/' + examObj._id + '/set-language', {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      }).then(res => {
         
      });
}

const savePoint = function(scoreVal){
    let data = {score: scoreVal};

    fetch("/instructor-main/exam/score/" + examObj._id + "/" + studentObj._id + "/" + qnum, {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(data)
    }).then(res => {
      
    });
}


editorLib.init();