const http=require("http");
const fs=require("fs");
const requests = require("requests");
        
const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min); 
    temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    return temperature;
}

const server=http.createServer((req,res)=>{
    if(req.url==="/")
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=b7a9df008ad6acf59cd8e9414348b884")
        .on('data', (chunk) => {
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];
         // console.log(arrData[0].main.temp);
         const realTimeData=arrData.map((val) => replaceVal(homeFile,val)).join(""); // after this it will convert into html page (most important line)
         //console.log(realTimeData);
         res.write(realTimeData);
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
        res.end();
       });
    }
});

server.listen(8000,"127.0.0.1");
