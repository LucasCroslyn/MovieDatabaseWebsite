Currently this is only a locally ran website. In the future I may make it a lot better and actually be accessible somewhere. For now, in order to see/interact with it fully, you need to download/run the below things.

# Things to download for development

## Programs
- VS Code (for the coding)
- Insomnia (testing the backend API)

## Packages and Languages
- Node.js
- npm install express cors mongodb dotenv (cd into the backend folder first from terminal)
- npm install -g nodemon
- May need to run npx create-react-app frontend_again (this may install some packages which I otherwise don't know what to run). Replace all of the content but node_modules with the content from the current frontend folder.
- npm install react-bootstrap bootstrap (cd into the frontend folder first from terminal)
- npm install --save react-router-dom (cd into the frontend folder first from terminal)
- npm install axios (cd into the frontend folder first from terminal)
- npm i moment --save (cd in the main project directory; it is for doing date formatting)

## MongoDB Atals Admin User
- Name: MainUser
- Password: JjMDKhOINH0H7uqn

# Running the website

## Backend
- Open terminal and cd into the backend directory
- Run nodemon index.js
- CTRL+C to exit out and close the server
- Insomnia can be used to also test some API stuff (GET, PUT, DEL, etc.)

## Frontend
-   Open terminal and cd into the frontend directory
- Run npm start
- CTRL+C to exit out and close the frontend

