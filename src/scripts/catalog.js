async function load_equipments(e) {
    e.preventDefault(); 
	const formData = new FormData(e.target);
    const url = localhost+"equipment/avaliable";
	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                "StartDate":toUtc(formData.get("startDate")),
                "EndDate":toUtc(formData.get("endDate")),
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result);
            render_equipments(result);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function createOrder(e) {
    e.preventDefault(); 
	const formData = new FormData(e.target);
    const url = localhost+"order/create";
    try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                "StartDate":toUtc(document.getElementById("startDate_input").value),
                "EndDate":toUtc(document.getElementById("endDate_input").value),
                "PickUpPointEquipmentId":localStorage.getItem("selected-item-id"),
                "Client":{
                    "FirstName": formData.get("firstName"),
                    "LastName": formData.get("secondName"),
                    "Email": formData.get("email"),
                }
            })
        });
        if(!response.ok){
            showPopup("Order wasn`t approved","neg",timeout=10000);
        } else{
            const result = await response.json();
            console.log(result); //log succes
            showPopup(`Order successfully approved. Order id:${result.id}`,"pos",timeout = 10000);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
function render_equipments(equipments) {

    const list = document.getElementById("equipment-list");
    list.innerHTML = ""; 

    equipments.forEach(eq => {

        const li = document.createElement("li");
        const wrapperDiv = document.createElement("div");

        const equipmentDiv = document.createElement("div");
        equipmentDiv.id = `equipment-${eq.id}`;

        const nameDiv = document.createElement("div");
        nameDiv.className = "span_major";
        nameDiv.textContent = eq.name;

        const priceDiv = document.createElement("div");
        priceDiv.className = "span_minor";
        priceDiv.textContent = `Price: ${eq.price}`;

        const img = document.createElement("img");
        img.src = "https://localhost:7251/images/"+eq.img; 

        equipmentDiv.appendChild(nameDiv);
        equipmentDiv.appendChild(priceDiv);
        equipmentDiv.appendChild(img);

        const innerList = document.createElement("ul");
        innerList.className = "inner-list-invisible";
        innerList.id = `equipment-${eq.id}-point-list`;

        eq.pickUpPoints.forEach(point => {

            const pointLi = document.createElement("li");
            const pointDiv = document.createElement("div");

            const addressSpan = document.createElement("span");
            addressSpan.className = "span_major";
            addressSpan.textContent = point.address;

            const statusSpan = document.createElement("span");

            const rentButton = document.createElement("input");
            rentButton.type = "button";
            rentButton.value = "Rent";
            rentButton.className = "button-regular";
            rentButton.addEventListener("click",()=>openForm(point.id))

            if (point.quantity > 0) {
                statusSpan.className = "available";
                statusSpan.textContent = "Available";
            } else {
                statusSpan.className = "unavailable";
                statusSpan.textContent = "Unavailable";
                rentButton.disabled = true;
            }

            pointDiv.appendChild(addressSpan);
            pointDiv.appendChild(statusSpan);
            pointDiv.appendChild(rentButton);

            pointLi.appendChild(pointDiv);
            innerList.appendChild(pointLi);
        });

        wrapperDiv.appendChild(equipmentDiv);
        wrapperDiv.appendChild(innerList);
        li.appendChild(wrapperDiv);
        list.appendChild(li);

        document
            .getElementById(`equipment-${eq.id}`)
            .addEventListener("click", () => equipmentClick(eq.id));
    });
}
function equipmentClick(id) {
    const li = document
        .getElementById(`equipment-${id}`)
        .closest("li");

    const list = document.getElementById(`equipment-${id}-point-list`);

    const isOpen = list.classList.contains("inner-list-visible");

    document.querySelectorAll("#equipment-list li").forEach(item => {

        item.classList.remove("equipment-open");

        const inner = item.querySelector("ul");
        if(inner){
            inner.classList.remove("inner-list-visible");
            inner.classList.add("inner-list-invisible");
        }
    });

    if (!isOpen) {
        li.classList.add("equipment-open");
        list.classList.remove("inner-list-invisible");
        list.classList.add("inner-list-visible");
    }
}
function openForm(id){
    console.log(id);
    document.getElementById("rent-form").className="active";
    localStorage.setItem("selected-item-id",id);

    document.getElementById("startDate_input").disabled = true;
    document.getElementById("endDate_input").disabled = true;
}
function closeForm(e){
    e.preventDefault();
    document.getElementById("rent-form").className="unactive";
    localStorage.removeItem("selected-item-id");

    document.getElementById("startDate_input").disabled = false;
    document.getElementById("endDate_input").disabled = false;
}
function getTodayLocal() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
}
function toUtc(dateString) {
    return new Date(dateString).toISOString();
}
document.addEventListener("DOMContentLoaded", async () => {
    //render_equipments(await load_equipments());
    let startDate = document.getElementById("startDate_input");
    let endDate = document.getElementById("endDate_input");
    startDate.min = getTodayLocal();
    endDate.min = getTodayLocal();
});