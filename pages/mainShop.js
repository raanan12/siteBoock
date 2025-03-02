const class1 = (class2) =>{
    fetch('/class',{
        headers:{ "Accept": 'application/json', 'Content-Type': 'application/json' },
        method:'post',
        body: JSON.stringify({
            class2
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data != 1){
            localStorage.setItem('arrBo',JSON.stringify(data))
            location.href = '/ShopClass'
            console.log(data);
        }
        else{
            alert('לא קיימים ספרים בכיתה זאת')
        }
    })
    .catch((e)=>{
        console.log(e);
    })
}