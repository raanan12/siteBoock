// Receiving an array of products and the user name from the
// Local Storage and also from the Session Storage.
let chosenProducts = JSON.parse(localStorage.getItem('chosenProducts'));


let totulPrice1 = 15

// A function that produces the divs of the selected products.
const newDiv = (name, price, imgUrl,class5,scool,cunt2,index1) => {
  let div = document.createElement('div');
  let h1 = document.createElement('h1');
  let p = document.createElement('p');
  let br = document.getElementById('br')
  let p1 = document.createElement('p')
  let imgDelete = document.createElement('button');
  let img =  document.createElement('img');


  // The function removes the product from the product array
  // that the user has selected.
  imgDelete.addEventListener('click', () => {
    let obj = {
      class: class5,
      productName: name,
      productPrice: price,
      productImg:imgUrl,
      scool: scool,
      index: index1
    }
    let boolean = false

    
    chosenProducts.forEach((val,ind)=>  {
      if(obj.productName == val.productName && obj.class === val.class && obj.scool === val.scool){
        if(val.cunt2 !=1){
          chosenProducts[ind].cunt2 = chosenProducts[index1].cunt2-1
        }
        else{
          chosenProducts = chosenProducts.filter((val)=>obj.productName != val.productName || obj.class != val.class || obj.scool != val.scool)
          localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
        }
      }     
    })
    document.getElementById('totalProducts').innerHTML = ''
    PresentingOrder()
    console.log(chosenProducts);
  })

  imgDelete.innerHTML = 'הסרה';
  imgDelete.setAttribute('class','btn')
  imgDelete.setAttribute('id','remov')
  imgDelete.style.background = 'red'
  imgDelete.style.height = '25px'
  imgDelete.style.width = '100px'
  imgDelete.style.marginTop = '0px'
  h1.innerHTML = name
  let scoolNew = ''
  if(scool == 'girls'){
    scoolNew = 'בנות'
  }
  else{
    scoolNew = 'בנים'
  }

  img.src = imgUrl
  img.style.width = '40px'
  img.style.height = '40px'
  p.innerHTML = `מחיר : ${price} כמות : ${cunt2} `
  div.append( h1, p,imgDelete,p1,img);
  div.setAttribute('class', 'product');
  document.getElementById('totalProducts').append(div)
}


// The function takes the Username and the Product array and passes to the server
// The server takes it and puts it in the Collection of pending orders and returns True or False
// if it returns True the user will be transferred to the home page and then discinnected from the system.

const back = () => {
  location.href = '/'
}


// The function displays the entire order, it enters the Username
// and also the total amount of products.
const PresentingOrder = () => {
  totulPrice1 = 0
  chosenProducts.forEach((val)=>{
    let num = val.productPrice * val.cunt2
    totulPrice1 = totulPrice1+num
  })
  chosenProducts.forEach((val,index) => {
    newDiv(val.productName, val.productPrice, val.productImg,val.class,val.scool ,val.cunt2,index)
  });

  console.log(totulPrice1);
  

  document.getElementById('totalPrice').innerHTML = ` ${totulPrice1}₪`;


}

PresentingOrder()
const approve = () => {

  console.log('ok');
  
  try{
    document.getElementById('approve').disabled = true
  }
  catch{
    
  }
    
    let userFamayl = document.getElementById('famayl').value;
    let userNameInput = document.getElementById('nameUser').value;
    let userEmail = document.getElementById('emailUser').value;
    let userFone = document.getElementById('foneUser').value;
    let adress = document.getElementById('adress').value;


    if(userFamayl.length <2){
      alert('לא הוכנס שם משפחה')
      document.getElementById('approve').disabled = false

    }
    else if (userNameInput.length < 2) {
      alert('לא הוכנס שם פרטי')
      document.getElementById('approve').disabled = false

    }
    else if (userEmail.indexOf('@') == -1) {
      alert('מייל לא תקין')
      document.getElementById('approve').disabled = false

    }
    else if (userFone.length != 10) {
      alert('מספר פאלפון לא תקין ')
      document.getElementById('approve').disabled = false

    }
    else if(adress.length < 10){
      alert('הכתובת לא חוקית')
      document.getElementById('approve').disabled = false

    }
    else if(document.getElementById('checkbox').checked == false){
      alert('לא אושר תשלום')
      document.getElementById('approve').disabled = false
    }
    else {
      userConnected = {
        userFamayl,
        userNameInput,
        userEmail,
        userFone,
        adress
      }

     
      localStorage.setItem('user', userConnected)
      localStorage.setItem('fon',userFone )
      localStorage.setItem('user', userFamayl + " " + userNameInput)
      localStorage.setItem('adress',adress)

      console.log('ok');
      

    if(chosenProducts.length != 0){ 
        localStorage.setItem('tiutlPric',totulPrice1)
        console.log('ppp');
        
        fetch('/approve123', {
          headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
          method: 'post',
          body: JSON.stringify({
            userName: userFamayl + ' ' + userNameInput,
            userFon : userFone,
            arrProducts: chosenProducts,
            totulPrice: totulPrice1,
            adress
    
          })
        })
          .then(res => res.json())
      
          .then(data => {

            if (data.result == true) {
              localStorage.setItem('user','not connected')
              localStorage.setItem('idOrder',data.id)
              let chosenProducts = [];
              localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
              alert('תודה שקנית ההזמנה הקניה  התקבלה במערכת ')
              location.href = '/summary'
            }
            else {
              alert = 'ההזמנה לא התקלה אנחנו מצטערים ניתן לנסות עוד פעם'
              document.getElementById('approve').disabled = false
            }
          })
          .catch((err) => {
            console.log(err);
          })
        
    }
    else{
      location.href = '/'
    }
    }

    
  
  


    


  
}