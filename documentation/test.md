# Functional Tests

## Testing links and responsiveness of each html page:
Using Chrome and Chrome Dev Tools. Check all links open in new tab.

## 1. Common to all pages:

- Test all Links:
  
Links | index.html | start.html
--- | --- | ---
Owl Icon | y | y
Go! | y | NA
Facebook | y | y
Twitter | y | y
Privacy | y | y


## 2. Feedback Form and EmailJs:

- Tested and functioning correctly.
- Displays success and both emails received. 
- Form checked for required on all inputs. 
- Email address input requires valid email form. 
- Send and dismiss buttons working correctly.
- Displays Alert of failure message to the user if there's a problem.


## 3. Page Responsiveness:

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


- In addition each page is checked for responsiveness using Chrome Dev Tools infinitely	adjustable sliding re-sizer tool. From 280px (Samsung Galaxy Fold) up to full width	1536px on a 4k laptop. The 404 page not included in the above table was checked this way.
- If the height is less than 1000px the header is hidden during questions.
- If the height is less than 750px the screen scrolls to show the next question button.
- No problems are found.

---
### __Summary:__

- No problems found.


## 4. Bugs List from Github Issues section:

All bugs below were fixed and explanations can be found in the github issues section of the repository.

- jshint suggested highscore should be accessed via dot notation bug #13

- If answers are answered too quickly it appears the timer has not started bug #12

- Answer button could still be pressed after answer is clicked thereby adding the box-shadow again bug #11

- After a new high score the high score table is not displaying bug #10 

- Bug when timer counts down and disables answer buttons and exit modal is brought up but dismissed bug #9 

- When exiting from a quiz answer buttons remain disabled bug #8 

- Bug which allows an answer to be clicked more than once bug #7 

- Wrong answer sound plays at same time as correct answer sound at almost zero seconds remaining bug #6 

- Bug Exit Quiz button is still showing at the final question of the quiz bug #5

- Bug where question can still be submitted after timer runs out and answer  as been revealed bug #4 

- Need to obtain token from API before obtaining questions bug #3 

- html encoding of api answers bug #2 

- Issue with Next Question Button bug #1 

## 5. List of devices tested:
- Samsung Galaxy S7
- Samsung Galaxy S10
- Huawei P30 Pro
- iPhones 8, 6s, X through Browserstack
- Asus k501u 4k laptop
- Chrome Dev Tools Device Emulator