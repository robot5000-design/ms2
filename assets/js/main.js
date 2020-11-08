//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
    // declare variables  
    let amount,
        category, 
        difficulty;

    function makeUrl(amount, category, difficulty) {
        return `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
    }

    // switch off quiz options and switch on questions
    function toggleOptions() {
        if ($(".question-options").css("display") != "none") {
            $(".question-options").removeClass("reinstate-element").addClass("remove-element");
            $(".question-container").removeClass("remove-element").addClass("reinstate-element");
        } else {
            $(".question-options").removeClass("remove-element").addClass("reinstate-element");
            $(".question-container").removeClass("reinstate-element").addClass("remove-element");
        }
    }

    // Using The Fisher-Yates Method from here https://www.w3schools.com/js/js_array_sort.asp
    function shuffleAnswers(answersArray, correctAnswer) {
        answersArray.push(correctAnswer);
        for (let i = answersArray.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * i);
            k = answersArray[i];
            answersArray[i] = answersArray[j];
            answersArray[j] = k;
        }
    }
    
    function askQuestions(setOfQuestions, questionIndex, score) {
        let currentType;
        let currentQuestion = setOfQuestions[questionIndex].question;
        let correctAnswer = setOfQuestions[questionIndex].correct_answer;
        let answersArray = setOfQuestions[questionIndex].incorrect_answers;
        let answerButtons = $(".question-answers").children("button");     

        console.log(answersArray, (correctAnswer));
        shuffleAnswers(answersArray, correctAnswer);
        $(".quiz-score").html(`Score is ${score}`);
        // check if question is boolean and if yes, hide redundant answer buttons
        if (setOfQuestions[questionIndex].type == "boolean") {
            $("[data-number='3']").addClass("hide-element");
            $("[data-number='4']").addClass("hide-element");
            $("[data-number='1']").html("<p>True</p>");
            $("[data-number='1']").attr("data-answer", "True");
            $("[data-number='2']").html("<p>False</p>");
            $("[data-number='2']").attr("data-answer", "False");
        } else {
            $("[data-number='3']").removeClass("hide-element");
            $("[data-number='4']").removeClass("hide-element");
            $("[data-number='1']").html(`<p>${answersArray[0]}</p>`);
            $("[data-number='1']").attr("data-answer", `${answersArray[0]}`);
            $("[data-number='2']").html(`<p>${answersArray[1]}</p>`);
            $("[data-number='2']").attr("data-answer", `${answersArray[1]}`);
            $("[data-number='3']").html(`<p>${answersArray[2]}</p>`);
            $("[data-number='3']").attr("data-answer", `${answersArray[2]}`);
            $("[data-number='4']").html(`<p>${answersArray[3]}</p>`);
            $("[data-number='4']").attr("data-answer", `${answersArray[3]}`);
        }
        document.getElementsByClassName("reset-confirm")[0].onclick = function() {
            toggleOptions();
            $('#resetModal').modal('toggle');
        }
        
        
        //console.log(currentQuestion, i);
        document.getElementsByClassName("questions")[0].innerHTML = `${questionIndex + 1}. ${currentQuestion}`;
        questionIndex++;
        console.log(questionIndex);
        $(".question-answers button").on("click", function() {
            $(".next-question").prop("disabled", false);
            $(".next-question").attr("aria-disabled", "false");
        });               
       
        $(".next-question").on("click", function() {
            console.log(correctAnswer)
            for (let button of answerButtons) {    
                //correctAnswer = correctAnswer 
                console.log($(button).attr("data-answer"));
                if ($(button).hasClass("active") && ($(button).attr("data-answer") == correctAnswer)) {
                    console.log("perfect");
                    score++;
                    $(".quiz-score").html(`Score is ${score}`);
                }
            }
        
            $(".next-question").prop("disabled", true);
            $(".next-question").attr("aria-disabled", "true");
        
            $(".next-question").off("click");
            for (let button of answerButtons) {
                $(button).removeClass("active");
            }
            if (questionIndex < setOfQuestions.length) {
                askQuestions(setOfQuestions, questionIndex, score);
            } else {
                toggleOptions();
            }      
        });
    }

    // get the quiz dataset from opentdb api
    function getData(apiUrl) {
        let questionSet,
            questionIndex = 0,
            scoreTotal = 0;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl);
        xhr.send();

        xhr.onreadystatechange = function () {
            console.log(this.readyState, this.status, scoreTotal);
            if (this.readyState == 4 && this.status == 200) {
                let questionsLoaded;
                questionsLoaded = JSON.parse(this.responseText);
                questionSet = questionsLoaded.results;
                toggleOptions();            
                askQuestions(questionSet, questionIndex, scoreTotal);
            } else if (this.status != 200) {
                console.log("we have an error!", this.status);
            }
        };
    }

    function activeButton(buttonGroup) {
        for (let button of buttonGroup) {     
            if ($(button).hasClass("active")) {
                buttonValue = button.getAttribute("data-value");
                console.log(buttonValue);
                return buttonValue;                 
            }
        }
    }

    $(".load-questions").click(function() {
        let categoryButtons = $(".categories").children("button");
        let difficultyButtons = $(".difficulty-level").children("button");
        let quantityButtons = $(".question-quantity").children("button");

        amount = activeButton(quantityButtons);
        category = activeButton(categoryButtons);
        difficulty = activeButton(difficultyButtons);

        getData(makeUrl(amount, category, difficulty));
        console.log(makeUrl(amount, category, difficulty));
    });

    // with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
    // separates the multiple bootstrap list groups on the same page
    $("body").on("click", ".list-group .btn", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
});



/*getData(printDataToConsole);
    function printDataToConsole(data) {
        console.log(data);
        console.log(data.response_code);
        console.log(typeof(data));
    }*/

/*
    let categoryButtons = $(".categories").children("button");
    let difficultyButtons = $(".difficulty-level").children("button");
    let quantityButtons = $(".question-quantity").children("button");
    
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
    }*/

    // sets the url for downloading the chosen question options
    //function makeUrl() {        
    /* let quantityButtons = document.querySelectorAll(".question-quantity-button");
        quantityButtons.forEach(function(quantityButton) {
            quantityButton.addEventListener("click", function() {
            amount = this.getAttribute("data-value");            
            });
        }); */
      /*  quantityButtons.click(function () {
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
        }); */

         /*$(".next-question").click(function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }      
        }); */

        /*document.getElementsByClassName("next-question")[0].onclick = function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }
        } */
