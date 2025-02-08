document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let pickup = document.getElementById("pickup").value;
    let pickupTime = document.getElementById("pickupTime").value;
    let dropoff = document.getElementById("dropoff").value;

    if (!name || !phone || !pickup || !pickupTime || !dropoff) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        let response = await fetch("http://localhost:5000/calculate-distance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pickup, dropoff })
        });

        let data = await response.json();

        if (response.ok) {
            alert(`Distance: ${data.distance}\nFare: ${data.fare}`);
            let whatsappMessage = `Hello, I want to book a delivery.\n\nName: ${name}\nPhone: ${phone}\nPickup: ${pickup}\nPickup Time: ${pickupTime}\nDrop-off: ${dropoff}\n\nDistance: ${data.distance}\nFare: ${data.fare}`;
            let whatsappUrl = `https://wa.me/27743339577?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank");
        } else {
            alert("Error: " + data.error);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    }
});
