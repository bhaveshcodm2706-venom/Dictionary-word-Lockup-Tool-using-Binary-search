async function searchWord() {

    const input = document.getElementById("wordInput");
    const result = document.getElementById("result");

    const word = input.value.trim();

    if (word === "") {
        result.className = "result error";
        result.innerHTML = "⚠️ Please enter a word.";
        return;
    }

    result.className = "result";
    result.innerHTML = "🔍 Searching...";

    try {

        const response = await fetch("/search", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                word: word
            })
        });

        const data = await response.json();

        if (data.success) {

            result.className = "result success";

            result.innerHTML = `
                <div class="word">${data.word}</div>

                <div>
                    <strong>Meaning:</strong>
                    ${data.meaning}
                </div>

                <div class="comparisons">
                    Binary Search Comparisons:
                    <strong>${data.comparisons}</strong>
                </div>
            `;

        } else {

            result.className = "result error";

            result.innerHTML = `
                ❌ <strong>${data.word || "Word"}</strong> was not found.

                <div class="comparisons">
                    Binary Search Comparisons:
                    <strong>${data.comparisons || 0}</strong>
                </div>
            `;
        }

    } catch (error) {

        result.className = "result error";

        result.innerHTML =
            "❌ Unable to connect to the Python backend.";
    }
}


// Allow pressing Enter to search
document.getElementById("wordInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        searchWord();
    }

});