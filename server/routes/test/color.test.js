const request = require('supertest');
const app = require('../../app');

const USER_EMAIL = "test@testing.com";
const TEST_COLORS = ['#ccaadd', '#ff223f', '#aabbcc'];
const CHANGED_COLOR = '#aaaaaa';

beforeEach(() => {
    let models = app.get('models');
    return models.sequelize.sync({ force: true });
});

describe('Test the color paths', () => {
    test('GET color list for user', () => {
        let uri = "/" + USER_EMAIL;

        return request(app)
            .get(uri)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([]);
            })
    });

    test('POST color list to user', () => {
        let uri = "/" + USER_EMAIL;

        return request(app)
            .post(uri)
            .send(TEST_COLORS)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.statusCode).toBe(200);
                // these are "...Containing" because color object return with
                // 'created_at' and 'updated_at' timestamp attributes as well
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        "color": TEST_COLORS[0],
                        "user_email": USER_EMAIL
                    }),
                    expect.objectContaining({
                        "color": TEST_COLORS[1],
                        "user_email": USER_EMAIL
                    }),
                    expect.objectContaining({
                        "color": TEST_COLORS[2],
                        "user_email": USER_EMAIL
                    })
                ]));
            });
    });

    test('DELETE color', () => {
        let post_uri = "/" + USER_EMAIL;
        let uri = "/" + USER_EMAIL + "/" + TEST_COLORS[2].replace("#", "");
        console.log(uri)
        // First request sets up colors so they exist 
        return request(app)
            .post(post_uri)
            .send(TEST_COLORS)
            .then(() => {
                // this actually send the delete request to test
                request(app)
                    .delete(uri)
                    .send(TEST_COLORS)
                    .expect('Content-Type', /json/)
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        expect(response.body).toEqual({ "rows_deleted": 1 });
                    });
            })
    });
});