// Shorts get their own line on the blocked page.
if (new URLSearchParams(location.search).get("site") === "shorts") {
  document.getElementById("why").textContent = "You decided Shorts are bad for you.";
  document.querySelector("small").textContent = "Search and regular videos still open.";
}

// Matches the 10s CSS breathing animation: 5s in, 5s out.
const cue = document.getElementById("cue");
let inhale = true;
setInterval(() => {
  inhale = !inhale;
  cue.textContent = inhale ? "Breathe in" : "Breathe out";
}, 5000);
