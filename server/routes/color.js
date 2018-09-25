var express = require('express');
var router = express.Router();

/* 
get
post
put
delete
*/

router.get('/hello', (req, res) => res.send('Hello World! colors'))

router.get('/:user_email/', listAllColors)
router.post('/:user_email/', addColors)
router.put('/:user_email/:color', updateColor)
router.delete('/:user_email/:color', deleteColor)

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
            return res.json(found_colors);
        })
        .catch((err) => {
            return res.json(err)
        })
}

function addColors(req, res) {
    let models = req.app.get('models');
    let user_email = req.params.user_email;
    let body = req.body
    console.log('user email ' + user_email)
    console.log('addColors.called: ')
    console.log(JSON.stringify(body, null, 2))

    let updated_body = body.map((ele, i) => {
        ele["user_email"] = user_email;
        console.log(ele)
        return ele
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

function deleteColor(req, res) {
    let models = req.app.get('models')
    let user_email = req.params.user_email;
    let body = req.body

    console.log('deleteUser called:')
    console.log(JSON.stringify(body, null, 2))

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