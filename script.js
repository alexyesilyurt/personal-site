const timeElement = document.querySelector("#local-time");

function updateLocalTime() {
  if (!timeElement) return;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  timeElement.textContent = `Local time: ${formatter.format(new Date())}`;
}

updateLocalTime();
window.setInterval(updateLocalTime, 30_000);

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});
