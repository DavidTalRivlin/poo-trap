'use strict'

var gBoard = []
const MINE = '💩'
const SMELL = 'Smell'
var gGameInterval
var gStartTime

const SMELL_IMG = '<img src="img/rotten.png" class="marked-img">'


var gLevel = {
      SIZE: 4,
      MINES: null,
      LIVES: null,

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
      gLevel.LIVES = 2
      gLevel.MINES = 3

      gGame.isOn = true
      gGame.shownCount = 0
      gGame.markedCount = 0

      closeModal()
      renderBoard(gBoard)
      stopTimer()
      gGameInterval = startTimer()




      var elLives = document.querySelector('.lives-left')
      elLives.innerHTML = gLevel.LIVES

      // for future step count
      // var elStepToGo = document.querySelector('.steps-to-go')
      // // var stepToGo = (Math.pow(gLevel.SIZE, 2))
      // // elStepToGo.innerText = stepToGo
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
                        isMine: false, //// - turn on when setRandomMines() will be turned on
                        // isMine: ((i === 0 && j === 0) || (i === 2 && j === 2)),
                        isMarked: false
                  }
                  board[i][j] = cell

            }
      }

      // console.table(board)
      // console.log(board)
      countIsShownCells('buildBoard')
      return board
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
                  strHTML += `<td class="cell covered" data-i="${i}" data-j="${j}" 
                  onclick="onCellClicked(this,${i},${j})" 
                  oncontextmenu="onCellMarked(this,event,${i},${j})">`


                  // if (currCell.isMine) {
                  //       strHTML += `<span class="mine inner-text-hidden">${MINE}</span>`
                  // }

                  // if (!currCell.isMine && currCell.minesAroundCount) {

                  //       strHTML += `<span class="near-mine inner-text-hidden">${currCell.minesAroundCount}</span>`
                  // }

                  // strHTML += ` <span class="marked"></span> </td>\n`

            }
            strHTML += '</tr>\n\n'
      }
      strHTML += '</tbody>'
      // console.log('strHTML', strHTML)
      elTable.innerHTML = strHTML

}


function setRandomMines(board, iIdx, jIdx) {
      const minesCount = gLevel.MINES
      const emptyBoardCells = []


      for (let i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                  if (i === iIdx && j === jIdx) continue
                  const currCell = { posI: i, posJ: j }
                  emptyBoardCells.push(currCell)
            }
      }
      // console.log('emptyBoardCells', emptyBoardCells)

      for (let i = 0; i < minesCount; i++) {
            const idx = getRandomInt(0, emptyBoardCells.length)
            // console.log('emptyBoardCells', emptyBoardCells)
            var chosenCell = gBoard[emptyBoardCells[idx].posI][emptyBoardCells[idx].posJ]
            chosenCell.isMine = true

            // console.log('chosenCell', emptyBoardCells[idx].posI, emptyBoardCells[idx].posJ)

            emptyBoardCells.splice(idx, 1)
            // console.log('emptyBoardCells', emptyBoardCells)
            // console.log('idx', idx)
            // console.log('chosenIdxs', chosenIdxs)

      }

}


function reRenderBoard(board) {

      for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                  const currCell = board[i][j]
                  if (currCell.isMine) {
                        // console.log('i found mine in:', i, j)
                        renderCell(i, j, `<span class="mine inner-text-hidden">${MINE}</span>`)
                  }
                  if (!currCell.isMine && currCell.minesAroundCount) {
                        // console.log('i found count in:', i, j)
                        renderCell(i, j, `<span class="near-mine inner-text-hidden">${currCell.minesAroundCount}</span>`)
                  }

            }
      }
      countIsShownCells('reRenderBoard')
}

function onCellClicked(elCell, iIdx, jIdx) {
      // console.log('elCell', elCell)
      // var elSpan = elCell.innerHTML

      ///checking if its the first click: 

      if (document.querySelectorAll('.covered').length === (Math.pow(gLevel.SIZE, 2))) {
            // console.log('im the first click')
            setRandomMines(gBoard, iIdx, jIdx)
            setMinesNegsCount(gBoard)
            reRenderBoard(gBoard)
            countIsShownCells('onCellClicked - first click')



      }

      if (!gGame.isOn) return


      if (gBoard[iIdx][jIdx].isMarked) return


      if (gBoard[iIdx][jIdx].isMine) {

            gLevel.LIVES--
            gLevel.MINES--

            gBoard[iIdx][jIdx].isShown = true

            var elLives = document.querySelector('.lives-left')
            elLives.innerText = gLevel.LIVES

            elCell.classList.remove('covered')
            var elMineSpan = elCell.querySelector('.mine')
            elMineSpan.classList.remove('inner-text-hidden')
            countIsShownCells('onCellClicked - is mine?')


            // showing all the mines if a mine is pressed and if its the last life:

            if (!gLevel.LIVES) {
                  for (let i = 0; i < gBoard.length; i++) {
                        for (let j = 0; j < gBoard[i].length; j++) {
                              if (gBoard[i][j].isMine) {
                                    gBoard[i][j].isShown = true

                                    var elMineCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                                    elMineCell.classList.remove('covered')
                                    var elMineSpan = elMineCell.querySelector('.mine')
                                    elMineSpan.classList.remove('inner-text-hidden')
                                    checkGameOver()
                                    countIsShownCells('onCellClicked - on defeat')
                              }
                        }
                  }
            }

      } else {

            gBoard[iIdx][jIdx].isShown = true

            elCell.classList.remove('covered')
            const elSpan = elCell.querySelector("span")
            if (elSpan) {
                  elSpan.classList.add('inner-text-visible')
                  elSpan.classList.remove('inner-text-hidden')
                  gGame.shownCount++
                  countIsShownCells('onCellClicked - all others')
            }
      }

      if (!gBoard[iIdx][jIdx].isMine && gBoard[iIdx][jIdx].minesAroundCount === 0) {
            expandShown(gBoard, iIdx, jIdx)



      }

      checkGameOver()


}


function expandShown(board, rowIdx, colIdx) {
      // to do:
      // When user clicks a cell with no mines around, 
      // we need to open not only that cell, but also its neighbors.
      //  NOTE: start with a basic implementation that only opens the 
      // non-mine 1st degree neighbors BONUS: if you have the time later,
      //  try to work more like the real algorithm 
      // (see description at the Bonuses section below)

      for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (let j = colIdx - 1; j <= colIdx + 1; j++) {
                  if (j < 0 || j >= board[i].length) continue
                  if (i === rowIdx && j === colIdx) continue
                  // console.log('i,j', i, j)
                  var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                  elCell.classList.remove('covered')
                  gBoard[i][j].isShown = true

                  // console.log('elCell', elCell)
                  var elSpan = elCell.querySelector('.near-mine')
                  if (elSpan) {
                        elSpan.classList.remove('inner-text-hidden')
                        elSpan.classList.add('inner-text-visible')
                  }
            }
      }
      countIsShownCells('expendShown')
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


function onCellMarked(elCell, ev, i, j) {
      //      to do:
      // Called when a cell is right- clicked 
      // See how you can hide the context menu on right click 

      ev.preventDefault()
      if (!gGame.isOn) return

      if (elCell.classList.contains('covered')) {
            if (!gBoard[i][j].isMarked) {
                  gBoard[i][j].isMarked = true
                  renderCell(i, j, SMELL_IMG)
                  gGame.markedCount++
                  checkGameOver()
                  return
            }
      }

      if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = false
            renderCell(i, j, '')
            gGame.markedCount--
            checkGameOver()
            return
      }

}


function checkGameOver() {
      // to do:
      // Game ends when all mines are marked,
      //  and all the other cells are shown
      // console.log('in game over')

      // console.log('gGame.markedCount', gGame.markedCount)
      // console.log('gGame.shownCount', gGame.shownCount)
      // console.log('gLevel.SIZE',gLevel.SIZE)
      if (((Math.pow(gLevel.SIZE, 2)) === gGame.markedCount + gGame.shownCount) && gGame.markedCount === gLevel.MINES) {

            // console.log('Game Over - victory')
            gGame.isOn = false
            onVictory()
      }

      if (!gLevel.LIVES) {
            // console.log('Game Over - victory')
            gGame.isOn = false
            onDefeat()

      }

}


function onVictory() {
      var elModal = document.querySelector('.modal')
      elModal.style.display = 'block'

      var elModaltext = document.querySelector('.modal-text')
      elModaltext.innerText = '⭐⭐⭐ YOU ARE VICTORIOUS ⭐⭐⭐'
      var audio = new Audio('assets/victory.mp3');
      audio.play();


}


function onDefeat() {

      var elMineCells = document.querySelectorAll('.mine')
      console.log('elMineCells', elMineCells)



      var elModal = document.querySelector('.modal')
      elModal.style.display = 'block'

      var elModaltext = document.querySelector('.modal-text')
      elModaltext.innerText = '🤢🫢 Shit! You better wash your shoes!!! 🫢🤢'

      var audio = new Audio('assets/lose.mp3');
      audio.play();


}


function closeModal() {
      var elModal = document.querySelector('.modal')
      elModal.style.display = 'none'
}


function renderCell(iIdx, jIdx, value) {

      var elCell = document.querySelector(`[data-i="${iIdx}"][data-j="${jIdx}"]`)
      // console.log('elCell', elCell)

      // elCell = elCell.querySelector('.marked')
      // console.log('elCell', elCell)


      elCell.innerHTML = value


}


function changeBoardSize(num) {
      gLevel.SIZE = num
      onInit()


}


function countIsShownCells(fromwhere) {
      var isShownCounter = 0
      for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[i].length; j++) {
                  if (gBoard[i][j].isShown) isShownCounter++
            }
      }
      // console.log('isShownCounter printed from:',fromwhere,' : ' ,isShownCounter)
      gGame.shownCount = isShownCounter
      console.log('gGame.shownCount', gGame.shownCount)
}

