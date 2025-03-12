const remove =(obj)=>{
    let productName = obj.productName;
    let productPrice = obj.productPrice;
    let class1 = obj.class2;
    let scool = obj.scool
    document.getElementById('OrderList').innerHTML = ''
      let boolean = false
      ArrProducts = ArrProducts.filter((val) => {
        if (productName!= val.productName && val.productPrice !=productPrice && boolean == false) {
          return val
        }
        else if (boolean == false) {
          boolean = true
        }
        else {
          return val
        }
  
      })
      ArrProducts.forEach((val) => {
        newDiv(val.productName, val.productPrice, val.productImg)
      });
  
      fetch('/deletProduct', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'delete',
        body: JSON.stringify({
          productName,
          productPrice,
          class1,
          scool
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



const newDiv = (name, price, imgUrl,scool,class2) => {
    let div = document.createElement('div');
    let h1 = document.createElement('h1');
    let p = document.createElement('p');
    let img = document.createElement('img');
    let btn = document.createElement('button');
    let update = document.createElement('button');
    let divText = document.createElement('div');
    btn.setAttribute('id','delete')
    btn.innerHTML = 'delete'
    update.innerHTML = 'update'
    img.setAttribute('id','imgProduct')

    div.addEventListener('click', () => {

        document.getElementById('clientName').innerHTML = `${name}`

        document.getElementById('totalPaid').innerHTML = ` ₪ ${price}`
        document.getElementById('delete').innerHTML =''
        document.getElementById('delete').append(btn)
        btn.addEventListener('click',()=>{
            obj ={
                productName:name,
                productPrice:price,
                class2,
                scool
            }

            remove(obj)
        })
        document.getElementById('update').innerHTML =''
        document.getElementById('update').append(update)
        update.addEventListener('click',()=>{
          obj ={
            productName:name,
            productPrice:price
          }
          let changeValue = document.getElementById('selectUpdate').value;
          let updateInpt = document.getElementById('updateInpt').value;

          fetch('/update', {
            headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({
              productName: obj.productName,
              productPrice : obj.productPrice,
              changeValue,
              updateInpt
            })
          })
          .then(res => res.json())
          .then((data)=>{
            ArrProducts = data
            document.getElementById('OrderList').innerHTML = ''
            ArrProducts.forEach((val) => {
              newDiv(val.productName, val.productPrice, val.productImg)
            })
          })
          .catch((err)=>{
            console.log(err);
          })
  
        })
    
    })

    

    // The function removes the product from the product array
    // that the user has selected.
    h1.innerHTML = name
    p.innerHTML = `מחיר: ${price}`
    img.src = imgUrl
    divText.append(h1,p)
    div.append(divText,img);
    div.setAttribute('class', 'product');
    document.getElementById('OrderList').append(div)
  }




fetch('/getAllProducts')
  .then(res => res.json())
  .then((data) => {
    ArrProducts = data.arrp  
    
    // forEach loop that goes throuh the array of products recieved from the
    // server and enters each product into a new div, which generates
    // a div for each product itself.
    // document.getElementById('userName').innerHTML = sessionStorage.getItem('user')
    ArrProducts.forEach((val) => {
      newDiv(val.productName, val.productPrice, val.productImg,val.scool,val.class)
    })
  })
  .catch((err) => {
    console.log(err);
  })



