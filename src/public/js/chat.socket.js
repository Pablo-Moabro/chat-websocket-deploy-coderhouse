const socket = io();

const chatText = document.getElementById("chat-text");
const messageLog = document.getElementById("message-log");

let user = null

// Modal que solicita el nombre para ingresar al chat.
// También, es quien disparar el evento "authenticated"
Swal.fire({
    title: "Identifícate",
    input: "text",
    confirmButtonText: "Ingresar",
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && "¡Ingresa tu nombre de usuario para comenzar a chatear!";
    },
}).then((response) => {
    if (response.isConfirmed) {
        user = response.value;
        socket.emit("authenticated", { user });
    }
});

chatText.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        if(chatText.value.trim().length > 0){
            socket.emit("message", { user, message: chatText.value } );
            chatText.value = "";
        }
        
    }
});

socket.on("message-log", (data) =>{
    messageLog.innerText = "";
    data.messages.forEach((item) =>{
        messageLog.innerHTML += `<li>${item.user} dice: <b>${item.message}</b></li>`;
    })
});

socket.on("new-user-connect", (data) =>{
    
    if (!user) return;

    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: `${data.user} se ha unido al chat`,
        icon: "success",
    });

});