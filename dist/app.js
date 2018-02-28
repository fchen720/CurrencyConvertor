(function(){function Convertor(firstCurrencyVal,secondCurrencyVal,firstCurrencyNam,secondCurrencyNam){var NOTHING=0,FIRST=1,SECOND=2;var DATA_LIFE_SPAN=20000;var lastChanged=NOTHING;var conversion;this.onFinish=null;var currencies={};currencies.store=function(first,second,rate){var newEntry={rate:rate,timeStamp:Date.now()}
if(this[first]){this[first][second]=newEntry}
else{this[first]={[second]:newEntry}}}
function setError(message){this.errorMessage=message;firstCurrencyVal=0;secondCurrencyVal=0;this.onFinish()}
function updateSecondCurrencyValue(){secondCurrencyVal=firstCurrencyVal*conversion}
function updateFirstCurrencyValue(){if(conversion===0){setError("The currency "+firstCurrencyNam+" is worth nothing. Divide by zero error.")}else{firstCurrencyVal=secondCurrencyVal/conversion}}
var updateCurrencyValues=function(){if(lastChanged==FIRST){updateSecondCurrencyValue()}
else if(lastChanged==SECOND){updateFirstCurrencyValue()}
this.onFinish()}.bind(this);var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState==4){if(this.status==200){var temp=JSON.parse(xhr.responseText);var retrievedBaseCurrency=temp.base;var retrievedTargetCurrency=Object.keys(temp.rates)[0];if(retrievedBaseCurrency==firstCurrencyNam&&retrievedTargetCurrency==secondCurrencyNam){conversion=temp.rates[retrievedTargetCurrency];currencies.store(firstCurrencyNam,secondCurrencyNam,conversion);updateCurrencyValues()}}else if(this.status==404){setError('Could not reach server')}}};function applyNewCurrencies(){var cacheObj=currencies[firstCurrencyNam];if(firstCurrencyNam==secondCurrencyNam){conversion=1;updateCurrencyValues()}
else if(cacheObj&&cacheObj[secondCurrencyNam]){var currentEntry=cacheObj[secondCurrencyNam];if(Date.now()-currentEntry.timeStamp>=DATA_LIFE_SPAN){sendXhrRequest()}else{conversion=currentEntry.rate;updateCurrencyValues()}}
else{sendXhrRequest()}}
function sendXhrRequest(){xhr.open("GET","https://api.fixer.io/latest?symbols="+firstCurrencyNam+","+secondCurrencyNam+"&base="+firstCurrencyNam);xhr.send()}
sendXhrRequest();Object.defineProperty(this,"firstCurrencyValue",{get:function(){return firstCurrencyVal},set:function(newValue){firstCurrencyVal=newValue;lastChanged=FIRST;updateCurrencyValues()}});Object.defineProperty(this,"secondCurrencyValue",{get:function(){return secondCurrencyVal},set:function(newValue){secondCurrencyVal=newValue;lastChanged=SECOND;updateCurrencyValues()}});Object.defineProperty(this,"firstCurrencyName",{get:function(){return firstCurrencyNam},set:function(newValue){firstCurrencyNam=newValue;lastChanged=FIRST;applyNewCurrencies()}});Object.defineProperty(this,"secondCurrencyName",{get:function(){return secondCurrencyNam},set:function(newValue){secondCurrencyNam=newValue;lastChanged=SECOND;applyNewCurrencies()}})}
window.Convertor=Convertor})();(function(){function UI(rootName,firstFieldInit,secondFieldInit,firstCurrencyInit,secondCurrencyInit){this.decimalPlaces=2;function createElementWithAtt(type,attributes){var el=document.createElement(type);for(var attr in attributes){el.setAttribute(attr,attributes[attr])}
return el}
var numeric=function(text){if(text===""){var zero=0;return zero.toFixed(this.decimalPlaces)}
else{return parseFloat(text).toFixed(this.decimalPlaces)}}.bind(this);function createSelectElement(options,selected){var selectElement=document.createElement('select');for(var op in options){var optionText=document.createTextNode(options[op]);var optionElement=createElementWithAtt('option',{value:op});if(op==selected){optionElement.selected=!0}
optionElement.appendChild(optionText);selectElement.appendChild(optionElement)}
return selectElement}
function createGroup(blurb,initialField,initialCurrency){var myBlurb=document.createElement('div');myBlurb.textContent=blurb;var myText=createElementWithAtt('input',{type:"number",value:numeric(initialField)});myText.addEventListener('focusout',function(){myText.value=numeric(myText.value)});var mySelector=createSelectElement({[Widget.CAD]:"CAD",[Widget.USD]:"USD",[Widget.EUR]:"EUR"},initialCurrency);var myGroup=document.createElement('div');myGroup.className="inputGroup"
myGroup.appendChild(myBlurb);myGroup.appendChild(myText);myGroup.appendChild(mySelector);myGroup.field=myText;myGroup.selector=mySelector;return myGroup}
var root=document.getElementById(rootName);root.className="currencyConvertorContainer";var title=document.createElement('h3');title.textContent='Currency converter';var firstGroup=createGroup('Type in amount and select currency:',firstFieldInit,firstCurrencyInit);var secondGroup=createGroup('Converted amount:',secondFieldInit,secondCurrencyInit);var disclaimer=document.createElement('a');disclaimer.href="#";disclaimer.textContent="Disclaimer";disclaimer.addEventListener('click',function(e){e.preventDefault();alert('This exchange rate is provided by http://fixer.io/')});root.appendChild(title);root.appendChild(firstGroup);root.appendChild(secondGroup);root.appendChild(disclaimer);this.firstFieldOnChange=function(callBack){firstGroup.field.addEventListener('input',callBack)};this.secondFieldOnChange=function(callBack){secondGroup.field.addEventListener('input',callBack)};this.firstCurrencyOnChange=function(callBack){firstGroup.selector.addEventListener('change',callBack)};this.secondCurrencyOnChange=function(callBack){secondGroup.selector.addEventListener('change',callBack)};Object.defineProperty(this,"firstField",{get:function(){return numeric(firstGroup.field.value)},set:function(newValue){if(firstGroup.field!==document.activeElement){firstGroup.field.value=numeric(newValue)}}});Object.defineProperty(this,"secondField",{get:function(){return numeric(secondGroup.field.value)},set:function(newValue){if(secondGroup.field!==document.activeElement){secondGroup.field.value=numeric(newValue)}}});Object.defineProperty(this,"firstCurrency",{get:function(){return firstGroup.selector.options[firstGroup.selector.selectedIndex].value}});Object.defineProperty(this,"secondCurrency",{get:function(){return secondGroup.selector.options[secondGroup.selector.selectedIndex].value}})}
window.UI=UI})();(function(){var Widget={CAD:"CAD",USD:"USD",EUR:"EUR"};Widget.create=function(rootName){var ui=new UI(rootName,0,0,Widget.CAD,Widget.USD);ui.decimalPlaces=2;var convertor=new Convertor(0,0,Widget.CAD,Widget.USD);convertor.onFinish=updateViewFromModel;function updateViewFromModel(){if(!convertor.errorMessage){ui.firstField=convertor.firstCurrencyValue;ui.secondField=convertor.secondCurrencyValue}
else{alert(convertor.errorMessage)}}
ui.firstFieldOnChange(function(){convertor.firstCurrencyValue=ui.firstField});ui.secondFieldOnChange(function(){convertor.secondCurrencyValue=ui.secondField});ui.firstCurrencyOnChange(function(){convertor.firstCurrencyName=ui.firstCurrency});ui.secondCurrencyOnChange(function(){convertor.secondCurrencyName=ui.secondCurrency})}
window.Widget=Widget})()
