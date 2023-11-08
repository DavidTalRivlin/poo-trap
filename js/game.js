'use strict'

var gBoard = []
const MINE = '💩'


var gLevel = {
      SIZE: 4,
      MINES: 2

}


var gGame = {
      isOn: false,
      shownCount: 0,
      markedCount: 0,
      secsPassed: 0
}



function onInit() {
      gBoard = buildBoard()
      // setRandomMines(gBoard) //disabled for develp stage ////////////////////////////////////////
      setMinesNegsCount(gBoard)
      renderBoard(gBoard)
}


function buildBoard() { //modal
      // to do:
      // Builds the board Set the mines Call setMinesNegsCount() 
      // Return the created board
      const size = gLevel.SIZE
      // console.log('size', size)
      const board = []

      for (let i = 0; i < size; i++) {
            board.push([])
            for (let j = 0; j < size; j++) {
                  const cell = {
                        minesAroundCount: 0,
                        isShown: false,
                        // isMine: false, //// - turn on when setRandomMines() will be turned on
                        isMine: ((i===0 && j===0) || (i===2 && j===2)),
                        isMarked: true
                  }
                  board[i][j] = cell

            }
      }

      // console.table(board)
      // console.log(board)
      return board
}


function setRandomMines(board) {
      const minesCount = gLevel.MINES
      const emptyBoardCells = []


      for (let i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {

                  const currCell = { posI: i, posJ: j }
                  emptyBoardCells.push(currCell)
            }
      }
      // console.log('emptyBoardCells', emptyBoardCells)

      for (let i = 0; i < minesCount; i++) {
            const idx = getRandomInt(0, emptyBoardCells.length)
            // console.log('emptyBoardCells', emptyBoardCells)
            gBoard[emptyBoardCells[idx].posI][emptyBoardCells[idx].posJ].isMine = true
            emptyBoardCells.splice(idx, 1)
            // console.log('emptyBoardCells', emptyBoardCells)
            // console.log('idx', idx)
            // console.log('chosenIdxs', chosenIdxs)

      }

}

function renderBoard(board) {//DOM
      // to do:
      // Render the board as a <table> to the page 

      const elTable = document.querySelector('.mines-zone')
      // console.log('elTable', elTable)

      var strHTML = '<tbody class="board">\n'

      for (let i = 0; i < board.length; i++) {
            strHTML += '<tr>\n'
            for (let j = 0; j < board[i].length; j++) {
                  const currCell = board[i][j]
                  strHTML += `<td class="cell covered" data-i="${i}" data-j="${j}" onclick="onCellClicked(this,${i},${j})"> <span class="inner-text-hidden cell-contant">`

                  if (currCell.isMine) {
                        strHTML += MINE
                  }

                  if (!currCell.isMine && currCell.minesAroundCount) {
                        strHTML += currCell.minesAroundCount
                  }

                  strHTML += `</span> </td>\n`
            }
            strHTML += '</tr>\n\n'
      }
      strHTML += '</tbody>'
      // console.log('strHTML', strHTML)
      elTable.innerHTML = strHTML

}


function onCellClicked(elCell, i, j) {
      console.log('elCell', elCell)
      // var elSpan = elCell.innerHTML

      elCell.classList.remove('covered')
      const elSpan = elCell.querySelector("span")
      // console.log('elSpan', elSpan)
      elSpan.classList.add('inner-text-visible')
      elSpan.classList.remove('inner-text-hidden')
}


function setMinesNegsCount(board) {
      // to do:
      // Count mines around each cell and set the cell's minesAroundCount.
      for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                  board[i][j].minesAroundCount = getNegsCount(board, i, j, 'isMine')


            }
      }
      // console.log(gBoard)
}


function onCellMarked(elCell) {
      //      to do:
      // Called when a cell is right- clicked 
      // See how you can hide the context menu on right click 

}


function checkGameOver() {
      // to do:
      // Game ends when all mines are marked,
      //  and all the other cells are shown

}


function expandShown(board, elCell, i, j) {
      // to do:
      // When user clicks a cell with no mines around, 
      // we need to open not only that cell, but also its neighbors.
      //  NOTE: start with a basic implementation that only opens the 
      // non-mine 1st degree neighbors BONUS: if you have the time later,
      //  try to work more like the real algorithm 
      // (see description at the Bonuses section below)

}