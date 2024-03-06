# React Documentation

This file contains the documentation of the client project structure.

React is a platform used to build web applications and can be easily extended to be used on native platforms.

## React Components

React is a modular platform in which components are built with JSX and then called upon like functions. 
Each component can be passed props to allow different variations of the same abstraction.

### JSX

JSX allows for the creation of DOM (Document Object Model) trees using an XML-like syntax within JavaScript. The 
components are written in JSX making them easy to nest and use alongside other DOM tree interface elements 
used in HTML.

## React Router

React router is how urls are handled giving the web app the feel of a website. Each page is a React component and is 
assigned a specific URL path. The router is called upon inside the root element alongside constants such as the
animation layer or page background component.

## backendRequests

Covered with greater detail on [structure.md](structure.md), these requests provide for the layer between the Django
server and the React application allowing the website to be a full stack application.

### React Router Pages

Each page handles its own backend requests for its respective content. This allows for smooth and fast navigation across
the application since only the content that gets requested is loaded. React is purely client driven and once the website
is accessed, interaction can technically be done offline however no content will appear as it would be all in the database.


### Component level tests

Modular components found under `neuro_arcade/reactapp/components` have rendering test suites to allow for extensible
application with any illegal prop assignments being caught and handled.