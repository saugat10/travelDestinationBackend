document.getElementById("destinationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const destinationObj = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    dateFrom: document.getElementById("dateFrom").value,
    dateTo: document.getElementById("dateTo").value,
  };
  console.log(destinationObj);
  const response = await createDestination(destinationObj);

  if (response.error) {
    console.log(response.error);
    if (response.error.title) {
      console.error("Custom error:", response.error.title.message);
      document.getElementById("titleError").textContent =
        response.error.title.message || "Unknown error occurred";
    }
  }
});

async function createDestination(destination) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/traveldestinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(destination),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
