# CUIE Backend

This is a NodeJS program, using as a backend for CUIE App Backend.

## Prerequisites

The project runs on docker-compose, so only [Docker](https://docs.docker.com/engine/install/) is required.

Tested with

* Docker version 20.10.6
* docker-compose version 1.29.1

## Initialization

1. Either download this project, or pull this into your local git repository.

2. Rename or copy `.env.template` into `.env`. You can change the values freely. The descriptions of each keys are as followed. Note that the actual values on the actual server are different.

    ```text
    DB_ROOT_PASSWORD=<Password for root@% user>
    DB_DATABASE=<Initial Database>
    DB_USERNAME=<User for NodeJS to access database>
    DB_PASSWORD=<Password for DB_USERNAME>
    PATH_STATIC=<Path to File&Pic Folder>
    ```

3. Run docker-compose, notice that folder `volumes/` is automatically created.

    ```bash
    docker-compose up
    ```

    * In case there is a permission error

        ```bash
        sudo docker-compose up
        ```

    * If you are starting a newly downloaded one, but there is this project's old Docker image somehow, `--build` is needed to update the old image.

        ```bash
        docker-compose up --build
        ```

4. To stop, if you are on the Docker-compose console, press CTRL + C, if not, type as followed:

    ```bash
    docker-compose down
    ```

5. In case you are to reset the state of your backend, delete folder `volumes/` and start docker-compose again.

    ```bash
    rm -rf volumes/
    docker-compose up --build
    ```

For normal usage after the first initialization, only step 3 and 4 are required.

## API & Endpoints

The backend is run on port `:3000`, if you need other port instead, change the last line of `nodejs/app.js`

```javascript
http.listen(3000, function () {
    console.log('listening to PORT 3000');
});
```

All API endpoints are seperated into 2 protocols: HTTP and Socket.IO (TCP/IP). Socket is only used for the chatting system.

### HTTP

All of the endpoints are included in the Postman Collection v2.1 `CUIE Backend API.postman_collection.json`. Please import the file into Postman to investigate further. OpenAPI/Swagger v2.0 (YAML) mirror, `CUIE Backend API-SwaggerYaml.yaml`, is also provided in this same directory.

For an overview, each endpoints are described as followed:

```text
POST /signup            => Register
POST /signin            => Log In
POST /signout           => Log Out

/* Below this line needs authentication */
GET /user/contacts      => Get all contacts in database except the user
GET /user/contact       => Get anyone contact in depth (including user's profile)
PUT /user/profile       => Update user profile
PUT /user/profile/pic   => Update user picture

POST /user/feed         => Post new feed
GET /user/feeds         => Get user's feed (Only post that targets the user OR the user is the owner)

POST /user/room/single  => Create SINGLE chatroom with someone
POST /user/room/group   => Create GROUP chatroom with anyone(s)
GET /user/rooms         => Get all rooms that the user is in
GET /user/room/info     => Get the room info with all chat history
PUT /user/room/pic      => Update room's picture
POST /user/room/invite  => Invite more user into the room (GROUP chatroom only)

GET /static/...         => Get files or pictures
```

### SocketIO

Note that all socket APIs are written in the perspective of the client side.

* `Emit` means the message is sent, Client -> Server
* `On` means the message is received, Client <- Server

Only important (and not SocketIO default) endpoints are documented here, others are commented in the `nodejs/sockets/map.js` in the first section.

Emit: `signin`

The first endpoint to be emitted right after each successful connection to the server.
The endpoint allows server to handle client's `socketID` appropriately, by assigning `socketID` to all of the user's chatrooms.

## Source Code Files Description

The source codes are mainly divided into 2 main folders: `mysql/` and `nodejs/` which handles database initial scripts and backend scripts respectively.

`000_init.sql` inside `mysql/` will ***only*** be loaded the first time `docker-compose up` is run (in other words, the scripts inside `mysql/` will not be executed as long as the `volumes/` still exists). If you are to add more initialization scripts, please follow the `000` indexing as MySQL will execute these scripts ordered by their names alphabetically.

Some of the important files and folders inside `nodejs/` are as followed:

```text
nodejs/
|
│   app.js              => Initialize app engine
│
├───routes              => All HTTP Endpoints
│       authen.js
│       chat.js
│       post.js
│       profile.js
│       router.js       => Map endpoint paths to functions
│
├───sockets             => All Socket Endpoints
│       authen.js
│       chat.js
│       map.js          => Map endpoint paths to functions
│
└───util
        database.js     => Connect database
        functions.js    => Utility Functions
        init.js         => Script for Required Initializations
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Currently choosing.
<!-- [MIT](https://choosealicense.com/licenses/mit/) -->