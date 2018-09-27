var express = require('express');
var router = express.Router();


/**
 * Routes to save colors to an email address.
 */
router.get('/hello', (req, res) => res.send('Hello World! colors'))

router.get('/:user_email/', listAllColors)
router.post('/:user_email/', addColors)
router.put('/:user_email/:color', updateColor)
router.delete('/:user_email/:color', deleteColor)

/**
 * Gets all colors for the email address.
 * 
 * This takes no body parameter.
 * 
 * @return json colors [
    {
        "color": "#ccaadd",
        "user_email": "someone@somewhere.com",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    },
    {
        "color": "#ff223f",
        "user_email": "someone@somewhere.com",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    }
]
 */
function listAllColors(req, res) {
    console.log("listall colors " + req.params);

    let user_email = req.params.user_email;
    let models = req.app.get('models');

    return models.saved_colors.findAll({
        'where': {
            'user_email': user_email
        }
    })
        .then((found_colors) => {
            /*
            // we get a list of db objects back, return just the colors
            return res.json(found_colors.map((ele) => {
                return ele.color;
            }))
            */
            return res.json(found_colors);
        })
        .catch((err) => {
            return res.json(err)
        })
}

/**
 * Adds a list of colors to be saved for the email address.
 * 
 * @param Object body ['#ccaadd', '#ff223f', ...]
 * @return json saved_colors Returns colors saved. [
    {
        "color": "#ccaadd",
        "user_email": "someone@somewhere.com",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    },
    {
        "color": "#ff223f",
        "user_email": "someone@somewhere.com",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    }
]
 */
function addColors(req, res) {
    let models = req.app.get('models');
    let user_email = req.params.user_email;
    let body = req.body
    console.log('user email ' + user_email)
    console.log('addColors.called: ')
    console.log(JSON.stringify(body, null, 2))

    let updated_body = body.map((ele, i) => {
        let new_ele = { "color": ele, "user_email": user_email }
        console.log(new_ele)
        return new_ele
    })
    console.log('udated body ' + JSON.stringify(updated_body))

    return models.saved_colors.bulkCreate(updated_body)
        .then((create_response) => {
            return res.json(create_response)
        })
        .catch((err) => {
            return res.json(err)
        })
}

/**
 * Modify a color.
 * 
 * @param Object body {"color": "#ff339d"}
 * @return json updated_color {"color": "#ff339f", "user_email": "someone@somewhere.com"}
 */
function updateColor(req, res) {
    let models = req.app.get('models')
    let user_email = req.params.user_email;
    let body = req.body

    console.log('updateUser called:')
    console.log(JSON.stringify(body, null, 2))

    return models.saved_colors.update(body, {
        returning: true,
        where: {
            user_email: user_email,
            color: req.params.color
        }
    })
        .then((update_response) => {
            /* format for update_response:
            [
                1,
                [
                    {
                        "color": "aaaaaa",
                        "user_email": "blah",
                        "created_at": "2018-09-25T15:54:53.753Z",
                        "updated_at": "2018-09-25T15:55:21.446Z"
                    }
                ]
            ]
            */
            // we only ever update one object at a time
            displayed_response = update_response[1][0];
            res.json(displayed_response)
        })
        .catch((err) => {
            return res.json(err)
        })
}

/**
 * Deletes the color from the email collection.
 * 
 * Does not take a body parameter.
 * 
 * @return json status {"rows_deleted": 1}
 */
function deleteColor(req, res) {
    let models = req.app.get('models')
    let user_email = req.params.user_email;

    console.log('deleteUser called:')

    return models.saved_colors.destroy({
        where: {
            user_email: user_email,
            color: req.params.color
        }
    })
        .then((num_rows) => {
            res.json({ "rows_deleted": num_rows })
        })
        .catch((err) => {
            return res.json(err)
        })
}

module.exports = router;