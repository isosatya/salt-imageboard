const spicedPg = require("spiced-pg");

const dbUrl =
    // process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-imageboard`;

var db = spicedPg(dbUrl);

module.exports.getImages = function getImages() {
    return db.query(`SELECT *
    FROM images
    ORDER BY id DESC
    LIMIT 6;`);
};

module.exports.getMoreImages = function getMoreImages(latestPicId) {
    return db.query(
        `
        SELECT *, (SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1) as firstindexid FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 9
        `,
        [latestPicId]
    );
};

module.exports.getFirstIndex = function getFirstIndex() {
    return db.query(`
        SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1;
        `);
};

module.exports.insertImages = function insertImages(
    url,
    username,
    title,
    description,
    tags
) {
    return db.query(
        `INSERT INTO images (url, username, title, description, tags) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        ) RETURNING *;`,
        [url, username, title, description, tags]
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

module.exports.getSpecificImage = function getSpecificImage(id) {
    console.log("console log from getSpecificImage query", id);
    return db.query(
        `SELECT *,
        (SELECT id FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1) as previousid,
        (SELECT id FROM images
        WHERE id > $1
        ORDER BY id ASC
        LIMIT 1) as nextid
        FROM images WHERE id=$1
        `,
        [id]
    );
};

module.exports.viewComments = function viewComments(id) {
    return db.query(
        `SELECT pictureid, username, comment, created_at FROM comments
        WHERE pictureid = $1
        ORDER BY id DESC;`,
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
