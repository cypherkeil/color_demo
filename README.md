**Color Demo**

This is a brief demo demonstrating an Express API and React front-end built on the same server. It allows you to choose a set of colors in the web browser and then save them to a collection by email address. Colors saved to an email address can be retrieved and reselected if desired.

Thanks to [Node](https://nodejs.org/), [Express](http://expressjs.com/), [Sequelize](http://docs.sequelizejs.com/), [React](https://reactjs.org/), [create-react-app](https://github.com/facebook/create-react-app), and many others.

---

## Installation

Clone this repository.

1. ```cd <color_demo>```
2. Set up a database compatible with [Sequelize](http://docs.sequelizejs.com/). Create a new, empty, database to use with this app.
3. Add the database connection string to a new file `config.json` in the `color_demo` base directory:
```javascript
{
    "db": {
        "connection_string": "postgres://postgres@<ip>:<port>/<db_name>"
    }
}
```
4. ```npm run build``` Build the static files for the React front-end. 
5. ```npm run start``` Run the express server (which will also serve the React front-end).
6. Visit the page at `http://localhost:3003/`.

---

## RESTful API

Here is a description of the API defined by the demo. There is no authentication.

### GET /:user_email

* body: None
* returns: JSON
```javascript
[
    {"color": "#aabbcc",
     "email": "someone@somewhere.com"}, 

    {"color": "#336611",
     "email": "someone@somewhere.com"}
]
```

---

### POST /:user_email

* body:
```javascript
[ "#ffaacc", "#444444"]
```
* returns: JSON
```javascript
[
    {"color": "#ffaacc",
     "email": "someone@somewhere.com"}, 

    {"color": "#444444",
     "email": "someone@somewhere.com"}
]
```

---

### PUT /:user_email/:color

* body:
```javascript
{"color": "#cccccc"} // new color
```
* returns: JSON
```javascript
{
    "color": "#cccccc",
    "user_email": "someone@somewhere.com"
}
```

---

### DELETE /:user_email/:color

* body: None
* returns: JSON
```javascript
{"rows_deleted": 1}
```

---

## Development

Express files are placed inside `/server` in the respository root. React files exist in the `/client` directory inside the repository root. Most React source files are in `/client/src`.