var inputSlider=document.querySelector("[data-lengthSlider]");
var lengthDisplay=document.querySelector("[data-lengthNumber]");
var passwordDisplay=document.querySelector("[data-passwordDisplay]");
var copyBtn=document.querySelector("[data-copy]");
var copyMsg=document.querySelector("[data-copyMsg]");
var uppercaseCheck=document.querySelector("#uppercase");
var lowercaseCheck=document.querySelector("#lowercase");
var numbersCheck=document.querySelector("#numbers");
var symbolsCheck=document.querySelector("#symbols");
var indicator=document.querySelector("[data-indicator]");
var generateBtn=document.querySelector(".generatebutton");
var allCheckBox=document.querySelectorAll("input[type=checkbox]");

var password="";
var passwordLength=10;
var checkCount=0;
var symbols='`~!@#$%^&*()+=][}{\|";:/?><,.';
handleSlider();
//set strength circle color to gray

//set password length
setIndicator("#ccc");
function handleSlider()
{
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    var min=inputSlider.min;
    var max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "%100%";
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
    var ans=Math.floor(Math.random()*(max-min))+min;
    return ans;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
   return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase()
{
   return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols()
{
    var len=symbols.length;
    var ans=getRndInteger(0,len);
    var ch=symbols.charAt(ans);
    return ch;
}

function calculateStrength()
{
     var hasUpper=false;
     var hasLower=false;
     var hasNumber=false;
     var hasSymbol=false;
     if(uppercaseCheck.checked) hasUpper=true;
     if(lowercaseCheck.checked) hasLower=true;
     if(numbersCheck.checked) hasNumber=true;
     if(symbolsCheck.checked) hasSymbol=true;

     if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8)
     setIndicator("red");
     else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6)
     {
        setIndicator("green");
     }
     else
     setIndicator("yellow");
}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>
{
    if(passwordDisplay.value)
    copyContent();
});

function handleCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

    //special condition
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach ( (checkbox)=> {
    checkbox.addEventListener('change',handleCheckBoxChange);
})


function shufflePassword(shufflePass)
{
    //Fisher Yates Method for shuffling array
    for(var i=shufflePass.length-1;i>0;i--)
    {
        var j=Math.floor(Math.random()*(i+1));
        var temp=shufflePass[i];
        shufflePass[i]=shufflePass[j];
        shufflePass[j]=temp;
    }
    let str="";
    shufflePass.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>{
    //none chkbox is selected
    console.log("journey started");
    if(checkCount<=0) return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

    // journey to find new password
    password="";
    // if(uppercaseCheck.checked)
    // {
    //     var ch=generateUpperCase();
    //     password+=ch;
    // }
    // else if(lowercaseCheck.checked)
    // {
    //     var ch=generateLowerCase();
    //     password+=ch;
    // }
    // else if(numbersCheck.checked)
    // {
    //     var ch=generateRandomNumber();
    //     password+=ch;
    // }
    // else if(symbolsCheck.checked)
    // {
    //     var ch=generateSymbols();
    //     password+=ch;
    // }

    //another cool Method
    var funcArr=[];
    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUpperCase);  //function ko hi push kr dijeye
    }
    if(lowercaseCheck.checked)
    {
        funcArr.push(generateLowerCase);  //function ko hi push kr dijeye
    }
    if(numbersCheck.checked)
    {
        funcArr.push(generateRandomNumber);  //function ko hi push kr dijeye
    }
    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbols);  //function ko hi push kr dijeye
    }
    
    //compulsory addition
    for(var i=0;i<funcArr.length;i++)
    {
        password+=funcArr[i]();
    }
    console.log("Compulsory condition handle")
    //remainig addition
    for(var i=0;i<passwordLength-funcArr.length;i++)
    {
        var ans=getRndInteger(0,funcArr.length);
        password+=funcArr[ans]();
    }
    console.log("Remainig condition handle")

    //shuffle the password
    password=shufflePassword(Array.from(password));//Array.from() method returns an array
    console.log("pass shuffle")
    //show UI
    passwordDisplay.value=password;
    console.log("Display done");
    //calculate Strength
    calculateStrength();
});