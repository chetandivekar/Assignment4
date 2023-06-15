const http = require("http");

const Users = [
  {
    name: "Bruce",
    age: 25,
  },
  {
    name: "Tony",
    age: 30,
  },
  {
    name: "Steve",
    age: 70,
  },
];

const server = http.createServer(function (request, response) {
  const paths = request.url.split("/");

  if (request.method === "GET" && paths[1] === "users" && paths.length === 2) {
    // GET all users
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(Users));
  } else if (request.method === "GET" && paths[1] === "users" && paths[2]) {
    // GET specific user
    const idx = paths[2];
    const user = Users[idx];
    if (user) {
      response.setHeader("Content-Type", "application/json");
      response.write(JSON.stringify(user));
    } else {
      response.statusCode = 404;
      response.write("Not Found");
    }
  } else if (request.method === "POST" && paths[1] === "users") {
    // CREATE a new user
    let data = "";
    request.on("data", function (chunk) {
      data += chunk;
    });
    request.on("end", function () {
      const obj = JSON.parse(data.toString());
      Users.push(obj);
      response.statusCode = 201;
      response.write("User data created.");
    });
  } else if (request.method === "PUT" && paths[1] === "users" && paths[2]) {
    // UPDATE an existing user
    const idx = paths[2];
    const user = Users[idx];
    if (user) {
      let data = "";
      request.on("data", function (chunk) {
        data += chunk;
      });
      request.on("end", function () {
        const obj = JSON.parse(data.toString());
        Users[idx] = obj;
        response.write("User data updated.");
      });
    } else {
      response.statusCode = 404;
      response.write("Not Found");
    }
  } else if (request.method === "DELETE" && paths[1] === "users" && paths[2]) {
    // DELETE an existing user
    const idx = paths[2];
    const user = Users[idx];
    if (user) {
      Users.splice(idx, 1);
      response.write("User data deleted.");
    } else {
      response.statusCode = 404;
      response.write("Not Found");
    }
  } else {
    response.statusCode = 404;
    response.write("Not Found");
  }

  response.end();
});

server.listen(3000, function () {
  console.log("Server is running on port number 3000");
});
