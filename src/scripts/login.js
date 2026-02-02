document.getElementById("login-form")
    .addEventListener("submit",login);

async function login(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    let role ="";

    const url = localhost+"auth/login";
    try{
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "Login":formData.get("login"),
                "Password":formData.get("password"),
            })
        });
        if(!response.ok){
            const text = await response.text();
            showPopup(text,"neg");
        } else{
            const result = await response.json();
            localStorage.setItem("jwt", result.token);
            role = result.role;
        }
    }
    catch(error){
        showPopup("ERROR: "+error.message,"neg");
    }
    if(role == "Admin") {
        window.location.href = "./admin.html";
    }
    else if (role=="Manager") {
        window.location.href = "./index.html";
    }
}