function onCountryChange(){
    onCountryChangeImplAndDoesntThisNameSuck(document);
}
function onCountryChangeImplAndDoesntThisNameSuck(form) {
	$('.new_address_form', form).hide();
	var country = $("#country", form).val();
    if (country === "JP") {
        $('.address_jp', form).show();
    }
    else {
        $('.address_generic', form).show();
    }
}