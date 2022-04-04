CREATE TABLE users(
    user_id serial PRIMARY KEY,
    username VARCHAR ( 50 ) UNIQUE NOT NULL,
    password VARCHAR ( 50 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL
);


INSERT INTO users(username, email, password) VALUES('test', 't@t.com', '12345678');



CREATE TABLE rooms(
    room_id serial PRIMARY KEY,
    room_name VARCHAR ( 50 ) UNIQUE NOT NULL
);



CREATE TABLE join_room (
    user_id serial,
    room_id serial,
    role VARCHAR ( 50 ) NOT NULL,
    join_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);


CREATE INDEX join_index ON join_room(user_id, room_id);



CREATE TABLE msg (
    msg_id serial PRIMARY KEY,
    from_id serial,
    to_id serial,
    send_at TIMESTAMP NOT NULL,
    FOREIGN KEY (from_id) REFERENCES users(user_id),
    FOREIGN KEY (to_id) REFERENCES rooms(room_id)
);


CREATE INDEX msg_index ON msg(from_id, to_id);