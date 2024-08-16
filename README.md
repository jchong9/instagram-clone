# Instagram Clone
A simple Instagram clone made using a MERN stack. Users can interact with other users by following other users; uploading and liking posts; and commenting. The app features
a homepage that displays recommended posts and the posts of the user's following, an explore page where the user can find other users and a profile page where the user can edit their profile.

## Technologies
- React
- Node
- MongoDB
- Express
- [Formik](https://formik.org/) & [Yup](https://www.npmjs.com/package/yup/v/1.0.0-alpha.3) for forms and validation
- [Bootstrap](https://getbootstrap.com/) & [Sass](https://sass-lang.com/) for styling
- [Multer](https://www.npmjs.com/package/multer) for uploading and storing images

## Acknowledgements
To upload the image URLs to the database and store the image files locally on the project, I used [this tutorial](https://www.youtube.com/watch?v=j_EAwG9Rwd4) as
a foundation.

## Installation
NOTE: You will need [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the required libraries

1. Clone/download the git repo
```
git clone https://github.com/jchong9/instagram-clone.git
```

2. Install the necessary dependencies for the frontend and backend
For the frontend: 
```
(From the project root directory)
cd frontend
npm i
```
For the backend:
```
(From the project root directory)
cd backend
npm i
```

3. Edit the .env file in /backend to your MongoDB database string,
i.e
```
DATABASE_URL = mongodb://localhost:27017/
```
NOTE: You can find this connection string on the [MongoDB Compass](https://www.mongodb.com/products/tools/compass) by connecting with your database and clicking the 3 dots
next to the database name.

3. Run both the frontend and backend

For the frontend:
```
npm start
```
For the backend:
```
nodemon
OR
node server
```
