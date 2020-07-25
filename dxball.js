
lk=String.fromCharCode(116,104,105,115,32,97,112,112,32,119,97,115,32,100,101,118,101,108,111,112,101,100,32,98,121,32,77,100,46,83,104,
    97,104,114,105,97,114,32,75,97,98,105,114,40,49,57,48,50,48,52,41);
var canvas=null,ctx=null,
persecond=1000/30,
balllX=400,
ballY=460,
ballXspd=6,
ballYspd=6,
pedalx=400,
score;
const PDLW=200;
const PDLH=10;
const PEDALFROMEDGE=30;
const brickW=80;
const brickH=20;
const brickcols=10;
const brickGap=2,
brickRows=10;
function rand(){
    var s=['red','green','blue','yellow','orange','pink'];
    return s[Math.floor(Math.random()*s.length)];
}
var brickgrid=new Array(brickcols,brickRows);
console.log(lk);
brickrws();
var colors=[];
for(var n=0;n<brickgrid.length;n++){
    colors.push(rand());
}
function drawbrick(){
    var l=0;
    for(var n=0;n<brickRows;n++){
        for(var k=0;k<brickcols;k++){
            var arrayindex=rowCol(k,n);
            if(brickgrid[arrayindex]){
                colorbox(colors[l],brickW*k,brickH*n,brickW-brickGap,brickH-brickGap);
                l++;
            }
        }
    }
}

function brickrws(){
     brickleft=0;
    for(var n=0;n<brickRows*brickcols;n++){
        brickgrid[n]=true;
        brickleft++;
    }
}

function rowCol(col,row){
    return col+brickcols*row;
}

function mousepos(evt){
    var rect=canvas.getBoundingClientRect();
    var root=document.documentElement;
    var mouseX=evt.clientX-rect.left-root.scrollLeft;
    pedalx=mouseX-PDLH/2;
}

window.onload=function(){
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    canvas.addEventListener("mousemove",mousepos);
    setInterval(update,persecond);
}
function update(){
    move();
    draw();
}
function colorbox(color,x,y,width,height){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,width,height);
}
function circle(color,x,y,radius){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fill();
}
function move(){
    balllX+=ballXspd;
    ballY+=ballYspd;
    if(balllX>canvas.width){
        ballXspd*=-1;
    }
    if(balllX<0){
        ballXspd*=-1;
    }
    if(ballY>canvas.height){
        window.alert("Dead");
        window.location.reload(false);
    }
    if(ballY<0){
        ballYspd*=-1;
    }
    
    var pedaltopy=canvas.height-PEDALFROMEDGE;
    var pedalbtm=pedaltopy+PDLH;
    var pedalLeftx=pedalx;
    var pedalright=pedalLeftx+PDLW;
    var plan=Math.abs(pedalLeftx-pedalright);
    if(ballY>pedaltopy && ballY<pedalbtm && balllX>pedalLeftx && balllX<pedalright){
        var touched=balllX-pedalLeftx;
        ballYspd*=-1;
        if(balllX>pedalLeftx && balllX<=pedalLeftx+plan/2){
            if(ballXspd>0){
                ballXspd=-(touched/100)*20;
                console.log(ballXspd);
            }
            else if(ballXspd==0) ballXspd=1;
        }
        else if(balllX<pedalright && balllX>pedalLeftx+plan/2){
            if(ballXspd<0){
                ballXspd=((touched-100)/100)*20;
            }
        }
        else if(balllX==pedalLeftx+plan/2){
            ballXspd=0;
        }
    }
    brickcontroller();

}

function brickcontroller(){
    var ballbrickcol=Math.floor(balllX/brickW);
    var ballbrickrow=Math.floor(ballY/brickH);
    var brickindexunderball=rowCol(ballbrickcol,ballbrickrow);
    if(ballbrickcol>=0 && ballbrickcol<brickcols && brickRows>=0 && ballbrickrow<brickRows){
        if(brickgrid[brickindexunderball]){
            brickgrid[brickindexunderball]=false;
            
            persecond-=10;
            
            var prevballX= balllX-ballXspd ;
            var prevballY=ballY-ballYspd;
            var prevballCol=Math.floor(prevballX/brickW);
            var prevballRow=Math.floor(prevballY/brickH);
            var bothway=true;
            if(prevballCol!=ballbrickcol){
                var adj=rowCol(prevballCol,ballbrickcol);
                if(!brickgrid[adj]){
                    ballXspd*=-1;
                    bothway=false;
                }
            }
            if(prevballRow!=ballbrickrow){
                var adj=rowCol(prevballRow,ballbrickrow);
                if(!brickgrid[adj]){
                    ballYspd*=-1;
                    bothway=false;
                }
            }
            if(bothway){
                ballXspd*=-1;
                ballYspd*=-1;
                bothway=false;
            }
        } 
    }
}


function draw(){
    colorbox("#000",0,0,canvas.width,canvas.height);
    circle("white",balllX,ballY,10);
    colorbox("white",pedalx,canvas.height-PEDALFROMEDGE,PDLW,PDLH);
    drawbrick();
}
function ballreset(){
    balllX=canvas.width/2;
    ballY=canvas.height/2;
}

