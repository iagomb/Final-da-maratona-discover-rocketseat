const div = document.querySelector('.new')
const active = document.querySelector('.modal-overlay')
const cancel = document.querySelector('.cancel')

div.addEventListener('click', clicar())
cancel.addEventListener('click', remove())

function clicar(){
  active.classList.add('active')
  
}

function remove(){
  active.classList.remove('active')
}

/*const transaction = [
{
  description: 'Luz',
  amount: -50000,
  date: '23/01/2021'
},
{
  description: 'Criação Website',
  amount: 50010,
  date: '23/01/2021'
},
{
  description: 'Internet',
  amount: -20050,
  date: '23/01/2021'
}]*/


// Eu preciso somar as entradas
// depois eu preciso somar as saidas e 
// remover das entradas o valor das saidas
// assim, eu terei o total

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))// transforma uma array em uma string com JSON.stringify
  }
  
}

const Transaction = {
  all: Storage.get(), // esta pegando o transaction de lar de fora e agrupando aqui dentro
  
  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index){
    Transaction.all.splice(index, 1)
    App.reload()
  },
  
  incomes(){
    let income = 0;
    // pegar pegar as transações
    // para cada transação,
    Transaction.all.forEach(transaction => {
      // se ela for maior que zero
      if (transaction.amount > 0) {
        // somar a uma variavel e retorna a variavel
        income += transaction.amount;
      }
    })
    return income
  },
  expenses(){
    let expense = 0;
    // pegar pegar as transações
    // para cada transação,
    Transaction.all.forEach(transaction => {
      // se ela for menor que zero
      if (transaction.amount < 0) {
        // somar a uma variavel e retorna a variavel
         expense += transaction.amount
      }
    })
    return expense
  },
  total(){
    return Transaction.incomes() + Transaction.expenses()
  }
}

// Eu preciso pegar as minhas transações do meu
// objeto aqui no javascript
// e colocar lá no HTML 

const DOM = {
  transactionsConteiner: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsConteiner.appendChild(tr)
    
  },
  innerHTMLTransaction(transaction, index){
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="descriptions">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="data">${transaction.date}</td>
      <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
    `
    return html
  },

  updateBalance(){
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransaction(){
    DOM.transactionsConteiner.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value){
    value *= 100
    return Math.round(value)
  },

  formatDate(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
     return signal + value
    
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  
  validateFields(){
    const { description, amount, date } = Form.getValues()
    
    if( description.trim() === "" ||
        amount.trim() === "" ||
        date.trim() === ""){
          throw new Error("Por favor, preencha todos os campos")
        }
  },

  formatValues(){
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event){
    event.preventDefault()

    try{
      // verificar se todas as informações foram preenchidas
      Form.validateFields()
      // formatar os dados para salvar
      const transaction = Form.formatValues()
      // salvar
      Transaction.add(transaction)
      // apagar os dados dos formulario
      Form.clearFields()
      // modal feche
      remove()
      
    } catch(Error){
      alert(Error.message)
    }
    
  }
  
}


App = {
  init(){
    Transaction.all.forEach(DOM.addTransaction);
    
    DOM.updateBalance()

    Storage.set(Transaction.all)

  },
  reload(){
    DOM.clearTransaction()
    App.init()

  },
}

App.init()

/*Transaction.add({
  description: 'Alo',
  amount: 200,
  date: '23/04/2021'
})*/

//Transaction.remove(0)
