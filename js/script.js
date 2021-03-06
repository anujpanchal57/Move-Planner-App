
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // loading streetview
    var Street = $('#street').val();
    var City = $('#city').val();
    var address = Street + ', ' + City;

    $greeting.text('Hey, You want to live at ' + address + '?');

    // Appended the Google Streetview API
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    // Background image of the particular street or city will appear which we have entered
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    // Declared a new variable NYTimesURL with the API KEY generated by me
    var NYTimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + City + '&sort=newest&api-key=94145ebf534145fa835ce16c8b989164';

    // Gets the JSON as well as the data for us
    $.getJSON(NYTimesURL, function(data) {
        $nytHeaderElem.text('New York Times article about: ' +City);
        articles = data.response.docs;

        for(var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class = "articles">' +
                '<a href = "' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        }
        // Appended a .error method, if something goes wrong with nytimes url or api key or anything else
    }).error(function(e) {
        $nytHeaderElem.text('NYTimes Articles could not be loaded!!');
    });

    // Declared a variable for WIKIPEDIA AJAX Request
    var WikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + City + '&format=json&callback=wikiCallback';

    //Error Handling with respect to JSON-P
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to retrieve the Wikipedia Resources!!');
    }, 8000);

//Ending time of the timeout function, at this time the request will end
//and generate an error, if any
//After 8 secs, it will go up and change the text to as specified in the function,
// If the method turns out to be successful, then after the AJAX Request the
//clearTimeout() will exit the wikiRequestTimeout() method.

// AJAX Request, we can also make URL request from inside the method too
    $.ajax({
        url: WikiURL,
        dataType: "jsonp",
        success: function(response) {

            // Created articleLists variable which is equal to the articles array from
            //the object that we got return from the function i.e., response
            var articleLists = response[1];

            for(var i = 0; i < articleLists.length; i++) {

                article = articleLists[i];

                //Each Article gets appended and article renders the information about the article.
                var URL = 'http://en.wikipedia.org/wiki/' + article;
                $wikiElem.append('<li><a href="'+ URL + '">' + article + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);


// Error Handling isn't built for JSON-P, that is one of the limitations of JSON-P
// But there are other alternatives which can work around
// to refer one of them, go to line 47