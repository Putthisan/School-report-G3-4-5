async function submitReport() {
  const name = document.getElementById("name").value;
  const problem = document.getElementById("problem").value;

  if (!name || !problem) {
    alert("?????????????????????");
    return;
  }

  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, problem }),
  });

  if (res.ok) {
    alert("???????????????");
    loadReports();
    document.getElementById("name").value = "";
    document.getElementById("problem").value = "";
  }
}

async function loadReports() {
  const res = await fetch("/api/reports");
  const data = await res.json();

  const reportsEl = document.getElementById("reports");
  reportsEl.innerHTML = "";
  data.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `#${r.id} ${r.name}: ${r.problem} [?????: ${r.status}]`;
    reportsEl.appendChild(li);
  });
}

window.onload = loadReports;
