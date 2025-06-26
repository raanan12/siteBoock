let tutal = localStorage.getItem('tiutlPric')
let adress = localStorage.getItem('adress')
document.getElementById('tutal').innerHTML = tutal
document.getElementById('adtess').innerHTML = adress

let userFon = localStorage.getItem('id')

const XL = () =>{
  fetch('/myPadingPDF', {
    headers: {
      "Accept": 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ fon: userFon })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("הקובץ לא נוצר (אולי אין נתונים?)");
      }
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pending.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.error(err);
      alert("שגיאה בהורדה: " + err.message);
    });
  
}