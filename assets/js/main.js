//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
   
  
    let amount, category, difficulty, questionSet;

    let categoryButtons = $(".categories").children("button");
    let difficultyButtons = $(".difficulty-level").children("button");
    let quantityButtons = $(".question-quantity").children("button");
    
    
        //console.log(buttons);
    for (let singleButton of categoryButtons) {        
        if ($(singleButton).hasClass("active")) {
            category = singleButton.getAttribute("data-value");                        
        };
        console.log(category);
    }
    for (let singleButton of difficultyButtons) {        
        if ($(singleButton).hasClass("active")) {
            difficulty = singleButton.getAttribute("data-value");                        
        };
        console.log(difficulty);
    }
    for (let singleButton of quantityButtons) {        
        if ($(singleButton).hasClass("active")) {
            amount = singleButton.getAttribute("data-value");                        
        };
        console.log(amount);
    }

    function makeUrl() {
        
    /* let quantityButtons = document.querySelectorAll(".question-quantity-button");
        quantityButtons.forEach(function(quantityButton) {
            quantityButton.addEventListener("click", function() {
            amount = this.getAttribute("data-value");            
            });
        }); */
        quantityButtons.click(function () {
        amount = this.getAttribute("data-value");
        console.log(amount);
        });

        categoryButtons.click(function () {
        category = this.getAttribute("data-value");
        console.log(category);
        });

        difficultyButtons.click(function () {
        difficulty = this.getAttribute("data-value");
        console.log(difficulty);
        });

        return `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
    }

    function toggleOptions() {
        if ($(".question-options").css("display") != "none") {
            $(".question-options").css("display", "none");
            $(".question-container").css("display", "block");
        } else {
            $(".question-options").css("display", "block");
            $(".question-container").css("display", "none");
        }
    }

    function populateQuestions(questionSet) {
        let currentQuestion,
            correctAnswer,
            wrongAnswers,
            currentType;
        toggleOptions();
        
        for (let i = 0; i < questionSet.length; i++) {
            currentQuestion = questionSet[i].question

            document.getElementsByClass("questions").innerText = (currentQuestion);
        }
    }

    function getData(apiUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl);
        xhr.send();

        xhr.onreadystatechange = function () {
            console.log(this.readyState, this.status);
            if (this.readyState == 4 && this.status == 200) {
                questionSet = JSON.parse(this.responseText);
                questionSet = questionSet.results;
                populateQuestions(questionSet);

            } else if (this.status != 200) {
                console.log("we have an error!", this.status);
            }
        };
    }

  function printDataToConsole(data) {
    console.log(data);
    console.log(data.response_code);
    console.log(typeof(data));
  }

  $(".load-questions").click(function() {
      getData(makeUrl());
      console.log(makeUrl());
  });
 // getData(printDataToConsole);

  $("body").on("click", ".list-group .btn", function () {
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
  });
});
