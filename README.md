# The Science Quiz

## 2nd Milestone Project

## Interactive Front-End Development

## Code Institute 2020

---

The brief for this project was to build an interactive website application using HTML, CSS and JavaScript. The author chose to develop a quiz game as the subject. The design is based on user experience priciples. Clean coding and a responsive mobile first method was employed. The purpose of this website is to provide users with:

- a useful fun and appealing test for students, academics or anybody else who has an   interest in computing, maths or nature science.
- multiple science categories.
- varying difficulties.
- a question countdown timer.
- a high score table.
- feedback as to the correct answer.
- an easy and smooth to operate interface.

---

### See the image below for an example of the responsiveness of the site.

Click the image to be taken to a live demo of the site:

[![homepage][1]][2]

[1]: ./documentation/images-for-readme/am-i-responsive.JPG
[2]: https://robot5000-design.github.io/ms2-the-science-quiz/index.html "Live Site"

---

### **Contents:**

[1. UX Design](#1-ux-design)

[2. Features](#2-features)

[3. Technologies Used](#3-technologies-used)

[4. Testing](#4a-testing-part-1)

[5. Deployment](#5-deployment)

[6. Credits](#6-credits)

---

### **1. UX Design**

#### Strategy

_User Stories:_

There are 2 types of users of the site: the site owner or all other users which include students, academics etc. The 2nd group have a common set of user goals.

As the site owner:

- I want the site to be fun and appealing to use.
- I want the site to look visually appealing.
- I want the site to provoke a positive response.
- I want the site to be easy and natural to use with smooth navigation between sections.
- I want the site to not only tell the user if they got a question wrong but also to tell them the correct answer.
- I want the site to be a learning tool.
- I want users to be able to offer feedback to the site, maybe new questions.
- I want users to be able to see updates or news on the site through social media links.
- I want a countdown timer to make the quiz more exciting.
- I want sound effects to reward the user and to offer feedback.
- I want a high score table saved from session to session.
- I want to avoid repetition of questions to a user.
- I want the site to have significant interactivity.
- I want the site to deal with potential errors without breaking the site or affecting the user negatively.
- I want the functionality to be as automated as possible but I want the user to be able to move between qustions themselves so that they can take in the answers at their own pace.

As a user:
- I want the site to be fun and appealing to use.
- I want the site to look visually appealing.
- I want the site to be easy to use with smooth navigation between sections.
- I want to learn something from using the site.
- I want to be able to offer feedback and suggest new questions.
- I want to be aware of updates or new features.
- I want the site to have a good variety of questions without continuous repetition.
- Sounds effects feedback would be useful.
- I want to be able to keep track of my best scores.
- I want to be able to choose a difficulty level i can manage and vary the quiz length depending on how much time i have.
- I want a site that is not commonly crashing with errors, or if there is an error it is managed properly.

From researching other online quizzes, most are quite similar in presentation. Some have timers, but others do not. Most offer points scoring which helps to keep them addictive. Most do not offer any kind of difficulty level option which is not good for user retention if the user cannot find a level which suits them. Some offer the option of a hint but because the free API that is being used for this project does not have that option, this project will not have that particular feature. [Opentdb](https://opentdb.com/) Quiz API was used for this project because of the choice of topics, it's free to use and appears to be reliable.

#### Scope

Based on the results of the Strategy research the features to be included are:

- A Landing page which offers a brief explanation and introduction to the site and the reason for its existence.
- An Options page, where the user chooses topic, difficulty level and quantity of questions.
- The Questions/answers page should show 4 answers for multiple choice and 2 answers for boolean questions. It should have a submit and next-question button and a reset quiz button.
- Use buttons if possible rather than dropdowns or tickboxes for a better user experience.
- A Modal containing a Feedback form.
- Social Links, eg. facebook, twitter.
- A countdown timer if possible.
- Shows Correct Answer Feedback.
- Display the current high score.
- Sound effects and a button to mute them.
- Use a free quiz API.
- Use the available API Token which ensure questions are not repeated during a session.

From the Strategy Table and graph it was clear that all features considered important are probably viable.

#### Structure

- A simple structure with just 2 main pages; the introduction/landing page and the quiz page.
- The Quiz page shows either the quiz options or the questions/answers. Javascript is used to achieve this.
- Custom 404 page, so in the case of a broken internal link a button is provided for the user to return to safety. Unlikely to be requred but included nevertheless.

#### Skeleton

Wireframes made in Balsamiq Wireframes were used for basic layout. These can be viewed here:

[Landing Page All Sizes](./documentation/wireframes/landing-page-all-sizes.png)

[Options Page All Sizes](./documentation/wireframes/options-page-all-sizes.png)

[Questions Page All Sizes](./documentation/wireframes/questions-page-all-sizes.png)


#### Surface

It was decided to use a green chalkboard themed background to suit the science theme of the site.
[Pixabay](https://pixabay.com/) provided the free background image and the owl icon.

The main background colour is courtesy of the background image and the median colour is green #306821. Text colour is an off-white #E4DFD5 which contrasts well with the green  background colour and a charcoal colour #353535 was used for the footer. The main CTA buttons are an eye catching pink #D31363.
The combination of colours provide contrast ratios that allow the site to score 100% in the Accessibility category on Chrome Development Tools Lighthouse.
A single font was chosen, Pangolin from Google Fonts. This was chosen for its imperfect appearance so that it could be handwritten.
 

![ColourChoices][3]

[3]: ./documentation/images-for-readme/coolors-palette.png "Colour Choices"

---

### **2. Features**

The site was designed with a mobile first approach. Customised Bootstrap was used to help with the responsiveness and layout of the site. In addition targeted media queries were used to assist with this. There are sound effects but the site is muted by default. There is a button in the top right corner to unmute.

_Landing page:_

The landing page features a simple message as the users focus falls to a black box which contains an explanation of what the site does. A large obvious CTA with the text Go! signifies to the user what to do next.

_Quiz Options:_

Box shadows have been placed under all the buttons to give them a 3D effect and the illusion of lifting them off the page. When a button is pressed the shadow disappears. This is most evident on the quiz options page when cycling through the options. There are three sets of buttons: for the category, the difficulty level and the number of questions. Below them is a large CTA which says Start! which acts as an obvious indicator to the user, what to do next.

Below the options is a high scores table which contains the highest score the user has acheived in each category. This information is saved as an object to local storage and checked for existence every time the page is loaded. It is updated after each quiz round.

When the Start! button is pressed, some asynchronous tasks are performed. A loading spinner is displayed in the Start button to alert the user that something is happening while the quiz data is being retrieved.
First the program checks if a token exists already. The token ensures that question repetition does not occur during a session. This will have been retrieved from session storage on page load. If it does not exist the getToken function is run, which returns a promise to get a new token through a new XMLHttpRequest. If this resolves successfully the getQuizData function is run. This function is a new XMLHttpRequest using the main quiz API URL with the token appended. If the token is found to be invalid, expired (expires after 6 hours of inactivity) or exhausted (all questions for that topic have been presented) the main API returns different response codes. The checkToken function handles these. If the token is invalid or expired  a new token is requested or if it is exhausted  the token can be reset using a specific reset token URL.

If there is a problem obtaining a token from the API an alert box is displayed to the user informing them of the error and that they can try again. Likewise, if there is a problem with the readyState or status of either of the XMLHttpRequests an alert box is displayed to the user informing them of the error and that they can try again. By way of validating the JSON data returned by the XMLHttpRequest, if there is a JSON parsing error the error is caught and alerted to the user with the option to try again.

_Quiz Questions and Answers:_

When the token checks ok, the askQuestions function is run which presents the question/answers to the screen to the user. Questions can be either multiple choice or boolean. Multiple choice questions should have 4 possible answers. Boolean questions have two, so when a boolean question is presented the extra unused answer buttons are hidden from the user.
In addition to that the JSON answers quantity is validated to ensure there is no more than 4 answers to each question. If the array of answers is greater than 3 the shuffleAnswers function pops the extra unnecessary answers.