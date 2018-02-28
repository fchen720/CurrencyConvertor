(function(){
  function Convertor(firstCurrencyVal, secondCurrencyVal, firstCurrencyNam, secondCurrencyNam){
    var NOTHING = 0, FIRST = 1, SECOND = 2;
    // The lifespan of a retrieved currency exchange rate, before refetching is necessary
    var DATA_LIFE_SPAN = 20000;
    var lastChanged = NOTHING;
    var conversion;
    this.onFinish = null;

    var currencies = {};
    // Stores the conversion rate between the currencies 'first' and 'second'
    currencies.store = function(first, second, rate){
      var newEntry = {
        rate: rate,
        timeStamp: Date.now()
      }
      if(this[first]){
        this[first][second] = newEntry;
      }
      else{
        this[first] = {[second]: newEntry};
      }
    }

    // Sets an error flag, sets currency values to 0, executes callback
    function setError(message){
      this.errorMessage = message;
      firstCurrencyVal = 0;
      secondCurrencyVal = 0;
      this.onFinish();
    }
    function updateSecondCurrencyValue(){
      secondCurrencyVal = firstCurrencyVal * conversion;
    }
    function updateFirstCurrencyValue(){
      if(conversion === 0){
        setError("The currency " + firstCurrencyNam + " is worth nothing. Divide by zero error.");
      } else {
        firstCurrencyVal = secondCurrencyVal / conversion;
      }
    }

    var updateCurrencyValues = function(){
      if(lastChanged == FIRST){
        updateSecondCurrencyValue();
      }
      else if(lastChanged == SECOND){
        updateFirstCurrencyValue();
      }
      this.onFinish();
    }.bind(this);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      // If ready state indicates that operation is complete
      if (this.readyState == 4){
        // On success
        if(this.status == 200) {
          var temp = JSON.parse(xhr.responseText);
          var retrievedBaseCurrency = temp.base;
          var retrievedTargetCurrency = Object.keys(temp.rates)[0];

          // Make sure that the received response satisfies the most recent requirements
          if(retrievedBaseCurrency == firstCurrencyNam && retrievedTargetCurrency == secondCurrencyNam){
            conversion = temp.rates[retrievedTargetCurrency];
            currencies.store(firstCurrencyNam, secondCurrencyNam, conversion);
            updateCurrencyValues();
          }
        // On fail
        }else if(this.status == 404){
          setError('Could not reach server');
        }
      }
    };

    function applyNewCurrencies(){
      var cacheObj = currencies[firstCurrencyNam];
      // If both currencies are the same, no need for XHR
      if(firstCurrencyNam == secondCurrencyNam){
        conversion = 1;
        updateCurrencyValues();
      }
      // If cache information on the first and second currencies exist
      else if(cacheObj && cacheObj[secondCurrencyNam]){
        var currentEntry = cacheObj[secondCurrencyNam];
        // If the cached information has expired, refetch
        if(Date.now() - currentEntry.timeStamp >= DATA_LIFE_SPAN){
          sendXhrRequest();
        }else{
          conversion = currentEntry.rate;
          updateCurrencyValues();
        }
      }
      else{
        sendXhrRequest();
      }
    }

    function sendXhrRequest(){
        xhr.open("GET", "https://api.fixer.io/latest?symbols="
                        + firstCurrencyNam + ","
                        + secondCurrencyNam
                        + "&base="
                        + firstCurrencyNam);
        xhr.send();
    }


    // send initial XHR request
    sendXhrRequest();

    //
    // SET UP PUBLIC API
    //
    Object.defineProperty(this, "firstCurrencyValue", {
      get: function(){
        return firstCurrencyVal;
      },
      set: function(newValue){
        firstCurrencyVal = newValue;
        lastChanged = FIRST;
        updateCurrencyValues();
      }
    });

    Object.defineProperty(this, "secondCurrencyValue", {
      get: function(){
        return secondCurrencyVal;
      },
      set: function(newValue){
        secondCurrencyVal = newValue;
        lastChanged = SECOND;
        updateCurrencyValues();
      }
    });

    Object.defineProperty(this, "firstCurrencyName", {
      get: function(){
        return firstCurrencyNam;
      },
      set: function(newValue){
        firstCurrencyNam = newValue;
        lastChanged = FIRST;
        applyNewCurrencies();
      }
    });

    Object.defineProperty(this, "secondCurrencyName", {
      get: function(){
        return secondCurrencyNam;
      },
      set: function(newValue){
        secondCurrencyNam = newValue;
        lastChanged = SECOND;
        applyNewCurrencies();
      }
    });
  }

  window.Convertor = Convertor;
})();
