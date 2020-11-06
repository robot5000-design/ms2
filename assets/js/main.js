//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
    // declare variables  
    let amount,
        category, 
        difficulty, 
        questionSet;

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
    }

    // sets the url for downloading the chosen question options
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

    // switch off quiz options and switch on questions
    function toggleOptions() {
        if ($(".question-options").css("display") != "none") {
            $(".question-options").removeClass("reinstate-element").addClass("delete-element");
            $(".question-container").removeClass("delete-element").addClass("reinstate-element");
        } else {
            $(".question-options").removeClass("delete-element").addClass("reinstate-element");
            $(".question-container").removeClass("reinstate-element").addClass("delete-element");
        }
    }

    function askQuestions(setOfQuestions, i) {
        let currentQuestion,
            correctAnswer,
            wrongAnswers,
            currentType;

        // check if question is boolean and if yes, hide redundant answer buttons
        if (setOfQuestions[i].type == "boolean") {
            $("[data-number='3']").addClass("hide-element");
            $("[data-number='4']").addClass("hide-element");
        } else {
            $("[data-number='3']").removeClass("hide-element");
            $("[data-number='4']").removeClass("hide-element");
        }            
        currentQuestion = setOfQuestions[i].question;
        //console.log(currentQuestion, i);
        document.getElementsByClassName("questions")[0].innerHTML = `${i+1}. ${currentQuestion}`;        
        i++;
        console.log(i);   
        $(".next-question").click(function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }
        })
    } 

    // populate the questions and answers in html elements and run quiz
    function populateQuestions(setOfQuestions) {
        toggleOptions();
        askQuestions(setOfQuestions, 0);
    }

    // get the quiz dataset from opentdb api
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

    // with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
    // separates the multiple bootstrap list groups on the same page
    $("body").on("click", ".list-group .btn", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
});
