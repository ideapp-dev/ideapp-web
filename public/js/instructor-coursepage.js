const addExam = function(name, start, end,lecture_id){
    let data = {name: name, start:start, end:end, lecture_id: lecture_id};

    fetch("/instructor-main/create-exam/", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(res => {
        
    });
}

const saveExamSettings = function(name, start, end, lecture_id, exam_id){
    let data = {name: name, start:start, end:end, lecture_id: lecture_id, exam_id: exam_id};

    fetch("/instructor-main/edit-exam/", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(res => {
        
    });
}