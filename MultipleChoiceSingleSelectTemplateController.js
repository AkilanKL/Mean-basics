/**
 * Created by Ravi Sharma on 8/11/2016.
 */

var MultipleChoiceSingleSelectTemplateController = function(currentRef){

    var radioInputLength, radioClicked, radioInput, jsonData, baseURL;
    var clickCount = 0;
	var increment = 0;
	var correctAns = 0;
	//var application;
    var _this = this;

    this.init = function(data){
		window.answersubmitted = false;
        trace(":: Multiple Choice Single Select Template Controller Loaded ::");
		baseURL = _model.getCourseDataObj().baseURL;
		//application = new ApplicationController();
		 singleSelect = new AudioManager();
		jsonData = data;
		//  $("#playPauseBtn").addClass("playPause");
		// (".playPause").bind("click", _this.playFunction); 
        _this.loadUI(data);
    }

    this.loadUI = function(){

		$('.right, .wrong').hide();
        trace(":: Multiple Choice Single Select Template Load UI ::");

        $("#submitBtn").attr('disabled','disabled');
		$("#question").html(jsonData.pageContent.question);
		$("#instruction").html(jsonData.pageContent.instruction);
		$("#headDiv").html(jsonData.pageContent.heading);
        radioInputLength = (jsonData.pageContent.options).length;
		
		radioInput = "";
		var radioImageClass = jsonData.pageContent.imageOptions ? "radioImageClass" : "";
		var optionImageDiv = jsonData.pageContent.imageOptions ? "optionImageDiv" : "";
		var option = "";

		if(optionImageDiv != ""){
			$('#singleChoice').addClass('flexClass');
		}

        for(var i=0;i<radioInputLength;i++){
			option = !jsonData.pageContent.imageOptions ? jsonData.pageContent.options[i] : "";
			radioInput += '<div class="radio '+ optionImageDiv +'"><input type="radio" class="radioColor" name="radioOption" id="radio_' + (i + parseInt('1')) + '" value="' + jsonData.pageContent.options[i] + '" /><label for="radio_' + (i + parseInt('1')) + '" class = "'+radioImageClass+' '+radioImageClass+ (i+1) +'" >' + option + '</label></div>';

			var styleElem = document.head.appendChild(document.createElement("style"));
			styleElem.innerHTML = "."+radioImageClass+ (i+1) +":before {background: url('"+  jsonData.pageContent.options[i].substring(3) +"');}";
			
        }
		
		$('#singleChoice').html('');
        $('#singleChoice').html(radioInput);

		$("input[name='radioOption']").unbind("click").bind("click", _this.radioClickHandler);
		$("#submitBtn").unbind("click").bind("click", _this.radioSubmitHandler);
		$("#feedbackModel").on("hidden.bs.modal", _this.PopupHide);	 
			
		var imageQuestionZoom = jsonData.pageContent.imageQuestionZoom;
		var imageQuestionShow = jsonData.pageContent.imageQuestionShow;
		// console.log(jsonData.pageContent)
		if(imageQuestionShow) {
			$('.question_image').show();
			$('.question_image').find('img').attr('src', jsonData.pageContent.questionImagePath);
		}else{
			$('.question_image').hide();
		}

		if(imageQuestionZoom){
			$("#img").unbind("click").bind("click", _this.zoomPopupHandler).css("cursor","pointer");
		}

		if((jsonData.pageContent.language != undefined) && (jsonData.pageContent.instruction != "")){
			switch (jsonData.pageContent.language) {
				case 'English': 
				  $('.submit_btn').html('Submit');
				  
				  break;
				case 'Hindi': 
				  $('.submit_btn').html('सब्मिट');
				 
				  break;
				case 'Tamil': 
				  $('.submit_btn').html('சமர்ப்பிக்கவும்');
				  
				  break;
				case 'Malayalam': 
				  $('.submit_btn').html('സമർപ്പിക്കുക');
				  
				  break;
				case 'Kannada': 
				  $('.submit_btn').html('ಸಲ್ಲಿಸು');
				  
				  break;
				case 'Telugu': 
				  $('.submit_btn').html('సమర్పించారు');
				  
				  break;
				case 'Bengali': 
				  $('.submit_btn').html('জমা দিন');
				  
				  break;
				case 'Marathi': 
				  $('.submit_btn').html('प्रस्तुत करणे');
				  
				  break;
				default:
				  $('.submit_btn').html('Submit');
				 
			}
			
		}else{
		
			$('.submit_btn').html('Submit');
			
		}
		
    }

	this.clear = function(){

	}
	
	//   _this.playFunction = function(){

	// 	if (application.playPauseFlag) {
    //         application.playPauseFlag = false;
    //         singleSelect.pauseAudio();
    //         $("#playPauseBtn img").attr('src', 'assets/images/play_button.png');
    //     } else {
    //         application.playPauseFlag = true;
    //         singleSelect.playAudio();
    //         $("#playPauseBtn img").attr('src', 'assets/images/pause_button.png');
    //     }
		
	// }
  
 
	_this.radioClickHandler = function(){
			$("#submitBtn").fadeIn(700);
			$("#feedbackModel").fadeOut(700);
			$("#submitBtn").removeAttr('disabled');
		}
		
     _this.radioSubmitHandler = function(){
	 singleSelect.stopAudio();
	

	 function htmlToText(html) {
		var el = document.createElement('div');
		el.innerHTML = html;
		return el.innerHTML;
	  }
         _model.setTemplateStatus(true);

			radioClicked = $("input[type='radio']:checked").val().substring(3);
			 $("#feedbackText").html("");
			
            if(htmlToText(radioClicked) == htmlToText(jsonData.pageContent.correctAnswer)) {
				EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":1});
				window.answersubmitted = true;
			 if((jsonData.pageContent.transcript[0].audio != undefined) && (jsonData.pageContent.transcript[0].audio != "")){
				

				singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[0].audio+"");
				currentRef.playPauseFlag = true;
			} 
			
			//if((jsonData.pageContent.transcript[0].correct != undefined) && (jsonData.pageContent.transcript[0].correct != "")){
				//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[0].correct);
			//}
			
			
			
				$("#popupHeading").html(jsonData.pageContent.popupHeadingCorrect);
                $("#feedbackText").html( jsonData.pageContent.feedback["correct"] );
				$("#singleChoice").css( "pointer-events", "none" );
				$("#popupContent").addClass("correctAnswer");
				$("#popupContent").removeClass("wrongAnswer");
				$('.right').show();
				$('.wrong').hide();
				
				correctAns++;
				
				$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
				var nextPage = currentRef.currentIndex + parseInt(1);
				$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
				}
				if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
					currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
					currentRef.checkChapterCompletionStatus();
				}
            } else {
				 $("#popupHeading").html(jsonData.pageContent.popupHeadingIncorrect);
				//EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
				increment++;
                if(clickCount < 1){
				
			 if((jsonData.pageContent.transcript[1].audio != undefined) && (jsonData.pageContent.transcript[1].audio != "")){
				currentRef.playPauseFlag = true;
					singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[1].audio+"");
				} 
				
				//if((jsonData.pageContent.transcript[1].correct != undefined) && (jsonData.pageContent.transcript[1].correct != "")){
					//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[1].incorrect1);
				//}
			
					 $("#feedbackText").html( jsonData.pageContent.feedback["incorrect1"] );
					 $("#popupContent").removeClass("correctAnswer");
					 $("#popupContent").addClass("wrongAnswer");
					 $('.wrong').show();
					 $('.right').hide();
					$("#feedbackModel .close").bind("click", _this.showHidepopUp);
                } else {
					EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, {"type":"assessment","score":0});
					window.answersubmitted = true;
			 	if((jsonData.pageContent.transcript[2].audio != undefined) && (jsonData.pageContent.transcript[2].audio != "")){
					currentRef.playPauseFlag = true;
						singleSelect.loadAudio(baseURL+"assets/media/audio/"+jsonData.pageContent.transcript[2].audio+""); 
					} 
					
					//if((jsonData.pageContent.transcript[2].correct != undefined) && (jsonData.pageContent.transcript[2].correct != "")){			
						//$("#audioTranscriptPopupContainer").html('').html(jsonData.pageContent.transcript[2].incorrect2);
					//}
			
			$('#nextBtn').css({'pointer-events': 'auto', 'opacity': 1});
			var nextPage = currentRef.currentIndex + parseInt(1);
				$(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").css({'pointer-events': 'auto', 'opacity': 1}); 
                $(" #menuItem_"+currentRef.currentIndex+" , #menuItem_"+nextPage+"").addClass('completed'); 
                
                //added to control tick mark in menus
			    if(!$(".menu_active i").hasClass("pull-right")){
				    $(".menu_active").append('<i class="fa fa-check-circle text-default pull-right"></i>');
				}
				if( currentRef.menuStatusArr[currentRef.curChapterIndex].pages != undefined ){
					currentRef.menuStatusArr[currentRef.curChapterIndex].pages[currentRef.curPageIndex].isVisited = "true";
					currentRef.checkChapterCompletionStatus();
				}
					 $("#feedbackText").html( jsonData.pageContent.feedback["incorrect2"] );
					 $("#popupContent").removeClass("correctAnswer");
					 $("#popupContent").addClass("wrongAnswer");
					 $('.wrong').show();
					 $('.right').hide();
					$("#singleChoice").css( "pointer-events", "none" );
                }
            }
	
	   
           $('#feedbackModel').modal('show');
             $("#submitBtn").attr('disabled','disabled');
			clickCount++; 
			
			
			 
	//	$("#playPauseBtn img").attr('src', 'assets/images/pause_button.png'); 
		
        }
	_this.PopupHide = function(){ 
		 singleSelect.stopAudio();
		 singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
			if(correctAns == 1){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", false );
			}
			else if(increment == 2){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
 			}
		}
	_this.showHidepopUp = function(){
			singleSelect.stopAudio();
			singleSelect.loadAudio(baseURL+"assets/media/audio/blank"); 
 			trace(correctAns+" correctAns"+increment)
			if(correctAns == 1){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
			else {
			if(increment == 1){
				$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", false );
			}
			else if(increment == 2){
				//$("input[type='radio']").removeAttr('checked');
			$("input[type='radio']").prop( "disabled", true );
			}
 			}
			
		}
	
		_this.zoomPopupHandler = function(){
			$("#imagePopup").show();
			_model.setTemplateStatus(true);
			// EventManager.getInstance().dispatchCustomEvent(window, StaticLibrary.AUDIO_ENDED_EVENT, true, null);
			$("#img").attr("data-toggle","modal").attr("data-target","#imagePopup");
			$("#imageZoom").attr("src", jsonData.pageContent.questionZoomImage);
		}
		
		
}