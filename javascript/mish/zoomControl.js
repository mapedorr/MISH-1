var zoomLevels = {
  1:"ERA",
  2:"MILLENNIUM",
  3:"CENTURY",
  4:"DECADE",
  5:"YEAR",
  6:"MONTH",
  7:"DAY",
  8:"HOUR"
};

var zoomSubLevels = {
  "ERA":{},
  "MILLENNIUM":{},
  "CENTURY":{},
  "DECADE":{},
  "YEAR":{},
  "MONTH":{
    0:{
      id:'PREV',
      parentId:6,
      initialCellWidth:1,
      lastCellWidth:1
    }
    ,1:{
      id:1,
      parentId:6,
      initialCellWidth:9,
      lastCellWidth:19,
      fillTimeRuler:function(nearestCellToCenterDate,nearestCellToCenterPosX){
        fillTimeRulerWeeks(nearestCellToCenterDate,nearestCellToCenterPosX);
      },zoomTimeRuler:function(nearestCellToCenterObj,mouseScrollDelta){
        zoomTimeRulerWeeks(nearestCellToCenterObj,mouseScrollDelta);
      },addGroupToTimeruler:function(evaluateAdditionToRight){
        addGroupToTimerulerWeeks(evaluateAdditionToRight);
      }
    }
    ,2:{
      id:2,
      parentId:6,
      initialCellWidth:20,
      lastCellWidth:50,
      fillTimeRuler:function(nearestCellToCenterDate,nearestCellToCenterPosX){
        fillTimeRulerDays(nearestCellToCenterDate,nearestCellToCenterPosX);
      },zoomTimeRuler:function(nearestCellToCenterObj,mouseScrollDelta){
        zoomTimeRulerDays(nearestCellToCenterObj,mouseScrollDelta);
      },addGroupToTimeruler:function(evaluateAdditionToRight){
        addGroupToTimerulerDays(evaluateAdditionToRight);
      }
    },3:{
      id:'NEXT',
      parentId:6,
      initialCellWidth:51,
      lastCellWidth:51
    },
    $scrollAmount:0,
    $currentSubLevel:0,
    initialSubLevel:2
    ,get zoomSubLevel(){
      return this[this.$currentSubLevel];
    }
    ,set currentSubLevel(levelID){
      this.$currentSubLevel = levelID;
    },set scrollAmount(newScrollAmount){
      this.$scrollAmount = newScrollAmount;
      if(this.$scrollAmount < this[this.$currentSubLevel].initialCellWidth){
        this.$currentSubLevel--;
      }else if(this.$scrollAmount > this[this.$currentSubLevel].lastCellWidth){
        this.$currentSubLevel++;
      }
    }
  },
  "DAY":{},
  "HOUR":{}
};

/**
 * Function that return the Object for the current Zoom level.
 *
 * @returns {*}
 */
function getZoomData(){
  var zoomSubLevelObj = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]];
  if(cellWidth === null
      || cellWidth === undefined){
    zoomSubLevelObj.currentSubLevel = zoomSubLevelObj.initialSubLevel;
  }else{
    zoomSubLevelObj.scrollAmount = cellWidth;
  }
  return zoomSubLevelObj.zoomSubLevel;
}