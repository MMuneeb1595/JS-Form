const form = document.getElementById('formResult');

const records = JSON.parse(localStorage.getItem('formData')) || [];

if (records.length === 0) {
    form.innerHTML = "<p class='text-center text-white fs-5 p-2 fw-semibold'>No record found</p>";
} else {
    let table = `
    <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover align-middle">
            <thead class="table-success">
                <tr class="text-center">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Contact Method</th>
                    <th>Services</th>
                    <th>Budget</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
    `;    
    records.forEach((item, index) => {
        table += `
        <tr class="text-center">
            <td class="row-id">${item.id}</td>
            <td class="name fw-semibold">${item.name}</td>
            <td class="email text-break">${item.email}</td>
            <td class="company">${item.company}</td>
            <td class="contactMethod">${item.contactMethod}</td>
            <td class="service-list">${item.services.join(", ")}</td>
            <td class="budget">${item.budget}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteRecord(${index})">
                    Delete
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn"
                        data-index="${index}"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal">
                    Edit
                </button>
            </td>
        </tr>`;
    });
    table += `
            </tbody>
        </table>
    </div>
    `;
    form.innerHTML = table;
}
// Delete function
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem('formData')) || [];
    // remove record
    records.splice(index, 1);
    // reassign IDs (1,2,3...)
    records = records.map((record, i) => {
        record.id = i + 1;
        return record;
    });
    localStorage.setItem('formData', JSON.stringify(records));
    location.reload();
}

let editIndex = null;
let row;
document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("edit-btn")) return;
    const btn = e.target;
    row = btn.closest("tr");
    editIndex = btn.dataset.index;
    document.getElementById("editName").value = row.querySelector(".name").innerText;
    document.getElementById("editEmail").value = row.querySelector(".email").innerText;
    document.getElementById("editcompany").value = row.querySelector(".company").innerText;
    document.getElementById("budget").value = row.querySelector(".budget").innerText;
    const method = row.querySelector(".contactMethod").innerText.trim();
    document.querySelectorAll('input[name="contactMethod"]').forEach(radio => { radio.checked = radio.value === method });

    const services = row.querySelector(".service-list").innerText.split(", ").map(s => s.trim());
    document.querySelectorAll(".service").forEach(chk => {
        chk.checked = services.includes(chk.value);
    });
});


function updateRecord() {
    row.querySelector(".name").innerText = document.getElementById("editName").value;
    row.querySelector(".email").innerText = document.getElementById("editEmail").value;
    row.querySelector(".company").innerText = document.getElementById("editcompany").value;
    row.querySelector(".budget").innerText = document.getElementById("budget").value
    const selectedRadio = document.querySelector(
        'input[name="contactMethod"]:checked'
    );
    row.querySelector(".contactMethod").innerText =
     selectedRadio ? selectedRadio.value : "";

    let services = [];
    document.querySelectorAll(".service:checked").forEach(chk => {
        services.push(chk.value);
    });
    row.querySelector(".service-list").innerText = services.join(", ");

    bootstrap.Modal.getInstance(
        document.getElementById('editModal')
    ).hide();
}