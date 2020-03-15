function makeMove(event) { 
    let gameData = socket.gameObject[0]
     let isWhitePlayerAttemptMakeMoveEvent = socket.gameObject[1].isWhite;
        console.log(gameData);
        gameData.isPlayerJustTookOutAChecker=false

    if(gameData.isWhiteTurn!==isWhitePlayerAttemptMakeMoveEvent){
        alert("wait your turn")
        return
    }    
    if(isConditionToTakeOutCheckers(gameData)){
        if(gameData.oneTimeAlertTakeOutCheckrsInstruction){
            alert("click twice to on a checker to take it out, or move regularly.")
            gameData.oneTimeAlertTakeOutCheckrsInstruction=false;
        }        
    }    
    if(gameData.clicksCount===0){   
                if(event.currentTarget.id){
                    gameData.firstClickPosition=parseInt(event.currentTarget.id);
                }else{
                    gameData.firstClickPosition= parseInt(event.currentTarget.parentNode.id);
                }
                if (isPlayerTurnAndHasEatenCheckers(gameData)||
                 (gameData.backgammonBoardArray[gameData.firstClickPosition].isWhite !== gameData.isWhiteTurn)){
                    alert("wrong checker or empty place or you have eaten checkrs to enter or");
                    return;
                }
                gameData.clicksCount++;             
        return;
    }    
    if(event.currentTarget.id){
        gameData.secondClickPosition=parseInt(event.currentTarget.id);
    }else{
        gameData.secondClickPosition= parseInt(event.currentTarget.parentNode.id);
    } 
    gameData.landPosition = setLandingPosition(gameData, isPlayerDecidedToTakeOutAChecker(gameData.firstClickPosition,gameData.secondClickPosition,gameData));
    gameData.initialPosition = setInitialPosition(gameData);   
   var isLandingPositionLegitAccordingToDiceThrows
   ////////////////////////////
    if(isPlayerDecidedToTakeOutAChecker(gameData.firstClickPosition,gameData.secondClickPosition,gameData)){
        
        isLandingPositionLegitAccordingToDiceThrows = positionPossibleByDiceThrows(gameData,gameData.diceThrowData.firstThrowResult,gameData.diceThrowData.secondThrowResult);
        if(isLandingPositionLegitAccordingToDiceThrows){
            
            gameData.backgammonBoardArray= reduceInitialCheckerPosition(gameData);//למרות-שאניחושב-שזה-נשלח-לפי-רפרנס-כשזה-אובייקט
            gameData.isPlayerJustTookOutAChecker=true

            if(gameData.isWhiteTurn){
                gameData.countOfTakenOutWhiteCheckers=gameData.countOfTakenOutWhiteCheckers+1;
            }else{
                gameData.countOfTakenOutBlackCheckers=gameData.countOfTakenOutBlackCheckers+1;
            } 
        }else{
            var theSixthPositionInPlayersBase= gameData.isWhiteTurn?18:5
            if(theSixthPositionInPlayersBase == gameData.secondClickPosition){
                alert(" click on the 6 position only if tho moveDifference is exactly 6")
                gameData.clicksCount--;
                return;
            }
            if(isThereACheckerAboveTheClickedChecker(gameData)){
                alert("you need to take out above checkers first");                
                gameData.clicksCount--;
                return;
            }else if(!isCheckersBeneathDiceResultsInPlayersBase(gameData)){//    בדיקה-הפרשים-קטנים-מתוצאת-הקוביות
                alert("you need to move the checkers down");                
                gameData.clicksCount--;
                return;
            }else{
                gameData.backgammonBoardArray=reduceInitialCheckerPosition(gameData);
                gameData.isPlayerJustTookOutAChecker=true
                if(gameData.isWhiteTurn){
                    gameData.countOfTakenOutWhiteCheckers=gameData.countOfTakenOutWhiteCheckers+1;
                }else{
                    gameData.countOfTakenOutBlackCheckers=gameData.countOfTakenOutBlackCheckers+1;
                } 
            }
        }
            // מהלך הוצאת דמקה לגיטימי 
            if(!gameData.diceThrowData.isDoubleVar.isdouble){                
                gameData.diceThrowData[resetUsedThrow(gameData,gameData.diceThrowData.firstThrowResult,gameData.diceThrowData.secondThrowResult)]=NaN;
            }
            gameData.clicksCount=0;
           
            gameData.diceThrowData.isDoubleVar.moveCount++;
            socket.emit( 'overwriteGameDataObjecetInOpponentSocket',gameData)
           if(isWin(gameData)){
               socket.emit('rateWinnerUp',socket.token);
               socket.emit('eraseRoom',socket.roomName);
                alert('you won')            
           }          
        if(gameData.diceThrowData.isDoubleVar.moveCount==2|| !checkPossibilityToCompleteTheRemainingMoves(gameData)){
            nextPlayerTurn(gameData);
        }
            
        return;
        }
    ////////////////////////////////////
    isLandingPositionLegitAccordingToDiceThrows = positionPossibleByDiceThrows(gameData,gameData.diceThrowData.firstThrowResult,gameData.diceThrowData.secondThrowResult);
    let isLandingPositionFreeFromOpponentMultipleTools= isLandingPositionFreeFromRivalMultipleTools(gameData,gameData.secondClickPosition);
    let isLandingPositionHasOpponentSingularTool= isLandingPositionHasRivalSingularTool(gameData);
    /////////////// מהלך לגיטימי רגיל בכל התנאים
   if(isLandingPositionLegitAccordingToDiceThrows && isLandingPositionFreeFromOpponentMultipleTools){
    
                if(!gameData.diceThrowData.isDoubleVar.isdouble){
                    gameData.diceThrowData[resetUsedThrow(gameData,gameData.diceThrowData.firstThrowResult,gameData.diceThrowData.secondThrowResult)]=NaN;
                }        
                gameData.clicksCount=0;
            if(isLandingPositionHasOpponentSingularTool){
            removeCheckerFromArrayAndIncreaseEatenCountVariable(gameData);
            }            
            if(gameData.enterEatenCheckerPossible){
                console.log(' if(gameData.enterEatenCheckerPossible){')
                console.log(gameData)
                    enterEatenCheckers(gameData,gameData.secondClickPosition,gameData.isWhiteTurn);
            } else{
                moveCheckersArray(gameData)    
                }
              socket.emit( 'overwriteGameDataObjecetInOpponentSocket',gameData)

      gameData.diceThrowData.isDoubleVar.moveCount++;
        gameData.isItACheckAfterCompletingOnlyOneThrow=true;
        //הוספת-אופרטור-!-לאחר-סוקטים-בסוגריים.גם-הפוק'-השתנתה
        if(gameData.diceThrowData.isDoubleVar.moveCount==2 || !checkPossibilityToCompleteTheRemainingMoves(gameData)){
            isItACheckAfterCompletingOnlyOneThrow=false;
            nextPlayerTurn(gameData);        
        }        
        // מהלך לא לגיטימי בכל התנאים
   }else{
    gameData.clicksCount--;            
    alert("illegal landing Position. please choose a new checker to move");
    //return; 
   }
} 
///////////////////////////////