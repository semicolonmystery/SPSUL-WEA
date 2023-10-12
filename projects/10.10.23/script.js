var table = document.getElementById("data");
for(var i = 0; i < data.length; i++) {
    var tr = document.createElement("tr");
    addDataToTable(tr, data[i].name);
    addDataToTable(tr, data[i].surname);
    addDataToTable(tr, data[i].email);
    addDataToTable(tr, data[i].phone);
    addDataToTable(tr, data[i].birth);
    addDataToTable(tr, data[i].sex);
    table.appendChild(tr);
}

function addDataToTable(parent, text) {
    var element = document.createElement("td");
    element.innerText = text;
    parent.appendChild(element);
}