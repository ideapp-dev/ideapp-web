const addExam = function(name, lecture_id){
    let data = {name: name, lecture_id: lecture_id};

    fetch("/instructor-main/create-exam/", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(data)
    }).then(res => {
        
    });
}