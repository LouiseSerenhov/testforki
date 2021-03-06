
function getListOfNewestPublications(orcidIds) {
  let promises = orcidIds.map(createORCIDProfile);
  var arrayOfAllPublications = [];
  var publication = {};
  Promise.all(promises).then(response => {
    console.log(response);

    data = response;
    if (response.status !== 200) { //om det inte är okej MEN detta är ju en array. Fixa det eller ta bort! 
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {

      for (var i in data.group) {

        //PAPER NAME
        if (data.group[i]["work-summary"]["0"].title.title.value != null) {
          var publicationName = data.group[i]["work-summary"]["0"].title.title.value;

        }

        //PUBLICATION YEAR
        if (data.group[i]["work-summary"]["0"]["publication-date"] != null) {
          var publicationYear = data.group[i]["work-summary"]["0"]["publication-date"].year.value;

        } else {
          var publicationYear = "";
        }

        //DOI REFERENCE (länka till adressen verkar det som)
        if (data.group[i]["external-ids"]["external-id"]["length"] != 0) {
          for (var j in data.group[i]["external-ids"]["external-id"]) {
            if (data.group[i]["external-ids"]["external-id"][j]["external-id-type"] == 'doi') {
              var doiReference = data.group[i]["external-ids"]["external-id"][j]["external-id-value"];

              break;
            }
          }
        } else {
          var doiReference = "";
        }

        //JOURNAL NAME
        var putcode = data.group[i]["work-summary"]["0"]["put-code"];


        // Lägg till allt i publikation objekt
        publication.publicationName = publicationName;
        publication.publicationYear = publicationYear;
        publication.doiReference = doiReference;
        publication.putcode = putcode;
        console.log(publication);
        arrayOfAllPublications.push(publication, "objektet publikation");
        console.log(arrayOfAllPublications, "arrayen arrayOffAllPublications");



        //om objektet inte är tomt/undefined så lägg till
        // if (outputs['output' + publicationYear]) {
        //   outputs['output' + publicationYear] += getOutputForYear(i, publicationYear, publicationName, doiReference);
        // } else {
        //   //Om det är tomt 
        //   outputs['output' + publicationYear] = getOutputForYear(i, publicationYear, publicationName, doiReference);
        // }
        // if (publicationYear < 2013) {
        //   outputEarlier += getOutputForYear(i, publicationYear, publicationName, doiReference);
        // }

        // getJournalTitleAndAuthors(orcidID, putcode, i);



        // document.getElementById("publications2018").innerHTML = outputs['output2018'];
        // document.getElementById("publications2017").innerHTML = outputs['output2017'];
        // document.getElementById("publications2016").innerHTML = outputs['output2016'];
        // document.getElementById("publications2015").innerHTML = outputs['output2015'];
        // document.getElementById("publications2014").innerHTML = outputs['output2014'];
        // document.getElementById("publications2013").innerHTML = outputs['output2013'];
        // document.getElementById("publicationsEarlier").innerHTML = outputEarlier;
        // loading = "false";
      }
      // console.log('Outputs', outputs);


      // if (loading == "false") {
      //   var x = document.getElementById("loader");
      //   x.style.display = "none";
      //   var y = document.getElementById("myPublications");
      //   y.style.display = "";
      // }

    });
  }
  )








  // });
  //do something with response
  // [response, response, response, response]
  //Slå ihop allt till en array och sortera efter datum (hur? Kan man köra direkt mer eller mindre än?) sen slica 5 senaste



}



//Hämtar alla arbeten + lite översiktlig data
function createORCIDProfile(orcidID) {
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/works";
  return fetch(ORCIDLink,
    {
      headers: {
        "Accept": "application/orcid+json"
      }
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}










//Hämtar mer specifik data om EN publikation
function getJournalTitleAndAuthors(orcidID, journalID, i) {
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/work/" + journalID;
  fetch(ORCIDLink, {
    headers: {
      "Accept": "application/orcid+json"
    }
  })
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        response.json().then(function (data) {
          //journal title
          if (data["journal-title"] != null) {
            var output = data["journal-title"].value + ".";
            document.getElementById("publication_" + i).innerHTML = document.getElementById("publication_" + i).innerHTML + output;
          }
          //authors
          var authors = "";
          if (data["contributors"]["contributor"]["length"] != 0) {
            for (var j in data["contributors"]["contributor"]) {
              if (j == 0) {
                authors += " " + data["contributors"]["contributor"][j]["credit-name"].value;
              } else {
                authors += ", " + data["contributors"]["contributor"][j]["credit-name"].value;
              }
            }
            document.getElementById("author_" + i).innerHTML = document.getElementById("author_" + i).innerHTML + authors;
          } else {
            var authors = "";
          }


        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });



}

function getOutputForYear(i, publicationYear, publicationName, doiReference) {
  var output = '';
  output += "<p><strong>" + publicationName + "</strong>";
  output += " (" + publicationYear + ") ";
  output += "<span id='publication_" + i + "'> </span> <em id = 'author_" + i + "'></em>";
  output += " <a href='https://doi.org/" + doiReference + "'> " + doiReference + "</a></p>";


  return output;
}



