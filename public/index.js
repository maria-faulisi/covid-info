const data = Data;
//handlebars template for articles
let confirmed_source = $('#confirmed').html();
let confirmed_template = Handlebars.compile(confirmed_source);
let none_confirmed_source = $('#none-confirmed').html();
let none_confirmed_template = Handlebars.compile(none_confirmed_source); 

let corona = {};
const base_url = 'https://api.covid19api.com/'
const corona_summary = 'summary';
const $country_list_container = $('#confirmed-list-container');
const country_codes = [];
const flags = [];

function getFlag(country_codes, name){
  for (var i = country_codes.length - 1; i >= 0; i--) {
    //console.log(country_codes[i]);
    if (country_codes[i]['name'] === name) {
      let code = country_codes['code'];
      return 'https://www.countryflags.io/' + code + '/flat/64.png';
    }
  }
};

function getAndDisplayData(iso_codes){
  $.ajax({
    url: base_url + corona_summary,
    type: "GET",
    success: function(data){
        let rawData = data['Countries'];
        let confirmed_countries = [];
        let no_case_countries = [];

        for (var i = rawData.length - 1; i >= 0; i--) {
          if (rawData[i]['TotalConfirmed']) {
            confirmed_countries.push({
              country: rawData[i]['Country'],
              confirmed: rawData[i]['TotalConfirmed'],
              deaths: rawData[i]['TotalDeaths'],
              recovered: rawData[i]['TotalRecovered']
            });
          } else {
            no_case_countries.push({country: rawData[i]['Country']});
          }
        }
        //reverse order of arrays list alphabetically
        confirmed_countries.reverse();
        no_case_countries.reverse();

        $country_list_container.append(confirmed_template({confirmed_countries}));
        $country_list_container.append(none_confirmed_template({no_case_countries}));
    },
    error: function(error){
      console.log('API did not send any data');
    },
    complete: function(){
      let $individual_country = $('.individual-country');
      let iso_codes = data['iso'];

      $individual_country.each(function(index, element){
        let $element = $(this);
        let $elementName = $element.data('name');

        for (var i = iso_codes.length - 1; i >= 0; i--) {
          if ($elementName === iso_codes[i]['name']) {
            $element.find('img').attr('src', 'https://www.countryflags.io/' + iso_codes[i]['code'] + '/flat/64.png');
          }
        }

      });    
    }
  });
};

//start program
$(function(){
  getAndDisplayData(); 

  

});



