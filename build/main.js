// inspired by https://www.youtube.com/watch?v=YDkB4xpP6Sc&list=PLnHJACx3NwAey1IiiYmxFbXxieMYqnBKF&index=16

const _ = className => document.querySelector(className);

class UI {
  constructor() {
    this.body = _('body');
    // === FEEDBACKS ===
    this.expenseFeedback = _('.expense-feedback');
    this.expenseAddedFeedback = _('.expense-added-feedback');
    this.budgetFeedback = _('.budget-feedback');
    this.updateExpenseFeedback = _('.update-expense-feedback');
    this.editExpenseFeedback = _('.edit-expense-feedback');
    // === PANELS IN MENU (expense, budget, reset) ===
    // expense form
    this.expenseForm = _('.expenses-panel');
    this.expenseInput = _(".expense-input");
    this.amountInput = _(".expense-amount-input");
    // budget form
    this.budgetForm = _('.budget-panel');
    this.budgetInput = _('.budget-input');
    // reset form
    this.resetForm = _('.reset-panel');
    // === MANAGE PANELS (update, edit) ===
    this.manageExpensePanels = document.querySelectorAll('.manage-expense-panel');
    // update expense form 
    this.updateForm = _('.update-expense-panel');
    this.updateInput = _('.update-input');
    // edit expense form
    this.editForm = _('.edit-expense-panel');
    this.editInput = _('.edit-input');
    this.editAmountInput = _('.edit-input-amount');
    // === APP INFO ===
    // app current summary
    this.budgetAmount = _('.budget-amount');
    this.expenseAmount = _('.expense-amount');
    this.balanceAmount = _('.balance-amount');
    // app expected summary
    this.expectedExpenseAmount = _('.expected-expense-amount');
    this.expectedBalanceAmount = _('.expected-balance-amount');
    this.expectedBalance = _('.expected-balance');
    // expected balance summary
    this.showExpectedBtn = _('.btn-open-expected');
    this.hideExpectedBalance = _('.expected-balance-hide');
    // === LISTS AND ARRAYS ===
    // expenses list
    this.expensesList = _('.expense-list');
    // arrays
    this.expenseArrs = [
      this.itemList = [],
      this.maxAmounts = [],
      this.currentAmounts = [],
      this.tempExpense = []
    ];
    this.itemID = 0;
    // === THE REST ===
    // menu
    this.openMenuBtn = _('.open-menu-btn');
    this.closeMenuBtn = _('.close-btn--menu');
    this.menu = _('.menu');
    this.menuOverlay = _('.menu-overlay');
    this.menuBtns = document.querySelectorAll('.menu-btn');
    this.expensesBtn = _('.menu-btn--expenses');
    this.budgetBtn = _('.menu-btn--budget');
    this.resetBtn = _('.menu-btn--reset');
    this.settingsBtn = _('.menu-btn--settings');
    // menu panels
    this.panels = document.querySelectorAll('.panel');
    this.expensesPanel = _('.expenses-panel');
    this.budgetPanel = _('.budget-panel');
    this.resetPanel = _('.reset-panel');
    this.settingsPanel = _('.settings-panel');
    this.panelsClassesArr = ['expenses-panel', 'budget-panel', 'reset-panel', 'settings-panel'];
    // search
    this.searchBtn = _('.expenses__search-btn');
    this.searchInput = _('.expenses__search');
  };

  // SHOW BALANCE
  showBalance() {
    // show expected balance
    const expectedExpense = this.totalExpense(this.maxAmounts, this.expectedExpenseAmount);
    const expectedTotal = parseInt(this.budgetAmount.textContent) - expectedExpense;
    this.expectedBalanceAmount.textContent = expectedTotal;

    // show current balance
    const currentExpense = this.totalExpense(this.currentAmounts, this.expenseAmount);
    const currentTotal = parseInt(this.budgetAmount.textContent) - currentExpense;
    this.balanceAmount.textContent = currentTotal;
  };

  // CALCULATE EXPENSE
  totalExpense(amounts, content) {
    let total = 0;

    if (this.itemList.length > 0) {
      total = amounts.reduce((acc, curr) => {
        acc += curr;
        return acc;
      }, 0);
    };
    content.textContent = total;

    return total;
  };

  // ADD EXPENSE
  addExpense(expense) {
    const li = document.createElement('li');
    li.classList.add('expense-item');
    li.dataset.title = `${expense.title}`;
    li.innerHTML = `
      <h6 class="expense-item__title">${expense.title}</h6>
      <h6 class="expense-item__amount"><span class="bold current-amount">${expense.currentAmount}</span> (<span class="max-amount">${expense.expectedAmount}</span>)</h6>
      <div class="expense-item__edit-form">
        <button class="btn btn-update" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-edit" data-id="${expense.id}">
          <i class="far fa-edit"></i>
        </button>
        <button class="btn btn-delete" data-id="${expense.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    this.expensesList.insertBefore(li, this.expensesList.childNodes[0]);
  };

  // SUBMIT EXPENSE FORM
  submitExpenseOrEditForm(name, amount, feedback) {
    const expenseValue = name.value;
    const amountValue = amount.value;

    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      feedback.classList.add('show-feedback');
      feedback.textContent = 'Values cannot be empty or negative.';
      setTimeout(() => {
        feedback.classList.remove('show-feedback');
      }, 3000);
    } else {
      let expectedAmount = parseInt(amountValue);
      name.value = '';
      amount.value = '';

      let currentAmount = 0;

      let expense = {
        id: this.itemID,
        title: expenseValue,
        expectedAmount,
        currentAmount
      };

      this.itemID++;
      this.expenseArrs[0].push(expense);
      this.expenseArrs[1].push(expense.expectedAmount);
      this.expenseArrs[2].push(expense.currentAmount);

      this.addExpense(expense);
      this.showBalance();

      if (name.parentElement.classList.contains('manage-expense-panel')) this.closeManagePanel();

      if (name.parentElement.classList.contains('expenses-panel')) {
        this.expenseAddedFeedback.classList.add('show-feedback');
        setTimeout(() => {
          this.expenseAddedFeedback.classList.remove('show-feedback');
        }, 3000);
      };
    };
  };

  // SUBMIT BUDGET
  submitBudgetForm() {
    const value = this.budgetInput.value;

    if (value === '' || value < 0) {
      this.budgetFeedback.classList.add('show-feedback');
      this.budgetFeedback.textContent = 'Value cannot be empty or negative.';
      setTimeout(() => {
        this.budgetFeedback.classList.remove('show-feedback');
      }, 3000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
      this.closeMenu();
    };
  };

  // SUBMIT UPDATE FORM
  submitUpdateForm() {
    const input = this.updateInput;
    const addAmount = input.value;

    if (addAmount === '' || addAmount < 0) {
      this.updateExpenseFeedback.classList.add('show-feedback');
      this.updateExpenseFeedback.textContent = 'Value cannot be empty or negative.';
      setTimeout(() => {
        this.updateExpenseFeedback.classList.remove('show-feedback');
      }, 3000);
    } else {
      input.value = '';

      let currentAmount = this.tempExpense[2] + parseInt(addAmount);

      let expense = {
        id: this.itemID,
        title: this.tempExpense[0],
        expectedAmount: this.tempExpense[1],
        currentAmount
      };

      this.itemID++;
      this.expenseArrs[0].push(expense);
      this.expenseArrs[1].push(expense.expectedAmount);
      this.expenseArrs[2].push(expense.currentAmount);

      this.addExpense(expense);
      this.showBalance();

      this.tempExpense = [];

      if (input.parentElement.classList.contains('manage-expense-panel')) this.closeManagePanel();
    };
  };

  // UPDATE EXPENSE
  updateExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement;

    // remove from DOM
    this.expensesList.removeChild(parent);

    // remove from lists
    let index = this.expenseArrs[0].findIndex(element => {
      return element.id === id;
    });
    let expense = this.expenseArrs[0].find(element => {
      return element.id === id;
    });

    // save expense in temp array
    this.tempExpense.push(expense.title, expense.expectedAmount, expense.currentAmount);

    this.expenseArrs[0].splice(index, 1);
    this.expenseArrs[1].splice(index, 1);
    this.expenseArrs[2].splice(index, 1);

    this.showBalance();
  };

  // EDIT EXPENSE
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement;

    // remove from DOM
    this.expensesList.removeChild(parent);

    // remove from lists
    let index = this.expenseArrs[0].findIndex(element => {
      return element.id === id;
    });
    let expense = this.expenseArrs[0].find(element => {
      return element.id === id;
    });

    this.expenseArrs[0].splice(index, 1);
    this.expenseArrs[1].splice(index, 1);
    this.expenseArrs[2].splice(index, 1);

    // show in edit expense form
    this.editInput.value = expense.title;
    this.editAmountInput.value = expense.expectedAmount;

    this.showBalance();
  };

  // DELETE EXPENSE
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement;

    // remove from DOM
    this.expensesList.removeChild(parent);

    // remove from lists
    let index = this.expenseArrs[0].findIndex(element => {
      return element.id === id;
    });

    this.expenseArrs[0].splice(index, 1);
    this.expenseArrs[1].splice(index, 1);
    this.expenseArrs[2].splice(index, 1);

    this.showBalance();
  };

  // RESET APP
  resetApp() {
    this.itemID = 0;
    this.expensesList.innerHTML = '';
    this.budgetAmount.textContent = '0';

    this.expenseArrs.forEach(arr => {
      arr.length = 0;
    });

    this.showBalance();
    this.closeMenu();
  };

  // SEARCH FILTER
  searchForExpense() {
    let value = this.searchInput.value.toLowerCase().trim();
    const items = document.querySelectorAll('.expense-item');
    items.forEach(item => {
      let type = item.dataset.title;

      (type.includes(value)) ? item.style.display = 'flex' : item.style.display = 'none';

      let length = value.length;
      let match = type.slice(0, length);

      (value === match) ? item.style.display = 'flex' : item.style.display = 'none';
    });
  };

  // OPEN/CLOSE
  openMenu() {
    this.body.classList.add('menu-opened');
    this.menu.classList.add('menu-opened');
    this.panels.forEach(panel => {
      panel.classList.add('menu-opened');
    });
    this.menuOverlay.classList.add('menu-opened');
  };

  closeMenu() {
    this.body.classList.remove('menu-opened');
    this.menu.classList.remove('menu-opened');
    this.closePanel();
    this.panels.forEach(panel => {
      panel.classList.remove('menu-opened');
    });
    this.menuOverlay.classList.remove('menu-opened');
  };

  closePanel(className) {
    this.panels.forEach(panel => {
      if (!panel.classList.contains(className)) panel.classList.remove('opened');
    });
  };

  closeManagePanel() {
    this.manageExpensePanels.forEach(panel => {
      if (panel.classList.contains('shown')) panel.classList.remove('shown', 'fade-in');
    });
  };
};

function eventListeners() {
  const ui = new UI();

  // SUBMIT BUDGET FORM
  ui.budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    ui.submitBudgetForm();
  });

  // SUBMIT EXPENSE FORM
  ui.expenseForm.addEventListener('submit', e => {
    e.preventDefault();
    ui.submitExpenseOrEditForm(ui.expenseInput, ui.amountInput, ui.expenseFeedback);
    ui.expenseInput.focus();
  });

  // SUBMIT RESET FORM
  ui.resetForm.addEventListener('submit', e => {
    e.preventDefault();
    ui.resetApp();
  });

  // SUBMIT UPDATE FORM
  ui.updateForm.addEventListener('submit', e => {
    e.preventDefault();
    ui.submitUpdateForm();
  });

  // SUBMIT EDIT FORM
  ui.editForm.addEventListener('submit', e => {
    e.preventDefault();
    ui.submitExpenseOrEditForm(ui.editInput, ui.editAmountInput, ui.editExpenseFeedback);
  });

  // SEARCH FOR EXPENSE
  ui.searchInput.addEventListener('keyup', () => {
    ui.searchForExpense();
  });

  // UI LISTENERS
  ui.searchBtn.addEventListener('click', () => {
    ui.searchInput.classList.toggle('opened');
  });
  ui.showExpectedBtn.addEventListener('click', () => {
    ui.hideExpectedBalance.classList.toggle('show');
  });
  ui.openMenuBtn.addEventListener('click', () => {
    ui.openMenu();
  });
  ui.closeMenuBtn.addEventListener('click', () => {
    ui.closeMenu();
  });
  ui.menuOverlay.addEventListener('click', () => {
    ui.closeMenu();
  });
  ui.menuBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      ui.closePanel(ui.panelsClassesArr[index]);
      ui.panels[index].classList.toggle('opened');
    });
  });

  // MANAGE PANELS BTNS (btns in item in expensesList)
  ui.expensesList.addEventListener('click', e => {
    let expense = e.target.parentElement;

    if (expense.classList.contains('btn-update')) {
      ui.updateForm.classList.add('shown', 'fade-in');
      ui.updateExpense(expense);

    } else if (expense.classList.contains('btn-edit')) {
      ui.editForm.classList.add('shown', 'fade-in');
      ui.editExpense(expense);

    } else if (expense.classList.contains('btn-delete')) {
      ui.deleteExpense(expense);
    };
  });
};

document.addEventListener('DOMContentLoaded', () => {
  eventListeners();
});