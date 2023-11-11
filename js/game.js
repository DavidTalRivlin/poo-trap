'use strict'

var gBoard = []
var gGameInterval
var gStartTime
var gCheckedCells = []



var gLevel = {
      SIZE: 4,
      MINES: null,
      LIVES: null,

}

var FLY_IMG = '<img src="img/marked.png" class="marked-img">'
var MINE_IMG = '<img src="img/cell-poo.png" class="mine-img inner-text-hidden">'


var gGame = {
      isOn: false,
      shownCount: 0,
      markedCount: 0,
      secsPassed: 0,
      isHint: false,
      hintCount: 3,
}


function onInit(boardsize) {
      gBoard = buildBoard()
      gLevel.LIVES = 3
      gGame.isOn = true
      gGame.shownCount = 0
      gGame.markedCount = 0

      switch (gLevel.SIZE) {
            case 4:
                  gLevel.MINES = 2
                  break
            case 8:
                  gLevel.MINES = 9
                  break
            case 12:
                  gLevel.MINES = 18
                  break
      }



      gCheckedCells = []
      closeModal()
      renderBoard(gBoard)
      stopTimer()
      startTimer()

      var elPooImg = document.querySelector('.button-picture')
      elPooImg.src = 'img/1.png'

      var elLives = document.querySelector('.lives-left')
      elLives.innerHTML = gLevel.LIVES
      elLives.style.color = 'var(--darkBrown)'
}


function buildBoard() { //modal
      const size = gLevel.SIZE
      const board = []

      for (let i = 0; i < size; i++) {
            board.push([])
            for (let j = 0; j < size; j++) {
                  const cell = {
                        minesAroundCount: 0,
                        isShown: false,
                        isMine: false,
                        isMarked: false
                  }
                  board[i][j] = cell
            }
      }
      return board
}


function renderBoard(board) {//DOM
      const elTable = document.querySelector('.mines-zone')
      var strHTML = '<tbody class="board">\n'

      for (let i = 0; i < board.length; i++) {
            strHTML += '<tr>\n'
            for (let j = 0; j < board[i].length; j++) {
                  strHTML += `<td class="cell cell-size${gLevel.SIZE} covered" data-i="${i}" data-j="${j}" 
                  onclick="onCellClicked(this,${i},${j})" 
                  oncontextmenu="onCellMarked(this,event,${i},${j})">`

            }
            strHTML += '</tr>\n\n'
      }
      strHTML += '</tbody>'
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

      for (let i = 0; i < minesCount; i++) {
            const idx = getRandomInt(0, emptyBoardCells.length)
            var chosenCell = gBoard[emptyBoardCells[idx].posI][emptyBoardCells[idx].posJ]
            chosenCell.isMine = true

            emptyBoardCells.splice(idx, 1)
      }
}


function reRenderBoard(board) {
      for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                  const currCell = board[i][j]
                  if (currCell.isMine) {
                        renderCell(i, j, `${MINE_IMG}`)
                  }
                  if (!currCell.isMine && currCell.minesAroundCount) {
                        renderCell(i, j, `<span class="near-mine inner-text-hidden font-size${gLevel.SIZE} color-${currCell.minesAroundCount}">${currCell.minesAroundCount}</span>`)
                  }

            }
      }

}


function onCellClicked(elCell, iIdx, jIdx) {
      ///checking if its the first click: 

      if (document.querySelectorAll('.covered').length === (Math.pow(gLevel.SIZE, 2))) {
            setRandomMines(gBoard, iIdx, jIdx)
            setMinesNegsCount(gBoard)
            reRenderBoard(gBoard)
      }

      if (!gGame.isOn) return

      if (gBoard[iIdx][jIdx].isMarked) return

      if (gBoard[iIdx][jIdx].isMine) {

            gLevel.LIVES--
            gLevel.MINES--

            gBoard[iIdx][jIdx].isShown = true


            var elLives = document.querySelector('.lives-left')
            elLives.innerText = gLevel.LIVES

            if (gLevel.LIVES === 1) {
                  elLives.style.color = 'red'
            }

            elCell.classList.remove('covered')
            elCell.classList.add('mine-border')
            gGame.shownCount++

            var elImg = elCell.querySelector('.mine-img')
            elImg.classList.remove('inner-text-hidden')
            elImg.classList.remove('inner-text-visible')

            var elPooImg = document.querySelector('.button-picture')
            elPooImg.src = 'img/2.png'

            // showing all the mines if a mine is pressed and if its the last life:

            if (!gLevel.LIVES) {
                  for (let i = 0; i < gBoard.length; i++) {
                        for (let j = 0; j < gBoard[i].length; j++) {
                              if (gBoard[i][j].isMine) {

                                    var elMineCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                                    elMineCell.classList.remove('covered')
                                    elMineCell.classList.add('mine-border')
                                    var elImg = elMineCell.querySelector('.mine-img')

                                    elImg.classList.remove('inner-text-hidden')
                                    elImg.classList.remove('inner-text-visible')

                                    checkGameOver()

                              }
                        }
                  }
            }

      } else {

            gBoard[iIdx][jIdx].isShown = true
            elCell.classList.remove('covered')
            const elSpan = elCell.querySelector("span")
            gGame.shownCount++
            if (elSpan) {
                  elSpan.classList.add('inner-text-visible')
                  elSpan.classList.remove('inner-text-hidden')
            }
      }

      if (!gBoard[iIdx][jIdx].isMine && gBoard[iIdx][jIdx].minesAroundCount === 0) {
            expandShown(gBoard, iIdx, jIdx)
      }

      checkGameOver()
}


function expandShown(board, rowIdx, colIdx) {


      for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue

            for (let j = colIdx - 1; j <= colIdx + 1; j++) {

                  if (j < 0 || j >= board[i].length) continue
                  // if (i === rowIdx && j === colIdx) continue              

                  // console.log('i,j', i,j)
                  var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                  elCell.classList.remove('covered')
                  gBoard[i][j].isShown = true

                  var elSpan = elCell.querySelector('.near-mine')
                  if (elSpan) {
                        elSpan.classList.remove('inner-text-hidden')
                        elSpan.classList.add('inner-text-visible')

                  }



                  if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount === 0) {

                        var currCell = [i, j]
                        var CurrCellStr = JSON.stringify(currCell);
                        var gCheckedCellsStr = JSON.stringify(gCheckedCells)

                        if (gCheckedCellsStr.indexOf(CurrCellStr) === -1) {
                              gCheckedCells.push(currCell)
                              setTimeout(expandShown, 10, gBoard, i, j)
                        }
                  }
            }
      }
      checkGameOver()
}


function setMinesNegsCount(board) {
      for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                  board[i][j].minesAroundCount = getNegsCount(board, i, j, 'isMine')


            }
      }
}


function onCellMarked(elCell, ev, i, j) {
      ev.preventDefault()
      if (!gGame.isOn) return

      if (elCell.classList.contains('covered')) {
            if (!gBoard[i][j].isMarked) {
                  gBoard[i][j].isMarked = true
                  renderCell(i, j, FLY_IMG)
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
      countIsShownCells()

      if (((Math.pow(gLevel.SIZE, 2)) === gGame.markedCount + gGame.shownCount) && gGame.markedCount === gLevel.MINES) {

            gGame.isOn = false
            onVictory()
      }

      if (!gLevel.LIVES) {
            gGame.isOn = false
            onDefeat()
      }

}


function onVictory() {
      var elModal = document.querySelector('.modal')
      elModal.style.display = 'block'

      var elPooImg = document.querySelector('.button-picture')
      elPooImg.src = 'img/5.png'

      var elModaltext = document.querySelector('.modal-text')
      elModaltext.innerText = '⭐⭐⭐ YOU ARE VICTORIOUS ⭐⭐⭐'
      var audio = new Audio('assets/victory.mp3');
      audio.play();

      stopTimer();
}


function onDefeat() {
      var elMineCells = document.querySelectorAll('.mine-img')

      var elModal = document.querySelector('.modal')
      elModal.style.display = 'block'

      var elPooImg = document.querySelector('.button-picture')
      elPooImg.src = 'img/6.png'

      var elModaltext = document.querySelector('.modal-text')
      elModaltext.innerText = '🤢🫢 Shit! You better wash your shoes!!! 🫢🤢'

      var audio = new Audio('assets/lose.mp3');
      audio.play();

      stopTimer();
}


function closeModal() {
      var elModal = document.querySelector('.modal')
      elModal.style.display = 'none'
}


function renderCell(iIdx, jIdx, value) {
      var elCell = document.querySelector(`[data-i="${iIdx}"][data-j="${jIdx}"]`)
      elCell.innerHTML = value


}


function setBoardSize(boardSize) {
      var elPooLeft = document.querySelector('.poo-left')
      elPooLeft.innerText = ''

      var elCell = document.querySelectorAll('.cell')
      console.log
      switch (boardSize) {
            case 4:
                  gLevel.SIZE = 4
                  break
            case 8:
                  gLevel.SIZE = 8
                  break
            case 12:
                  gLevel.SIZE = 12
                  break
            default:
                  gLevel.SIZE = gLevel.SIZE
      }
      onInit()
}


function countIsShownCells() {
      var isShownCounter = 0
      for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[i].length; j++) {
                  if (gBoard[i][j].isShown) isShownCounter++
            }
      }
      gGame.shownCount = isShownCounter

      var elPoints = document.querySelector('.score')
      elPoints.innerText = gGame.shownCount

      var elLeftPoo = document.querySelector('.poo-left')
      elLeftPoo.innerText = gLevel.MINES

}

function safeClick(){
      
}



function clickHint() {
      // not writen yet


}