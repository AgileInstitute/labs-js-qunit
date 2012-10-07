function onCountryChange(){
	j('.new_address_form').hide();
	var country = j("#country").val();
    if (country == "JP")
        j('.address_jp').show();
    else
        j('.address_generic').show();
}