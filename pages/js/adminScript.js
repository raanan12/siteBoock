const orderManagement = () => {
    location.href = '/All'
}

const productManagement = () => {
    location.href = '/productManagement'
}

const appendProduct = () => {
    location.href = '/appendProduct'
}

const usersXl = () => {
    fetch('/usersXL')
        .then(res => res.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.xlsx';
            a.click();
        })
        .catch((err) => {
            console.log(err);
        })
}

const pendingXL = () => {
    fetch('/pendingXL')
        .then(res => res.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pending.xlsx';
            a.click();
        })
        .catch((err) => {
            console.log(err);
        })
}

const allbooc = ()=>{
    fetch('/allpadingXl')
        .then(res => res.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pending.xlsx';
            a.click();
        })
        .catch((err) => {
            console.log(err);
        })
}

const openSaleF = ()=>{
    fetch('/openSaleManger', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            openSale:true
        })
      })
      .then((res)=>res.json())
      .then((data)=>{
        console.log(data);
        
        if(data == true){
            alert('המכירה נפתחה')
        }
      })
      .catch((err)=>{console.log(err);
      })
}


const closeSaleF = ()=>{
    fetch('/closeSaleManger', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
            openSale:false
        })
      })
      .then((res)=>res.json())
      .then((data)=>{
        if(data == true){
            alert('המכירה נסגרה')
        }
      })
      .catch((err)=>{console.log(err);
      })
}

const deletAllOrers = () =>{
    fetch('/deletAdmin25240')
        .then(res => res.json())
        .then((data) => {
            alert(data)
        })
        .catch((err) => {
            console.log(err);
        })
}