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
- A countdown timer.
- Shows Correct Answer Feedback.
- Sound effects and a button to mute them.
- Use a free quiz API.
- Use the available API Token which ensure questions are not repeated during a session.
- From the Strategy Table and graph it was clear that all features considered important are probably viable.