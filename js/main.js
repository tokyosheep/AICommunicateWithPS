window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const PSURL = "http://localhost:8000/";
    const AIURL = "http://localhost:3000/";
    
    const http = require("http");
    const fs = require("fs");
    const url = require("url");
    const ejs = require("ejs");
    
    const toPS = document.getElementById("toPS");
    
    const indexPage = fs.readFileSync(`${extensionPath}/ejs/index.ejs`,"utf8");
    
    const server = http.createServer((req,res)=>{
        const url_parts = url.parse(req.url);
        switch(url_parts.pathname){
            case "/":
                if(req.method == "GET"){
                    const content = ejs.render(indexPage,{
                        title:"Illustrator server listening",
                        content:"from Ai"
                    });
                    res.writeHead(200,{"Content-Type":"text/html"});
                    res.write(content);
                    res.end();
                }else if(req.method == "POST"){
                    let body = "";
                    req.on("data",chunk=>{
                        body += chunk;
                    });
                    req.on("end",response=>{
                        response = JSON.parse(body);
                        PlacedImages(response);
                        res.end();
                    });
                }else{
                    alert("error");
                }
            break;
                
            default:
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.end("no page...");
                break;
        }
    });
    
    server.listen(3000);
    
    toPS.addEventListener("click",connectServer);
    
    async function connectServer(){
        const images = await getPlacedItem().catch(error => alert(error));
        fetch(PSURL,{
            method:"POST",
            body:JSON.stringify(images),
            headers:{"Content-Type": "application/json"}
        })
        .then(res => console.log(res))
        .catch(error => alert(error));
        
        function getPlacedItem(){
            return new Promise((resolve,reject)=>{
                csInterface.evalScript(`$.evalFile("${extensionRoot}getPlacedImg.jsx")`,(o)=>{
                    if(o === "false"){
                       reject("the image is invalid");
                    }
                    const images = JSON.parse(o);
                    resolve(images);
                });
            });
        }
    }//end of connectServer
    
    function PlacedImages(array){
        csInterface.evalScript(`placeImg(${JSON.stringify(array)})`,()=>{
            alert("placed Images");
        });
    }
    
    
    
}
    
