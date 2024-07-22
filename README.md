# Anomolous X 

Anomolous X is a web application that emulates the core functionalities of Twitter. It allows users to post "tweets", like posts, pseudo-comment on posts, upload images, use hashtags, and utlilize a search feature to filter posts based on keywords. The project showcases the ability to build a social media platform with essential interactive features using web technologies.

## Key Features

1. **User Authentication**:
   - Users can sign up and log in to their accounts.
   - Authentication ensures that only registered users can post tweets and interact with the interface.

2. **Posting Tweets**:
   - Users can compose and post tweets.
   - Users can upload images.
   - Users can edit their posts; they can choose to delete an image or their whole post altogether.
   - Users can like and comment on posts. 
   - Each tweet displays the user’s name, handle, and the timestamp of the post. 

3. **Search Feature**:
   - Users can filter posts based on keywordds.

4. **Responsive Design**:
   - The application is designed to be responsive, ensuring a good user experience across different devices and screen sizes.

5. **User Profile**:
   - Each user has a profile page displaying their tweets.
   
6. **Navigation**:
   - Easy navigation through different sections of the application, including home feed, user profile, and tweet composition.

## Technologies Used

### Frontend
- **HTML/CSS**: For the structure and styling of the web pages.
- **JavaScript**: For the interactive functionalities and dynamic updates.

### Backend
- **Node.js**: Server-side JavaScript runtime environment used for building the backend of the application.
- **Express.js**: Web application framework for Node.js, used to build the API and handle server-side routing.
- **SQLite**: Lightweight relational database management system used for storing application data.
- **SQLite Studio**: Tool used for managing and interacting with the SQLite database.

### Database Schema
- **Users Table**: Stores user information such as username, password, and user handle.
- **Tweets Table**: Stores tweet content, timestamps, and references to the user who posted each tweet.

This project demonstrates the ability to implement fundamental social media features, providing a practical example of a web application with user interaction and dynamic content updates.
