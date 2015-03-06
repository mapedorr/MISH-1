var zoomLevels = {
  1: "ERA",
  2: "MILLENNIUM",
  3: "CENTURY",
  4: "DECADE",
  5: "YEAR",
  6: "MONTH",
  7: "DAY",
  8: "HOUR"
};

var zoomSubLevels = {
  "ERA": {},
  "MILLENNIUM": {},
  "CENTURY": {},
  "DECADE": {},
  "YEAR": {
    0: {
      id: 'PREV',
      parentId: 5,
      initialCellWidth: 1,
      lastCellWidth: 1
    }
    , 1: {
      id: 1,
      name: 'MONTHS',
      parentId: 5,
      initialCellWidth: 20,
      lastCellWidth: 150,
      fillTimeRuler: function (nearestCellToCenterDate, nearestCellToCenterPosX) {
        fillTimeRulerMonths(nearestCellToCenterDate, nearestCellToCenterPosX);
      },
      zoomTimeRuler: function (nearestCellToCenterObj, mouseScrollDelta) {
        zoomTimeRulerMonths(nearestCellToCenterObj, mouseScrollDelta);
      },
      addGroupToTimeruler: function (evaluateAdditionToRight) {
        addGroupToTimerulerMonths(evaluateAdditionToRight);
      },
      calculateXPosOfEvent: function (groupTime,eventTime) {
        return calculateXPosOfEventMonths(groupTime,eventTime);
      },
      changeOfLevel: function(lastLevel, centerCellObj){
        changeOfLevelMonths.call(this, lastLevel, centerCellObj);
      }
    }, 2: {
      id: 'NEXT',
      parentId: 5,
      initialCellWidth: 61,
      lastCellWidth: 61
    },
    $scrollAmount: 0,
    $currentSubLevel: 0,
    initialSubLevel: 1,
    lastSubLevel: 1
    , get zoomSubLevel() {
      return this[this.$currentSubLevel];
    }
    , set currentSubLevel(levelID) {
      this.$currentSubLevel = levelID;
    }, set scrollAmount(newScrollAmount) {
      this.$scrollAmount = newScrollAmount;
      if (this.$scrollAmount < this[this.$currentSubLevel].initialCellWidth) {
        this.$currentSubLevel--;
      } else if (this.$scrollAmount > this[this.$currentSubLevel].lastCellWidth) {
        this.$currentSubLevel++;
      }
    }
  },
  "MONTH": {
    0: {
      id: 'PREV',
      parentId: 6,
      initialCellWidth: 1,
      lastCellWidth: 1
    }
    , 1: {
      id: 1,
      name: 'WEEKS',
      parentId: 6,
      initialCellWidth: 9,
      lastCellWidth: 19,
      fillTimeRuler: function (nearestCellToCenterDate, nearestCellToCenterPosX) {
        fillTimeRulerWeeks(nearestCellToCenterDate, nearestCellToCenterPosX);
      },
      zoomTimeRuler: function (nearestCellToCenterObj, mouseScrollDelta) {
        zoomTimeRulerWeeks(nearestCellToCenterObj, mouseScrollDelta);
      },
      addGroupToTimeruler: function (evaluateAdditionToRight) {
        addGroupToTimerulerWeeks(evaluateAdditionToRight);
      },
      calculateXPosOfEvent: function (groupTime,eventTime) {
        return calculateXPosOfEventWeeks(groupTime,eventTime);
      },
      changeOfLevel: function(lastLevel, centerCellObj){
        changeOfLevelWeeks.call(this, lastLevel, centerCellObj);
      }
    }
    , 2: {
      id: 2,
      name: 'DAYS',
      parentId: 6,
      initialCellWidth: 20,
      lastCellWidth: 50,
      fillTimeRuler: function (nearestCellToCenterDate, nearestCellToCenterPosX) {
        fillTimeRulerDays(nearestCellToCenterDate, nearestCellToCenterPosX);
      },
      zoomTimeRuler: function (nearestCellToCenterObj, mouseScrollDelta) {
        zoomTimeRulerDays(nearestCellToCenterObj, mouseScrollDelta);
      },
      addGroupToTimeruler: function (evaluateAdditionToRight) {
        addGroupToTimerulerDays(evaluateAdditionToRight);
      },
      calculateXPosOfEvent: function (groupTime,eventTime) {
        return calculateXPosOfEventDays(groupTime,eventTime);
      },
      changeOfLevel: function(lastLevel, centerCellObj){
        changeOfLevelDays.call(this, lastLevel, centerCellObj);
      }
    }, 3: {
      id: 'NEXT',
      parentId: 6,
      initialCellWidth: 51,
      lastCellWidth: 51
    },
    $scrollAmount: 0,
    $currentSubLevel: 0,
    initialSubLevel: 1,
    lastSubLevel: 2
    , get zoomSubLevel() {
      return this[this.$currentSubLevel];
    }
    , set currentSubLevel(levelID) {
      this.$currentSubLevel = levelID;
    }, set scrollAmount(newScrollAmount) {
      this.$scrollAmount = newScrollAmount;
      if (this.$scrollAmount < this[this.$currentSubLevel].initialCellWidth) {
        this.$currentSubLevel--;
      } else if (this.$scrollAmount > this[this.$currentSubLevel].lastCellWidth) {
        this.$currentSubLevel++;
      }
    }
  },
  "DAY": {},
  "HOUR": {}
};

/**
 * Function that return the Object for the current Zoom level.
 *
 * @returns {*}
 */
function getZoomData() {
  var zoomSubLevelObj = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]];
  if (cellWidth === null
    || cellWidth === undefined) {
    zoomSubLevelObj.currentSubLevel = mishGA.currentZoomSubLevel;
  } else {
    zoomSubLevelObj.scrollAmount = cellWidth;
  }
  return zoomSubLevelObj.zoomSubLevel;
}

/**
 * Function that updates the level of Zoom for the application.
 */
function updateZoomLevels(){
  if (mishGA.zoomData.id !== mishGA.currentZoomSubLevel
      || mishGA.zoomData.parentId !== mishGA.currentZoomLevel) {
    //The ZOOM SUB LEVEL changes, do something
    zoomSubLevelChange = true;
    console.log("ZOOM SUB LEVEL CHANGE");

    if (mishGA.zoomData.id === 'PREV') {
      //It's time to change the Zoom LEVEL
      //The ZOOM LEVEL changes, do something
      zoomLevelChange = true;
      console.log("ZOOM LEVEL CHANGE");

      mishGA.currentZoomLevel--;
      mishGA.currentZoomSubLevel = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]].lastSubLevel;
      cellWidth = null;
      mishGA.zoomData = getZoomData();
    } else if (mishGA.zoomData.id === 'NEXT') {
      //The ZOOM LEVEL changes, do something
      zoomLevelChange = true;
      console.log("ZOOM LEVEL CHANGE");

      //It's time to change the Zoom LEVEL
      mishGA.currentZoomLevel++;
      mishGA.currentZoomSubLevel = zoomSubLevels[zoomLevels[mishGA.currentZoomLevel]].initialSubLevel;
      cellWidth = null;
      mishGA.zoomData = getZoomData();
    }

    mishGA.currentZoomSubLevel = mishGA.zoomData.id;
    mishGA.currentZoomLevel = mishGA.zoomData.parentId;

    if (delta > 0) {
      cellWidth = mishGA.zoomData.initialCellWidth;
    } else {
      cellWidth = mishGA.zoomData.lastCellWidth;
    }
  }
}