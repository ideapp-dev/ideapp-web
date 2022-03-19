let btn = document.querySelector(".add_course")


    btn.addEventListener("click", function addCard() {
            if (document.getElementById('course_code').value && document.getElementById('course_name').value){
                const card = document.createElement("div");
                const card_inner = document.createElement("div");
                const card_top = document.createElement("div");
                const card_bottom = document.createElement("div");
                const card_info = document.createElement("div");
                const img = document.createElement("img");
                const p1 = document.createElement("p");
                const p2 = document.createElement("p");
                card.className = "card_item";
                card_inner.className = "card_inner";
                card_top.className = "card_top";
                card_bottom.className = "card_bottom";
                card_info.className = "card_info";
                img.src = "/images/course.png";
                img.alt = "Course Card"
                p1.className = "title";
                p1.style.textAlign = "center";
                p1.textContent = document.getElementById('course_code').value;
                p2.textContent = document.getElementById('course_name').value;
    
                card_info.appendChild(p1);
                card_info.appendChild(p2);
    
                card_bottom.appendChild(card_info);
    
                card_top.appendChild(img);
    
                card_inner.appendChild(card_top);
                card_inner.appendChild(card_bottom);
    
                card.appendChild(card_inner);
    
                document.getElementById("cards").appendChild(card);
    
                $("#exampleModal").on("hidden.bs.modal", function(){
                    $(this).find('form').trigger('reset');
                });
            }
        });
 