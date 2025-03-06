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
    let famayl = document.getElementById('famayl').value;
    let nameUser = document.getElementById('nameUser').value;
    let emailUser = document.getElementById('emailUser').value;
    let foneUser = document.getElementById('foneUser').value;
    if(famayl.length <2){
      alert('לא הוכנס שם משפחה')
    }
    if (nameUser.length < 2) {
      alert('לא הוכנס שם פרטי')
    }
    else if (emailUser.indexOf('@') == -1) {
      alert('מייל לא תקין')
    }
    else if (foneUser.length != 10) {
      alert('מספר פאלפון לא תקין ')
    }
    else if (document.getElementById('check').checked == false){
      alert('לא אושר התקנון ')
    }
    else {
  
      // This fetch request send to the server the user info such as Email and Password
      // And then transfer them to the server, The server check if the sertion info does not
      // exist to other user and if it does not exist it add the user to the system and 
      // returns True as a result and if not it will return an alert to the user as False.
      fetch('/addUser', {
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
          famayl,
          nameUser,
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
            alert('המשתמש קיים כבר במערכת אתה מוזמן להתחבר מעמוד ההתחברות ')
          }
  
        })
        .catch((err) => {
          console.log(err);
        })
  
    }
  
  }
  
  
  // --------------------------------
  // Third Page
  // is on ivdividual JS file
  
  
  
  // --------------------------------
  // Fourth Page
  // is on ivdividual JS file