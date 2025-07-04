// Global Variable for order array.
let ArrOrders = []

const today = new Date();
const dayOfWeek = today.getDay(); 



// Function that produce new Divs for order of products.
const newDiv = (name, arr, orderNumber,id) => {
  let div = document.createElement('div');
  let p2 = document.createElement('p');
  let p1 = document.createElement('p');
  let p = document.createElement('p');
  let btn = document.createElement('button');
  btn.setAttribute('id','delete')
  let Remove = document.getElementById('delete');

  // This function takes the Orders and calculating the total of the
  // order and then preseting it on the created div.
  div.addEventListener('click', () => {
    let obj = {
      userName: name,
      arrProducts: arr,
      id
    }
    document.getElementById('clientName').innerHTML = `${name}`
    document.getElementById('ProductsOrder').innerHTML = ''
    let price = 0
    arr.forEach((val) => {
      
      let p = document.createElement('p');
      p.style.borderBottomColor = 'black'
      p.style.borderBottomStyle = 'solid'
      p.style.borderBottomWidth = '1'
      p.style.display = 'block'
      p.innerHTML = val.productName +' , ' + ' ' + ' ' + ' כמות : ' + val.cunt2
      document.getElementById('ProductsOrder').append(p)
      price += val.productPrice;
      console.log(val.productName);
    })

    document.getElementById('totalPaid').innerHTML = ` ₪ ${price}`
    Remove.innerHTML = ''
    btn.addEventListener('click',()=>{
      remove(obj)
      console.log(obj);
    })
    btn.innerHTML = 'dalete'
    Remove.append(btn)
  })
  p2.innerHTML = `מספר הזמנה: ${orderNumber}`
  p1.innerHTML = `שם מזמין: ${name}`
  p.innerHTML = `מספר מוצרים: ${arr.length}`
  div.append(p2, p1, p);
  div.setAttribute('class', 'orders');
  document.getElementById('OrderList').append(div)
}


const remove =(obj)=>{
  let userName = obj.userName;
  let arrProducts = obj.arrProducts;
  let id = obj.id
  console.log(userName);
  document.getElementById('OrderList').innerHTML = ''
    let boolean = false
    ArrOrders = ArrOrders.filter((val) => {
      if (boolean == false && userName == val.userName && val.arrProducts == arrProducts && val._id == id ) {
        boolean = true
      }
      else {
        return val
      }

    })
    ArrOrders.forEach((val,index) => {
      newDiv(val.userName, val.arrProducts, ++index)
    });

    fetch('/deletOrder', {
      headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
      method: 'delete',
      body: JSON.stringify({
        userName,
        arrProducts,
        id
      })
    })

      .then(res => res.json())

      .then((data) => {
        alert(data)

      })
      .catch((err) => {
        console.log(err);
      })

  
}

// if(dayOfWeek)


// Recieving the array of orders from the server.
fetch('/Order')
  .then(res => res.json())
  .then((data) => {
    ArrOrders = data.result
    ArrOrders.forEach((val,index) => {  
      let id = val._id
      newDiv(val.userName, val.arrProducts, ++index, id)
    });
  })
  .catch((err) => {
    console.log(err);
  })