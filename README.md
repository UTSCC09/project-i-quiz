# Project Proposal

![iquiz_logo.svg](client/src/media/iquiz_logo.svg)

## Project Title

iQuiz!

## Team Members

| Name | Student # | Email | GitHub |
| --- | --- | --- | --- |
| Amey Damle | 1007039198 | amey.damle@mail.utoronto.ca | 4meyDam1e |
| Eric Zhou | 1006170064 | ericck.zhou@mail.utoronto.ca | ericckzhou |
| Houde Liu | 1005722158 | archie.liu@mail.utoronto.ca | archie-lhd |

## Description of Web application

iQuiz! is an online quiz platform for instructors and students. The platform allows instructors to create, host, grade and regrade quizzes. Students can enroll in courses, write quizzes for their selected courses, view their quiz results and quiz history, and request regrades. Quizzes can be imported from formatted JSON files or they can be created on the platform using our GUI editor.

## Key Features to be completed by the Beta version

1. Secured sign-up and log-in
    1. Account Email Verification
2. Student Dashboard
    1. Show all enrolled courses
    2. Send requests to enroll in new courses
    3. On the course page
        1. Show a list of past quizzes (submissions and results)
3. Instructor Dashboard
    1. Manage courses and students
        1. Add/remove courses
        2. Add/remove students from courses
        3. Accept/decline enrollment requests from students
    2. On the course page: 
        1. Show a list of students and quizzes
        2. Ability to upload formatted JSON to create a quiz
4. Quiz page
    1. Supported question types:
        1. Multiple choice questions
        2. Multiple select questions
        3. Open-ended questions
        4. Cloze questions (Fill in the blanks)
5. GUI editor for quiz creation

## Additional Features to be completed by the Final version

1. Auto-marker for closed-end questions
2. Instructors:
    1. Emails - quiz reminders, quiz grade release
    2. Grade quiz submissions
    3. Manage and resolve regrade requests
3. Students:
    1. Emails - accept quiz invitations and receive grades through email
    2. Quiz result page - See marks for each question, instructor comments, regrade button
    3. Grade distribution graph of the entire class
4. Synchronous quiz-taking session 
    1. During the session, the instructor can:
        1. See students’ progress
        2. Allow for a time extension
        3. Send real-time notification
    2. Students can report any quiz typos or errors to the instructor
5. Export Quizzes to PDF files

## Technology Stack

### UI Design

- Figma

### Frontend

- ReactJS
- Tailwind CSS

### Backend

- Express
- NodeMailer

### Database

- MongoDB

### Deployment

- Firebase

## Top 5 technical challenges

1. GUI editor for quiz creation
2. Synchronous quiz-taking session
3. Email verification and notifications
4. Responsive Design to support different devices
5. Support exporting quizzes to PDF and JSON files
