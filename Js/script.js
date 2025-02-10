'use strict';

// Implement Accounts  Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-05-25T10:51:36.790Z'
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//##########################################################################################################
// Elements
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//#########################################################################################################

// Functions
//-----------

// Update Ui
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalacne(acc);
  calcDisplaySummary(acc);
};

// Create Movements Date
const formatMovementsDate = function (date, locale) {
  let now = new Date();
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs((date1 - date2) / 86400000));
  };
  let daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format();
};

// Formate currency
const formatCur = function (value, locale, currency) {
  let formattedMov = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
  return formattedMov;
};

// Display Movements
const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
    let formattedMov = formatCur(mov, acc.locale, acc.currency);

    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let date = new Date(acc.movementsDates[i]);
    let displayDate = formatMovementsDate(date, acc.locale);
    const html = `
                <div class="movements__row">
                      <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
                      <div class="movements__date">${displayDate}</div>
                      <div class="movements__value">${formattedMov}</div>
                </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance
const calcDisplayBalacne = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Create Username In Each Object
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

// Display The Summary
let calcDisplaySummary = function (acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  let out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  );
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// logOut Timer
let logOutTimer = function () {
  let tick = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = '0';
    }
    time--;
  };
  let time = 300;
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
};

// Login Feature
let currentUser, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back , ${
      currentUser.owner.split(' ')[0]
    }`;
    // Create Date
    let dateAndTime = Intl.DateTimeFormat(currentUser.locale).format();
    labelDate.textContent = dateAndTime;

    containerApp.style.opacity = '100';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = logOutTimer();
    updateUI(currentUser);
  }
  // console.log(currentUser);
});

//Transfer Feature
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amout = Number(inputTransferAmount.value);
  const reciveUser = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    currentUser.balance >= amout &&
    amout > 0 &&
    reciveUser &&
    reciveUser.username !== currentUser.username
  ) {
    currentUser.movements.push(-amout);
    currentUser.movementsDates.push(new Date().toISOString());
    reciveUser.movements.push(amout);
    reciveUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
    inputTransferAmount.value = inputTransferTo.value = '';
    if (timer) clearInterval(timer);
    timer = logOutTimer();
  }
});

//Loan Feature
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = currentUser.movements.some(
    mov => mov > Number(inputLoanAmount.value) * 0.1
  );
  if (loanAmount && inputLoanAmount.value) {
    setTimeout(() => {
      currentUser.movements.push(Math.floor(inputLoanAmount.value));
      currentUser.movementsDates.push(new Date().toISOString());
      updateUI(currentUser);
      inputLoanAmount.value = '';
    }, 2000);
  }
  if (timer) clearInterval(timer);
  timer = logOutTimer();
});

// Close Feature
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let userIndex = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );
  if (
    inputCloseUsername?.value === currentUser.username &&
    Number(inputClosePin?.value) === currentUser.pin
  ) {
    accounts.splice(userIndex, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//Sort Array Feature
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (sorted === false) {
    const copyArr = [...currentUser.movements];
    const arrSorted = copyArr.sort((a, b) => a - b);
    currentUser.movements = arrSorted;
    displayMovements(currentUser);
    sorted = true;
  } else if (sorted === true) {
    const copyArr = [...currentUser.movements];
    const arrSorted = copyArr.sort((a, b) => b - a);
    currentUser.movements = arrSorted;
    displayMovements(currentUser);
    sorted = false;
  }
  // console.log(sorted);
});
