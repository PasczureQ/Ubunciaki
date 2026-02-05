let selected = [];
let time = 1800;
let interval;
let finished = false;

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

async function startTest() {
  finished = false;

  const res = await fetch("questions.json");
  selected = await res.json();
  selected = shuffle(selected).slice(0, 30);

  const form = document.getElementById("test");
  form.innerHTML = "";

  let html = "";
  selected.forEach((q, i) => {
    html += `<div class="question" id="q${i}">
      <h3 class="q-title">${i+1}. ${q.q}</h3>
      ${shuffle(q.a.map((ans, idx) => ({ans, idx})))
        .map(o => `<label class="answer">
                      <input type="radio" name="q${i}" value="${o.idx}">
                      ${o.ans}
                    </label>`).join("")}
    </div>`;
  });

  form.innerHTML = html;

  startTimer();
}

function startTimer() {
  clearInterval(interval);
  time = 1800;
  const timer = document.getElementById("timer");
  interval = setInterval(() => {
    let m = Math.floor(time / 60);
    let s = time % 60;
    timer.textContent = `${m}:${s.toString().padStart(2,"0")}`;
    if (--time < 0) finishTest();
  }, 1000);
}

function finishTest() {
  if (finished) return;
  finished = true;
  clearInterval(interval);

  let score = 0;

  selected.forEach((q, i) => {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    if (checked) {
      if (Number(checked.value) === q.c) {
        score++;
        checked.parentElement.classList.add("correct");
      } else {
        checked.parentElement.classList.add("wrong");
      }
    }
  });

  const resultBox = document.querySelector("#finalScore .result-box");
  resultBox.innerHTML = `
    <h2>Wynik</h2>
    <p>${score} / ${selected.length} (${Math.round(score/selected.length*100)}%)</p>
    <button onclick="location.reload()">Spróbuj ponownie</button>
  `;
  document.getElementById("finalScore").classList.remove("hidden");
}

document.getElementById("finishBtn").addEventListener("click", finishTest);

document.addEventListener("DOMContentLoaded", startTest);
