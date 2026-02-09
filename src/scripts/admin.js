let points = [];
async function load_users() {
    const url = localhost+"user";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_points() {
    const url = localhost+"point";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_equipments() {
    const url = localhost+"equipment/all";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function load_orders() {
    const url = localhost+"order";
	try{
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            return result;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
function render_users(users,points){
    if(!Array.isArray(users)) return;
    const container = document.getElementById("users-table");
    container.innerHTML = "";
    if(points  === null) alert("ERROR");
    users.forEach(user => {
        const row = document.createElement("tr");
        row.id = `user-${user.id}`;

        const login = document.createElement("th");
        login.className = "span_major";
        login.scope = "row";
        login.textContent = user.login;

        const role = document.createElement("td");
        role.className = "span_minor";
        role.textContent = user.role;

        
        const address_elem = document.createElement("td");
        if(user.role !== "Admin"){
            const address_select = document.createElement("select");
            address_select.id = `user-address-${user.id}`;
            points.forEach(point => {
                const option = document.createElement("option");
    	        option.value = point.id;
    	        option.textContent = point.addres;
    	        if (user.address === point.addres) option.selected = true;
    	            address_select.appendChild(option);
            })
            address_elem.append(address_select);
        }
        const updateBtn_elem = document.createElement("td");

        const updateBtn = document.createElement("button");
        updateBtn.className = "button-regular";
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => updateUser(user.id);
        updateBtn_elem.append(updateBtn);

        const deleteBtn_elem = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "button-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteUser(user.id);

        deleteBtn_elem.append(deleteBtn);

        row.append(login, role, address_elem,updateBtn_elem,deleteBtn_elem);
        container.appendChild(row);
    });
}
function render_points(points) {

    const container = document.getElementById("points-table");
    container.innerHTML = "";
    points.forEach(point => {
        const row = document.createElement("tr");
        row.id = `point-${point.id}`;

        const address_elem = document.createElement("th");
        const address = document.createElement("input");
        address.type = "text";
        address.scope = "row";
        address.id = `point-address-${point.id}`;
        address.value = point.addres;

        address_elem.append(address);

        const phone_elem = document.createElement("td");
        const phone = document.createElement("input");
        phone.type = "text";
        phone.id = `point-phone-${point.id}`;
        phone.value = point.phoneNumber;  

        phone_elem.append(phone);

        const updateBtn_elem = document.createElement("td");

        const updateBtn = document.createElement("button");
        updateBtn.className = "button-regular";
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => updatePoint(point.id);

        updateBtn_elem.append(updateBtn);

        const deleteBtn_elem = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "button-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deletePoint(point.id);

        deleteBtn_elem.append(deleteBtn);

        row.append(address_elem, phone_elem,updateBtn_elem, deleteBtn_elem);
        container.appendChild(row);
    });
}
function render_equipments(equipments, points) {
    let list = document.getElementById("equipment-list");
    list.innerHTML ="";
    equipments.forEach(equipment => {

        let li = document.createElement("li");

        let container = document.createElement("div");
        container.className = "equpiment-container";
        container.id = `equpiment-${equipment.id}-container`;

        let title_div = document.createElement("div");
        title_div.className ="title-row";

        let title = document.createElement("span");
        title.className = "span_major";

        title.textContent = equipment.name;

        let price = document.createElement("input");
        price.type="number";
        price.placeholder="Price";
        price.id =`equipment-${equipment.id}-price`;
        price.value=equipment.price;

        title_div.append(title,price);

        container.appendChild(title_div);

        let ol = document.createElement("ol");
        ol.id = `equpiment-${equipment.id}-point-list`;

        equipment.pickUpPoints.forEach(p => {

            let row = document.createElement("li");
            row.className = "list-row";

            let select = document.createElement("select");
            select.id = `equipment-${equipment.id}-address-${p.id}`;
            points.forEach(point => {
                let option = document.createElement("option");
                option.textContent = point.addres;
                option.value = point.id;
                if (point.addres === p.address)
                    option.selected = true;

                select.appendChild(option);
            });

            let inputQty = document.createElement("input");
            inputQty.type = "number";
            inputQty.placeholder = "Quantity";
            inputQty.value = p.quantity;
            inputQty.id = `equipment-${equipment.id}-quantity-${p.id}`;

            let deleteBtn = document.createElement("input");
            deleteBtn.type = "button";
            deleteBtn.value = "Delete";
            deleteBtn.className = "button-danger";

            deleteBtn.onclick = ()=> deleteEquipmentPoint(p.id);

            row.append(select, inputQty, deleteBtn);
            ol.appendChild(row);
        });

        let addRow = document.createElement("li");
        addRow.className = "list-row";

        let form = document.createElement("form");

        form.onsubmit = (e) => {
            addEquipmentAddress(e,equipment.id);
            form.reset();
        };

        let newAddressSelect = document.createElement("select");
        newAddressSelect.id = `equipment-${equipment.id}-new-address`;
        newAddressSelect.name = "point";

        points.forEach(point => {
            let option = document.createElement("option");
            option.textContent = point.addres;
            option.value = point.id;
            newAddressSelect.appendChild(option);
        });

        let newQtyInput = document.createElement("input");
        newQtyInput.type = "number";
        newQtyInput.placeholder = "Quantity";
        newQtyInput.name = "quantity";
        newQtyInput.id = `equipment-${equipment.id}-new-quantity`;

        let addBtn = document.createElement("button");
        addBtn.type = "submit";
        addBtn.className = "button-regular";
        addBtn.textContent = "Add";

        form.append(newAddressSelect, newQtyInput, addBtn);
        addRow.appendChild(form);

        ol.appendChild(addRow);

        let updateRow = document.createElement("li");
        updateRow.className = "list-row";

        let updateBtn = document.createElement("input");
        updateBtn.type = "button";
        updateBtn.value = "Update";
        updateBtn.className = "button-regular";

        updateBtn.onclick = () => updateEquipmentPoints(equipment.id,equipment.pickUpPoints.map(item=>item.id));

        updateRow.appendChild(updateBtn);
        ol.appendChild(updateRow);

        container.appendChild(ol);
        li.appendChild(container);
        list.appendChild(li);
    });
}
function render_orders(orders){

    const tbody = document.getElementById("orders-table");
    tbody.innerHTML = "";

    orders.forEach((order, index) => {

        const orderId = order.id ?? index; 

        const tr = document.createElement("tr");
        tr.appendChild(createCell(order.client.firstName));
        tr.appendChild(createCell(order.client.lastName));
        tr.appendChild(createCell(order.client.email));

        tr.appendChild(createCell(order.equipment.name));

        const statusCell = document.createElement("th");

        const selectWrapper = document.createElement("div");
        selectWrapper.className = "select-status";
        selectWrapper.dataset.status = order.status;

        const select = document.createElement("select");
        select.className = "order-status";
        select.id = `order-status-${orderId}`;

        statuses.forEach(status => {

            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;

            if (status === order.status)
                option.selected = true;

            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            selectWrapper.dataset.status = select.value;
        });

        selectWrapper.appendChild(select);
        statusCell.appendChild(selectWrapper);
        tr.appendChild(statusCell);

        tr.appendChild(createCell(formatDate(order.startDate)));
        tr.appendChild(createCell(formatDate(order.endDate)));

        tbody.appendChild(tr);
    });
}
async function addUser(e){
    e.preventDefault(); 
	const formData = new FormData(e.target);
    
    const url = localhost+"user/new_user";
	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
        		"Login":formData.get("login"),
        		"Password":formData.get("password"),
        		"Role":formData.get("role"),
        		"PickUpPointId":formData.get("address"),
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            render_users(await load_users(),points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }

}
async function addPickUpPoint(e){
    e.preventDefault(); 
	const formData = new FormData(e.target);
    const url = localhost+"point/new_point";

	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
        		"Addres":formData.get("address"),
        		"PhoneNumber":formData.get("phone"),
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            points = await load_points();
            render_points(points);
            render_address_select(points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }

}
async function addEquipment(e) {
    e.preventDefault(); 
	const formData = new FormData(e.target);

    const url = localhost+"equipment";
	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:formData
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result.id);
            render_equipments(await load_equipments(),points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function addEquipmentAddress(e,id) {
    const url = localhost+"equipment/address";
    e.preventDefault(); 
	const formData = new FormData(e.target);
	try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
        		"EquipmentId":id,
        		"PickUpPointId":formData.get("point"),
        		"Quantity":formData.get("quantity"),
	        }),
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
            return null;
        } else{
            const result = await response.json();
            console.log(result);
            render_equipments(await load_equipments(),points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function deletePoint(id) {
    const url = localhost+`point/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            points = await load_points();
            render_points(points);
            render_address_select(points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function deleteUser(id) {
    const url = localhost+`user/${id}`;

	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            render_users(await load_users(),points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function deleteEquipmentPoint(id) {
    const url = localhost+`equipment/address/${id}`;
	try{
        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            render_equipments(await load_equipments(),points);
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function updateUser(id) {
    let newPointId = document.getElementById(`user-address-${id}`).value;
    let url = localhost+`user/${id}/${newPointId}`;
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            render_users(await load_users(),points);
            showPopup("Updated","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function updatePoint(id) {
    let newPointAddress = document.getElementById(`point-address-${id}`).value;
    let newPointPhone = document.getElementById(`point-phone-${id}`).value;
    let url = localhost+`point/${id}`;
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Address":newPointAddress,
	        	"Phone":newPointPhone,
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            points = await load_points();
            render_points(points);
            render_address_select(points);
            showPopup("Updated","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
async function updateEquipmentPoints(equipmentId, ids) {
    const result = {
        id: equipmentId,
        points: []
    };

    ids.forEach(recordId => {

        const addressSelect = document.getElementById(
            `equipment-${equipmentId}-address-${recordId}`
        );

        const quantityInput = document.getElementById(
            `equipment-${equipmentId}-quantity-${recordId}`
        );

        if (!addressSelect || !quantityInput) return;

        result.points.push({
            id: recordId,
            pickUpPointId: addressSelect.value || addressSelect.options[addressSelect.selectedIndex].text,
            quantity: Number(quantityInput.value)
        });
    });

    let url = localhost+`equipment/update_point_equipments`;
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify(result)
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            showPopup("Updated","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }

    let price = document.getElementById(`equipment-${equipmentId}-price`).value;
    url = localhost+`equipment/update_price/${equipmentId}/${price}`;
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            showPopup("Updated","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
// Support functions
function render_address_select(points) {
    if (!Array.isArray(points)) return;

    const select = document.getElementById("address-select");
    if (!select) return;

    select.innerHTML = "";
    
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select address";
    placeholder.disabled = true;
    placeholder.selected = true;

    select.appendChild(placeholder);

    points.forEach(point => {
        const option = document.createElement("option");
        option.value = point.id;
        option.textContent = point.addres;

        select.appendChild(option);
    });
}
function selectChange() {
    const roleSelect = document.querySelector('select[name="role"]');
    const addressSelect = document.getElementById('address-select');

    const role = roleSelect.value;

    if (role === "Admin") {
        addressSelect.disabled = true;
        addressSelect.required = false;
        addressSelect.value = "";
    } 
    else if (role === "Manager") {
        addressSelect.disabled = false;
        addressSelect.required = true;
    }
}
function previewImage(event) {
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(event.target.files[0]);
}
document.addEventListener("DOMContentLoaded", async () => {
    points = await load_points();
    render_users(await load_users(),points);
    render_points(points);
    render_address_select(points);
    render_equipments(await load_equipments(),points);
    render_orders(await load_orders());
});