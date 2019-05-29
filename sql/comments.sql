DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    pictureid INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO comments (pictureid, username, comment) VALUES (
--     '1',
--     'funkychicken',
--     'Comment number 1 for testing! aaaaa'
-- );
--
-- INSERT INTO comments (pictureid, username, comment) VALUES (
--     '1',
--     'andres',
--     'Comment number 2 for testing! bbbbbb'
-- );
--
-- INSERT INTO comments (pictureid, username, comment) VALUES (
--     '1',
--     'user number 3',
--     'Comment number 3 for testing! ccccccc'
-- );
