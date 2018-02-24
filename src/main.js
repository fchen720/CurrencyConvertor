(function(){
  var Widget = {
    CAD: "CAD",
    USD: "USD",
    EUR: "EUR"
  };

  Widget.create = function(rootName){
    // Create a UI object with zeroed out fields, initial currencies CAD and USD
    var ui = new UI(rootName,0, 0, Widget.CAD, Widget.USD);
    ui.decimalPlaces = 2;
    // Create a Convertor object with zeroed out values, initial currencies CAD and USD
    var convertor = new Convertor(0, 0, Widget.CAD, Widget.USD);
    convertor.onFinish = updateViewFromModel;

    function updateViewFromModel(){
      if(!convertor.errorMessage){
        ui.firstField = convertor.firstCurrencyValue;
        ui.secondField = convertor.secondCurrencyValue;
      }
      else{
        alert(convertor.errorMessage);
      }
    }

    ui.firstFieldOnChange(function(){
      convertor.firstCurrencyValue = ui.firstField;
    });

    ui.secondFieldOnChange(function(){
      convertor.secondCurrencyValue = ui.secondField;
    });

    ui.firstCurrencyOnChange(function(){
      convertor.firstCurrencyName = ui.firstCurrency;
    });

    ui.secondCurrencyOnChange(function(){
      convertor.secondCurrencyName = ui.secondCurrency;
    });
  }

  window.Widget = Widget;
})();
