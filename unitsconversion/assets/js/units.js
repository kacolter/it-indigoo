function calculate() {
    "use strict";

    // Get a reference to the form - Use the ID of the form
    let form = $( "#myform" );
    
    // If all of the form elements are valid, the get the form values
    if (form.valid()) {
        
        // Operand 1
        let FromValue = document.getElementById("FromValue").value;

        // Operator
        // Get the value associated with the operator that was checked (+, -, *, or /)
    let FromUnit = $("input[name='FromUnit']:checked").val();
    let ToUnit = $("input[name='ToUnit']:checked").val();
        CalculateResult(FromValue, FromUnit,ToUnit);
    }
}

async function CalculateResult(FromValue, FromUnit, ToUnit) {
    "use strict;"
        
        // URL and method used with AJAX Call
        let myURL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";

        /* AJAX calculator requires Operand1, Operator, and Operand2 */
         myURL = myURL + "?FromValue=" + encodeURIComponent(FromValue) + "&FromUnit=" + encodeURIComponent(FromUnit) + "&ToUnit=" + encodeURIComponent(ToUnit);
        /* fetch the results */
        let myCalcObject = await fetch(myURL);
        let myResult = await myCalcObject.text();
        
        document.getElementById("ToValue").innerHTML = myResult;
}

function clearform() {
    "use strict";
    
    /* Set all of the form values to blank or false */
    document.getElementById("FromValue").value = "";
    document.getElementById("FromValueMsg").innerHTML = "";
    document.getElementById("fromCM").checked = false;
    document.getElementById("fromM").checked = false;
    document.getElementById("fromKI").checked = false;
    document.getElementById("fromIN").checked = false;
    document.getElementById("fromFT").checked = false;
    document.getElementById("fromYD").checked = false;
    document.getElementById("fromMI").checked = false;
    document.getElementById("toCM").checked = false;
    document.getElementById("toM").checked = false;
    document.getElementById("toKI").checked = false;
    document.getElementById("toIN").checked = false;
    document.getElementById("toFT").checked = false;
    document.getElementById("toYD").checked = false;
    document.getElementById("toMI").checked = false;
    document.getElementById("OperatorMsg").innerHTML = "";
    document.getElementById("ToValue").innerHTML = "";
    document.getElementById("ToValueMsg").innerHTML = "";
}

$( "#myform" ).validate({

});