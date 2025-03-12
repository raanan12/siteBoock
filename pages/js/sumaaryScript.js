tutal = localStorage.getItem('tiutlPric')
document.getElementById('tutal').innerHTML = tutal
let userFon = sessionStorage.getItem('fon')

const XL = () =>{
    fetch('/myPading',{
        headers: { "Accept": 'application/json', 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({
          fon:userFon
        })
      })
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