const birthDateInput = document.getElementById("birthDate");
const btnCalc = document.getElementById("btnCalc");
const btnToday = document.getElementById("btnToday");
const btnClear = document.getElementById("btnClear");
const outYears = document.getElementById("outYears");
const outMonths = document.getElementById("outMonths");
const outDays = document.getElementById("outDays");
const nextBirthdayLine = document.getElementById("nextBirthdayLine");
const extraLine = document.getElementById("extraLine");
const todayChip = document.getElementById("todayChip");
const statusChip = document.getElementById("statusChip");
const msgBox = document.getElementById("msgBox");

function formatDateForChip(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function showMessage(type, text) {
  msgBox.classList.remove("good", "bad");
  if (type === "good") msgBox.classList.add("good");
  if (type === "bad") msgBox.classList.add("bad");
  msgBox.textContent = text;
}

function setStatus(text) {
  statusChip.textContent = text;
}

function resetOutputs() {
  outYears.textContent = "—";
  outMonths.textContent = "—";
  outDays.textContent = "—";
  nextBirthdayLine.textContent = "Next birthday: —";
  extraLine.textContent = "Extra info: —";
  setStatus("Waiting…");
}

function calculateExactAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    const prevMonthIndex = (today.getMonth() - 1 + 12) % 12;
    const prevMonthYear =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    const prevMonthDays = daysInMonth(prevMonthYear, prevMonthIndex);
    days += prevMonthDays;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

function daysUntilNextBirthday(birthDate, today) {
  const thisYear = today.getFullYear();
  let next = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  if (stripTime(next) < stripTime(today)) {
    next = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = stripTime(next) - stripTime(today);
  const diffDays = Math.round(diffMs / msPerDay);
  return { nextBirthdayDate: next, daysLeft: diffDays };
}

const now = new Date();
todayChip.textContent = `Today: ${formatDateForChip(now)}`;

btnCalc.addEventListener("click", () => {
  const birthValue = birthDateInput.value;
  if (!birthValue) {
    showMessage("bad", "❌ Please select your birth date first.");
    resetOutputs();
    return;
  }
  const [y, m, d] = birthValue.split("-").map(Number);
  const birthDate = new Date(y, m - 1, d);
  const today = stripTime(new Date());
  if (stripTime(birthDate) > today) {
    showMessage("bad", "❌ Birth date cannot be in the future.");
    resetOutputs();
    return;
  }
  if (y < 1900) {
    showMessage("bad", "❌ Please enter a valid year (1900 or later).");
    resetOutputs();
    return;
  }
  const age = calculateExactAge(birthDate, today);
  outYears.textContent = age.years;
  outMonths.textContent = age.months;
  outDays.textContent = age.days;
  const { nextBirthdayDate, daysLeft } = daysUntilNextBirthday(
    birthDate,
    today,
  );
  nextBirthdayLine.textContent = `Next birthday: ${formatDateForChip(
    nextBirthdayDate,
  )} (in ${daysLeft} day${daysLeft === 1 ? "" : "s"})`;
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((today - stripTime(birthDate)) / msPerDay);
  extraLine.textContent = `Extra info: You have lived about ${totalDays.toLocaleString()} days.`;
  showMessage("good", "✅ Age calculated successfully.");
  setStatus("Calculated ✅");
});

btnToday.addEventListener("click", () => {
  const t = new Date();
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  birthDateInput.value = `${yyyy}-${mm}-${dd}`;
  showMessage(
    "neutral",
    "📌 Birth date set to today (demo). Now click Calculate.",
  );
  setStatus("Ready…");
});

btnClear.addEventListener("click", () => {
  birthDateInput.value = "";
  resetOutputs();
  showMessage("neutral", "Tip: Choose a birth date and press “Calculate Age”.");
});

birthDateInput.addEventListener("change", () => {
  setStatus("Ready…");
  showMessage("neutral", "📌 Date selected. Click “Calculate Age”.");
});
