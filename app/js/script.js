//"use strict";
console.clear();
const CELL_SIZE = 100;
const CELL_STYLES = {
    width : CELL_SIZE + "px",
    height : CELL_SIZE + "px",
    position : "absolute",
    textAlign : "center",
    fontSize : "50px"
};

const START_MODAL_WRAPP_STYLES ={
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, .8)'
}

const START_MODAL_INNER_STYLES ={
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    maxWidth: '600px'
}

const SIZE = 3;
let positions = [];
let cells = [];


// createModal();

createContainer();

createField(SIZE);





// Рандомний перший хід
if (mathRandon2()){
    // computerStep();
}
computerStep();
function createModal() {
    let modalWrapp = document.createElement("DIV");
    let modalInner = document.createElement("DIV");
    let modalTitle = document.createElement("P");
    let checkBoxStep = document.createElement("BUTTON");
    let startBtn = document.createElement("BUTTON");

    modalWrapp.id = 'modalWrapp';
    modalTitle.textContent = 'Налаштування';
    checkBoxStep.textContent = 'Випадковий перший хід';
    startBtn.textContent = 'Почати гру';

    setStyle (modalWrapp, START_MODAL_WRAPP_STYLES);
    setStyle (modalInner, START_MODAL_INNER_STYLES);


    startBtn.addEventListener('click', startNewGame);

    document.body.append(modalWrapp);
    modalWrapp.append(modalInner);
    modalInner.append(modalTitle, checkBoxStep, startBtn);
}

function startNewGame(settings) {
    let fieldContainer = document.getElementById("modalWrapp");
    fieldContainer.style.display = 'none';

    for (let i = 0; i < SIZE; i++) {
        positions[i] = [];
        for (let j = 0; j < SIZE; j++){
            positions[i][j] = -1;
            cells[i * SIZE + j].textContent = '';
            cells[i * SIZE + j].disabled = false;
        }
    }

}

function createContainer() {
    let cellsWrapp = document.createElement("DIV");
    cellsWrapp.id = 'field';
    cellsWrapp.style.position = "relative";

    document.body.append(cellsWrapp);
}

function createField(size) {
    let fieldContainer = document.getElementById("field");
    let counter = 0;
    for (let i = 0; i < size; i++) {
        positions[i] = [];
        for (let j = 0; j < size; j++){
            positions[i][j] = -1;
            counter++;
            cells.push(cell(fieldContainer, i, j, counter));
        }
    }

    return cells;
}

function cell(parent, i, j/*, counter*/) {
    let top = i;
    let left = j;
    let cell = document.createElement("BUTTON");

    setStyle(cell, CELL_STYLES);
    cell.style.top = top * CELL_SIZE + "px";
    cell.style.left = left * CELL_SIZE + "px";
    cell.textContent = "";
    cell.addEventListener("click", function(event) {
        listener(event, i, j, cell);
    });
    parent.appendChild(cell);

    return cell;
}

function setStyle(obj, styles){
    for(let style in styles){
        obj.style[style] = styles[style];
    }
}

function listener(event, i, j, cell) {

    // Не даємо клікнути по тому самому полю
    if (positions[i][j] == 1 || positions[i][j] == 0){
        console.log('Please chose other field');
        return;
    }

    cell.textContent = "X";
    positions[i][j] = 1;
    let win = checkField(1);
    win ? playAgain("player WIN") : computerStep() ? playAgain("computer WIN") : console.log("next run");
}

function computerStep() {
    let pos = checkFree();
    if(pos) {
        cells[pos[0] * SIZE + pos[1]].textContent = "O"
    } else {
        playAgain("DRAW");
        return;
    }
    positions[pos[0]][pos[1]] = 0;
    let win = checkField(0);
    return win;
}

function checkFree() {
    let freeCells = [];
    positions.forEach(function(row, i) {
        row.forEach(function(val, j) {
            if(positions[i][j] == -1){
                freeCells.push([i, j]);
            }
        });
    });

    if (positions[Math.floor(SIZE / 2)][Math.floor(SIZE / 2)] == -1) {
        return ([Math.floor(SIZE / 2), Math.floor(SIZE / 2)]);
    }

    let weights = {}, weightsSkynet = {};
    let horizont = 0, vertical = 0, diagonalOne = 0, diagonalTwo = 0;
    let horizontSkynet = 0, verticalSkynet = 0, diagonalOneSkynet = 0, diagonalTwoSkynet = 0;

    let diagonalOneShadow = 0, diagonalTwoShadow = 0, weightShadow = 0;

    if ((freeCells.length == (SIZE * SIZE) - 1) && positions[Math.floor(SIZE / 2)][Math.floor(SIZE / 2)] == 1) {
        mathRandon2() ? diagonalOne = 1 : diagonalTwo = 1;
    }





    let valueUser = 1;
    let valueSkynet = 0;
    outer: for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {

            if(i == j && positions[i][j] == valueUser) {
                diagonalOne++;
                diagonalOneSkynet--;
                diagonalOneShadow++;
            }

            if(i == j && positions[i][j] == valueSkynet) {
                diagonalOne--;
                diagonalOneSkynet++;
            }

            if (diagonalOne > 0) {
                weights['M'] = diagonalOne;
            }

            if (diagonalOneSkynet > 0) {
                weightsSkynet['M'] = diagonalOneSkynet;
            }

            if(i == (SIZE - j - 1) && positions[i][j] == valueUser) {
                diagonalTwo++;
                diagonalTwoSkynet--;
                diagonalTwoShadow++;
            }

            if(i == (SIZE - j - 1) && positions[i][j] == valueSkynet) {
                diagonalTwo--;
                diagonalTwoSkynet++;
            }

            if (diagonalTwo > 0) {
                weights['S'] = diagonalTwo;
            }

            if (diagonalTwoSkynet > 0) {
                weightsSkynet['S'] = diagonalTwoSkynet;
            }

            if ((diagonalOneShadow == SIZE - 1 || diagonalTwoShadow == SIZE - 1) && (freeCells.length == (SIZE * SIZE) - SIZE) && positions[Math.floor(SIZE / 2)][Math.floor(SIZE / 2)] == 0) {
                weightShadow = 2;

                mathRandon2() ? weights['G' + (SIZE - 2)] = weightShadow : weights['V' + (SIZE - 2)] = weightShadow;

                break outer;
            }

            if(positions[i][j] == valueUser) {
                horizont++;
                horizontSkynet--;
            }

            if(positions[i][j] == valueSkynet) {
                horizont--;
                horizontSkynet++;
            }

            weights['G' + i.toString()] = horizont;

            weightsSkynet['G' + i.toString()] = horizontSkynet;

            // calkGVWeight('G', i, j, valueUser, valueSkynet, horizont, horizontSkynet, weights, weightsSkynet);


            for(let l = 0; l < SIZE; l++){

                // calkGVWeight('V', l, j, valueUser, valueSkynet, vertical, verticalSkynet, weights, weightsSkynet);

                if(positions[l][j] == valueUser) {
                    vertical++;
                    verticalSkynet--;
                }

                if(positions[l][j] == valueSkynet) {
                    vertical--;
                    verticalSkynet++;
                }

                weights['V' + j.toString()] = vertical;
                weightsSkynet['V' + j.toString()] = verticalSkynet;
            }




            vertical = 0;
            verticalSkynet = 0;
        }
        horizont = 0;
        horizontSkynet = 0;
    }




    console.log(weights);
    console.log(weightsSkynet);
    let weihgtSkynet = 0;
    let weihgtUser = 0;
    let weihgt = 0;
    let name = '';
    let name1 = '';

    for (var key in weights) {
        if(weights[key] > weihgt) {
            weihgt = weights[key];
            name = key;
        }
    }

    for (var key in weightsSkynet) {
        if(weightsSkynet[key] > weihgtSkynet) {
            weihgtSkynet = weightsSkynet[key];
            name1 = key;
        }
    }

    if ( weihgtSkynet >= weihgt) {
        console.log('берем на виграш')
        name = name1;
        weihgt = weihgtSkynet
    }

    console.log(name);

    let numberOfList = 0;
    let numberOfList2 = [];
    outer2:for (var i = 0; i < freeCells.length; i++) {
        let bufferValue = 0;
        if (name[0] == 'G' && freeCells[i][0] == name[1]) {
            console.log(`Номер який можна брати для натиску штучному інтелекту щоб не здути ${i}`);
            numberOfList = i;
            numberOfList2.push(i);
            // console.log(numberOfList2);
        } else if (name[0] == 'V' && freeCells[i][1] == name[1]) {

            console.log(`Номер який можна брати для натиску штучному інтелекту щоб не здути ${i}`);
            numberOfList = i;
            numberOfList2.push(i);

            if ( freeCells[i - 1] && freeCells[i + 1] && (freeCells[i - 1][0] == freeCells[i + 1][0])) {
                console.log(`Номер який можна брати для натиску штучному інтелекту щоб не здути ${i}`);
                numberOfList2 = numberOfList2.filter(function(elem, index) {
                    if (elem == i)
                        return elem;
                });
                console.log(numberOfList2);
                break outer2;
            }


        } else if (name[0] == 'M' && freeCells[i][0] == freeCells[i][1]) {
            console.log(`Номер який можна брати для натиску штучному інтелекту щоб не здути ${i}`);
            numberOfList = i;
            numberOfList2.push(i);
            // console.log(numberOfList2);
        } else if (name[0] == 'S' && freeCells[i][0] + freeCells[i][1] == SIZE-1 ) {
            console.log(`Номер який можна брати для натиску штучному інтелекту щоб не здути ${i}`);
            numberOfList = i;
            numberOfList2.push(i);
            // console.log(numberOfList2);
        }
    }


    if (numberOfList2.length) {
        if (mathRandon2()) {
            numberOfList = numberOfList2[1] || numberOfList2[0];
        }
        else {
            numberOfList = numberOfList2[0];
        }
    }

    else {
        numberOfList = 0;
    }

    let freeCell = freeCells[Math.floor(Math.random() * freeCells.length)];

    if (weihgt >= 1) {
        freeCell = freeCells[numberOfList];
    }

    console.log(freeCells);
    return freeCell;
}


function calkGVWeight(name, i, j, valUser, valSkynet, rezUser, rezSkynet, objUser, objSkynet ) {
    if( positions[i][j] == valUser ) {
        rezUser++
        rezSkynet--
    }

    if(positions[i][j] == valSkynet) {
        rezUser--;
        rezSkynet++;
    }

    objUser[name + i.toString()] = rezUser;

    objSkynet[name + i.toString()] = rezSkynet;
}

function checkField(value) {
    let win = false;
    let horizont = 0, vertical = 0, diagonalOne = 0, diagonalTwo = 0;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {

            if(positions[i][j] == value) {
                horizont++;
            }

            for(let l = 0; l < SIZE; l++){
                if(positions[l][j] == value) {
                    vertical++;
                }
            }
            if(i == j && positions[i][j] == value) {
                diagonalOne++;
            }
            if(i == (SIZE - j - 1) && positions[i][j] == value) {
                diagonalTwo++;
            }

            if(horizont == SIZE || vertical == SIZE || diagonalOne == SIZE || diagonalTwo == SIZE) {
                win = true;
            }

            vertical = 0;
        }
        horizont = 0;
    }

    if(win) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].disabled = true;
        }
    }

    return win;
}

function checkWin() {
    let win = false;
    return win;
}

function mathRandon2(){
    return Math.round(Math.random())
}

function startSettings(winer) {
    if (winer) {
        console.lof(winer);
    }
}

function playAgain(winer) {
    console.log(winer);
// 	let fieldContainer = document.getElementById("modalWrapp");

// 	let timer = setTimeout(function(){
// 		fieldContainer.style.display = 'flex';
// 	}, 1000);
}