var model = new ExquisiteCorpse();

$('#generate').click(function() {
    var div = $('<div><p>'+model.generate(2+Math.floor((Math.random()*5)))+'</p>')
    var link = $('<a class="share">share on facebook</a></div>');
    link.click(share);
    div.append(link);
    div.hide().prependTo('#output').slideDown(500);
});

$('#login').click(function() {
    FB.login(null,{scope: 'user_status'});
});

function share(event) {
    console.log($(event.target).prev().text());
    FB.ui({
      method: 'feed',
      name: 'name',
      link: 'http://what-else-would-i-say.com',
      caption: 'An example caption',
      description: 'An example description'
    }, function(response){});
}

// for (var i=0; i<test_data.length; i++) {
//     model.addInput(test_data[i]);
//     $('#statusdiv').append('<p>'+test_data[i]+'</p>');
// }

function spoolStatus() {
    var status_limit = 99999;
    var latest_id = 0;
    var status_per_page = 30;
    var status_count = 0;
    spool('/me/statuses');
    
    function spool(query) {
        FB.api(query, {limit: status_per_page, offset: status_count, fields: 'message'}, function(response) {
          console.log(query);
          for (var i=0; i<response.data.length; i++) {
            //console.log(response.data[i].message);
            model.addInput(response.data[i].message);
            //$('#statusdiv').append('<p>'+response.data[i].message+'</p>');
          }
          status_count += response.data.length;
          if (response.paging == undefined) console.log("got undefined paging link. status_count="+status_count);
          else if (status_count < status_limit) spool(response.paging.next);
          else {
            console.log("done getting statuses. status_count="+status_count);
            console.log("last status recieved was "+response.data[response.data.length - 1].message);
            }
        });
    }
}

function ExquisiteCorpse() {
    var head = [];
    var body = [];
    var tail = [];

    var abbreviations = /(Mr.|Ms.|Mrs.|Mt.|Mtn.|(?:[^!?.]\.)+)$/i;

    //Process a new status message input
    this.addInput = function(status) {
        //Massage the data
        //Split it into sentences (regex credit: http://stackoverflow.com/a/5553924)
        var sentences = status.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g);
        for (var i=0; i<sentences.length; i++) {
            //hack for abbreviations
            if (sentences[i].match(abbreviations) > 0 && i+1 < sentences.length) {
                parseSentence(sentences[i] + sentences[i+1]);
            } else {
                parseSentence(sentences[i]);
            }
        }
    }

    function parseSentence(s) {
        head.push(s);
    }

    //Return a generated status of <length> sentences
    this.generate = function generate(length) {
        var output = '';
        for (var i=0; i<length; i++) {
            output += random(head);
            //probability of a sentence having a body is bodies.length/heads.length
            //output += random(tail);
            if (i+1 < length) output += " ";
        }
        return output;
    }

    function random(xs) {
        return xs[Math.floor((Math.random()*xs.length))];
    }
}

