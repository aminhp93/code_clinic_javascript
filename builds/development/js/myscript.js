$(function(){
	'use strict';
	var file, droppedImage;
	var target = $('.dropzone');
	var resultsText = document.querySelector('#results');

	function compareImages(imageUrl){
		console.log(imageUrl);	
	}

	function getImages(url){
		console.log('amin');
		console.log(url);
		var request = new XMLHttpRequest();
		console.log(request);
		var list = [];
		request.onload = function(){
			console.log('2');
			var data = this.responseXML.querySelectorAll('img');
			console.log(data);
			for (var key in data){
				if (data.hasOwnProperty(key)){
					var image = data[key].src;
					// console.log('3');
					// console.log(image);
					if ((image !== undefined) && (image.lastIndexOf('.jpg') > 0 )){
						list.push(image);
					}
				}
			}
		};

		resultsText.innerHTML = '<h3>Searching images ... </h3>';
		for (var item in list){
			if (list.hasOwnProperty(item)){
				console.log(list[item]);
				compareImages(list[item]);
			}
		}

		request.open('get', url);
		console.log(request);
		request.responseType = 'document';
		request.send();
	} // get Images

	function dropZone(target){
		target
			.on('dragover', function(){
				target.addClass('dragover');
				// console.log('1');
				return false;
			})
			.on('dragend', function(){
				target.removeClass('dragover');
				// console.log('2')
				return false;
			})
			.on('dragleave', function(){
				target.removeClass('dragover');
				// console.log('3')
				return false;
			})
			.on('drop', function(e){
				var fileReader;
				file = e.originalEvent.dataTransfer.files[0];
				// console.log(file);
				e.stopPropagation();
				e.preventDefault();

				target.removeClass('dragover');

				droppedImage = new Image();
				// console.log(droppedImage);
				fileReader = new FileReader();
				// console.log(fileReader);
				fileReader.onload = function(e){
					droppedImage.src = e.target.result;
					target.html(droppedImage);
				};

				fileReader.readAsDataURL(file);
				// console.log(fileReader);
				// return false;
			}); // on drop

	}
	dropZone(target);

	// Wait for events
	document.forms.compare.addEventListener('submit', function(e){
		var formUrl = document.compare.url.value;
		e.preventDefault();
		if (droppedImage !== undefined){
			getImages(formUrl);
		} else {
			resultsText.innerHTML = '<p class="alert alert-danger">Sorry drop image here';
		}


	});
});