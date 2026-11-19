document.getElementById("jsStatus").textContent = "JS: Active";

document.getElementById("themeBtn").addEventListener("click", function () {
  document.body.classList.toggle("light");
});

var tabIds = ["picker", "routine", "mcq", "concepts"];
function switchTab(name) {
  for (var i = 0; i < tabIds.length; i++) {
    var t = tabIds[i];
    document.getElementById("tab-" + t).classList.toggle("active", t === name);
    document.getElementById("sec-" + t).classList.toggle("active", t === name);
  }
}

var tabsContainer = document.querySelector(".tabs");
tabsContainer.addEventListener("click", function (e) {
  var btn = e.target.closest(".tab");
  if (btn) {
    switchTab(btn.getAttribute("data-tab"));
  }
});

// 1. Smart Picker
var picker = { time: "30m", energy: "mid", focus: "concept" };

function bindPickerGroup(containerId, key) {
  var container = document.getElementById(containerId);
  container.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    picker[key] = chip.getAttribute("data-val");
    var btns = container.querySelectorAll(".chip");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove("active");
    }
    chip.classList.add("active");
    buildPlan();
  });
}

bindPickerGroup("timeChips", "time");
bindPickerGroup("energyChips", "energy");
bindPickerGroup("focusChips", "focus");

function buildPlan() {
  var timeText = picker.time === "30m" ? "30 Minutes" : picker.time === "1h" ? "1 Hour" : "2 Hours";
  var tip =
    picker.energy === "low"
      ? "Low energy: keep it light with reading and notes."
      : picker.energy === "high"
      ? "High energy: tackle active recall and practice problems first."
      : "Normal energy: steady reading plus a quick self-check.";

  var steps = [];
  if (picker.focus === "concept") {
    steps = [
      "Read one topic carefully and highlight key terms.",
      "Write a 4-line summary from memory.",
      "Compare two related terms or examples."
    ];
  } else if (picker.focus === "mcq") {
    steps = [
      "Review key rules or formulas for 5 minutes.",
      "Solve 15–20 MCQs without checking notes.",
      "Review every mistake and note why."
    ];
  } else {
    steps = [
      "Skim your short notes or concept cards.",
      "Quiz yourself out loud on definitions.",
      "Do a 5-minute recap at the end."
    ];
  }

  document.getElementById("planOutput").innerHTML =
    "<strong>Plan: " + timeText + " (" + picker.focus.toUpperCase() + ")</strong>" +
    "<div style='color:var(--muted);font-size:0.84rem;margin-top:0.2rem;'>" + tip + "</div>" +
    "<ul><li>" + steps[0] + "</li><li>" + steps[1] + "</li><li>" + steps[2] + "</li></ul>";
}

document.getElementById("generatePlanBtn").addEventListener("click", buildPlan);
buildPlan();

// 2. Daily Routine
var tasks = [
  { time: "07:30", task: "Morning Revision: Key Definitions", type: "Revision", done: false },
  { time: "17:00", task: "ICT / Core Subject Study Block", type: "Self Study", done: false },
  { time: "20:30", task: "Practice 20 MCQs", type: "Self Study", done: false }
];

var routineListEl = document.getElementById("routineList");

function renderRoutine() {
  var html = "";
  for (var i = 0; i < tasks.length; i++) {
    var item = tasks[i];
    html +=
      "<div class='routine-item " + (item.done ? "done" : "") + "'>" +
        "<div class='toggle-area' data-idx='" + i + "' style='cursor:pointer;flex:1;'>" +
          "<strong>[" + item.time + "]</strong> <span class='task-text'>" + item.task + "</span> " +
          "<small style='color:var(--muted);'>(" + item.type + ")</small>" +
        "</div>" +
        "<button type='button' class='btn del-btn' data-idx='" + i + "'>Remove</button>" +
      "</div>";
  }
  routineListEl.innerHTML = html;
}

routineListEl.addEventListener("click", function (e) {
  var delBtn = e.target.closest(".del-btn");
  if (delBtn) {
    tasks.splice(Number(delBtn.getAttribute("data-idx")), 1);
    renderRoutine();
    return;
  }
  var toggleArea = e.target.closest(".toggle-area");
  if (toggleArea) {
    var idx = Number(toggleArea.getAttribute("data-idx"));
    tasks[idx].done = !tasks[idx].done;
    renderRoutine();
  }
});

document.getElementById("addRoutineBtn").addEventListener("click", function () {
  var tInput = document.getElementById("rTime");
  var kInput = document.getElementById("rTask");
  var yInput = document.getElementById("rType");
  var val = kInput.value.trim();
  if (!val) return;
  tasks.push({ time: tInput.value || "19:30", task: val, type: yInput.value, done: false });
  kInput.value = "";
  renderRoutine();
});

renderRoutine();

// 3. MCQ Trainer
var mcqs = [
  {
    q: "What is the binary value of decimal 10?",
    opts: ["1010", "1100", "1001", "1110"],
    ans: 0,
    exp: "10 in binary is 1010 (8 + 0 + 2 + 0 = 10)."
  },
  {
    q: "Which organ of government makes laws?",
    opts: ["Judiciary", "Legislature", "Executive", "Police"],
    ans: 1,
    exp: "The Legislature makes laws, the Executive enforces them, and the Judiciary interprets them."
  },
  {
    q: "According to the Law of Demand, when price rises (other things equal), demand:",
    opts: ["Rises", "Falls", "Stays equal", "Doubles"],
    ans: 1,
    exp: "Higher prices generally reduce quantity demanded."
  },
  {
    q: "Which gate outputs 1 only when both inputs are 1?",
    opts: ["OR", "XOR", "AND", "NOR"],
    ans: 2,
    exp: "AND outputs 1 only when both A and B are 1."
  },
  {
    q: "GDP measures the value of final goods and services produced:",
    opts: ["Inside a country's borders", "Only abroad", "Only by government", "Only in agriculture"],
    ans: 0,
    exp: "GDP counts production within geographical borders over a period."
  }
];

var qIndex = 0;
var score = 0;
var attempted = 0;
var locked = false;
var mcqOptionsEl = document.getElementById("mcqOptions");

function renderMcq() {
  locked = false;
  var item = mcqs[qIndex];
  document.getElementById("mcqMeta").textContent = "Question " + (qIndex + 1) + " of " + mcqs.length;
  document.getElementById("mcqScore").textContent = "Score: " + score + " / " + attempted;
  document.getElementById("mcqQuestion").textContent = item.q;
  document.getElementById("mcqExp").style.display = "none";

  var optsHtml = "";
  for (var i = 0; i < item.opts.length; i++) {
    optsHtml += "<button type='button' class='opt' data-opt='" + i + "'>" + item.opts[i] + "</button>";
  }
  mcqOptionsEl.innerHTML = optsHtml;
}

mcqOptionsEl.addEventListener("click", function (e) {
  var btn = e.target.closest(".opt");
  if (!btn || locked) return;
  locked = true;
  attempted++;

  var picked = Number(btn.getAttribute("data-opt"));
  var item = mcqs[qIndex];
  var allOpts = mcqOptionsEl.querySelectorAll(".opt");
  allOpts[item.ans].classList.add("correct");
  if (picked === item.ans) {
    score++;
  } else {
    btn.classList.add("wrong");
  }

  document.getElementById("mcqScore").textContent = "Score: " + score + " / " + attempted;
  var expBox = document.getElementById("mcqExp");
  expBox.textContent = item.exp;
  expBox.style.display = "block";
});

document.getElementById("nextMcqBtn").addEventListener("click", function () {
  qIndex = (qIndex + 1) % mcqs.length;
  renderMcq();
});

renderMcq();

// 4. Concept Cards
var concepts = [
  { cat: "Civics", title: "Good Governance", desc: "Transparent, accountable, and law-abiding public administration.", note: "Pillars: Accountability, Transparency, Rule of Law." },
  { cat: "Civics", title: "Unitary vs. Federal State", desc: "Unitary centralizes power; federal divides power between center and states.", note: "Bangladesh is Unitary." },
  { cat: "Economics", title: "Perfect Competition vs. Monopoly", desc: "Many sellers as price-takers vs. one dominant seller.", note: "Monopoly controls market supply/price." },
  { cat: "Economics", title: "GDP vs. GNP", desc: "GDP is domestic production; GNP adds net income from abroad.", note: "GNP = GDP + Net factor income from abroad." },
  { cat: "ICT", title: "Combinational vs. Sequential", desc: "Combinational depends only on current inputs; sequential uses memory/past state.", note: "Adder vs. Flip-Flop." },
  { cat: "ICT", title: "LAN vs. WAN", desc: "LAN covers a local area; WAN spans wider regions or countries.", note: "Campus vs. Internet-scale links." }
];

var catChipsEl = document.getElementById("catChips");
var conceptListEl = document.getElementById("conceptList");

function filterConcepts(cat) {
  var html = "";
  for (var j = 0; j < concepts.length; j++) {
    var c = concepts[j];
    if (cat === "all" || c.cat === cat) {
      html +=
        "<div class='c-card'>" +
          "<small>" + c.cat + "</small>" +
          "<h3>" + c.title + "</h3>" +
          "<p>" + c.desc + "</p>" +
          "<div class='c-note'>" + c.note + "</div>" +
        "</div>";
    }
  }
  conceptListEl.innerHTML = html;
}

catChipsEl.addEventListener("click", function (e) {
  var chip = e.target.closest(".chip");
  if (!chip) return;
  var btns = catChipsEl.querySelectorAll(".chip");
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove("active");
  }
  chip.classList.add("active");
  filterConcepts(chip.getAttribute("data-cat"));
});

filterConcepts("all");
      
