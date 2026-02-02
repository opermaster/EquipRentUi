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
    const url = localhost+"equipment";
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
            //return result;
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
    if(points  === null) alert("asdasd");
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
    if (!Array.isArray(points)) return;

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
            render_users(await load_users(),points);
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
            
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
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
    await load_equipments();
});