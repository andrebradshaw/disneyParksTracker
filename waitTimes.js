var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var gi = (ob, nm) => ob.getElementById(nm);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var parks = ['ak','hs','mk','ep'];
var parkTableCSV = [];
var parkTableJSON = [];

var minute = 60000;
var day = 8.64e+7;

async function getParkStatsBy(park){
  var res = await fetch("https://www.easywdw.com/waits/?park="+park, {"credentials":"omit","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","cache-control":"max-age=0","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, "text/html");
  var tabl = tn(doc,'table')[2];
  var trs = tn(tn(tabl, 'tbody')[0], 'tr');
  var timestamp = new Date().getTime();
  for(var i = 0; i<trs.length; i++){
	var row = tn(trs[i], 'td');
    if(row[2]){
      var ride = row[0].innerText.trim();
      var geo = row[1].innerText.trim();
      var wait = parseInt(row[2].innerText.replace(/\D+/g, ''));
	  var csvoutput = [park,ride,geo,wait,timestamp];
	  var jsonoutput = {
		"park":park,
		"ride":ride,
		"geo":geo,
		"wait":wait,
		"timestamp":timestamp,
		};
	  parkTableCSV.push(csvoutput);
	  parkTableJSON.push(jsonoutput);
    }
  }
}
async function loopThroughParks(){
  for(var i=0; i<parks.length; i++){
	await delay(Math.round(Math.random()*100));
	getParkStatsBy(parks[i]);
  }
}

async function timedScraper(){
  var len = day/(minute*5);
  for(var i=0; i<len; i++){
	loopThroughParks();
	await delay(minute*5);
  }
}
timedScraper()
