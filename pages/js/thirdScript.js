// Third Page

// Global variable of an array that saves the selected product inside
let chosenProducts = JSON.parse(localStorage.getItem('chosenProducts')) || [];
let ArrProducts = [];

// This function creating the div tag each div contains only one product such as 
// product name, product price and product img.
const newDiv = (name, price, imgUrl, class5, scool, indexProdu, index) => {
  let div = document.createElement('div');
  let addAndRamoveProduct = document.createElement('div');
  let div2 = document.createElement('div');
  let h1 = document.createElement('h1');
  let p = document.createElement('p');
  let sum = document.createElement('p');
  let img = document.createElement('img'); 
  let btn1 = document.createElement('button');
  let btn2 = document.createElement('button');

  sum.innerHTML = ArrProducts[index].cunt2;

  btn1.addEventListener('click', () => {
    let obj = {
      class: class5,
      productName: name,
      productPrice: price,
      productImg: imgUrl,
      scool: scool,
      index: indexProdu,
      cunt2: 1
    };

    if (ArrProducts[index].type == false) {
      if (ArrProducts[index].cunt2 != ArrProducts[index].amount) {
        chosenProducts.push(obj);
        ArrProducts[index].cunt2++;
        sum.innerHTML = ArrProducts[index].cunt2;
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
      }
    } else {
      let bool = false;
      chosenProducts.forEach((val, ind) => {
        if (obj.productName === val.productName && obj.class === val.class && obj.scool === val.scool) {
          chosenProducts[ind].cunt2++;
          bool = true;
          ArrProducts[index].cunt2++;
          sum.innerHTML = ArrProducts[index].cunt2;
          localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
        }
      });
      if (!bool) {
        chosenProducts.push(obj);
        ArrProducts[index].cunt2++;
        sum.innerHTML = ArrProducts[index].cunt2;
        localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
      }
    }
  });

  btn2.addEventListener('click', () => {
    let obj = {
      class: class5,
      productName: name,
      productPrice: price,
      productImg: imgUrl,
      scool: scool,
      index: indexProdu
    };

    if (ArrProducts[index].cunt2 > 1) {
      let bool = false;
      chosenProducts.forEach((val, ind) => {
        if (obj.productName == val.productName && obj.class === val.class && obj.scool === val.scool && !bool) {
          chosenProducts[ind].cunt2--;
          bool = true;
        }
      });

      ArrProducts[index].cunt2--;
      sum.innerHTML = ArrProducts[index].cunt2;
      localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
    } else if (ArrProducts[index].cunt2 == 1) {
      let bool = false;
      chosenProducts.forEach((val, ind) => {
        if (obj.productName == val.productName && obj.class === val.class && obj.scool === val.scool && !bool) {
          chosenProducts[ind].cunt2--;
          bool = true;
        }
      });
      chosenProducts = chosenProducts.filter((val) =>
        obj.productName != val.productName || obj.class != val.class || obj.scool != val.scool
      );
      ArrProducts[index].cunt2--;
      sum.innerHTML = ArrProducts[index].cunt2;
      localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
    }
  });

  btn1.innerHTML = '+';
  btn2.innerHTML = '-';
  addAndRamoveProduct.setAttribute('id', 'addAremove');
  addAndRamoveProduct.append(btn1, sum, btn2);
  h1.innerHTML = name;
  p.innerHTML = `מחיר : ${price} ₪`;
  img.src = imgUrl;
  div2.append(h1, p, addAndRamoveProduct);
  div.append(div2, img);
  div.setAttribute('class', 'product');
  document.getElementById('products').append(div);
};

// Closeing the sale after the Wednesday
const openSaleF = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const hour = today.getHours();
  let manger = false;

  await fetch('/getManger')
    .then((res) => res.json())
    .then((data) => {
      manger = data.openSale;
    })
    .catch((err) => console.log(err));

  if (dayOfWeek === 2 || (dayOfWeek === 3 && hour < 11) || manger === true) {
    fetch('/getProducts')
      .then((res) => res.json())
      .then((data) => {
        ArrProducts = data.arrp;

        ArrProducts = ArrProducts.map((val) => {
          if (val.type === false && val.amount < 1) {
            return null;
          }

          let found = false;
          chosenProducts.forEach((value) => {
            if (
              value.class == val.class &&
              value.scool == val.scool &&
              value.productName == val.productName
            ) {
              val.cunt2 = value.cunt2;
              found = true;
            }
          });

          if (!found) {
            val.cunt2 = 0;
          }

          return val;
        });

        // סינון מוצרים שהוחזרו כ-null
        ArrProducts = ArrProducts.filter(val => val !== null && val !== undefined);

        ArrProducts.forEach((val, index) => {
          try {
            newDiv(val.productName, val.productPrice, val.productImg, val.class, val.scool, val.index, index);
          } catch (err) {
            console.log(err);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    let h1 = document.createElement('h1');
    h1.innerHTML = 'המכירה תפתח ביום שלישי';
    document.getElementById('products').append(h1);
  }
};

openSaleF();

// Sort by name or price
const sort = () => {
  let nameOrPrice = document.getElementById('select_sort').value;
  if (nameOrPrice == 'price') {
    ArrProducts = ArrProducts.sort((a, b) => b.productPrice - a.productPrice);
  } else {
    ArrProducts = ArrProducts.sort((a, b) => (b.productName < a.productName ? 1 : -1));
  }
  document.getElementById('products').innerHTML = '';
  ArrProducts.forEach((val, index) => {
    newDiv(val.productName, val.productPrice, val.productImg, val.class, val.scool, val.index, index);
  });
};

// Filter by class
const byClass = () => {
  let class3 = document.getElementById('byClass').value;
  document.getElementById('products').innerHTML = '';

  if (class3 == '') {
    ArrProducts.forEach((val, index) => {
      newDiv(val.productName, val.productPrice, val.productImg, val.class, val.scool, val.index, index);
    });
  } else {
    let arr = [];

    ArrProducts.forEach((val, index) => {
      try {
        if (val.class == class3) {
          arr.push([val, index]);
        }
      } catch {}
    });

    arr = arr.sort((a, b) => a[0].index - b[0].index);
    arr.forEach((val) => {
      newDiv(val[0].productName, val[0].productPrice, val[0].productImg, val[0].class, val[0].scool, val[0].index, val[1]);
    });
  }
};

// Search by product name
const search = () => {
  let userInput = document.getElementById('searchInpt').value;
  let ArrProductsSearch = [];

  ArrProducts.forEach((val, index) => {
    try {
      if (val.productName.indexOf(userInput) != -1) {
        ArrProductsSearch.push([val, index]);
      }
    } catch {}
  });

  document.getElementById('products').innerHTML = '';
  ArrProductsSearch.forEach((val) => {
    newDiv(val[0].productName, val[0].productPrice, val[0].productImg, val[0].class, val[0].scool, val[0].index, val[1]);
  });
};

// Back to previous page
const back = () => {
  location.href = '/scool';
};

// Buy selected products
const buy = () => {
  let checkNumber = false;
  chosenProducts.forEach((val) => {
    if (val.cunt2 >= 2) {
      checkNumber = true;
    }
  });

  // if (chosenProducts.length == 0) {
  //   alert(' (מינימום הזמנה 2 מוצרים) לא נבחרו מספיק מוצרים');
  // } else {
  // if (chosenProducts.length >= 2 || checkNumber || chosenProducts[0].productName.includes("באנדל")) {
  //     location.href = '/buy';
  //   } else {
  //     alert(' (מינימום הזמנה 2 מוצרים) לא נבחרו מספיק מוצרים');
  //   }
  // }

  if (chosenProducts.length == 0) {
    alert('לא נבחרו מספיק מוצרים');
  } else if(chosenProducts.length > 0 ) {
    location.href = '/buy';
  }
};
