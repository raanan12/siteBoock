// First Page

// Transformation to the Sign-up Page 
const transferPage = () => {
    location.href = '/signup'
  }
  
  
  // This function checks for validation info such as email and password
  const checkValidUser = () => {
    let emailUser = document.getElementById('emailUser').value;
    let foneUser = document.getElementById('foneUser').value;
    if (emailUser.indexOf('@') == -1) {
      alert('אימייל לא תקין ')
    }
    else if (foneUser.length != 10) {
      alert('מספר פאלפון לא תקין')
    }
    else {
      // Fetch sends a request to the server, and the user's email and password
      // are located in the body of the request. The server performs a check, and if the user exist,
      // it returns true and the user's name. If the user does not exist, it returns
      // the user an alert that the user does not exist.
      // also making an transformation from object to json
      fetch('/check', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
          emailUser,
          foneUser
        })
      })
  
        .then(res => res.json())
  
        .then((data) => {
          if (data.result == true) {
            userConnected = data.name
            fon = data.fon
            localStorage.setItem('user', userConnected)
            localStorage.setItem('fon', fon)
            let chosenProducts = [];
            localStorage.setItem('chosenProducts', JSON.stringify(chosenProducts));
            location.href = '/products'
          }
          else {
            alert('אינך רשום עדין להרשמה לחצו על כפטור  "הרשמה" בתחתית המסך')
          }
  
        })
        .catch((err) => {
          console.log(err);
        })
  
    }
  }
  
  
  // --------------------------------
  
  // Second Page
  
  // This function meant to add a new user and also validations such as
  // password lengths, Special characters and user lengths.
  const addUser = () => {
    console.log('pppp');
    
    let userFamayl = document.getElementById('famayl').value;
    let userName = document.getElementById('nameUser').value;
    let userEmail = document.getElementById('emailUser').value;
    let userFone = document.getElementById('foneUser').value;
    let adress = document.getElementById('adress').value;
    if(userFamayl.length <2){
      alert('לא הוכנס שם משפחה')
    }
    if (userName.length < 2) {
      alert('לא הוכנס שם פרטי')
    }
    else if (userEmail.indexOf('@') == -1) {
      alert('מייל לא תקין')
    }
    else if (userFone.length != 10) {
      alert('מספר פאלפון לא תקין ')
    }
    else if (document.getElementById('check').checked == false){
      alert('לא אושר התקנון ')
    }
    else if(adress.length < 10){
      alert('הכתובת לא חוקית')
    }
    else {
      userConnected = {
        userFamayl,
        userName,
        userEmail,
        userFone,
        adress
      }

     
      localStorage.setItem('user', userConnected)
      localStorage.setItem('fon',userFone )
      localStorage.setItem('user', userFamayl + " " + userName)
      localStorage.setItem('adress',adress)
      location.href = '/buy'


  
    }
  
  }
  
  
  // --------------------------------
  // Third Page
  // is on ivdividual JS file
  
  
  
  // --------------------------------
  // Fourth Page
  // is on ivdividual JS file