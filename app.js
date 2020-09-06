document.addEventListener('DOMContentLoaded',()=>{
  const cells=document.querySelectorAll(".grid div");
  cells.forEach(cell=>{
    cell.addEventListener('click',handleClick)
  })

  const displayRedScore=document.querySelector('#red-score');
  const displayBlueScore=document.querySelector('#blue-score');
  const players=['red','blue'];
  const displayCurrentPlayer=document.querySelector('#current-player');
  const displayResult=document.querySelector('#result');
  let tempList=[]; //keeps track of cells that are already filled when clicked
  let turn=0;
  let currentPlayer='red';
  let clickCount=0;

  let squareStack=[];
  let score={red:0,blue:0}

  function gameOver(){
    for (let i=0;i<49;i++){
      if (!cells[i].classList.contains('taken')){

        return false
      }

    }
    return true
  }

  function checkSquare(arr){
    arr.sort((a,b)=>{
      return a-b
    })


    return (checkRegular(arr) || checkDiamond(arr))

  }

  function checkRegular(arr){

    if (Math.floor(arr[0]/7)===Math.floor(arr[1]/7)){

      let l=arr[1]-arr[0];
      if (Math.floor(arr[2]/7)===Math.floor(arr[3]/7)){

        if (arr[3]-arr[2]===l){

          if (arr[2]%7===arr[0]%7){

            if (Math.floor(arr[2]/7)-Math.floor(arr[0]/7)===l){

              return true
            }
          }
        }
      }
    }
    return false
  }
  function checkDiamond(arr){
    if (arr[0]%7===arr[3]%7){
      let d=Math.floor(arr[3]/7)-Math.floor(arr[0]/7);
      if (Math.floor(arr[1]/7)===Math.floor(arr[2]/7)){
        if (arr[2]-arr[1]===d){
          if ((arr[2]%7+arr[1]%7)/2===arr[0]%7){
            if ((Math.floor(arr[0]/7)+Math.floor(arr[3]/7))/2===Math.floor(arr[1]/7)){
              return true
            }
          }
        }
      }
    }
    return false
  }

  function claimCells(arr){
    if (Math.floor(arr[0]/7)===Math.floor(arr[1]/7)){
      claimRegular(arr)
    }
    else {
      claimDiamond(arr)
    }
  }
  function claimRegular(arr){
    for (let i=Math.floor(arr[0]/7);i<=Math.floor(arr[3]/7);i++){
      for (let j=arr[0]%7;j<=arr[1]%7;j++){
        let currentCell=cells[7*i+j];
        if (!currentCell.classList.contains('taken')){
          currentCell.classList.add('taken',currentPlayer+'-unfilled')
        }
      }
    }
  }
  function claimDiamond(arr){
    let n=arr[2]%7-arr[1]%7-1;
    let start=(Math.floor(arr[0]/7)+1)*7+arr[1]%7+1;
    for (let i=0;i<n;i++){
      for (let j=0;j<n;j++){
        if (!cells[start+i*7+j].classList.contains('taken')){
          cells[start+i*7+j].classList.add('taken',currentPlayer+'-unfilled')
        }
      }
    }

  }


  function handleClick(e){

    const cellArray=Array.from(cells)
    const index=cellArray.indexOf(e.target)
    //Case I: cell clicked is empty
    if (!cells[index].classList.contains('taken') && clickCount===0){
      if (currentPlayer==="red"){
        cells[index].classList.add('taken','red-unfilled')
      }
      else {
        cells[index].classList.add('taken','blue-unfilled')
      }

      turn+=1;
      currentPlayer=players[turn%2];
      displayCurrentPlayer.innerHTML=currentPlayer;
    }
    //other case is that someone is claiming a square to redeem
    else if (cells[index].classList.contains(currentPlayer+"-unfilled")||cells[index].classList.contains(currentPlayer+"-filled")) {
      cells[index].style.backgroundColor='gray';

      if (!squareStack.includes(index)){
        clickCount+=1;
        squareStack.push(index)
        if (cells[index].classList.contains(currentPlayer+"-filled")){
          tempList.push(index);
        }
      }


      if (clickCount===4){

        if (checkSquare(squareStack) && tempList.length!=4){
          claimCells(squareStack);
          score[currentPlayer]+=4-tempList.length;
          for (let item of squareStack){
            cells[item].style.backgroundColor="yellow"
            cells[item].classList.remove(currentPlayer+"-unfilled")
            cells[item].classList.add(currentPlayer+"-filled")
          }
          turn+=1
          currentPlayer=players[turn%2]
          displayCurrentPlayer.innerHTML=currentPlayer;
          displayRedScore.innerHTML=score['red'];
          displayBlueScore.innerHTML=score['blue'];

        }
        else {
          alert('not a valid square! Try again.')

          for (let item of squareStack){
            if (!tempList.includes(item)){
              cells[item].classList.add(currentPlayer+"-unfilled")
              cells[item].classList.remove(currentPlayer+"-filled")

            }
            cells[item].style.backgroundColor="yellow"

          }

      }
        clickCount=0;
        squareStack=[];
        tempList=[];
      }
    }
    if (gameOver()){
      if (score['red']>score['blue']){
        displayResult.innerHTML=`red wins ${score['red']} to ${score['blue']}`;
      }
      else if (score['blue']>score['red']){
        displayResult.innerHTML=`blue wins ${score['blue']} to ${score['red']}`;
      }
      else {
        displayResult.innerHTML=`blue and red tie at ${score[blue]}`
      }
      cells.forEach(cell=>{cell.classList.add('taken')})
      displayCurrentPlayer.style.visibility="hidden";

    }

  }

})
