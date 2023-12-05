![iquiz_logo.svg](client/src/media/iquiz_logo.svg)

# iQuiz

## Project Video URL

Provide the link to your youtube video. Please make sure the link works. 

URL: [https://youtu.be/KAoqO7bXpao](https://youtu.be/KAoqO7bXpao)

## Project Description

iQuiz! is an online quiz platform for instructors and students. The platform allows instructors to create, host, grade, and regrade quizzes. Students can enroll in courses, write quizzes for their selected courses, view their quiz results and quiz history, and request regrades. Quizzes can be imported from formatted JSON files or they can be created on the platform using our GUI editor.

## Development

Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

### **Overall Code Design:**

- **Frontend-Backend Separation:** The codebase follows a clear separation between the frontend and backend, with distinct file structures for each.
- **Component-Based Frontend:** Organized components based on their types help maintain a scalable and modular codebase.
- **Express for Backend:** Leveraging Express simplifies the process of handling HTTP(S) requests and structuring the backend logic.
- **Database Interaction:** MongoDB is used for database interactions, given its compatibility with Node.js and Express.

Our overall design follows common best practices used for developing scalable and maintainable web applications.

### Programming Languages & Frameworks

NodeJS, React, Express, MongoDB

TailwindCSS for CSS styling components

Our codebase design is organized into a client (frontend) and server (backend) file structure

For the client, we organized our files by:

- APIs: any API interactions
- media: static images
- components: small React components used to build the larger user interface
    - We classified components into many types:
        - elements, page_components, question_components, question_editor_components
- pages: large React components composed of smaller ones used to generate pages
- styles: CSS styling
- utils: any general purpose function used across client

For the server, we organized the files by:

- models: for any data structure and business logic of the application.
    - Users, Courses, Question Types, Quizzes, Quiz responses, Quiz remarks
- controllers: handles incoming requests from the client, processing model data, send the response back.
- middleware: intermediary functions to perform security functions like authentication, request validations, and content cleansing.
- routes: used for mapping incoming HTTP requests and sending them to the corresponding controller handler
- utils: any general-purpose functions used across the server

### Libraries/Third-party APIs used

**Frontend**

- jspdf - handle client-side quiz pdf generation for students.
- http-proxy-middleware - proxying requests to the server
- uuid: generate unique identifiers
- dotenv: load and management environment configuration variables, API keys, and other sensitive info
- bson-objectid: handle MongoDB objects
- dayjs: parsing and manipulating dates
- framer-motion: creating animations in React
- web-vitals: measures the performance of a webpage

**Backend**

- NodeMailer - handle sending emails for quiz grades, invitation, and email verification.
- jsonwebtoken - used for password reset authentication
- bcrypt - encrypting and decrypting password
- cors - allow only client to make requests to the server, prevent CSRF attack
- cookie-parser - parsing cookies middleware

## Deployment

Explain how you have deployed your application.

Using App Engine, we deployed our frontend and backend applications separately on Google Cloud. We did this by creating a frontend.yaml and backend.yaml file to define the settings, runtime environments, and other configurations like environmental variables and entrypoint so that each application would know how to deploy separately. Also, we used dispatch.yaml file to impose general routing rules on our application so that incoming requests would know whether to connect to our frontend or backend applications.

Our database is already deployed on MongoDB Atlas’ cloud where the deployed applications connect to it via specific connection string with credentials, and having a white-listed IP address.

URL: [https://iquiz-405903.ue.r.appspot.com/](https://iquiz-405903.ue.r.appspot.com/)

## Challenges

What is the top 3 most challenging things that you have learned/developed for your app? Please restrict your answer to only three items.

### Challenge #1 - Custom-styling UI using Tailwind CSS

1. **Overcoming Learning Curve:**
    - **Challenge:** Understanding the entire spectrum of available utilities that Tailwind CSS has to offer and knowing how to leverage them efficiently.
    - **Learned:** Acquired proficiency in Tailwind CSS by navigating through the documentation, experimenting with different classes, and gaining insights into the best practices for leveraging the framework effectively.
2. **Managing Design Consistency:**
    - **Challenge:** Ensuring a consistent and cohesive design across different components and pages while using the utility-first approach of Tailwind CSS can be challenging. Balancing customization needs with maintaining a unified visual style requires careful consideration.
    - **Learned:** Developed skills in structuring and organizing Tailwind CSS classes to achieve design consistency throughout the application. Explored techniques for creating reusable utility components to streamline styling.

### Challenge #2 - Responsiveness Design across different devices

- **Challenge:** Implementing responsive design, especially when dealing with complex layouts and components posed challenges. Tailwind CSS provides responsive utility classes, but determining the optimal combination for various screen sizes and devices required careful consideration as our application supports mobile responsiveness as well.
- **Learned:** Developed skills in implementing responsive design with Tailwind CSS across different devices.

### Challenge #3 - Deployment

- **Challenge:** One challenge we faced was deploying our application on App Engine. There were a lot of initial configuration issues as the whole application did not work. A bunch of issues were presented and we had no clue where to start debugging. We spent a lot of time resolving these issues by listing them out and sorting them in an order on of which issue to debug first. Fine-tuning deployment configuration settings to our applications was the hardest challenging factor, despite thorough exploration of the official documentation, trial and error troubleshooting, and insights from our web security and deployment lectures. Some of the issues we encountered when deploying were:
    1. Tuning deployment configurations
    2. Communication between deployed applications
    3. App Security configurations - session, cookies, and cors issues 
- **Learned:** Through these deployment challenges, we have learned the nuances of setting deployment configurations, how to communicate between deployed applications, and how to correctly set security configurations on deployed applications. Through this, we have improved our skills on troubleshooting deployed system issues and as the end goal, learned how to deploy applications on Google Cloud.

## Contributions

Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

**********Note:********** Some areas/features might have had tweaks from multiple people but the JIRA task will be names after person who did the most work. Best representation of contribution is the commit history.

### Houde Liu

- iQuiz Logo Design
- Signup, Login Page, Logout UI & Integration
- Question component UI
- Quiz Draft feature
- Quiz GUI editor
- Quiz Editing feature
- Quiz Grading frontend
- Quiz Remark frontend
- Course UI & Integration
- Course accent color
- Course access code
- UI responsiveness

### Amey Damle

- App Setup (Mongo DB setup, Creation of Express App and folder structure)
- Course Backend
- Quiz Backend
- Quiz Response Backend
- Password Reset Feature Backend (JWT, email sending, etc.) + UI
- Quiz Info page integration to Quiz Response + Quiz Backend
- Dashboard Integration to Quiz Response + Quiz Backend

### Eric Zhou

- User backend
    - Register, Login, Logout API
- Account email verification
- Security - Sessions, Cookies
- Course Archive feature
- Deployment
- Quiz invitation & Graded quiz email
- Quiz Remark Backend
- Export Quiz to PDF

## One more thing?

Any additional comments you want to share with the course staff?

No
