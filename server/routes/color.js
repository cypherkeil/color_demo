var express = require('express');
var router = express.Router();


/**
 * Routes to save colors to an collection.
 */
router.get('/hello', (req, res) => res.send('Hello World! colors'))

router.get('/:collection_name/', listAllColors)
router.post('/:collection_name/', addColors)
router.put('/:collection_name/:color', updateColor)
router.delete('/:collection_name/:color', deleteColor)

/**
 * Gets all colors for the collection.
 * 
 * This takes no body parameter.
 * 
 * @return json colors [
    {
        "color": "#ccaadd",
        "collection_name": "nice_colors",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    },
    {
        "color": "#ff223f",
        "collection_name": "nice_colors",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    }
]
 */
function listAllColors(req, res) {
    console.log("listall colors " + req.params);

    let collection_name = req.params.collection_name;
    let models = req.app.get('models');

    return models.saved_colors.findAll({
        'where': {
            'collection_name': collection_name
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
 * Adds a list of colors to be saved for the collection.
 * 
 * @param Object body ['#ccaadd', '#ff223f', ...]
 * @return json saved_colors Returns colors saved. [
    {
        "color": "#ccaadd",
        "collection_name": "nice_colors",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    },
    {
        "color": "#ff223f",
        "collection_name": "nice_colors",
        "created_at": "2018-09-27T13:57:10.190Z",
        "updated_at": "2018-09-27T13:57:10.190Z"
    }
]
 */
function addColors(req, res) {
    let models = req.app.get('models');
    let collection_name = req.params.collection_name;
    let body = req.body
    console.log('collection name ' + collection_name)
    console.log('addColors.called: ')
    console.log(JSON.stringify(body, null, 2))

    let updated_body = body.map((ele, i) => {
        let new_ele = { "color": ele, "collection_name": collection_name }
        console.log(new_ele)
        return new_ele
    })
    console.log('updated body ' + JSON.stringify(updated_body))

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
 * @return json updated_color {"color": "#ff339f", "collection_name": "nice_colors"}
 */
function updateColor(req, res) {
    let models = req.app.get('models')
    let collection_name = req.params.collection_name;
    let body = req.body

    let color = "#" + req.params.color;

    console.log('updateUser called:')
    console.log(JSON.stringify(body, null, 2))

    return models.saved_colors.update(body, {
        returning: true,
        where: {
            collection_name: collection_name,
            color: color
        }
    })
        .then((update_response) => {
            /* format for update_response:
            [
                1,
                [
                    {
                        "color": "aaaaaa",
                        "collection_name": "blah",
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
 * Deletes the color from the collection.
 * 
 * Does not take a body parameter.
 * 
 * @return json status {"rows_deleted": 1}
 */
function deleteColor(req, res) {
    let models = req.app.get('models')
    let collection_name = req.params.collection_name;

    let color = "#" + req.params.color;

    console.log('deleteUser called:')

    return models.saved_colors.destroy({
        where: {
            collection_name: collection_name,
            color: color
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