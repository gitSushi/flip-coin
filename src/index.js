if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("sw registered !");
        console.log(registration);
    }).catch(error => {
        console.log("sw registration failed !");
        console.log(error);
    })
}else{
    alert("Service Worker not supported in this browser.");
}