(function(){
  //handlebars template for articles
  let source = $('#country').html();
  let template = Handlebars.compile(source);  

  let corona = {};
  const base_url = 'https://api.covid19api.com/'
  const corona_summary = 'summary';
  const all_countries = 'countries';
  const corona_country_day_one = 'dayone/country/united-kingdom/status/confirmed';
  
  //get conrona virus api working
  corona.getData = function(api_string, func){
    $.get(api_string).done(function(data){
      console.log(data);

    }).fail(function(){
      console.log('API Did not send data.');
    });
  };

  //corona.getData(base_url + all_countries);
  function displayListOfCountries(){
    
  };

  //start program
  $(document).ready(function(){
    const $country_list_container = $('#country-list-container');
    $.get(base_url + all_countries).done(function(data){
      let rawData = data;
      let countries = [];

      for (var i = rawData.length - 1; i >= 0; i--) {
        if (rawData[i]['Country']) {
          countries.push(rawData[i]['Country']);
        }
      }
      $country_list_container.append(template({countries}));
    }).fail(function(){
      console.log('API Did not send data.');
    });
  });
})();


