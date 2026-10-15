const input = document.getElementById("wordInput");
const searchButton = document.getElementById("searchButton");
const result = document.getElementById("result");

// Search word using backend
async function searchWord() {
    const word = input.value.trim().toLowerCase();

    // Check empty input
    if (word === "") {
        result.className = "result error";

        result.innerHTML = `
            <p>⚠️ Please enter a word.</p>
        `;

        return;
    }

    // Show loading message
    result.className = "result";

    result.innerHTML = `
        <p class="loading">🔎 Searching...</p>
    `;

    try {
        // Send word to backend
        const response = await fetch("/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                word: word
            })
        });

        // Check if server response is OK
        if (!response.ok) {
            throw new Error("Server error");
        }

        // Convert response to JSON
        const data = await response.json();

        // Word found
        if (data.success) {
            result.className = "result success";

            result.innerHTML = `
                <div class="word">
                    📖 ${data.word}
                </div>

                <div class="meaning">
                    <strong>Meaning:</strong>
                    ${data.meaning}
                </div>
            `;
        }

        // Word not found
        else {
            result.className = "result error";

            result.innerHTML = `
                <strong>❌ Word Not Found</strong>

                <br><br>

                The word
                <strong>"${data.word || word}"</strong>
                is not present in the dictionary.
            `;
        }
    }

    catch (error) {
        console.error("Error:", error);

        result.className = "result error";

        result.innerHTML = `
            <strong>❌ Server Connection Error</strong>

            <br><br>

            The backend server is not running properly.

            <br><br>

            Please check your backend server.
        `;
    }
}

// Connect Search button to searchWord()
searchButton.addEventListener("click", searchWord);

// Allow pressing Enter to search
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});