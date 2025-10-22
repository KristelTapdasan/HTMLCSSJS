
const home = document.getElementById('home');
const booking = document.getElementById('booking');
const flights = document.getElementById('flights');
const passenger = document.getElementById('passenger');
const summary = document.getElementById('summary');

const bookBtn = document.getElementById('bookBtn');
const bookingForm = document.getElementById('bookingForm');
const flightList = document.getElementById('flightList');
const passengerForm = document.getElementById('passengerForm');
const summaryDetails = document.getElementById('summaryDetails');
const bookNow = document.getElementById('bookNow');
const successMessage = document.getElementById('successMessage');
const flightTypeSelect = document.getElementById('flightType');
const returnDateContainer = document.getElementById('returnDateContainer');


const flightSchedules = {
  oneWay: [
    { flightNo: "BK101", from: "Cebu", to: "Manila", departDate: "2025-10-20", departTime: "8:00 AM", price: 3000, fare: "Promo Fare", seats: 15, duration: "2h", terminal: "T2" },
    { flightNo: "BK205", from: "Cebu", to: "Manila", departDate: "2025-10-21", departTime: "11:00 AM", price: 3500, fare: "Regular", seats: 10, duration: "1h 30m", terminal: "T1" },
    { flightNo: "BK303", from: "Cebu", to: "Manila", departDate: "2025-10-22", departTime: "5:00 PM", price: 4000, fare: "Promo Fare", seats: 20, duration: "1h 45m", terminal: "T3" }
  ],
  roundTrip: [
    { flightNo: "BK501", from: "Cebu", to: "Manila", departDate: "2025-10-20", returnDate: "2025-10-25", departTime: "9:00 AM", returnTime: "2:00 PM", price: 5500, fare: "Promo Fare", seats: 18, duration: "2h", terminal: "T2" },
    { flightNo: "BK505", from: "Cebu", to: "Manila", departDate: "2025-10-22", returnDate: "2025-10-26", departTime: "10:30 AM", returnTime: "4:00 PM", price: 6000, fare: "Regular", seats: 12, duration: "1h 30m", terminal: "T1" },
    { flightNo: "BK510", from: "Cebu", to: "Manila", departDate: "2025-10-23", returnDate: "2025-10-27", departTime: "6:00 PM", returnTime: "10:00 AM", price: 7000, fare: "Promo Fare", seats: 14, duration: "1h 45m", terminal: "T3" }
  ]
};


bookBtn.addEventListener('click', () => {
  switchSection(home, booking);
});


flightTypeSelect.addEventListener('change', () => {
  returnDateContainer.classList.toggle('hidden', flightTypeSelect.value !== 'roundtrip');
});


bookingForm.addEventListener('submit', e => {
  e.preventDefault();

  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const departDate = document.getElementById('departDate').value;
  const returnDate = document.getElementById('returnDate').value;
  const flightType = flightTypeSelect.value;

  if (!from || !to || !departDate) {
    alert("Please complete all required fields.");
    return;
  }

  switchSection(booking, flights);
  displayFlights(from, to, departDate, returnDate, flightType);
});


function displayFlights(from, to, departDate, returnDate, flightType) {
  flightList.innerHTML = "";

  const results = flightSchedules[flightType === 'roundtrip' ? 'roundTrip' : 'oneWay'].filter(
    f => f.from.toLowerCase() === from.toLowerCase() &&
         f.to.toLowerCase() === to.toLowerCase()
  );

  if (results.length === 0) {
    flightList.innerHTML = `<p>No available ${flightType} flights found.</p>`;
    return;
  }

  results.forEach(flight => {
    const card = document.createElement('div');
    card.classList.add('flight-card');
    card.innerHTML = `
      <h3>${flight.flightNo} (${flight.fare})</h3>
      <p><b>From:</b> ${flight.from} → <b>To:</b> ${flight.to}</p>
      <p><b>Departure:</b> ${flight.departDate} (${flight.departTime})</p>
      ${flightType === 'roundtrip' ? `<p><b>Return:</b> ${flight.returnDate} (${flight.returnTime})</p>` : ""}
      <p><b>Seats:</b> ${flight.seats}</p>
      <p><b>Terminal:</b> ${flight.terminal}</p>
      <p><b>Duration:</b> ${flight.duration}</p>
      <p><b>Price:</b> ₱${flight.price.toLocaleString()}</p>
      <button class="btn-primary selectFlight">Select Flight</button>
    `;
    card.querySelector(".selectFlight").addEventListener("click", () => selectFlight(flight));
    flightList.appendChild(card);
  });

 
  const backContainer = document.createElement('div');
  backContainer.classList.add('button-group');
  backContainer.innerHTML = `
    <button type="button" id="backToBooking" class="btn-secondary">Back</button>
  `;
  flightList.appendChild(backContainer);

  document.getElementById('backToBooking').addEventListener('click', () => {
    switchSection(flights, booking);
  });
}


function selectFlight(flight) {
  switchSection(flights, passenger);

  const passengerCount = parseInt(document.getElementById('passengers').value);
  passengerForm.innerHTML = "";

  if (isNaN(passengerCount) || passengerCount <= 0) {
    passengerForm.innerHTML = `<p>Please select at least one passenger.</p>`;
    return;
  }

  for (let i = 1; i <= passengerCount; i++) {
    passengerForm.innerHTML += `
      <div class="form-group">
        <h4>Passenger ${i}</h4>
        <label>Full Name:</label>
        <input type="text" required placeholder="Full Name">
        <label>Age:</label>
        <input type="number" required min="0" placeholder="Age">
      </div>
    `;
  }


  passengerForm.innerHTML += `
    <div class="button-group">
      <button type="button" id="backToFlights" class="btn-secondary">Back</button>
      <button type="submit" class="btn-primary">Continue</button>
    </div>
  `;

  passengerForm.onsubmit = e => {
    e.preventDefault();
    switchSection(passenger, summary);
    displaySummary(flight);
  };

  document.getElementById("backToFlights").addEventListener("click", () => {
    switchSection(passenger, flights);
  });
}


function displaySummary(flight) {
  const inputs = passengerForm.querySelectorAll("input");
  const passengers = [];

  for (let i = 0; i < inputs.length; i += 2) {
    const name = inputs[i].value.trim();
    const age = inputs[i + 1].value.trim();
    if (name && age) passengers.push({ name, age });
  }

  const totalCost = flight.price * passengers.length;

  summaryDetails.innerHTML = `
    <h3>Flight Summary</h3>
    <p><b>Flight No:</b> ${flight.flightNo}</p>
    <p><b>Route:</b> ${flight.from} → ${flight.to}</p>
    <p><b>Terminal:</b> ${flight.terminal}</p>
    <p><b>Fare Type:</b> ${flight.fare}</p>
    <p><b>Duration:</b> ${flight.duration}</p>
    <p><b>Price per Ticket:</b> ₱${flight.price.toLocaleString()}</p>
    <hr>
    <h3>Passengers (${passengers.length})</h3>
    <ul>
      ${passengers.map(p => `<li>${p.name} (${p.age} yrs old)</li>`).join('')}
    </ul>
    <hr>
    <p><b>Total Price:</b> ₱${totalCost.toLocaleString()}</p>
  `;
}


bookNow.addEventListener('click', () => {
  successMessage.classList.remove('hidden');
  successMessage.textContent = "✅ Booking confirmed! Thank you for flying with B&K Airlines.";

  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  setTimeout(() => {
    successMessage.classList.add('hidden');
    bookingForm.reset();
    switchSection(summary, booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 5000);
});


function switchSection(hide, show) {
  hide.classList.remove('active');
  show.classList.add('active');
}
