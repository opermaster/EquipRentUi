async function getOrders(e) {
    e.preventDefault(); 
	const formData = new FormData(e.target);
    const url = localhost+"order/personal";

    try{
        const response = await fetch(url,{
            method:"PUT", //GET
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                "FirstName": formData.get("firstName"),
                "LastName": formData.get("secondName"),
                "Email": formData.get("email"),
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            console.log(result);
            render_orders(result, {
                "FirstName": formData.get("firstName"),
                "LastName": formData.get("secondName"),
                "Email": formData.get("email"),
            });
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
function render_orders(orders, client) {

    const tbody = document.getElementById("orders-table");
    tbody.innerHTML = "";

    orders.forEach((order, index) => {
        const orderId = order.id ?? index;

        const tr = document.createElement("tr");

        tr.appendChild(createCell(orderId));

        tr.appendChild(createCell(order.equipment.name));

        tr.appendChild(createCell(order.equipment.price));

        const statusCell = document.createElement("th");

        const selectWrapper = document.createElement("div");
        selectWrapper.className = "select-status";
        selectWrapper.dataset.status = order.status;

        const select = document.createElement("select");
        select.className = "order-status";
        select.id = `order-status-${orderId}`;
        select.disabled = true;

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

        tr.appendChild(createCell(order.address));

        const btnCell = document.createElement("th");

        const btn = document.createElement("input");
        btn.type = "button";
        btn.value = "Cancel";
        btn.className = "button-danger";
        if(order.status !=="Confirmed") btn.disabled = true;

        btn.addEventListener("click", () => cancelOrder(orderId,client));

        btnCell.appendChild(btn);
        tr.appendChild(btnCell);

        tbody.appendChild(tr);
    });
}
async function cancelOrder(orderId,client) {
    const url = localhost+"order/cancel";

    try{
        const response = await fetch(url,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                "Id":orderId,
                "Client":client,
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            showPopup("The order has been successfully cancelled.","pos");
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
}
