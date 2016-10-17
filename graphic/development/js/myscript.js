$(function(){
	'use strict';
	var fromDate;
	var toDate;

	function getMean(myArray){
		var mean = myArray.reduce(function(a,b){
			return a + b;
		})/myArray.length;
		return mean.toFixed(2);
	}


	function getMedian(myArray){
		var median;
		var sorted = myArray.sort(myArray);
		var middleIndex = Math.floor(sorted.length/2);

		if (sorted.length % 2 === 0){
			var medianA = sorted[middleIndex];
			var medianB = sorted[middleIndex - 1];
			median = (medianA + medianB)/2;
		} else {
			median = sorted[middleIndex];
		}
		return median.toFixed(2);
	}


	function processData(data){
		var myData = []; 
		var myDates = ['x'];
		var meanTemps = ['Mean temperature'];
		var medTemps = ['Median temperature'];
		var meanPress = ['Mean pressure'];
		var medPress = ['Mean pressure'];
		var meanSpeed = ['Mean speed'];
		var medSpeed = ['Median speed'];
		console.log('amin');

		for (var key in data){
			if (data.hasOwnProperty(key)){
				if ((data[key].t !== null)
					&& (data[key].p !== null) 
					&& (data[key].s !== null)){
					myDates.push(key);
					meanTemps.push(getMean(data[key].t));
					medTemps.push(getMedian(data[key].t));
					meanPress.push(getMean(data[key].p));
					medPress.push(getMedian(data[key].p));
					meanSpeed.push(getMean(data[key].s));
					medSpeed.push(getMedian(data[key].s));
				}
			}
		}
		myData.push(myDates, meanTemps, medTemps, meanPress, medPress, meanSpeed, medSpeed);
		return myData;
	}

	var test = [2,3,3,3];
	console.log('Mean: ' + getMean(test));
	console.log('Median: ' + getMedian(test));

	function generateChart(data){
		var chart = c3.generate({
			data: {
				x: 'x',
				columns: data,
				type: 'area',
				groups: [
					['Mean temperature','Median temperature', 'Mean pressure','Mean pressure','Mean speed','Median speed']
				]
			},
			bar: {
				width: {
					ratio: 0.9
				}
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%Y-%m-%d'
					}
				} // x
			}, // axis
			subchart:{
				show: true
			}
		}) // chart
	} // generate Chart

	function loadChart(){
		$.ajax({
			url: 'http://foundationphp.com/phpclinic/podata.php?&raw&callback=?',
			jsonpCallback: 'jsonReturnData',
			dataType: 'jsonp',
			data: {
				startDate: formatDate(fromDate, ''),
				endDate: formatDate(toDate, ''),
				format: 'json'
			},
			success: function(response){
				generateChart(processData(response));
			} // succss
		}); // AJAX call
	} // load Chart

	function formatDate(date, divider){
		var someday = new Date(date);
		var month = someday.getUTCMonth() + 1;
		var day = someday.getUTCDay();
		var year = someday.getUTCFullYear();

		if (month <= 9) { month = '0' + month};
		if (day <= 9) { day = '0' + day};

		return ('' + year + divider + month + divider + day);
	}

	fromDate = new Date();
	console.log(fromDate);
	fromDate.setDate(fromDate.getDate() - 100);
	console.log(fromDate);

	toDate = new Date();
	toDate.setDate(toDate.getDate() - 1);

	document.forms.rangeform.from.value = formatDate(fromDate, '-');
	document.forms.rangeform.to.value = formatDate(toDate, '-');


	loadChart();

	// Events =====\

	document.forms.rangeform.addEventListener('change', function(e){
		fromDate = new Date(document.rangeform.from.value);
		toDate = new Date(document.rangeform.to.value);

		fromDate = fromDate.toUTCString();
		toDate = toDate.toUTCString();

	loadChart();

	}, false);


});
