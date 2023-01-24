$(function() {
  // Get the form fields and hidden div
  var checkbox = $("#trigger");
  var checkbox1 = $("#trigger1");
  var hidden = $("#hidden_fields");
  var hidden1 = $("#hidden_fields1");
  
  // Hide the fields.
  // Use JS to do this in case the user doesn't have JS 
  // enabled.
  hidden.hide();
  hidden1.hide();
  
  // Setup an event listener for when the state of the 
  // checkbox changes.
  checkbox.change(function() {
    // Check to see if the checkbox is checked.
    // If it is, show the fields and populate the input.
    // If not, hide the fields.
    if (checkbox.is(':checked')) {
      // Show the hidden fields.
      hidden.show();
	  $('#hidden_field').val("");
    } else {
      // Make sure that the hidden fields are indeed
      // hidden.
      hidden.hide();
	  $('#hidden_field').val("");
      // You may also want to clear the value of the 
      // hidden fields here. Just in case somebody 
      // shows the fields, enters data to them and then 
      // unticks the checkbox.
      //
      // This would do the job:
      //
      // $("#hidden_field").val("");
    }
  });
	  checkbox1.change(function() {
    // Check to see if the checkbox is checked.
    // If it is, show the fields and populate the input.
    // If not, hide the fields.
    if (checkbox1.is(':checked')) {
      // Show the hidden fields.
      hidden1.show();
		$('#hidden_field1').val("");
    } else {
      // Make sure that the hidden fields are indeed
      // hidden.
      hidden1.hide();
		$('#hidden_field1').val("");
		
      
      // You may also want to clear the value of the 
      // hidden fields here. Just in case somebody 
      // shows the fields, enters data to them and then 
      // unticks the checkbox.
      //
      // This would do the job:
      //
      // $("#hidden_field").val("");
    }
  });
});

$('#yourCheckboxId').click(function() {
            if ($('#yourCheckboxId').is(':checked')){
                 $('#inputId').val('yes');
            }    
            if (!$('#yourCheckboxId').is(':checked')){
                 $('#inputId').val('no');
            }     
});
$('#yourCheckboxId1').click(function() {
            if ($('#yourCheckboxId1').is(':checked')){
                 $('#inputId1').val('yes');
            }    
            if (!$('#yourCheckboxId1').is(':checked')){
                 $('#inputId1').val('no');
            }     
});