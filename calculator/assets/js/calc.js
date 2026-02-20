function calculate() {
    "use strict";
    /* Make sure that the form is valid */
    if ($( "#myform" ).valid()) {
        
        /* get the operands from the form */
        let operand1 = document.getElementById("Operand1").value;
        let operand2 = document.getElementById("Operand2").value;
        
        /* convert the operands from string to floating point */
        let operand1fp = parseFloat (operand1);
        let operand2fp = parseFloat (operand2);
        
        /* figure out which operator was checked and place the value in operator */
        let operator;
        if (document.getElementById("PlusOperator").checked) {
            operator = document.getElementById("PlusOperator").value;
        }
        if (document.getElementById("MinusOperator").checked) {
            operator = document.getElementById("MinusOperator").value;
        }
        if (document.getElementById("MultOperator").checked) {
            operator = document.getElementById("MultOperator").value;
        }
        if (document.getElementById("DivideOperator").checked) {
            operator = document.getElementById("DivideOperator").value;
        }

        let result;
        
        /* if the operator was "Min" then set result to the minimum */
        if (operator == "Plus") {
                result = operand1fp + operand2fp;
        }
 
        /* if the operator was "Max" then set result to the maximum */
        if (operator == "Minus") {
                result = operand1fp - operand2fp;
        }

        if (operator == "Mult") {
                result = operand1fp * operand2fp;
        }

        if (operator == "Divide") {
                result = operand2fp === 0 ? "Cannot divide by zero" : operand1fp / operand2fp;
        }
        
        /* convert the result to a string and display it */
        document.getElementById("Result").innerHTML = result.toString();
    }
}

function clearform() {
    
    /* Set all of the form values to blank or false */
    document.getElementById("Operand1").value = "";
    document.getElementById("Operand2").value = "";
    document.getElementById("Operand1Error").innerHTML = "";
    document.getElementById("Operand2Error").innerHTML = "";
    document.getElementById("PlusOperator").checked = false;
    document.getElementById("MinusOperator").checked = false;
    document.getElementById("MultOperator").checked = false;
    document.getElementById("DivideError").innerHTML = "";
    document.getElementById("Result").innerHTML = "";
}

/* Form Validation */
$( "#myform" ).validate({
 
});