var allSettori;

window.onload= async function(){
    caricaSettori();
    document.getElementById("btnCercaTesto").addEventListener("click",()=>{
      btnCercaTesto();
    });
    document.getElementById("btnCercaSettore").addEventListener("click",()=>{
      btnCercaSettore();
    });
    document.getElementById("btnInserisci").addEventListener("click",()=>{
      btnInserisci();
    });
    
}

async function btnCercaTesto()
{
  let _listaParole=document.getElementById("listaParole");
  _listaParole.innerHTML="";

  let a = document.getElementById("txtCerca").value;
  document.getElementById("txtCerca").value = "";
  let busta = await fetch("http://localhost:1337/cercaWord", 
    {
      "method":"POST",
      "headers":{"Content-Type":"application/json"},
      "body":a
    });
    let risposta = await busta.json();
  console.log(risposta.parole[0]);

  

  for(Element of risposta.parole[0])
  {
    let b =document.createElement("li")
    b.innerText=Element;
    _listaParole.appendChild(b);
  }
}

async function caricaSettori()
{
  let busta = await fetch("http://localhost:1337/loadSettori", 
    {
      "method":"POST"
    });
    let risposta = await busta.json();
  console.log(risposta.settore);
  _select=document.getElementById("selSettori");
  _select1=document.getElementById("sel");
  for(Element of risposta.settore[0]){
    let _option=document.createElement("option");
    _option.innerText=Element[1];
    _select.appendChild(_option);
  }
  for(Element of risposta.settore[0]){
    let _option=document.createElement("option");
    _option.innerText=Element[1];
    _select1.appendChild(_option);
  }

  allSettori=risposta.settore[0];

}

async function btnCercaSettore()
{
  let _listaParole=document.getElementById("listaParole");
  _listaParole.innerHTML="";

  let a = document.getElementById("selSettori").value;
  let n = "";

  for(Element of allSettori){
    if(a==Element[1])
    {
      n=Element[0];
    }
  }

  let busta = await fetch("http://localhost:1337/cercaSettore", 
    {
      "method":"POST",
      "headers":{"Content-Type":"application/json"},
      "body":n
    });
    let risposta = await busta.json();
  console.log(risposta.parole[0]);

  for(Element of risposta.parole[0])
  {
    let b =document.createElement("li")
    b.innerText=Element;
    _listaParole.appendChild(b);
  }


}

async function btnInserisci()
{
  let _listaParole=document.getElementById("listaParole");
  _listaParole.innerHTML="";

  let a = document.getElementById("sel").value;
  let n = "";

  for(Element of allSettori){
    if(a==Element[1])
    {
      n=Element[0];
    }
  }

  let w = document.getElementById("txtParolaNuova").value;
  document.getElementById("txtParolaNuova").value = "";


  let obj = {
    desc:w,
    settore:n,
    settoriPadreJson:null
  }

  // console.log(obj);


  let busta = await fetch("http://localhost:1337/add", 
    {
      "method":"POST",
      "headers":{"Content-Type":"application/json"},
      "body":JSON.stringify(obj)
    });
  let risposta = await busta.json();
  console.log(risposta.desc);

  // for(Element of risposta.parole[0])
  // {
  //   let b =document.createElement("li")
  //   b.innerText=Element;
  //   _listaParole.appendChild(b);
  // }
}