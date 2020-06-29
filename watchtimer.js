//基本定义
function $(id){
    return document.getElementById(id);
}


function $$(Class){
    return document.getElementsByClassName(Class);
}


var showNum=(num)=>{
    if(num<10)
        return "0"+num;
    return num;
}


//参数设置
var JetLagConfig=[-8,-13,0];
var colorBlue="rgb(49, 114, 255)";
var colorGrey="#999";


//窗口初始化
onload=function(){
    tableArray=$$("city");
    dateArray=$$("otherdate");
    cityTimeArray=$$("citytime");

    clockActive();
}


//时钟部分

//变量定义
var localtime=new Date();
var year;
var month;
var day;
var hour;
var minute;
var second;
var dateArray;
var cityTimeArray;
var datetimer;

//启动时钟
function clockActive(){
    $$("tab")[0].style.color=colorBlue;
    $$("tab")[1].style.color=colorGrey;
    $("stopwatch").style.display="none";
    $("clock").style.display="block";
    showClockTime(true);
    datetimer=setInterval(showClockTime,1000);
}


//停止时钟
function stopwatchActive(){
    $$("tab")[1].style.color=colorBlue;
    $$("tab")[0].style.color=colorGrey;
    $("clock").style.display="none";
    $("stopwatch").style.display="block";
    clearInterval(datetimer);
}


//显示时钟时间
function showClockTime(flag=false){
    localtime=new Date()
    year=localtime.getFullYear();
    month=localtime.getMonth()+1;
    day=localtime.getDate();
    hour=localtime.getHours();
    minute=localtime.getMinutes();
    second=localtime.getSeconds();
    $("localtime").innerHTML=showNum(hour)+":"+showNum(minute)+":"+showNum(second);
    if(flag||(hour==0&&minute==0&&second==0))
       $("localdate").innerHTML="本地时间: "+year+"年"+showNum(month)+"月"+showNum(day)+"日";
    
    for(var i=0;i<JetLagConfig.length;i++)
    {
        var otherDay=day;
        var otherHour=hour+JetLagConfig[i];
        if(otherHour>24)
        {
            otherHour-=24;
            otherDay++;
        }
        else if(hour+JetLagConfig[i]<0)
        {
            otherHour+=24;
            otherDay--;
        }
        if(flag||second==0)
            cityTimeArray[i].innerHTML=showNum(otherHour)+":"+showNum(minute);
        if(flag||(hour==0&&minute==0&&second==0))
            dateArray[i].innerHTML=month+"月"+otherDay+"日"+"&nbsp;";
    }
}   


//选择时间
function selectTime(tableIndex){
    var dateline=$$("dateline");
    for(var i=0;i<tableArray.length;i++)
    {
        if(i!=tableIndex||tableArray[i].style.color==colorBlue)
        {
            tableArray[i].style.color="white";
            dateline[i].style.color=colorGrey;

        }
        else
        {
            dateline[i].style.color=colorBlue;
            tableArray[i].style.color=colorBlue;
        }
    }
}


//秒表部分

//变量定义
var timer=null;
var timeMiSec=0;
var timeSec=0;
var timeMin=0;
var littleDeg=0;
var bigDeg=0;
var endTimer=null;
var flagTime=[];

//显示时间
function showStopTime(){
    $("stoptime").innerHTML=showNum(timeMin)+":"+showNum(timeSec)+"."+showNum(timeMiSec);
}


//开始计时
function play(){
    if(endTimer)
        clearInterval(endTimer);
    timer=setInterval(addTime,10);
    $("stopbutton").style.display="none";
    $("playbutton").style.display="none";
    $("flagbutton").style.display="block";
    $("pausebutton").style.display="block";
    $("pausewatch").style.display="none";
    $("playwatch").style.display="block";
}


//时间递增
function addTime(){
    timeMiSec++;
    if(timeMiSec==100)
    {
        timeMiSec=0;
        timeSec++;
    }
    if(timeSec==60)
    {
        timeSec=0;
        timeMin=(timeMin+1)%100;
    }
    showStopTime(); 
    watchRotate();
    watchRotate();
}


//表盘旋转
function watchRotate(){
    littleDeg=(littleDeg+1.8)%360;
   
    if(!timeMiSec)
    {
        bigDeg=(bigDeg+3)%360;
        $("playwatch").style.transform="rotate("+bigDeg+"deg)";   
    }
    $("littlewatch").style.transform="translate(-50%,0) rotate("+littleDeg+"deg)";
}


//暂停按钮
function pause(){
    clearInterval(timer);
    showStopTime();
    $("flagbutton").style.display="none";
    $("pausebutton").style.display="none";
    $("stopbutton").style.display="block";
    $("playbutton").style.display="block";
    $("pausewatch").style.display="block";
    $("playwatch").style.display="none";
    $("pausewatch").style.transform="rotate("+bigDeg+"deg)";
}


//停止按钮
function stop(){
    watchBack();
    timeMiSec=timeMin=timeSec=0;
    showStopTime();
    $("stopbutton").style.display="none";
    var flags=$("flags");
    for(var i=flags.childNodes.length-1;i>=0;i--)
        flags.removeChild(flags.childNodes[i]);
    count=0;
    preMinSec=preSec=preMin=0;
}


//表盘恢复动画
function watchBack()
{
    var bigTimer=setInterval(function(){ 
        bigDeg-=6;
        $("pausewatch").style.transform="rotate("+bigDeg+"deg)";
    },30);
    var littleTimer=setInterval(function(){
        littleDeg-=10;
        $("littlewatch").style.transform="translate(-50%,0) rotate("+littleDeg+"deg)";
    },20);
    endTimer=setInterval(function(){
        if(bigDeg<=0)
        {
            clearInterval(bigTimer);
            bigDeg=0;
            $("playwatch").style.transform="rotate("+bigDeg+"deg)";
        }
        if(littleDeg<=0)
        {
            clearInterval(littleTimer);
            littleDeg=0;
            $("littlewatch").style.transform="translate(-50%,0) rotate("+littleDeg+"deg)";
        } 
    },20); 
}

var count=0;
var preMinSec=0;
var preSec=0;
var preMin=0;


//计时插桩按钮
function setFlag(){
    var flag=0;
    count++;
    var stepMin,stepSec,stepMinSec;
    stepMinSec=timeMiSec-preMinSec;
    preMinSec=timeMiSec;
    if(stepMinSec<0)
    {
        stepMinSec+=100;
        flag=1;
    }
    stepSec=timeSec-preSec-flag;
    preSec=timeSec;
    if(preSec<0)
    {
        preSec+=60;
        flag=1;
    }
    else
        flag=0;
    stepMin=timeMin-preMin-flag;
    preMin=timeMin;

    var dest=$("flags");
    var divline=document.createElement("div");
    var span1=document.createElement("span");
    var span2=document.createElement("span");
    span1.innerHTML=showNum(count)+"&nbsp;&nbsp; +"+showNum(stepMin)+":"+showNum(stepSec)+"."+showNum(stepMinSec);
    span2.innerHTML="&nbsp;&nbsp;"+showNum(timeMin)+":"+showNum(timeSec)+"."+showNum(timeMiSec)+"<br>";
    span2.style.color="white";
    span1.animate([
        {color:"white"},
        {color:colorGrey}
    ],{
        duration:1000
    })
    divline.appendChild(span1);
    divline.appendChild(span2);
    if(!dest.firstChild)
        dest.appendChild(divline);
    else
        dest.insertBefore(divline,dest.firstChild);
}


//新增计时插桩动画
function flagChangeColor(span)
{
    span.style.transition="color 0.8s "
    span.style.color=colorGrey;
}