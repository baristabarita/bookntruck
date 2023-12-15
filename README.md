# Book-N-Truck: An Online Booking and Asset Management Website for Trucking Businesses README

## Providing aid to trucking businesses with their clients and owned assets within one online platform, Book-N-Truck!

Welcome to the Book-N-Truck README! This comprehensive document provides an insightful overview of our advanced online booking and asset management system. Whether you're a developer aiming to seamlessly integrate this platform into your website or a user eager to make reservations, this guide equips you with detailed setup instructions and essential insights. Explore the following functionalities outlined in this project:

* Create an online booking platform for businesses focused on the trucking industry
* Automate an organization system for businesses to manage and organize their present assets

## Important Links
1. [Wireframe Layouts](https://www.figma.com/file/MFvgGnNbKIX9A1GcXdJupJ/IM2-website-wireframes-prototypes?type=design&node-id=0%3A1&mode=design&t=oOfx8QjZlP3RbIWf-1)

### Setting Up the Project
1. Clone the project in your local directory of choice. Example using the git CLI:
```
git clone https://github.com/baristabarita/bookntruck.git
```

2. CD into the root folder
```
cd bookntruck
```
2. CD into the client and server folder separately 
```
cd client (or) cd server
```
3. Install dependencies on each folder
```
npm install
```

4. Run the project
```
npm run dev (in the client directory)
npm start (in the server directory)
```

## client directory File Structure - the Frontend Side
1. `src\assets` - This is where you place the images (.png, .jpg, .svg, etc...)
2. `src\components` - Common components to be used throughout the application
3. `src\pages` - Pages of the website
4. `src\common` - Where the styles, colors, etc are accessed
5. `src\utils` - utility codes that may be required.

## server directory File Structure - the Backend & Database Side
1. `\controllers` - Where most of the backend functionalities reside
2. `\models` - Contains the database model
3. `\routes` - These are where the functionalities of each controller are connected to route.js
4. `\uploads` - A folder for file uploads
5. `\validations` - Contains the validator files.

## Database Setup
# Guide to install the DB of bookntruck
1. Import the "bookntruck.sql" SQL file found in the models directory from the server directory into phpmyadmin. NOTE THAT THIS IS A MUST

## Commands to Run During Development

1. Ensure that your XAMPP is running with the imported database and mySQL server running as well.
2. Start your local front-end server
```
npm run dev (on client directory)
npm start (on server directory)
```

