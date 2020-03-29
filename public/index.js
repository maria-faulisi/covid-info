(function(){
  //handlebars template for articles
  let confirmed_source = $('#confirmed').html();
  let confirmed_template = Handlebars.compile(confirmed_source);
  let none_confirmed_source = $('#none-confirmed').html();
  let none_confirmed_template = Handlebars.compile(none_confirmed_source); 

  let corona = {};
  const base_url = 'https://api.covid19api.com/'
  const corona_summary = 'summary';
  const all_countries = 'countries';
  const corona_country_day_one = 'dayone/country/united-kingdom/status/confirmed';
  const $country_list_container = $('#confirmed-list-container');


  //start program
  $(document).ready(function(){
    //corona.getData(base_url + all_countries, corona.displayListOfCountries, $country_list_container);

    $.get(base_url + corona_summary).done(function(data){
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
      confirmed_countries.reverse();
      no_case_countries.reverse();
      console.log(no_case_countries);
      $country_list_container.append(confirmed_template({confirmed_countries}));
      $country_list_container.append(none_confirmed_template({no_case_countries}));

    }).fail(function(){
      console.log('API Did not send data.');
    });
    
    
    $('.individual-country').on('click', 'a', function(e){
      e.preventDefault();

    });

  });
})();


