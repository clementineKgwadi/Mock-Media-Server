const http = require("http");

let movies = [
  { id: 1, title: "Mufsa:The Lion King", year: 2024 },
  { id: 2, title: "Meet The Khumalo's", year: 2025 },
];

let series = [
  { id: 1, title: "Top Boy", seasons: 3 },
  { id: 2, title: "Supacell", seasons: 1 },
];

let songs = [
  { id: 1, title: "Perfect", artist: "Ed Sheeran" },
  { id: 2, title: "Laho", artist: "Shallipopi" },
];

function sendResponse(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => callback(JSON.parse(body)));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  const handleRequest = (dataArray, name) => {
    if (method === "GET") {
      sendResponse(res, 200, dataArray);
    } else if (method === "POST") {
      parseBody(req, (body) => {
        dataArray.push(body);
        sendResponse(res, 201, dataArray);
      });
    } else if (method === "PUT") {
      parseBody(req, (body) => {
        const index = dataArray.findIndex((item) => item.id === body.id);
        if (index > -1) {
          dataArray[index] = body;
          sendResponse(res, 200, dataArray);
        } else {
          sendResponse(res, 404, { error: `${name} not found` });
        }
      });
    } else if (method === "DELETE") {
      parseBody(req, (body) => {
        const index = dataArray.findIndex((item) => item.id === body.id);
        if (index > -1) {
          dataArray.splice(index, 1);
          sendResponse(res, 200, dataArray);
        } else {
          sendResponse(res, 404, { error: `${name} not found` });
        }
      });
    } else {
      sendResponse(res, 405, { error: "Method Not Allowed" });
    }
  };

  if (url === "/movies") {
    handleRequest(movies, "Movie");
  } else if (url === "/series") {
    handleRequest(series, "Series");
  } else if (url === "/songs") {
    handleRequest(songs, "Song");
  } else {
    sendResponse(res, 404, { error: "Not Found" });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
