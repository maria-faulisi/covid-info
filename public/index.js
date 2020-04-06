//load iso data from local file
const data = Data;
//firebase config
const firebaseConfig = config;
firebase.initializeApp(firebaseConfig);
const messageAppReference = firebase.database();
//handlebars
let confirmed_source = $('#confirmed').html();
let confirmed_template = Handlebars.compile(confirmed_source);
let none_confirmed_source = $('#none-confirmed').html();
let none_confirmed_template = Handlebars.compile(none_confirmed_source); 
let single_message = $('#single-message').html();
let single_message_template = Handlebars.compile(single_message);

const base_url = 'https://api.covid19api.com/summary'
const $country_list_container = $('#confirmed-list-container');

function getAndDisplayData(iso_codes){
  $.ajax({
    url: base_url,
    type: "GET",
    success: function(data){
        let rawData = data['Countries'];
        let confirmed_countries = [];
        let no_case_countries = [];

        for (let i = rawData.length - 1; i >= 0; i--) {
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
        
        for (let i = iso_codes.length - 1; i >= 0; i--) {
          if ($elementName === iso_codes[i]['name']) {
            $element.find('img').attr('src', 'https://www.countryflags.io/' + iso_codes[i]['code'] + '/flat/64.png');
          }else if ($elementName === 'Cruise-Ship'|| $elementName === 'Diamond-Princess' || $elementName === 'MS-Zaandam' || $elementName === 'Others'){
            $element.find('img').attr('src', '../ship.svg').addClass('other-flag');
          }
        }
      });

      addEventHandler();
      searchCountries(); 
    }
  });
};

function searchCountries(){
  //get input field set as variable
  let userInput = $('#user-input');

  userInput.keyup(data, function(){
    let $userValue = $(this).val().toLowerCase();
    let $allCountries = $('.individual-country');

    $allCountries.filter(function(){
      $(this).toggle($(this).text().toLowerCase().indexOf($userValue) > -1);
    });

  });
};

function addEventHandler(){
  //get data from country on click and populate #country-status
  $('.individual-country').on('click', function(e){
    e.preventDefault();
    let $this = $(this);
    let $header = $('.individual-name');
    $('.individual-name').html($this.data('name'));
    $('.messages-for-country').html('Messages for ' + $this.data('name'));
    $('.confirmed-number').html($this.data('confirmed'));
    $('.deaths-number').html($this.data('deaths'));
    $('.recovered-number').html($this.data('recovered'));

    getCountryMessages($this.data('name').toLowerCase());
  });
};

function saveMessage(){
  let country = $('.individual-name').html().toLowerCase();
  if ($('input').val()) {
    //variable for input data
    let message = $('input').val();
    let id = messageAppReference.ref().child('messages/' + country).push().key;
    let updates = {};
    updates['messages/' + country + '/' + id] = {'message': message};
    messageAppReference.ref().update(updates);
    //clear out input field
    $('input').val(''); 
    //save id to localStorage
    let visitorLocalStorage = window.localStorage;
    visitorLocalStorage.setItem('message:' + id, id);
    
  } else {
    alert('Must enter a value to send message.');
  }  
};

function getCountryMessages(country) {
  // retrieve messages data when .on() initially executes and when its data updates
  messageAppReference.ref('messages/' + country).on('value', function (results) {
    const $messageList = $('#country-messages');
    $messageList.empty();
    const allMessages = results.val();
    // iterate through results coming from database call; messages
    for (const msg in allMessages) {
      const message = allMessages[msg].message;
      const id = msg;
      //use handlebars template
      $messageList.append(single_message_template({message, id, country}));     
    }
    $('.fa-trash').on('click', function(){
      let $this = $(this).closest('.individual-msg');
      deleteCountryMessage($this);
    });

    $('.fa-pencil').on('click', function(){
      let $this = $(this).closest('.individual-msg');
      editCountryMessage($this);
    });    
  })
};

function deleteCountryMessage(elem){
  let id = elem.data('id');
  let country = elem.data('msg-country');  
  //check localstorage for id
  let post_author = window.localStorage.getItem('message:' + id);
  if (post_author) {
    // find message whose objectId is equal to the id we're searching with
    messageAppReference.ref('messages/' + country + '/' + id).remove();
  }else{
    alert('You are not the author, you cannot delete.');
  }
};

function editCountryMessage(elem){
  let id = elem.data('id');
  let country = elem.data('msg-country');
  //check localstorage for id
  let post_author = window.localStorage.getItem('message:' + id);

  if (post_author) {
    let currentMessage = elem.text().trim();
    // find message whose objectId is equal to the id we're searching with
    const messageReference = messageAppReference.ref('messages/' + country + '/' + id);
    //set modal input to current message
    $('#edit-message').val(currentMessage);
    //show modal
    $('#virusModal').modal('show');
      
    $('#cancel-edit').on('click', function(e){
      messageReference.update({'message': currentMessage});
    });

    $('#save-edit').on('click', function(e){
      e.preventDefault();
      //capture new message
      let newMessage = $('#edit-message').val();
      // update message in db
      messageReference.update({'message': newMessage});
      //close modal
      $('#virusModal').modal('hide');      
    });
  }else{
    alert('You are not the author, you cannot edit.');
  }
};

$(function(){
  getAndDisplayData();
  //save message when "send love" clicked
  $('#send-love').on('click', function(e){
    e.preventDefault();
    saveMessage();
  });

});






