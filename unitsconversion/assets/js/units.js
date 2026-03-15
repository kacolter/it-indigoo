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
        let FromUnit;
        if (document.getElementById("cmOperator").checked) {
            operator = document.getElementById("cmOperator").value;
        }
        if (document.getElementById("mOperator").checked) {
            operator = document.getElementById("mOperator").value;
        }
        if (document.getElementById("kiOperator").checked) {
            operator = document.getElementById("kiOperator").value;
        }
        if (document.getElementById("inOperator").checked) {
            operator = document.getElementById("inOperator").value;
        }
        if (document.getElementById("ftOperator").checked) {
            operator = document.getElementById("ftOperator").value;
        }
        if (document.getElementById("ydOperator").checked) {
            operator = document.getElementById("ydOperator").value;
        }
        if (document.getElementById("miOperator").checked) {
            operator = document.getElementById("miOperator").value;
        }

        let ToUnit;
        if (document.getElementById("cmOperator").checked) {
            operator = document.getElementById("cmOperator").value;
        }
        if (document.getElementById("mOperator").checked) {
            operator = document.getElementById("mOperator").value;
        }
        if (document.getElementById("kiOperator").checked) {
            operator = document.getElementById("kiOperator").value;
        }
        if (document.getElementById("inOperator").checked) {
            operator = document.getElementById("inOperator").value;
        }
        if (document.getElementById("ftOperator").checked) {
            operator = document.getElementById("ftOperator").value;
        }
        if (document.getElementById("ydOperator").checked) {
            operator = document.getElementById("ydOperator").value;
        }
        if (document.getElementById("miOperator").checked) {
            operator = document.getElementById("miOperator").value;
        }


        CalculateResult(FromUnit, ToUnit);
    }
}

async function CalculateResult(FromValue, FromUnit, ToUnit) {
    "use strict;"
        
        // URL and method used with AJAX Call
        let myURL = "https://brucebauer.info/assets/ITEC3650/ajaxcalculator.php";

        /* AJAX calculator requires Operand1, Operator, and Operand2 */
        myURL = myURL + "?FromValue=" + encodeURIComponent(FromUnit) + "&Operator=" + encodeURIComponent(FromUnit) + "&ToUnit" + encodeURIComponent(operand2);

        /* fetch the results */
        let myCalcObject = await fetch(myURL);
        let myResult = await myCalcObject.text();
        
        document.getElementById("Result").innerHTML = myResult;
}

function clearform() {
    "use strict";
    
    /* Set all of the form values to blank or false */
    document.getElementById("FromValue").value = "";
    document.getElementById("FromValueMsg").innerHTML = "";
    document.getElementById("AddOperator").checked = false;
    document.getElementById("SubtractOperator").checked = false;
    document.getElementById("MultiplyOperator").checked = false;
    document.getElementById("DivideOperator").checked = false;
    document.getElementById("OperatorMsg").innerHTML = "";
    document.getElementById("ToValue").value = "";
    document.getElementById("ToValueMsg").innerHTML = "";
    document.getElementById("Result").innerHTML = "";
}

$( "#myform" ).validate({

});