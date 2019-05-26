const spicedPg = require("spiced-pg");

const dbUrl =
    // process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-imageboard`;

var db = spicedPg(dbUrl);

module.exports.getImages = function getImages() {
    return db.query(`SELECT * FROM images;`);
};

module.exports.insertImages = function insertImages(
    url,
    username,
    title,
    description
) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES (
            $1,
            $2,
            $3,
            $4
        ) RETURNING *;`,
        [url, username, title, description]
    );
};

module.exports.addComments = function addComments(
    pictureid,
    username,
    comment
) {
    return db.query(
        `INSERT INTO comments (pictureid, username, comment) VALUES ($1, $2, $3)
        RETURNING *;`,
        [pictureid, username, comment]
    );
};

module.exports.viewComments = function viewComments(id) {
    return db.query(
        `SELECT pictureid, username, comment, created_at FROM comments WHERE pictureid = $1;`,
        [id]
    );
};

module.exports.getImageAndComments = function getImageAndComments(id) {
    return db.query(
        `
        SELECT *
        FROM images
        INNER JOIN comments
            ON images.id = comments.pictureid
        WHERE images.id = $1
        `,
        [id]
    );
};
