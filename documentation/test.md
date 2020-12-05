# Functional Tests

## Testing responsiveness of each html page:
Using Chrome and Chrome Dev Tools.

## 1. Page Responsiveness:

Breakpoints | index.html | quiz options | quiz answers
--- | --- | --- | ---
W280px | y | y | y
W400px | y | y | y
W576px | y | y | y
W768px | y | y | y
W992px | y | y | y
W1200px | y | y | y
H750px | y | y | y
H1000px | y | y | y


- In addition each page is checked for responsiveness using Chrome Dev Tools infinitely	adjustable 
sliding re-sizer tool. From 280px (Samsung Galaxy Fold) up to full width 1536px on a 4k laptop.
The 404 page not included in the above table was checked this way.
- If the height is less than 1000px the header is hidden during questions.
- If the height is less than 750px the screen scrolls to show the next question button.
- No problems are found.


### __Summary:__

- No problems found.

---

## 2. Bugs List from Github Issues section:

After efforts to "break" the application, testing on mobile produced bug #14, which was a similar issue
to #12. All bugs below were fixed and explanations can be found in the github issues section of the
repository. Prior to removing console logs for final user acceptance testing, the error handling
was tested by feeding the XMLHttpRequest functions 'broken' JSON objects to ensure json.parse errors
are handled. 

- #14 - timer secondsLeft is not displaying the correct value after a question is answered too quickly. A
value from the previous running is displayed. 

    _solution was to reset secondsLeft to the same 
    value as questionTimer every time the timer is run. And to increase the time delay to more than 
    1000ms before answer buttons are enabled. This allows sufficient time for the timer timeInterval
    to do its first iteration._

- #13 - jshint suggested highscore should be accessed via dot notation bug.

    _dot notation did not work properly with edge. Reverted to square bracket notation._

- #12 - If answers are answered too quickly it appears the timer has not started bug.
Then the timer is not cleared and continues to run.

    _This bug was solved by not enabling the buttons until the timer has started.
    There was also a bug observed that if the next question button was pressed too quickly the box
    shadow was removed for the answer buttons for the next question. This problem was solved by
    only enabling the next button at the same time as the box shadow had been removed (or when the
    answer checking process had fully ended)._

- #11 - Answer button could still be pressed after answer is clicked thereby adding the box-shadow again
bug.

    _solved by adding class of no-shadow to answer after answer is clicked._

- #10 - After a new high score the high score table is not displaying bug. 

    _There was an old line of code still there from before the high score table was implemented._

- #9 - Bug when timer counts down and disables answer buttons and exit modal is brought up but 
bug. When next question button is clicked answer buttons stay disabled on following question.

    _Solved by using disable class rather than disabling element when the timer === 0._

- #8 - When exiting from a quiz answer buttons remain disabled bug.

    _Solved by removing disable class when quiz ends._

- #7 - Bug which allows an answer to be clicked more than once.

    _Problem solved by creating a disable class to apply to buttons._

- #6 - Wrong answer sound plays at same time as correct answer sound at almost zero seconds remaining 
bug. 

    _This is due to experimentation with removing the submit button and having select and 
    submit in the same keypress with a built-in time delay. Solve by adjusting the timing of
    sounds and where they are implemented._

- #5 - Bug Exit Quiz button is still showing at the final question of the quiz bug.

    _Code to show this button was in the wrong position. Moved inside the .reset-confirm click function._

- #4 - Bug where question can still be submitted after timer runs out and answer  as been revealed bug.
    
    _Adjusted logic and fixed bug by disabling submit-answer button in displayTimeLeft function when time = 0._

- #3 - Need to obtain token from API before obtaining questions bug.

    _When obtaining questions from the api the token must first be requested and then attached to 
    the questions url. This presents an asynchronous problem. The solution is to have the getToken 
    function return a resolved promise to be used afterwards to download the questions._

- #2 - html encoding of api answers bug. Some answers not being registered correct due to api returning 
html encoded characters.

    _Solution was to put the answers in a custom data attribute of the answer element. So rather than 
    matching the answer presented in the browser (which doesn't show the special characters) to the 
    correct answer, we match to the data attribute._

- #1 - Issue with Next Question Button bug. Causing many more loops than intended.

    _Solution was to add the .off("click") to the click event function to detach the click event.
    The ultimate solution was to remove the nextQuestion function from the askQuestions function.
    The mistake was one was nested inside the other._
---

## 3. List of devices tested:
- Samsung Galaxy S7
- Samsung A21s
- Samsung Galaxy S10
- Huawei P30 Pro
- iPhone 8 Safari through Browserstack
- Asus k501u 4k laptop
- Chrome Dev Tools Device Emulator:

    - Samsung Galaxy Fold
    - Samsung S5
    - Google Pixel 2
    - iPhone 5
    - iPhone X
    - iPad
    - iPad Pro

---

## 4. Test Cases:
- TC01

    Description: 

    - Verify all links on Index and Start pages function as expected.

    Procedure: 
    1. Navigate to https://robot5000-design.github.io/ms2-the-science-quiz/index.html
    2. Click feedback form. 
    - Expected Result: Feedback form appears in modal. _Pass_
    3. Click Facebook in footer. 
    - Expected Result: Opens Facebook in new tab. _Pass_
    4. Click Twitter in footer. 
    - Expected Result: Opens Twitter in new tab. _Pass_
    5. Click Privacy in footer. 
    - Expected Result: Reloads Page. _Pass_
    6. Click owl image. 
    - Expected Result: Reloads index.html. _Pass_
    7. Click Go button. 
    - Expected Result: Opens start.html _Pass_
    8. On start.html repeat steps 2-6. 
    - Expected Result: As above for each step. _Pass_

- TC02

    Description: 

    - Verify sound is muted by default and verify unmute button works as expected.

    Procedure: 
    1. Navigate to https://robot5000-design.github.io/ms2-the-science-quiz/start.html
    2. Click question option buttons. 
    - Expected Result: Should be no sounds. _Pass_
    3. Click unmute button. 
    - Expected Result: Makes a keypress sound. _Pass_
    4. Click question option buttons. 
    - Expected Result: Makes a keypress sound. _Pass_
    5. Click feedback form in footer Click Dismiss. 
    - Expected Result: Makes a keypress sound. _Pass_

- TC03

    Description: 

    - Verify quiz options result in expected quiz outcome questions and answers are populating
     the buttons as expected.

    Procedure: 
    1. Click Start (accepts default quiz options). 
    - Expected Result: Five computing questions of 
    easy difficulty level. _Pass_
    2. Reload the page & click different quiz options. 
    - Expected Result: Quiz question category,
    difficulty level and quantity of questions should match those chosen. Multiple choice 
    questions should have 4 answer options and boolean questions should have 2 answer options. 
    _Pass_
    3. Repeat step 2 a number of times.

- TC04

    Description: 

    - Verify quiz procedure operates as expected.

    Procedure: 
    1. Click on quiz option buttons. 
    - Expected Result: Verify disable class & shadow is removed from active button _Pass_
    2. Click Start (using default quiz options). 
    - Expected Result: Loading spinner should display in Start button while question data is
    retrieved. Questions should number five computing questions of easy difficulty level. _Pass_
    3. Check questions layout. 
    - Expected Result: Multiple choice questions should have 4 answer
    options and boolean questions should have 2 answer options. _Pass_
    4. Submit an answer by clicking it. 
    - Expected Result: Active button should briefly turn yellow
    and shadow removed. A correct answer should light up green and a wrong answer should light up
    red (with the correct answer showing in green). After a pause shadow is removed from all answers.
    Next Question button is enabled and has shadow added. Upon answering correctly the score in the
    Next Question button should increment by 1. _Pass_
    5. Click Next Question. 
    - Expected Result: Moves to next question. _Pass_
    6. Allow time to run out. 
    - Expected Result: The timer should light up red at 5 seconds remaining.
    The wrong answer sound is played when time runs out. Shadow is removed from all answers and the
    correct answer is lit up green. _Pass_
    7. Go to last question. 
    - Expected Result: Exit Quiz button hidden and Next Question button is
    coloured orange & renamed Finish Quiz. _Pass_
    8. Click Finish Quiz. 
    - Expected Result: A modal is displayed with a summary of the result. If 
    it's a new high score, this should be stated in the modal. _Pass_
    9. Click Exit button in modal.     
    - Expected Result: Should return to Quiz Options and the high 
    score should be displayed in the high score table in the correct position. _Pass_

- TC05

    Description: 

    - Verify Exit Quiz functions as expected.

    Procedure: 
    1. Start a new Quiz.
    2. Click Exit Quiz. 
    - Expected Result: A Reset Quiz Modal appears  _Pass_
    3. Reset Modal has 2 buttons. No and Yes. Test both.
    - Expected Result: No should dismiss the modal. Yes should return to Quiz Options. _Pass_

- TC06

    Description: 

    - Verify Feedback Form Modal functions as expected.

    Procedure: 
    1. Click Feedback Form. 
    - Expected Result: A modal should display with a feedback form containing 3 inputs;
    name, email & textarea input. Two buttons; Dismiss & Send Feedback. _Pass_
    2. Click Dismiss. 
    - Expected Result: Modal should disappear. _Pass_
    3. Click Send.
    - Expected Result: Name, Email and text should be required entries. _Pass_
    3. Verify email input validates format.
    - Expected Result: Email entry must be in correct basic format. _Pass_
    4. Enter valid entries and press Send Feedback.
    - Expected Result: Displays a message modal confirming either success or failure. _Pass_

- TC07

    Description: 

    - Verify Error Message Modal displays as expected.

    Procedure: 
    1. Switch off internet and click Start.. 
    - Expected Result: A message modal with one ok button should display, with a message of a 
    problem to the user. The Start button should display Press to Retry. _Pass_

---
