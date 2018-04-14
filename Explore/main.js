var board = d3.select("body").append("svg").attr("height", "500px").attr("width", "750px")

// var movies = d3.csv("/data/movies_raw.csv")
// var bag_of_words = d3.csv("/data/bag_of_words.csv")
var years = []
var names = []
var avg_rating = []
var num_votes = []
var words = []
var occurence = []
var frequency = []

d3.select("header").append("h1").text("IMDb Automatic Spoiler Tag Generation Initial Data")
d3.select("header").style("background-color", "cyan").transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("cyan", "yellow")}).duration(5000)

d3.select("body").style("background-color", "yellow").transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("yellow", "cyan")}).duration(5000)

/*while(true){
    d3.select("header").style("background-color", "cyan").transition().delay(1000).styleTween("background-color", function(){return            d3.interpolate("cyan", "blue")}).duration(5000).transition().delay(1000).styleTween("background-color", function(){return d3.interpolate("blue, cyan")}).duration(5000)
}*/


// Movie stuff
d3.csv("./data/movies_raw.csv", function(data){
    
    // Obtain the information regarding the movies
    years.push(data.year)
    names.push(data.name)
    avg_rating.push(data.avg_rating)
    num_votes.push(data.num_votes)
    
    
    if(years.length === 1000){
        // Chart Variables
        var chartWidth = 960
        var chartHeight = 640
        
        // Calculate min and maxes
        var minRating = Number(avg_rating[0])
        var minIndex = 0
        var minVotes = Number(num_votes[0])
        var minVotesIndex = 0
        var maxRating = Number(avg_rating[0])
        var maxRatingIndex = 0
        var maxVotes = Number(num_votes[0])
        var maxVotesIndex = 0
        for(var i=1; i<avg_rating.length; i++){
            if(Number(avg_rating[i])< minRating){
                minIndex = i
                minRating = Number(avg_rating[i])
            }
        }
        for(var i=1; i<num_votes.length; i++){
            if(Number(num_votes[i])<minVotes){
                minVotesIndex = i
                minVotes = Number(num_votes[i])
            }
        }
        for(var i=1; i<avg_rating.length; i++){
            if(Number(avg_rating[i]) > maxRating){
                maxRating = Number(avg_rating[i])
                maxRatingIndex = i
            }
        }
        for(var i=1; i<num_votes.length; i++){
            if(Number(num_votes[i]) > maxVotes){
                maxVotes = Number(num_votes[i])
                maxRatingIndex = i
            }
        }
        
        
        // Write out some information about the movies
        d3.select("body").append("p").text(names[4] + " has a rating of " + avg_rating[4] + " and a total of " + num_votes[4] + " votes.")
        d3.select("body").append("p").text(names[minIndex] + " has the worst rating of " + avg_rating[minIndex] + " and a total of " + num_votes[minIndex] + " votes.")
        d3.select("body").append("p").text(names[minVotesIndex] + " has rating of " + avg_rating[minVotesIndex] + " and has the least number of votes: " + num_votes[minVotesIndex] + ".")
        d3.select("body").append("p").text(names[maxRatingIndex] + " has the best rating of " + avg_rating[maxRatingIndex] + " and has number of votes: " + num_votes[maxRatingIndex] + ".")
        d3.select("body").append("p").text(names[maxVotesIndex] + " has rating of " + avg_rating[maxVotesIndex] + " and has the most number of votes: " + num_votes[maxVotesIndex] + ".")
    }
})

d3.csv("./data/bag_of_words.csv", function(data){
    words = Object.keys(data)
    occurence = Object.values(data)
    total = 0
    
    mostWords = []
    
    
    
    // total number of words
    for(var i=0; i<occurence.length; i++){
        total += Number(occurence[i])
    }
    console.log(total)
    console.log(occurence.length)
    frequency = Array.from(occurence)
    //console.log(frequency)
    // frequency of words
    for(var i=0; i<frequency.length; i++){
        
    }
    console.log(frequency)
    // average frequency
    totalFreq = 0
    for(var i=0; i<frequency.length; i++){
        totalFreq += Number(frequency[i])
    }
    freqAverage = totalFreq/frequency.length
    var sortedFreq = occurence
    sortedFreq.sort(function(a, b){
        return a - b
    })
    //console.log(sortedFreq)
    sortedFreq = sortedFreq.slice(sortedFreq.length - 100, sortedFreq.length)
    console.log(sortedFreq.length)
    for(var i = sortedFreq.length - 1; i>= 0; i--){
        for(var j = 0; j<occurence.length; j++){
            if(sortedFreq[i] === frequency[j]){
                /*console.log(j)
                console.log("SortedFreq: " + sortedFreq[i])
                console.log("Freq: " + occurence[j])
                console.log("Name: " + words[j])*/
                mostWords.unshift(words[j])
                break
            }
        }
    }
    for(var i = 0; i<sortedFreq.length; i++){
        sortedFreq[i] = Number(sortedFreq[i])/total
    }
    //console.log(sortedFreq)
    var wordCloud = []
    for(var i = 0; i< mostWords.length; i++){
        wordCloud[i] = [mostWords[i], sortedFreq[i]]
    }
    //console.log(wordCloud[5][1])
    
    //draw a bar graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
    wordCloud.sort(function() {return Math.random() - 0.5})
    
    for(var i = 0; i<wordCloud.length; i = i+5){
        var newCloud = []
        beginning = i
        for(var j = i; j<i+5; j++){
            newCloud[j - beginning] = wordCloud[j]
        }
        //console.log(newCloud)
        var tot = 0
        for(var j=0; j<wordCloud.length; j++){
            tot += Number(wordCloud[j][1])
        }
        tot = tot/100
        console.log(tot)
        
        var divs = d3.selectAll("body").selectAll("new-div").data(newCloud).enter().append("span").text(function (d){return d[0]}).style("font-size", function (d){return d[1]*10000 + "px"}).filter(function(d){return d[1]>tot*1.2}).append("p")
        
    }
    
    //d3.selectAll("body").selectAll("new-div").data(wordCloud).enter().append("span").text(function (d){return d[0]}).style("font-size", function (d){return d[1]*10000 + "px"})


    
    
    
    //Draw WordCloud

})
