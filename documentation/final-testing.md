# Final Acceptance Tests

## 1. Page Responsiveness:

## Testing responsiveness of each html page:
Using Chrome and Chrome Dev Tools.

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


- In addition, each page is checked for responsiveness using Chrome Dev Tools infinitely 
adjustable sliding re-sizer tool. From 280px (Samsung Galaxy Fold) up to full width 1536px
on a 4k laptop. The 404 page not included in the above table was checked this way.
- If the height is less than 1000px the header is hidden during questions.
- If the height is less than 750px the screen scrolls to show the next question button.
Except if question type is boolean.
- No problems are found.


### __Summary:__

- No problems found.

---

## 2. List of devices tested:
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

The site has been tested on the following browsers on Windows 10:

- Internet Explorer 11
- Firefox 83.0
- Google Chrome 87.0.4280.66
- Opera 72.0.3815.320
- Microsoft Edge 87.0.664.52
- Safari 13.1 on Mac using www.browserstack.com

and tested on a Samsung Galaxy S7:
- Samsung on Android 12.1.2.5
- Firefox 80.1.3
- Chrome 85.0.4183.101

All HTML and CSS files have been passed through the w3c validation service here https://validator.w3.org/ 
with no significant issues. It advised not to use aria-disabled on disabled buttons. These were removed.

Javascript files were passed through jshint.com without any significant issues. Jshint suggested using
dot notation rather than square brackets, accessing the highscore object, so this has been changed.

The site does not function on Internet Explorer 11, but considering its overall low usage and the fact that
it is being discontinued in 2021, it was deemed not worth spending time on.

---

## 3. Final Testing Test Cases on Live Website:
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
    - Expected Result: Scrolls to top. _Pass_
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
    5. Confirm delivery of emailjs emails.
    - Expected Result: Two emails are sent. One to admin and one to user. _Pass_

- TC07

    Description: 

    - Verify Error Message Modal displays as expected.

    Procedure: 
    1. Switch off internet and click Start.
    - Expected Result: A message modal with one ok button should display, with a message of a 
    problem to the user. The Start button should display Press to Retry. _Pass_

---
