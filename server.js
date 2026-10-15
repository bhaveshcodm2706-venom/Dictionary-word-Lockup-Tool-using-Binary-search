const http = require("http");
const fs = require("fs");
const path = require("path");

// ==========================================
// DICTIONARY DATA
// ==========================================

const dictionary = [
    {
        word: "Algorithm",
        meaning: "A step-by-step procedure used to solve a problem."
    },
    {
        word: "Binary",
        meaning: "A number system that uses only 0 and 1."
    },
    {
        word: "Computer",
        meaning: "An electronic device that processes data."
    },
    {
        word: "Database",
        meaning: "An organized collection of information."
    },
    {
        word: "Function",
        meaning: "A reusable block of code that performs a specific task."
    },
    {
        word: "Internet",
        meaning: "A worldwide network connecting computers and devices."
    },
    {
        word: "Keyword",
        meaning: "A reserved word that has a special meaning in programming."
    },
    {
        word: "Loop",
        meaning: "A programming structure used to repeat statements."
    },
    {
        word: "Python",
        meaning: "A high-level programming language."
    },
    {
        word: "Search",
        meaning: "The process of finding a particular item."
    },
    {
        word: "Software",
        meaning: "A collection of programs used to perform tasks."
    },
    {
        word: "Variable",
        meaning: "A named memory location used to store a value."
    }
];

// ==========================================
// BINARY SEARCH
// ==========================================

function binarySearch(searchWord) {

    searchWord = searchWord.trim().toLowerCase();

    let low = 0;
    let high = dictionary.length - 1;

    while (low <= high) {

        const middle = Math.floor((low + high) / 2);

        const middleWord =
            dictionary[middle].word.toLowerCase();

        if (middleWord === searchWord) {
            return {
                found: true,
                word: dictionary[middle].word,
                meaning: dictionary[middle].meaning
            };
        }

        if (middleWord < searchWord) {
            low = middle + 1;
        } else {
            high = middle - 1;
        }
    }

    return {
        found: false,
        word: searchWord,
        meaning: ""
    };
}


// ==========================================
// MIME TYPES
// ==========================================

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript"
};

// ==========================================
// CREATE SERVER
// ==========================================

const server = http.createServer((request, response) => {

    // ======================================
    // API SEARCH
    // ======================================

    if (
        request.method === "POST" &&
        request.url === "/api/search"
    ) {

        let body = "";

        request.on("data", chunk => {
            body += chunk.toString();
        });

        request.on("end", () => {

            try {

                const data = JSON.parse(body);

                const word = String(data.word || "")
                    .trim()
                    .toLowerCase();

                console.log("Search request received:", word);

                // Empty input
                if (word === "") {

                    response.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    response.end(JSON.stringify({
                        success: false,
                        message: "Please enter a word."
                    }));

                    return;
                }

                // Perform Binary Search
                const result = binarySearch(word);

                console.log("Search result:", result);

                // Word found
                if (result.found) {

                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });

                    response.end(JSON.stringify({
                        success: true,
                        word: word,
                        meaning: result.meaning,
                        comparisons: result.comparisons
                    }));

                }

                // Word not found
                else {

                    response.writeHead(200, {
                        "Content-Type": "application/json"
                    });

                    response.end(JSON.stringify({
                        success: false,
                        word: word,
                        message: "Word not found in dictionary.",
                        comparisons: result.comparisons
                    }));
                }

            }

            catch (error) {

                console.error("Server Error:", error);

                response.writeHead(500, {
                    "Content-Type": "application/json"
                });

                response.end(JSON.stringify({
                    success: false,
                    message: "Server error."
                }));
            }
        });

        return;
    }

    // ======================================
    // SERVE FRONTEND FILES
    // ======================================

    let requestedFile =
        request.url === "/"
            ? "/index.html"
            : request.url;

    const filePath = path.join(
        __dirname,
        requestedFile
    );

    const extension = path.extname(filePath);

    const contentType =
        mimeTypes[extension] || "text/plain";

    fs.readFile(filePath, (error, content) => {

        if (error) {

            response.writeHead(404);

            response.end("File not found");

            return;
        }

        response.writeHead(200, {
            "Content-Type": contentType
        });

        response.end(content);
    });

});

// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Dictionary Word Lookup server running on port ${PORT}`
    );

});