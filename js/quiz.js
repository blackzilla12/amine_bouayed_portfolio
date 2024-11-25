const quizData = [
    {
        question: "Which programming language is most used in my projects?",
        a: "Python",
        b: "JavaScript",
        c: "C++",
        d: "PHP",
        correct: "b", // Replace with the actual correct answer.
    },
    {
        question: "What framework do I frequently use for building web applications?",
        a: "Django",
        b: "React",
        c: "Laravel",
        d: "Angular",
        correct: "c", // Replace with your primary framework.
    },
    {
        question: "Which type of applications have I primarily worked on?",
        a: "Mobile apps",
        b: "Web apps",
        c: "Desktop apps",
        d: "Game development",
        correct: "b", // Replace with your focus area.
    },
    {
        question: "What is the main focus of my recent projects?",
        a: "AI and machine learning",
        b: "Blockchain development",
        c: "E-commerce platforms",
        d: "Educational tools",
        correct: "a", // Replace with your actual focus area.
    },
    {
        question: "Which tool do I often use for version control?",
        a: "Git",
        b: "SVN",
        c: "Mercurial",
        d: "None",
        correct: "a",
    },
];
const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const timeoutEl = document.getElementById('timeout');
const progressCircle = document.getElementById('progress-circle');
const correctSound = new Audio('../audio/correct.mp3');
const incorrectSound = new Audio('../audio/incorrect.mp3');
correctSound.preload = 'auto';
incorrectSound.preload = 'auto';
let currentQuiz = 0;
let score = 0;
let timeRemaining = 10; // Initial countdown value
let timerId; // Stores the interval timer
let autoMoveId; // Stores the timeout for auto-moving to the next question

loadQuiz();

function loadQuiz() {
    deselectAnswers();
    resetTimer();

    // Clear background colors from previous answers
    answerEls.forEach(answerEl => {
        answerEl.parentElement.style.backgroundColor = '';
    });

    // Load the current question
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;

    // Start the countdown and circular progress
    startTimer();
}

function deselectAnswers() {
    answerEls.forEach(answerEl => {
        answerEl.checked = false; // Deselect answers
    });
}


function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function resetTimer() {
    clearInterval(timerId); // Clear the countdown timer
    clearTimeout(autoMoveId); // Clear the auto-move timeout
    timeRemaining = 10; // Reset the time remaining
    timeoutEl.innerText = timeRemaining; // Reset the text display
    progressCircle.style.animation = 'none'; // Stop the animation
    void progressCircle.offsetWidth; // Trigger reflow to restart animation
    progressCircle.style.animation = 'progress 10s linear forwards'; // Restart the animation
}

function startTimer() {
    // Display the initial countdown value immediately
    timeoutEl.innerText = timeRemaining;

    // Decrement the countdown every second
    timerId = setInterval(() => {
        timeRemaining--;
        timeoutEl.innerText = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerId); // Stop the countdown
        }
    }, 1000);

    // Automatically move to the next question when time is up
    autoMoveId = setTimeout(() => {
        moveToNextQuestion();
    }, 10000); // 10 seconds
}

function moveToNextQuestion() {
    currentQuiz++;
    if (currentQuiz < quizData.length) {
        loadQuiz();
    } else {
        quiz.innerHTML = `
            <h2>You answered ${score}/${quizData.length} questions correctly</h2>
            <button onclick="location.reload()">Reload</button>
        `;
    }
}


function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        // Highlight correct/incorrect answers
        const correctAnswer = quizData[currentQuiz].correct;

        answerEls.forEach(answerEl => {
            if (answerEl.id === correctAnswer) {
                answerEl.parentElement.style.backgroundColor = 'green';
            } else {
                answerEl.parentElement.style.backgroundColor = 'red';
            }
        });

        // Play sound based on the correctness of the answer
        if (answer === correctAnswer) {
            correctSound.play();
            score++;
        } else {
            incorrectSound.play();
        }

        // Clear the timer and move to the next question after 10 seconds
        clearInterval(timerId);
        clearTimeout(autoMoveId);
        setTimeout(moveToNextQuestion, 5000);
    }
});
