// Third Page


// Global variable of an array that saves the selected product inside
let chosenProducts = JSON.parse(localStorage.getItem('chosenProducts'));
let ArrProducts = []

// This function creating the div tag each div contains only one product such as 
// product name, product price and product img.
const newDiv = (name, price,imgUrl,class5,scool,indexProdu,index,) => {
  let div = document.createElement('div');
  let addAndRamoveProduct = document.createElement('div');
  let div2 = document.createElement('div');
  let div3 = document.createElement('div');
  let h1 = document.createElement('h1');
  let p = document.createElement('p');
  let sum = document.createElement('p');
  let img = document.createElement('img'); 
  let btn1 = document.createElement('button');
  let btn2 = document.createElement('button');
  sum.innerHTML = ArrProducts[index].cunt2;
  // console.log(ArrProducts[index]);
  console.log(imgUrl);
  

  // Function that adds a product to the selected products array
  btn1.addEventListener('click',()=>{
    let obj = {
      class: class5,
      productName: name,
      productPrice: price,
      productImg:imgUrl,
      scool: scool,
      index: indexProdu,
      cunt2:1
    }

    if(ArrProducts[index].type == false){
      if (ArrProducts[index].cunt2 != ArrProducts[index].amount) {
        chosenProducts.push(obj);
        ArrProducts[index].cunt2++
        sum.innerHTML = ArrProducts[index].cunt2
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));

      }
    }
    else{
      let bool = false
      chosenProducts.forEach((val,ind)=>{
        if(obj.productName === val.productName && obj.class === val.class && obj.scool === val.scool){
          chosenProducts[ind].cunt2 = chosenProducts[ind].cunt2+1 
          bool = true
          ArrProducts[index].cunt2++
          sum.innerHTML = ArrProducts[index].cunt2
          localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts)); 
        }
      })
      if(bool == false){
        chosenProducts.push(obj);
        ArrProducts[index].cunt2++
        sum.innerHTML = ArrProducts[index].cunt2
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
      }
    }
  })

  // The function removes the product from the product array
  // that the user has selected.
  btn2.addEventListener('click',()=>{
    let obj = {
      class: class5,
      productName: name,
      productPrice: price,
      productImg:imgUrl,
      scool: scool,
      index: indexProdu
    }
    if(ArrProducts[index].cunt2 > 1){
     let bool = false
     chosenProducts.forEach((val,ind)=>  {
       if(obj.productName == val.productName && obj.class === val.class && obj.scool === val.scool && bool == false){
           chosenProducts[ind].cunt2--
           bool = true
       }     
      })

      if(ArrProducts[index].cunt2 > 1 ){
        ArrProducts[index].cunt2--
        sum.innerHTML = ArrProducts[index].cunt2
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
      }
    }
    
    else if(ArrProducts[index].cunt2 == 1) {
      let bool = false
      console.log(chosenProducts);
      chosenProducts.forEach((val,ind)=>  {
        if(obj.productName == val.productName && obj.class === val.class && obj.scool === val.scool && bool == false){
            chosenProducts[ind].cunt2--
            bool = true
        }     
       })
       chosenProducts = chosenProducts.filter((val)=> obj.productName != val.productName || obj.class != val.class || obj.scool != val.scool || bool == false)
       ArrProducts[index].cunt2--
        sum.innerHTML = ArrProducts[index].cunt2
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
    }
  })
  btn1.innerHTML = '+';
  btn2.innerHTML = '-';
  addAndRamoveProduct.setAttribute('id','addAremove')
  addAndRamoveProduct.append(btn1,sum,btn2)
  h1.innerHTML = name
  p.innerHTML = `מחיר : ${price} ₪`
  img.src = imgUrl
  div2.append(h1, p,addAndRamoveProduct);
  // div3.append(div2,div1)
  div.append(div2,img)
  div.setAttribute('class','product');
  document.getElementById('products').append(div)
}


// closeing the sale after the Wednesday


const openSaleF = async ()=>{

  const today = new Date();
  const dayOfWeek = today.getDay();
  const hour = today.getHours()
  let manger = false;


  await fetch('/getManger')
  .then((res)=>res.json())
  .then((data)=>{
        console.log(data);
        manger =  data.openSale
        console.log(data.openSale);
  
      })
  .catch((err)=>{
        console.log(err);
  
      })


      if(dayOfWeek === 2 || (dayOfWeek === 3 && hour < 11) || manger == true){
        // The fetch request is a request to the server that gets back from the server
        // all product existed. 
        fetch('/getProducts')
        .then(res => res.json())
        .then((data) => {
          ArrProducts = data.arrp  
          
          // forEach loop that goes throuh the array of products recieved from the
          // server and enters each product into a new div, which generates
          // a div for each product itself.

          ArrProducts = ArrProducts.map((val)=>{
            if(val.type == false && val.amount < 1){
      
            }
            else{
              let booli = false
              let booc = ''
              chosenProducts.forEach((value)=>{
                if(value.class == val.class && value.scool == val.scool && value.productName  == val.productName){
                  val['cunt2'] =  value.cunt2
                  console.log('ok');
                  booli = true
                  booc =  val    
                }
              })
              if(booli == false){
                console.log('a');
                val['cunt2'] =  0
                return val
              }
              else{
                return booc
              }
              console.log(val);
            }
          })
          ArrProducts.forEach((val,index) => {
            try{
              newDiv(val.productName, val.productPrice,val.productImg,val.class,val.scool,val.index,index)
            }
            catch{
              
            }
          })
        })
        .catch((err) => {
          console.log(err);
        })
      
      }
      else{
        let h1 = document.createElement('h1');
        h1.innerHTML = 'המכירה תפתח ביום שלישי'
        document.getElementById('products').append(h1)  
      }

}

openSaleF()




 





// The function for the Sort button, the function outputs the value selected
// in the select and arranges the products on the site accordingly.
const sort = () => {
  let nameOrPrice = document.getElementById('select_sort').value;
  if (nameOrPrice == 'price') {
    ArrProducts = ArrProducts.sort((a, b) => b.productPrice - a.productPrice);
  }
  else {
    ArrProducts = ArrProducts.sort((a, b) => (b.productName < a.productName) ? 1 : -1);
  }
  document.getElementById('products').innerHTML = ''
  ArrProducts.forEach((val,index) => {
    newDiv(val.productName, val.productPrice,val.productImg,val.class,val.scool,val.index,index)  })
}

const byClass = () =>{
  let class3 = document.getElementById('byClass').value;
  if (class3 == '') {
    document.getElementById('products').innerHTML = ''
    ArrProducts.forEach((val,index) => {
      newDiv(val.productName, val.productPrice,val.productImg,val.class,val.scool,val.index,index)    })

  }
  else{
    let arr = []
    
    ArrProducts.forEach((val,index) => {
      console.log(class3);
      
        try{
          if(val.class == class3){
            arr.push([val,index])
            console.log('ok');
          }
        }
        catch{

        }
      
      })
      document.getElementById('products').innerHTML = ''
      arr = arr.sort((a,b)=>a[0].index-b[0].index)
      console.log(arr);
      arr.forEach((val) => {
        newDiv(val[0].productName, val[0].productPrice, val[0].productImg,val[0].class,val[0].scool,val[0].index,val[1])
      })
  }
}

// A search function that is connected to HTML
// using on input and filters the array of products by filter
// loop with the use of Index Of.
const search = () => {
  let userInput = document.getElementById('searchInpt').value;
  let ArrProductsSearch = []
  console.log(ArrProducts);
  ArrProducts.forEach((val,index)=>{
    try{
      let a = val.productName
      if (a.indexOf(userInput) != -1){
        ArrProductsSearch.push([val,index])
      }
    }
    catch{

    }
  })
  document.getElementById('products').innerHTML = ''
  ArrProductsSearch.forEach((val) => {
    newDiv(val[0].productName, val[0].productPrice, val[0].productImg,val[0].class,val[0].scool,val[0].index,val[1])  })
}

const back = () =>{
  location.href = '/scool'
}
// A request function that takes the array pf selected products
// and saves it on the browser in Local Storage which moves the user 
// to the purchase page.
const buy = () => {
  
  let checkNumber = false 
  chosenProducts.forEach((val)=>{
    if(val.cunt2 >= 2){
      checkNumber = true
    }
  })


  if(chosenProducts.length > 2 || checkNumber == true){
    location.href = '/buy';
  }
  else{
    alert(' (מינימום הזמנה 2 מוצרים) לא נבחרו מספיק מוצרים')
  }
  
}

