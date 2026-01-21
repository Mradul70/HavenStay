HavenStay
A full-stack accommodation booking platform built to demonstrate RESTful architecture, CRUD operations, and MVC design patterns.

Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB (Mongoose ODM)

Templating: EJS (Embedded JavaScript)

Styling: Bootstrap 5, Custom CSS

Features
CRUD Operations: Complete Create, Read, Update, and Delete functionality for property listings.

MVC Architecture: Separation of concerns using Models for database schemas and Views for UI rendering.

Database Seeding: Automated script (seed.js) to populate the database with dummy data for development testing.

Responsive UI: Mobile-first design using Bootstrap grid system and custom CSS variables.

RESTful Routing: Standardized URL patterns for resource management.

### Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Mradul70/HavenStay.git](https://github.com/Mradul70/HavenStay.git)
    cd HavenStay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    Ensure MongoDB is running locally.
    Seed the database with initial data:
    ```bash
    node seed.js
    ```

4.  **Run the application:**
    ```bash
    node app.js
    ```
    The server will start on port 8080.
    Open `http://localhost:8080` in your browser to view the app.

Engineering Decisions
Server-Side Rendering: EJS was chosen over client-side frameworks (React/Vue) to maintain a monolithic structure, reducing complexity for this specific MVP scope.

License
This project is open source.

NoSQL Database: MongoDB was selected for its schema flexibility, particularly for handling nested objects like image metadata within the Listing schema.

CSS Framework: Bootstrap 5 is utilized to enforce layout consistency and responsiveness without writing extensive custom media queries.
