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

        const btnCell = document.createElement("th");

        const btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Update Status";
        btn.className = "button-regular";

        btn.addEventListener("click", () => updateOrder(orderId));

        btnCell.appendChild(btn);
        tr.appendChild(btnCell);

        tbody.appendChild(tr);
    });
}
async function updateOrder(id) {
    console.log(id+" "+document.getElementById(`order-status-${id}`).value);
    let url = localhost+"order";
    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
	        	"Id":id,
	        	"Status":document.getElementById(`order-status-${id}`).value,
	        })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            render_orders(await load_orders());
            showPopup("Updated","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
document.addEventListener("DOMContentLoaded", async () => {
   render_orders(await load_orders());
});