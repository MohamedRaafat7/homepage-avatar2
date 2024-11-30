const typingForm = document.querySelector(".typing_form");
const chatList = document.querySelector(".chat_list");
const API_KEY = "AIzaSyC6HRGCfMJB1in2OQO4nfFk64JCzGudlSQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerHTML += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];
        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
        }
        window.scrollTo(0, chatList.scrollHeight);
    }, 75);
};

const generateAPIResponse = async (div) => {
    const textElement = div.querySelector(".text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userMessage }],
                    },
                ],
            }),
        });

        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\|8/g, "$1");
        showTypingEffect(apiResponse, textElement);
    } catch (error) {
        console.error(error);
    } finally {
        div.classList.remove("loading");
    }
};

const copyMessage = (copyBtn) => {
    const messageText = copyBtn.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyBtn.innerText = "done";

    setTimeout(() => (copyBtn.innerText = "content_copy"), 1000);
};

const showLoading = () => {
    const html = `
        <div class="message">
            <img src="../img/me3.jpg" alt="User Avatar">
            <p class="text"></p>
            <div class="loading_indicator">
                <div class="loading_bar"></div>
                <div class="loading_bar"></div>
                <div class="loading_bar"></div>
            </div>
        </div>
        <span onclick="copyMessage(this)" class="fa-regular fa-copy"></span>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "outgoing");
    div.innerHTML = html;

    chatList.appendChild(div);
    window.scrollTo(0, chatList.scrollHeight);
    generateAPIResponse(div);
};

const handleOutgoingChat = () => {
    userMessage = document.querySelector(".typing_input").value;
    if (!userMessage) return;

    const html = `
        <div class="message">
            <i class="fa-regular fa-user text-white"></i>
            <p class="text"></p>
        </div>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "outgoing");
    div.innerHTML = html;
    div.querySelector(".text").textContent = userMessage;

    chatList.appendChild(div);
    typingForm.reset();
    window.scrollTo(0, chatList.scrollHeight);
    setTimeout(showLoading, 500);
};

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutgoingChat();
});



function startVoice() {
    // Check if the browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech Recognition is not supported in your browser. Please use a compatible browser like Chrome.");
        return;
    }

    // Initialize Speech Recognition
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB"; // Set the language

    // Handle results
    recognition.onresult = function (event) {
        console.log(event);
        document.getElementById("speechToText").value = event.results[0][0].transcript;
    };

    // Handle errors
    recognition.onerror = function (event) {
        console.error(event.error);
        alert("An error occurred: " + event.error);
    };

    // Start the speech recognition
    recognition.start();
}