function onCountryChange(){
	$('.new_address_form').hide();
	var country = $("#country").val();
    if (country === "JP") {
        $('.address_jp').show();
    }
    else {
        $('.address_generic').show();
    }
}