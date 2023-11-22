let http = require("http");
let url = require("url");
let fs = require("fs");

var server = http.createServer(gestisciRichieste);
server.listen(1337);
console.log("Il server è stato avviato !1337!");

function gestisciRichieste(richiesta, risposta){
    let indirizzo = richiesta.headers.host + richiesta.url;
    let info = url.parse(indirizzo, true);
    let risorsa = info.pathname;
    let file;
    let parola = "";
    switch(risorsa){
        case "/":
            file = fs.readFileSync("index.html");
            risposta.writeHead(200, {"Content-Type":"text/html"});
            risposta.write(file);
            risposta.end();
            break;
        case "/index.css":
            file = fs.readFileSync("index.css");
            risposta.writeHead(200, {"Content-Type":"text/css"});
            risposta.write(file);
            risposta.end();
            break;
        case "/index.js":
            file = fs.readFileSync("index.js");
            risposta.writeHead(200, {"Content-Type":"text/javascript"});
            risposta.write(file);
            risposta.end();
            break;

        case "/aggiungiPartita":
            //PASSAGGIO DEI PARAMETRI IN GET all'interno dell'intestazione del pacchetto
            let parametri = info.query;
            console.log(parametri.dati);
            aggiungiPartita("dati.json", JSON.stringify(parametri.dati), risposta);
            break;

        case "/cercaWord":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                // console.log(parola);
                let obj={parole:[]}
                let array = new Array();
                
                file = JSON.parse(fs.readFileSync("diz.json"));
                for(let i in file){
                    if(file[i].desc.includes(parola))
                    {
                        // console.log(file[i]);
                        array.push(file[i].desc)
                    }
                }

                // console.log(array);
                obj.parole.push(array);

                // console.log(obj.parole);

                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(obj));
                risposta.end();
            });
        break;

        case "/cercaSettore":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                // console.log(parola);
                let settore = parola;

                let obj={parole:[]}
                let array = new Array();
                
                file = JSON.parse(fs.readFileSync("diz.json"));
                for(let i in file){
                    if(file[i].settore == settore)
                    {
                        // console.log(file[i]);
                        array.push(file[i].desc)
                    }
                }

                // console.log(array);
                obj.parole.push(array);

                // console.log(obj.parole);

                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(obj));
                risposta.end();
            });
        break;

        case "/add":

            let objJ="";

            richiesta.on("data", (dato)=>{
                objJ += dato;
            });

            richiesta.on("end", ()=>{
                
                let s = JSON.parse(objJ);

                file = JSON.parse(fs.readFileSync("diz.json"));

                for(i in file)
                {
                    if(file[parseInt(i)+1]==undefined && file[parseInt(i)+7]==undefined && file[parseInt(i)+13]==undefined)
                    {
                        s.settoriPadreJson="["+(parseInt(i)+1)+","+s.settore+"]";
                        file[parseInt(i)+1]=s
                    }
                }
                


                

                fs.writeFile("diz.json", JSON.stringify(file), (err)=>{
                    if(err){
                        risposta.writeHead(500, {"Content-type":"application/json"});
                        let json = {desc:"Errore nel salvataggio"};
                        risposta.write(JSON.stringify(json));
                        risposta.end();
                    }else{
                        risposta.writeHead(200, {"Content-type":"application/json"});
                        let json = {desc:"Salvataggio avvenuto con successo"};
                        risposta.write(JSON.stringify(json));
                        risposta.end();
                    }
                });
            });
        break;

        case "/loadSettori":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                // console.log(parola);
                let obj={settore:[]}
                let array = new Array();
                let f;
                
                file = JSON.parse(fs.readFileSync("diz.json"));
                for(let i in file){
                    if(file[i].settore==null)
                    {
                        let thing=[i,file[i].desc]
                        array.push(thing);
                    }
                }

                obj.settore.push(array);

                // console.log(obj.settore)


                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(obj));
                risposta.end();
            });
        break;
    }
}