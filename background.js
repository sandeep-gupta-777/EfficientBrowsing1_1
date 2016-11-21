

// var lastTabId = 0;
var tab_clicks = {};

var count = -1;
var k=true;

var time = 0;
var minutes = 0;
var facebookOn = false;
var fbBeginTime = 0;
var fbEndTime = 0;
var currentTime = 0;
var difference;
var lock = false;
var seconderyDomainArray = ["co","ac"];
var currentlyActiveTab;
var indexArray = [];//carried all the tab object along with working status
//{tabObject:tab, working: 0 or 1 or 2}

var currentWebsite = "nothing"; //Website on currently active tab
var URLarray = []; //details of website with start, end and total used time

var blockArray = ["quora","wikipedia","gmail","facebook"];
//blockArray is updated from options.js
// and contains the website name and how long they are to be permitted

// var newObj = {
// 	BlockID: TempID,
// 	BlockWebsite:TempBlockWebsite,
// 	BlockTime : TempBlockTime,
// 	BlockAction: TempBlockAction
// };

chrome.storage.sync.get('Stored_BlockedArray_key', function (obj) {
    // console.log('myKey', obj);

    if(obj.Stored_BlockedArray_key != undefined)
		blockArray = obj.Stored_BlockedArray_key;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {

	for (key1 in changes) {
		var storageChange = changes[key1];
		if(key1 == "Stored_BlockedArray_key")
		{
			chrome.storage.sync.get('Stored_BlockedArray_key', function (obj) {
				// console.log('myKey', obj);

				if(obj.Stored_BlockedArray_key != undefined)
					blockArray = obj.Stored_BlockedArray_key;
			});

		}
	}
});

chrome.storage.sync.get('myKey', function (obj) {
    // console.log('myKey', obj);

    // if(obj.myKey != undefined)
    //     URLarray = obj.myKey;


    if(obj.myKey != undefined)
        URLarray = obj.myKey;
});


chrome.storage.sync.get('myKey', function (obj) {
	// console.log('myKey', obj);

	if(obj.myKey != undefined)
	URLarray = obj.myKey;
});


// **************FUNCTIONS******* ****

function getCurrentlyActiveTabsArray() { //

	var save = {};
	save["myKey"] = URLarray;

	chrome.storage.sync.set(save, function() {
		// console.log('Settings saved');
	});

	chrome.tabs.query({active: true, lastFocusedWindow: true},function(tabs) {

		currentlyActiveTab= tabs[0];
		/*Important: at this point currentWebsite refers to just previous website*/
		pushWebsiteDetailIntoArray(currentWebsite);  // AS OF NOW: currentWebsite =  previous website
		setEndTimeForGivenWebsite(currentWebsite); //set end time because this website is no longer in use
	});

	setTimeout(function () {
		currentWebsite = stripWebsiteName(currentlyActiveTab.url);//now after setting end time for previous website, undate currentWebsite variable
		pushWebsiteDetailIntoArray(currentWebsite); //set start time for that website
		setStartTimeForGivenWebsite(currentWebsite);//set start time for that website
		// runClockforGivenWebsite(currentWebsite);
	},500);

}

function setStartTimeForGivenWebsite(websiteName) {
	var i = findWebsiteinArray(websiteName);
//	alert("setting starting time for " + websiteName);
	//if(URLarray[i].startTime == 0)
	// {
		URLarray[i].startTime = Date.now()/60000;
	// }
}

function setEndTimeForGivenWebsite(websiteName) {
	var i = findWebsiteinArray(websiteName);

	// console.log(i);
	if(URLarray[i].startTime!=0)
	{
		URLarray[i].endTime =  Date.now()/60000;
	//	alert("setting end and final time for " + websiteName);
	}

	URLarray[i].time = (URLarray[i].time + URLarray[i].endTime - URLarray[i].startTime);//.toFixed(2);
	URLarray[i].startTime = 0;
	URLarray[i].endTime = 0;
	//alert("DONE setting end and final time for " + websiteName + ""+ " \n " + URLarray[i].startTime);
}

function findWebsiteinArray(websiteName) {

	for(var i=0;i<URLarray.length;++i) {
		if(URLarray[i].website == websiteName)
		{
			return i;
		}
	}
	return -1;
}
function pushWebsiteDetailIntoArray(websiteName) {  //if new website then push its details
	if(findWebsiteinArray(websiteName)==-1) //website is not in array
	{
		URLarray.push({website: websiteName, time:0, startTime:0, endTime:0}); //adding a new website
	}
	else{
		return;
	}

}

function findInSeconderyDomainArray(website1) {
	for(var i=0;i<seconderyDomainArray.length;++i)
	{
		if(seconderyDomainArray[i] == website1)
		{
			return true;
		}
	}
	return false;
}

function updateIndexArray(tab) { //updating tab object
	var i = searchTab(tab.id);
	indexArray[i]  = {tabObject: tab, working : (findInBlockArray(tab.url)!=-1) ? 2:0 };
//	alert("tab has been updated...");
}

function blockedWebsitefound(tab) {


    currentTime =  ((new Date()).getMinutes());

     if(findInBlockArray(tab.url)!=-1)
     {
     //     // console.log("Blocked website running...");
	// 	 if(fbBeginTime==0)//fb has begun 0
	// 	 {
	// 		 fbBeginTime = 1;//fb is continue
	// 		 setTimeout(function () {fbBeginTime = 2},600000);
    //
	// 		 setTimeout(function () {fbBeginTime = 0},3600000);
	// 	 }
	// //	 if(fbBeginTime==0 || (difference >180000 || difference <30000)) //person never used fbif
	// 	 if(fbBeginTime==0 ||fbBeginTime==1 ) //0
	// 	 {
	// //		 alert("You can use facebook and other blocked site till 10mins from now");
	// 		// fbBeginTime = ((new Date()).getTime());
	// 		 alert("yyy");
	// 		 //setTimeout(blockAll,30000);//permit for 60 seconds
	// 	 }
	// 	 else
	// 	 {
	// 		 alert("ZZZ");
	// 		 setTimeout(blockAll);
	// 	 }

		 //

		 if(blockArray[findInBlockArray(tab.url)].BlockActualTime ==0)
		 {
			 chrome.tabs.remove(tab.id);
			 //YET TO BE DONE: do this for all tabs with this URL
			 //closeALlTabsWithThisURL(tab.url)
		 }
		 else{
			 setTimeout(function () {
				 // alert("closing");
				 chrome.tabs.remove(tab.id);
				 blockArray[findInBlockArray(tab.url)].BlockActualTime =0;

				 //YET TO DO: this code will break if extension is reloaded
				 // so make sure to save NEW VARIBLES these in local storage
				 if(blockArray[findInBlockArray(tab.url)].setOnce == 0)// to make sure this part of code runs just once
				 {
					 blockArray[findInBlockArray(tab.url)].setOnce =1;
					 setTimeout(function () {
						 blockArray[findInBlockArray(tab.url)].BlockActualTime =0;
						 blockArray[findInBlockArray(tab.url)].setOnce = 0;
					 },86400000 );//this function will run after one day: YET TO BE IMPROVED

				 }

			 },blockArray[findInBlockArray(tab.url)].BlockTime*60000);
		 }
     }
}

function pushInIndexArray(tab) {


    if(findInBlockArray(tab.url)!=-1) {
        indexArray.push({tabObject : tab, working : 2 });
    }
    else {
        indexArray.push({tabObject : tab, working : 0 });
    }

}
function findInBlockArray(str) {
    str = stripWebsiteName(str);
    for(var i=0;i<blockArray.length;++i)
    {
       // console.log("str "+str);
       //  console.log("blockArray "+blockArray[i]);
        if(str == blockArray[i].BlockWebsite)
        {
         //   console.log("str"+blockArray[i]);
         //   alert("found in block array");
            return i;
        }
    }
   // alert("NOT found in block array");
    return -1;
}

function blockAll() //
{
	for(var i=0;i<indexArray.length;++i)
	{
		if( indexArray[i].working == 0)
		{
			// console.log("blockAll: REMOVING:" + indexArray[i].tabObject.id);
			chrome.tabs.remove(indexArray[i].tabObject.id);
			// console.log("blockAll: COMPLETED" + indexArray[i].tabObject.id);
		}
		else if(indexArray[i].working == 2)
		{
			chrome.tabs.remove(indexArray[i].tabObject.id);


		}

	}
}

function getWebsiteTimeObject(websiteName) //here
{
	for(var i=0;i<websiteArray.length;++i)
	{
		if(websiteArray[i].websiteName = websiteName)
		{
			return websiteArray[i];
		}
	}
	return -1;
}


function searchTab(id) {
	
	//console.log(" search id:"+id);
	//console.log(indexArray);
	for( var i=0;i<indexArray.length;++i)
	{
		if(indexArray[i].tabObject.id == id)
		{
			return i;  //tab found in indexArray
		}
	}
	
    return -1; //not found
}

function stripWebsiteName(url)  //strips website name Example: google.com
{
//check if website is either http or https
	var tempArray1  = url.split(":");
	if(tempArray1[0]=="chrome")
	{
		return "chrome";
	}
	else if(tempArray1[0]=="chrome-extension")
	{
		return "chrome-extension";
	}
	else if(tempArray1[0]!="http" && tempArray1[0]!="https" ){
		alert(tempArray1[0]);
		return url ;
	}


	var str = (new URL(url)).hostname;
	 var tempArray= str.split(".");
	 var website1 = tempArray[tempArray.length-2];
	 if(findInSeconderyDomainArray(website1)){
	 	website1 = tempArray[tempArray.length-3];
		 return website1;
	 }
	 else{
		 return website1;
	 }

}


function print_indexArray()
{
	indexArray.forEach(function(i){
		{
			//console.log(i);
		}
	});
}

function makeOtherTabsWorking(url) 
{
	//console.log(indexArray[0].working);
	//alert(url);
	for(var i=0;i<indexArray.length;++i)
	{
	//	console.log("iiii:"+ i);
	//	console.log(indexArray[0].working);
		if(stripWebsiteName( indexArray[i].tabObject.url) == stripWebsiteName(url))
		{
		//	console.log("iiii:"+ i);
			indexArray[i].working = 1;
		}
	}
}

function removeFalseFromIndexArray()
{
	for(var i=0;i<indexArray.length;++i)  //remove false elements
	{
		if(!indexArray[i].working)
		{
			indexArray.splice(i, 1);		
		}
	}

	k = true;
	count = -1;
}
function closeTabs()
{
	for(var i=0;i<indexArray.length;++i)
	{
		if(!indexArray[i].working)
		{
			chrome.tabs.remove(indexArray[i].tabObject.id);
		}
	}
	
	removeFalseFromIndexArray();
	
}

function showAlert()
{
	count++;
	if(count <5)
	{
	//	console.log(5-count+"seconds left");
		setTimeout(showAlert,2000);
	}
	else
	{
		closeTabs();
	}
}
function setIconFunction(lastTabId){

    chrome.pageAction.setIcon({path: "icon_" + (indexArray[searchTab(lastTabId)].working) + ".png",  tabId: lastTabId});
    chrome.pageAction.show(lastTabId);//
}

// **************FUNCTIONS***********
//onCreated
//onUpdated
//onSelectionChanged
//onClicked
//query
chrome.tabs.onCreated.addListener(function(tab) {//this is an object
	getCurrentlyActiveTabsArray();
	var tabId1 = tab.id;
	console.log("onCreated:"+ tab.id);


	// chrome.storage.local.get('keywords', function(result){
	// 	alert("kk");
	// 	keywords = result;
	// 	alert(result);
	// });

  if(indexArray.length == 0 || searchTab(tab.id) == -1 )//array isnt empty OR tab is NOT found in indexArray
  {
	   
	//console.log("push in array");

      pushInIndexArray(tab);

  }
  chrome.pageAction.setIcon({path: "icon_" + (indexArray[searchTab(tab.id)].working) + ".png",  tabId: tab.id});
	chrome.pageAction.show(tab.id);
    blockedWebsitefound(tab);
 });
 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	getCurrentlyActiveTabsArray();
	console.log("onUpdated..."+ tabId);

	updateIndexArray(tab); //update url
	setIconFunction(tabId);//update icon
	chrome.pageAction.show(tabId);
	//console.log(tab);
	blockedWebsitefound(tab);


});

chrome.tabs.onSelectionChanged.addListener(function(tabId) {//just an integer...NOT object

	getCurrentlyActiveTabsArray();
	lastTabId = tabId;
    var selectedTab;

    console.log("onSelectionChanged:"+ tabId);

  if(indexArray.length == 0 || searchTab(tabId) == -1 )//array is empty and tab is not found in indexArray
  {
	//console.log("inside if");
      chrome.tabs.get(tabId, function(tab) { //using tabId get tab object
          selectedTab = tab;
          pushInIndexArray(selectedTab);
      });

  }
	setTimeout(setIconFunction, 20,lastTabId);
    chrome.tabs.get(tabId, function(tab) { //using tabId get tab object
        selectedTab = tab;
	//	alert("about to close this website...");
        blockedWebsitefound(selectedTab);
        //console.log(selectedTab);
    });

  
});

chrome.pageAction.onClicked.addListener(function(tab) {//tab is just an object carrying info about current Tab

	console.log("onClicked:"+tab.id);
	if(k)
	{
		//console.log("1");
		var url = new URL(tab.url);
	//	alert(stripWebsiteName(url));
//		alert("Clock started. After 15 mins all non working tabs will be closed \n Red clock-->non woking tab \n Blue clock-->working tab \n click the clock to toggle" );
		//setTimeout(showAlert,10000);
		k=false;
	}

  if(indexArray.length != 0 && searchTab(tab.id) != -1 )//array isnt empty and tab is found in indexArray
  {
	// console.log("1");
	   //toggle the working status
	// indexArray[searchTab(tab.id)].working ^= 1 << 0; //toggle between 0 and 1
	if(indexArray[searchTab(tab.id)].working==0){
	  indexArray[searchTab(tab.id)].working = 1;
	}
	else if(indexArray[searchTab(tab.id)].working ==1){
	  indexArray[searchTab(tab.id)].working = 0;
	}

	if(indexArray[searchTab(tab.id)].working  == 1)
	{
	//	alert();

		makeOtherTabsWorking(tab.url);
	}

  }
  else
  {
	//  console.log("1");
      pushInIndexArray(tab);
  }

  //since icon is clicked--> change image accroding to working status
 // console.log()
	// console.log("1");
	//blockedWebsitefound(tab);
  chrome.pageAction.setIcon({path: "icon_" + (indexArray[searchTab(tab.id)].working) + ".png",  tabId: tab.id});
 // print_indexArray();
//	alert("end of click");
 });

///////////Thu Nov 17 2016 20:44:44 GMT+0530 (India Standard Time)