function isConditionToTakeOutCheckers(gameData){  
   // let doesThePlayerCanTakeOutCheckers;
    if(isEatenCheckersExistForTheMovingPlayer(gameData)||
     isThereACheckerOutsideTheTakeOutColumns(gameData)){
      //  gameData.doesThePlayerCanTakeOutCheckers= false;
      return false
    }else{
      //  gameData.doesThePlayerCanTakeOutCheckers=true;        
      return true
    }
   // return gameData.doesThePlayerCanTakeOutCheckers;
}
function isEatenCheckersExistForTheMovingPlayer(gameData){    
    if(gameData.isWhiteTurn &&gameData.countOfWhiteCheckersEaten){
                return true;
            }else if(!gameData.isWhiteTurn && gameData.countOfBlackCheckersEaten){
                return true;
            }
            return false;
}
function isThereACheckerOutsideTheTakeOutColumns(gameData){
    let startCheckColumn = gameData.isWhiteTurn ? 0: 6;
    let endCheckColumn = gameData.isWhiteTurn? 18: 23;
    for(var i = startCheckColumn;i<endCheckColumn; i++){
        if(gameData.backgammonBoardArray[i].isWhite === gameData.isWhiteTurn){
                return true;
        }
    }
    return false;
}
function isPlayerTurnAndHasEatenCheckers(gameData){
    if((gameData.isWhiteTurn&& gameData.countOfWhiteCheckersEaten) || 
    (!gameData.isWhiteTurn && gameData.countOfBlackCheckersEaten)){
        return true;
    }
return false;
}
function isPlayerDecidedToTakeOutAChecker(firstClickPosition,secondClickPosition,gameData ){
    if(firstClickPosition===secondClickPosition && isConditionToTakeOutCheckers(gameData)){
        return true;
    }else{
        return false;
    }
}

function positionPossibleByDiceThrows(gameData,firstThrowResult,secondThrowResult) {  
    let throwResults = oppositeThrowResultsForCalculationIfBlackTurn(gameData,firstThrowResult,secondThrowResult);//הופכי אם שחור
    firstThrowResult = throwResults[0];
    secondThrowResult = throwResults[1];
    gameData.moveDifference = gameData.landPosition -gameData.initialPosition;
        if( gameData.moveDifference=== firstThrowResult || gameData.moveDifference=== secondThrowResult|| isACheckForTakingOutCHeckeroutTheBoard(gameData)){
        return true;
    }else{
        return false;
    }
}
function oppositeThrowResultsForCalculationIfBlackTurn(gameData,firstThrowResult,secondThrowResult){
    if (!gameData.isWhiteTurn){  
        
            firstThrowResult = -firstThrowResult;
            secondThrowResult = -secondThrowResult;                   
   } 
   let throwResults=[firstThrowResult,secondThrowResult]
   return throwResults;
   }

function resetUsedThrow(gameData,firstThrowResult,secondThrowResult){
    let throwResults = oppositeThrowResultsForCalculationIfBlackTurn(gameData,firstThrowResult,secondThrowResult)//הופכי אם שחור
    firstThrowResult = throwResults[0];
    secondThrowResult = throwResults[1];
    if(gameData.moveDifference === firstThrowResult){
       return 'firstThrowResult';
    }else if(gameData.moveDifference=== secondThrowResult){
        return 'secondThrowResult';       
    }
    else if(gameData.isPlayerJustTookOutAChecker){
        if(!gameData.isWhiteTurn){
            firstThrowResult= -1*firstThrowResult
            secondThrowResult= -1*secondThrowResult
        }
        return firstThrowResult>secondThrowResult? 'firstThrowResult':'secondThrowResult'        
    }     
}
function reduceInitialCheckerPosition(gameData){
    gameData.backgammonBoardArray[gameData.firstClickPosition].checkersAmountCount--;
    if(gameData.backgammonBoardArray[gameData.firstClickPosition].checkersAmountCount===0){
        gameData.backgammonBoardArray[gameData.firstClickPosition].isWhite = null;
    }
    return gameData.backgammonBoardArray;
}
function isThereACheckerAboveTheClickedChecker(gameData){
    if(gameData.isWhiteTurn){
        for(var i = gameData.firstClickPosition-1; i>17;i--){
            if(gameData.backgammonBoardArray[i].isWhite===gameData.isWhiteTurn){
                return true;
            }
        }
    return false;
    }else{
        for(var i = gameData.firstClickPosition+1; i<6;i++){
            if(gameData.backgammonBoardArray[i].isWhite=== gameData.isWhiteTurn){
                return true;
            }
        }
    return false;
    }    
}
function isWin(gameData){
    let amountTakenOutCheckers= gameData.isWhiteTurn? gameData.countOfTakenOutWhiteCheckers : gameData.countOfTakenOutBlackCheckers;
    if(amountTakenOutCheckers===15){
        return true;
    }
    return false; 
}
function isItASecondCheckInARowToEnterAnotherEatenChecker(gameData){
    if(isNaN(gameData.diceThrowData.firstThrowResult) || isNaN(gameData.diceThrowData.secondThrowResult)){
        return true;
    }
    return false;
}
function isItpossibleToEnterEAtenChecker(gameData){    
    let possibleEntrypositionFirstThrow, possibleEntrypositionSecondThrow,entryPositionStartingCheck;
        if(gameData.isWhiteTurn){
            possibleEntrypositionFirstThrow= gameData.diceThrowData.firstThrowResult-1;
            possibleEntrypositionSecondThrow=gameData.diceThrowData.secondThrowResult-1;
            entryPositionStartingCheck=0; 
        }else{
            possibleEntrypositionFirstThrow= 24-gameData.diceThrowData.firstThrowResult;
            possibleEntrypositionSecondThrow= 24-gameData.secondThrowResult.secondThrowResult;
            entryPositionStartingCheck=18;    
        }
       let entryPositionStartingCheckcopy= entryPositionStartingCheck;
        for(;entryPositionStartingCheck<entryPositionStartingCheckcopy+6; entryPositionStartingCheck++){
            if(entryPositionStartingCheck===possibleEntrypositionFirstThrow ||
                entryPositionStartingCheck===possibleEntrypositionSecondThrow){                    
                    // פוסל אפשרות יציאה
                    if(!isLandingPositionFreeFromRivalMultipleTools(gameData,entryPositionStartingCheck)){
                        gameData.countsChecksPossibleEntryposition++;
                            ///case 1
                            if(gameData.countsChecksPossibleEntryposition===2)                           
                            {
                                return false;
                            }
                            ///case 2
                            let possibleEntrypositionWichIsNotNaN;
                            if(isNaN(possibleEntrypositionFirstThrow) ){
                                possibleEntrypositionWichIsNotNaN=possibleEntrypositionSecondThrow
                            }else if(isNaN(possibleEntrypositionSecondThrow)){
                                possibleEntrypositionWichIsNotNaN=possibleEntrypositionFirstThrow
                            }
                            let isPossibleEntrypositionWichIsNotNaNisTakenByMultipleRivalCheckers;
                            let possibleSecondEnterPosition= gameData.backgammonBoardArray[possibleEntrypositionWichIsNotNaN]
                            if(possibleSecondEnterPosition &&(possibleSecondEnterPosition.isWhite!=gameData.isWhiteTurn
                                &&possibleSecondEnterPosition.checkersAmountCount>1)){
                                    isPossibleEntrypositionWichIsNotNaNisTakenByMultipleRivalCheckers=true
                                }else{
                                    isPossibleEntrypositionWichIsNotNaNisTakenByMultipleRivalCheckers=false
                                }
                            if((isItASecondCheckInARowToEnterAnotherEatenChecker(gameData) && gameData.countsChecksPossibleEntryposition===1&&isPossibleEntrypositionWichIsNotNaNisTakenByMultipleRivalCheckers)){
                                return false;
                            }
                        }                        
        }        
    }
    return true;
    }