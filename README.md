[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/KRLE_tfD)

# Proposal

# Proposal

## Title

iQuiz!

## Team Members

| Name | Student # | Email | GitHub |
| --- | --- | --- | --- |
| Amey Damlea | 1007039198 | amey.damle@mail.utoronto.ca | 4meyDam1e |
| Eric Zhou | 1006170064 | ericck.zhou@mail.utoronto.ca | ericckzhou |
| Houde Liu | 1005722158 | archie.liu@mail.utoronto.ca | archie-lhd |

## Description of Web application

iQuiz! is an online quiz platform for instructors and students. The platform allows instructors to create, host, grade and regrade quizzes. It also allows students to enroll in courses, write quizzes for their selected courses, view their quiz history and performance as well as request regrades. I Quiz! features a UI quiz editor as well as the ability to upload JSON files to create quizzes.

## Key Features to be completed by Beta ver.

1. Sign up & Log in (instructor and student type users)
2. For Instructors:
    1. Dashboard - list of courses
    2. Course page - list of students, list of quizzes, create quiz button
    3. Ability to create a quiz (automatically unlocks during available window and locks after)
3. For Students:
    1. Dashboard - list of courses, enroll in course button
    2. Course page - list of quizzes, quiz history
    3. Write a quiz - only within the available window

## Additional Features to be completed by Final ver.

1. Instructors:
    1. Emails - quiz reminders, quiz grade release 
    2. Grade the quiz submissions
    3. Regrade quiz and resolve regrade requests
2. Students:
    1. Emails - accepting quiz invitations, seeing quiz grade release email
    2. Quiz page - marks for each question, instructor comments, regrade button
    3. Grade distribution graph

## Description of Technology Stack to use to build and deploy

Frontend: ReactJS

Backend: Express

Database: MongoDB

Deployment: (Netlify, DigitalOcean, Firebase or GCP/GKE, AWS)

## Top 5 technical challenges

Quiz Generation - JSON, UI quiz editor 

Synchronous Quizzes (Progress bar, allow for time extension)

Sending emails 

Deployment

Exporting Quizzes? (PDF)

Other optional features:

- (Face-recognition, eye-tracking, OCR to parse handwriting to text, practice quizzes)
