//load iso data from local file
const data = Data;

//firebase config
const firebaseConfig = config;
firebase.initializeApp(firebaseConfig);
const covidAppReference = firebase.database();


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
            let country_data = rawData[i]['Country'].replace(/\s+/g, '-');
            confirmed_countries.push({
              country: rawData[i]['Country'],
              confirmed: rawData[i]['TotalConfirmed'],
              deaths: rawData[i]['TotalDeaths'],
              recovered: rawData[i]['TotalRecovered'],
              country_data: country_data,
            });
          } else {
            let country_data = rawData[i]['Country'].replace(/\s+/g, '-');
            no_case_countries.push({country: rawData[i]['Country'], country_data: country_data});
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
          }else if ($elementName === 'Cruise-Ship'|| $elementName === 'Diamond-Princess' || $elementName === 'MS-Zaandam' || $elementName === 'Others'){
            $element.find('img').attr('src', '../ship.svg').addClass('other-flag');
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



