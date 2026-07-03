// --- 音源データ（GitHub上のmp3ファイルを直接読み込みます） ---
const correctSound = new Audio('seikai.mp3');
const incorrectSound = new Audio('huseikai.mp3');

// （※これより下のプログラムは、前回お渡ししたもののままで一切変えなくて大丈夫です！）
let currentSessionQuestions = [];
let currentQuestion = 0;
let score = 0;

const progressEl = document.getElementById('progress-text');
const questionEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options-container');
const resultEl = document.getElementById('result-message');
const nextBtn = document.getElementById('next-btn');

function playSound(isCorrect) {
    if (isCorrect) {
        correctSound.currentTime = 0;
        correctSound.play().catch(e => console.log("再生エラー:", e));
    } else {
        incorrectSound.currentTime = 0;
        incorrectSound.play().catch(e => console.log("再生エラー:", e));
    }
}

function initQuiz() {
    // window.allQuizData から問題データを取得します
    currentSessionQuestions = [...window.allQuizData].sort(() => 0.5 - Math.random()).slice(0, 5);
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    resultEl.innerHTML = "";
    nextBtn.style.display = "none";
    optionsEl.innerHTML = "";

    const currentQuizData = currentSessionQuestions[currentQuestion];
    
    progressEl.innerHTML = `<ruby>第<rt>だい</rt></ruby> ${currentQuestion + 1} <ruby>問<rt>もん</rt></ruby> / <ruby>第<rt>だい</rt></ruby> 5 <ruby>問<rt>もん</rt></ruby>`;
    questionEl.innerHTML = currentQuizData.question;

    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerHTML = option;
        button.onclick = () => checkAnswer(index, button);
        optionsEl.appendChild(button);
    });
}

function checkAnswer(selectedIndex, button) {
    const buttons = optionsEl.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const currentQuizData = currentSessionQuestions[currentQuestion];

    if (selectedIndex === currentQuizData.answer) {
        playSound(true);
        button.style.backgroundColor = "#d4edda";
        button.style.borderColor = "#28a745";
        button.style.color = "#155724";
        resultEl.style.color = "#28a745";
        resultEl.innerHTML = "<ruby>正解<rt>せいかい</rt></ruby>！🎉<br><br><span style='font-size: 15px; font-weight:normal; color:#444; line-height: 1.5; display: inline-block; text-align: left;'>" + currentQuizData.explanation + "</span>";
        score++;
    } else {
        playSound(false);
        button.style.backgroundColor = "#f8d7da";
        button.style.borderColor = "#dc3545";
        button.style.color = "#721c24";
        buttons[currentQuizData.answer].style.backgroundColor = "#d4edda";
        buttons[currentQuizData.answer].style.borderColor = "#28a745";
        buttons[currentQuizData.answer].style.color = "#155724";
        
        resultEl.style.color = "#dc3545";
        resultEl.innerHTML = "<ruby>不正解<rt>ふせいかい</rt></ruby>...<br><br><span style='font-size: 15px; font-weight:normal; color:#444; line-height: 1.5; display: inline-block; text-align: left;'>" + currentQuizData.explanation + "</span>";
    }

    nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < currentSessionQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
};

function showResults() {
    progressEl.innerHTML = "";
    questionEl.innerHTML = "クイズ<ruby>終了<rt>しゅうりょう</rt></ruby>！お<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>でした。";
    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";
    resultEl.style.color = "#333";
    resultEl.innerHTML = `あなたの<ruby>正解数<rt>せいかいすう</rt></ruby>は 5<ruby>問中<rt>もんちゅう</rt></ruby> <strong>${score}<ruby>問<rt>もん</rt></ruby></strong> です！<br><br><button id="restart-btn">もういちどチャレンジ！</button>`;
    
    document.getElementById('restart-btn').onclick = () => {
        resultEl.innerHTML = "";
        initQuiz();
    };
}

initQuiz();
