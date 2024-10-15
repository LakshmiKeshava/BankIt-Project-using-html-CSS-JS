'use strict'

const account1 = {
    owner: 'Lakshmi Keshava',
    movements: [2000, 4000, -1500, -150, 6000, -130, 70, 1300],
    interest: 1.2,
    pin: 1111
}
const account2 = {
    owner: 'Test User',
    movements: [3000, 7000, -2500, 150, 7000, -1300, 700, 300],
    interest: 1.5,
    pin: 1111
}
const account3 = {
    owner: 'User Test',
    movements: [31000, -7000, -500, 1050, 17000, -2300, 80, 100],
    interest: 1.5,
    pin: 1111
}

const accounts = [account1, account2,account3];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUserName = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? movements.slice().sort((a,b)=>a-b): movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'

        const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>
    `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })


}
// displayMovements(account1.movements);

const eurToUsd = 1.1;
const movements = [2000, 4000, -1500, -150, 6000, -130, 70, 1300]
// const newMovements = movements.map(function(mov){
//     return mov*eurToUsd;
// })

// const newMovements = movements.map( mov => mov * eurToUsd );
//  console.log(newMovements);


//This is to make shot names :Example:  Lakshmi Keshava as lk
const creatingUsers = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(function (namePart) {
                return namePart[0];
            }).join('')
    })
}
creatingUsers(accounts);

console.log(accounts);


// var deopsits = movements.filter(function(mov){
//     return mov>0
// })

// var withdrawals = movements.filter(function(mov){
//     return mov<0
// })
// console.log(deopsits);
// console.log(withdrawals);

// var balance = account1.movements.reduce(function(acc,curr,i,arr){
//     console.log(`Iteration Number ${i} accumulator ${acc} Current ${curr}`);
// return acc+curr
// },0)
// console.log(balance);

const calcDisplayBalance = function (acc) {
    // acc.balance = acc.movements.reduce(function (acc, curr, i, arr) {
    //     return acc + mov;
    // }, 0)
    acc.balance = acc.movements.reduce((acc, mov) => acc+mov, 0);
    labelBalance.textContent = `${acc.balance}`;
}

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = incomes + '€';


    const outcomes = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = Math.abs(outcomes) + '€';
    // return {incomes, outcomes};


    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interest) / 100)
        .filter((int, i, arr) => {
            console.log(arr);
            return int >= 1;
        })
        .reduce((acc, interest) => acc = acc + interest, 0);
    labelSumInterest.textContent = interest + '€';
}
// calcDisplaySummary(account1.movements);

//EVENT HANDLERS

let currentAccount;

function updateUI(acc) {
    displayMovements(acc.movements);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc);
}

btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUserName.value);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;
        inputLoginUserName.value = '';
        inputLoginPin.value = '';
        inputLoginPin.blur();

        // displayMovements(currentAccount.movements);
        // calcDisplayBalance(currentAccount);
        // calcDisplaySummary(currentAccount);
        updateUI(currentAccount);
    }
})

//Transfer

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);

    const receiversAccount = accounts.find(acc => acc.username === inputTransferTo.value);
    console.log(receiversAccount);
    console.log(amount);

    inputTransferAmount.value = inputTransferTo.value =''; 
    if (amount > 0 && currentAccount.balance >= amount && receiversAccount && receiversAccount?.username !== currentAccount.username) {
        console.log("valid");
        currentAccount.movements.push(-amount);
        receiversAccount.movements.push(amount);
        updateUI(currentAccount);
    }
});

//Loan 
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);

    if(amount>0 && currentAccount.movements.some(mov => 
        mov >=amount *0.1)){
            currentAccount.movements.push(amount);
            updateUI(currentAccount);
        }

        inputLoanAmount.value= '';
})

//Deleting account
btnClose.addEventListener('click', function(e){
    e.preventDefault();

    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin ){
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );
        console.log(index);
        accounts.splice(index,1);
        containerApp.style.opacity = 0;
        inputCloseUsername.value = inputClosePin.value = ''
    }
})

//sorting
let sorted = false
btnSort.addEventListener('click', function(e){
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})



// labelBalance.textContent = `${balance}`;

//finding maximum

// const maximum = function(movements){
// const max = movements.reduce(function(acc, mov){
//     if(acc>mov){
//         return acc; 
//     }
//     else{
//         return mov;
//     }
// },movements[0])
// }

// console.log(max);


//Chaining method
var totalAmtDepositUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc = acc + mov);
console.log(totalAmtDepositUSD);

//Find Method
var findAcc = accounts.find(acc => acc.owner === 'Test User');
console.log(findAcc);

// const arr1=[1,-8,9,10,-12,-13];
// arr1.sort((a,b)=>{
//     if(a>b) return 1;
//     if(a<b) return -1;
// })
// console.log(arr1);

// const arr2 = ['a', 'z', 'm', 'l', 'p']
// arr2.sort((a,b)=>{
//     if(a>b) return -1;
//     if(a<b) return 1;
// });

// console.log(arr2);








