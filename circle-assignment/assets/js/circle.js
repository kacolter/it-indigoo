/* The following should be a file in your js or script folder */
        "use strict";

        $( "#CircleForm" ).validate({

        });
        
        function displayResult() {
            // if the form is valid, then make the calculations
            if ($("#CircleForm").valid()) {
                
                 document.getElementById("radius").innerHTML = "";
                 document.getElementById("area").innerHTML = "";
                 document.getElementById("diameter").innerHTML = "";
                 document.getElementById("circumference").innerHTML = "";


                 let radius; // string representation of the leg1
                 let radiusfp; // floating point value of leg1
                 let diameter; // string representation of the leg1
                 let area; // floating point value of leg1
                 let circ;  // floating point hypotenuse

                 // read in the legs as a string
                 radius = document.getElementById("radius").value;

                 // Convert numbers from strings to Floating Point
                 radiusfp = parseFloat(radius); 

                 // calculate the hypotenuse
                 diameter = calcDiameter(radiusfp);

                 circ = calcCircumference(radiusfp);

                 area = calcArea(radiusfp);

                 
                 document.getElementById("radius").innerHTML = "";
                 document.getElementById("area").innerHTML = area.toString();
                 document.getElementById("diameter").innerHTML = diameter.toString();
                 document.getElementById("circumference").innerHTML = circ.toString();

            }
        }

          function calcDiameter (radiusfp)
          {
            return (2 * radiusfp);
          }

          function calcCircumference (radiusfp)
          {
            return (2 * Math.PI * radiusfp);
          }

          function calcArea(radiusfp)
          {
            return (Math.PI * radiusfp * radiusfp);
          }
          
          function clearForm()
        {
            document.getElementById("radius").value = "";
            document.getElementById("radiuserror").innerHTML = "";
            document.getElementById("area").value = "";
            document.getElementById("diameter").value = "";
            document.getElementById("circumference").value = "";
        }

 