let currentRow = 0;
let lastDirection = 0;

const headers = [
  "Name",
  "Email",
  "Department",
  "Position",
  "Location",
  "Phone"
];

const patients = [
  {
    name: "Jane Doe",
    id: "100001",
    dob: "1/1/1940",
    primary: "Medicare",
    secondary: "None",
    activeprograms: [
        {
            "type": "cc",
            "item": "Vabysmo",
            "start": "01/15/2024",
            "end": "01/15/2025",
            "status": "Active"
        }
    ]
  },
  {
    name: "Dayne Johnson",
    id: "100002",
    dob: "1/1/1940",
    primary: "Medicade",
    secondary: "Private Insurance",
    activeprograms: [
        {
            "type": "sp",
            "item": "Eylea HD 2MG",
            "start": "03/01/2025",
            "end": "03/01/2026",
            "status": "Active"
        }
    ]
  },
  {
    name: "Emily Song",
    id: "100003",
    dob: "1/1/1940",
    primary: "Private Insurance",
    secondary: "None",
    activeprograms: [
        {
            "type": "cc",
            "item": "Vabysmo",
            "start": "01/01/2024",
            "end": "01/01/2025",
            "status": "Active"
        },
        {
            "type": "pa",
            "item": "Vabysmo",
            "start": "01/01/2024",
            "end": "01/01/2025",
            "status": "Active"
        }
    ]
  }
];

// Render table rows
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = patients
    .map(
      (patient, index) => `
        <tr onclick="openModal(${index})">
          <td>${patient.name}</td>
          <td>${patient.id}</td>
          <td>${patient.dob}</td>
          <td>${patient.primary}</td>
          <td>${patient.secondary}</td>
					<td>
						${
							patient.activeprograms
							.map(program => `${program.item} (${program.type.toUpperCase()})`)
							.join("<br>")
						}
					</td>
        </tr>
      `
    )
    .join("");
}

function openModal(rowIndex) {
  currentRow = rowIndex;
  lastDirection = 0;
  updateModal();
  updateTableHighlight();
  const modal = document.getElementById("modal");
  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  // Remove highlight from table
  document
    .querySelectorAll("tbody tr")
    .forEach((tr) => tr.classList.remove("viewing"));
}

function navigateRow(direction) {
  const newRow = currentRow + direction;
  if (newRow >= 0 && newRow < patients.length) {
    currentRow = newRow;
    lastDirection = direction;
    updateModal();
    updateTableHighlight();

    // Animate modal
    const modalContent = document.querySelector(".modal-content");
    modalContent.classList.remove("bounce-up", "bounce-down");
    if (direction === 1) {
      modalContent.classList.add("bounce-up");
    } else {
      modalContent.classList.add("bounce-down");
    }
    setTimeout(() => {
      modalContent.classList.remove("bounce-up", "bounce-down");
    }, 300);
  }
}

function updateTableHighlight() {
  // Remove all highlights
  document
    .querySelectorAll("tbody tr")
    .forEach((tr) => tr.classList.remove("viewing"));

  // Add highlight to current row
  const rows = document.querySelectorAll("tbody tr");
  if (rows[currentRow]) {
    rows[currentRow].classList.add("viewing");
  }
}

function updateModal() {
  const modalBody = document.getElementById("modalBody");
  const patient = patients[currentRow];

  let html = `<div class="card">`;

  for (const program of patient.activeprograms) {
    html += `
          <div class="card-field">
            <div class="card-label">${getProgramName(program.type)} Programs</div>
            <div class="card-value">
              ${
                patient.activeprograms
                .filter(patientProgram => patientProgram.type === program.type)
                .map(patientProgram => `<i class="fa-solid fa-angle-up"></i> <b>${patientProgram.item}</b> <a href="">Edit</a><br/>Status: ${patientProgram.status}<br/>Effective Start Date: ${patientProgram.start}<br/>Effective End Date: ${patientProgram.end}`)
                .join("<br>")
              }
              <hr>
              <div class="add-new-program">
                <button class="close-btn add-new-program">
                  Add New ${program.type.toUpperCase()} Program
                </button>
              </div>
            </div>
          </div>
        `;
  }
  html += "</div>";

  modalBody.innerHTML = html;
}

function getProgramName (type) {
  switch (type) {
    case 'cc':
      return 'Charity Care';
    case 'sp':
      return 'Specialty Pharmacy';
    case 'pa':
      return 'Prior Authorization';
    default:
      return 'Unknown Program';
  }
}

function init () {
    const modal = document.getElementById("modal");
    modal.addEventListener("click", function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    renderTable()
}

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        init()
    }
});