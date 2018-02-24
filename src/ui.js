(function(){
  function UI(rootName, firstFieldInit, secondFieldInit, firstCurrencyInit, secondCurrencyInit){
    // Default number of decimal places
    this.decimalPlaces = 2;

    // Creates a DOM element with the specified type and attributes
    function createElementWithAtt(type, attributes){
      var el = document.createElement(type);
      for(var attr in attributes){
        el.setAttribute(attr, attributes[attr]);
      }
      return el;
    }

    // Returns float representation of input to the specified number of decimal places
    function numeric(text){
      if(text === ""){
        var zero = 0;
        return zero.toFixed(this.decimalPlaces);
      }
      else{
        return parseFloat(text).toFixed(this.decimalPlaces);
      }
    }

    // Returns selector DOM element with specified options, and selected option
    function createSelectElement(options, selected){
      var selectElement = document.createElement('select');
      for(var op in options){
        var optionText = document.createTextNode(options[op]);
        var optionElement = createElementWithAtt('option',{
          value: op
        });
        if(op == selected){
          optionElement.selected = true;
        }
        optionElement.appendChild(optionText);
        selectElement.appendChild(optionElement);
      }
      return selectElement;
    }

    // Returns text field and selector input group DOM element
    function createGroup(blurb, initialField, initialCurrency){
      var myBlurb = document.createElement('div');
      myBlurb.textContent = blurb;

      var myText = createElementWithAtt('input', {
        type:"number",
        value: numeric(initialField)
      });

      myText.addEventListener('focusout', function(){
        myText.value = numeric(myText.value);
      });
      var mySelector = createSelectElement({[Widget.CAD]: "CAD", [Widget.USD]: "USD", [Widget.EUR]: "EUR"}, initialCurrency);

      var myGroup = document.createElement('div');
      myGroup.className = "inputGroup"
      myGroup.appendChild(myBlurb);
      myGroup.appendChild(myText);
      myGroup.appendChild(mySelector);
      myGroup.field = myText;
      myGroup.selector = mySelector;
      return myGroup;
    }

    var root = document.getElementById(rootName);
    root.className = "currencyConvertorContainer";
    var title = document.createElement('h3');
    title.textContent = 'Currency converter';
    var firstGroup = createGroup('Type in amount and select currency:', firstFieldInit, firstCurrencyInit);
    var secondGroup = createGroup('Converted amount:', secondFieldInit, secondCurrencyInit);
    var disclaimer = document.createElement('a');
    disclaimer.href = "#";
    disclaimer.textContent = "Disclaimer";
    disclaimer.addEventListener('click', function(e){
      console.log('clicked')
      e.preventDefault();
      alert('This exchange rate is provided by http://fixer.io/');
    });

    root.appendChild(title);
    root.appendChild(firstGroup);
    root.appendChild(secondGroup);
    root.appendChild(disclaimer);

    //
    // SET UP PUBLIC API
    //
    this.firstFieldOnChange = function(callBack){
      firstGroup.field.addEventListener('input',callBack);
    };
    this.secondFieldOnChange = function(callBack){
      secondGroup.field.addEventListener('input',callBack);
    };
    this.firstCurrencyOnChange = function(callBack){
      firstGroup.selector.addEventListener('change',callBack);
    };
    this.secondCurrencyOnChange = function(callBack){
      secondGroup.selector.addEventListener('change',callBack);
    };

    Object.defineProperty(this, "firstField", {
      get: function(){
        return numeric(firstGroup.field.value);
      },
      set: function(newValue){
        if(firstGroup.field !== document.activeElement){
          firstGroup.field.value = numeric(newValue);
        }
      }
    });
    Object.defineProperty(this, "secondField", {
      get: function(){
        return numeric(secondGroup.field.value);
      },
      set: function(newValue){
        if(secondGroup.field !== document.activeElement){
          secondGroup.field.value = numeric(newValue);
        }
      }
    });
    Object.defineProperty(this, "firstCurrency", {
      get: function(){
        return firstGroup.selector.options[firstGroup.selector.selectedIndex].value;
      }
    });
    Object.defineProperty(this, "secondCurrency", {
      get: function(){
        return secondGroup.selector.options[secondGroup.selector.selectedIndex].value;
      }
    });
  }

  window.UI = UI;
})();
