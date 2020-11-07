//document.addEventListener("DOMContentLoaded", function () {
$(document).ready(function() {
    // declare variables  
    let amount,
        category, 
        difficulty;
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

    function askQuestions(setOfQuestions, i) {
        let currentQuestion,
            correctAnswer,
            wrongAnswers,
            currentType;
        //console.log(setOfQuestions[i]);
        // check if question is boolean and if yes, hide redundant answer buttons
        if (setOfQuestions[i].type == "boolean") {
            $("[data-number='3']").addClass("hide-element");
            $("[data-number='4']").addClass("hide-element");
            $("[data-number='1']").html("<p>True</p>");
            $("[data-number='2']").html("<p>False</p>");
        } else {
            $("[data-number='3']").removeClass("hide-element");
            $("[data-number='4']").removeClass("hide-element");
        }
        currentQuestion = setOfQuestions[i].question;
        //console.log(currentQuestion, i);
        document.getElementsByClassName("questions")[0].innerHTML = `${i+1}. ${currentQuestion}`;
        i++;
        console.log(i);

        // Loop 1
        /*document.getElementsByClassName("next-question")[0].onclick = function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }
        }*/
        // loop 2
        $(".next-question").on("click", function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }      
        });
        /* Loop 3
        $(".next-question").click(function() {
            if (i < setOfQuestions.length) {
                askQuestions(setOfQuestions, i);
            } else {
                toggleOptions();
            }      
        }); */

    }


    // populate the questions and answers in html elements and run quiz
    /*function populateQuestions(setOfQuestions) {
        toggleOptions();
        askQuestions(setOfQuestions, 0);
    }*/

    // get the quiz dataset from opentdb api
    function getData(apiUrl) {
        let questionSet;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl);
        xhr.send();

        xhr.onreadystatechange = function () {
            console.log(this.readyState, this.status);
            if (this.readyState == 4 && this.status == 200) {
                let questionsLoaded;
                questionsLoaded = JSON.parse(this.responseText);
                questionSet = questionsLoaded.results;
                //populateQuestions(questionSet);
                toggleOptions();
                
                askQuestions(questionSet, 0);

            } else if (this.status != 200) {
                console.log("we have an error!", this.status);
            }
        };
    }

    $(".load-questions").click(function() {
        let categoryButtons = $(".categories").children("button");
        let difficultyButtons = $(".difficulty-level").children("button");
        let quantityButtons = $(".question-quantity").children("button");

        for (let singleButton of categoryButtons) {        
            if ($(singleButton).hasClass("active")) {
                category = singleButton.getAttribute("data-value");
                console.log(category);                     
            }
        }
        for (let singleButton of difficultyButtons) {        
            if ($(singleButton).hasClass("active")) {
                difficulty = singleButton.getAttribute("data-value");
                console.log(difficulty);                      
            }
            
        }
        for (let singleButton of quantityButtons) {        
            if ($(singleButton).hasClass("active")) {
                amount = singleButton.getAttribute("data-value");
                console.log(amount);                   
            }
        }
        getData(makeUrl(amount, category, difficulty));
        console.log(makeUrl(amount, category, difficulty));
    });
    /*getData(printDataToConsole);
    function printDataToConsole(data) {
        console.log(data);
        console.log(data.response_code);
        console.log(typeof(data));
    }*/

    // with help from https://stackoverflow.com/questions/29128228/multiple-list-groups-on-a-single-page-but-each-list-group-allows-an-unique-sele
    // separates the multiple bootstrap list groups on the same page
    $("body").on("click", ".list-group .btn", function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
});
