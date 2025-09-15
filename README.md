## About this project

PennyPincher is a progressive web app (PWA) that is a minimalist budgeting tool, designed so users can quickly & easily:
- Keep a record of transactions (income, expenses)
- Create a weekly, biweekly, or monthly budget sheet.
- Monitor account balances like savings and allowance, which update in real-time in response to changes in your __transaction list__ & __budget sheet__.
- Create personal savings goals that the user can keep track of their contributions to.


The transactions, balances, and other data you input are stored in the browser using [IndexedDB](https://www.w3.org/TR/IndexedDB/).

#### For instructions on  how to download PWAs, please see _https://web.dev/learn/pwa/installation_ :)

### Built with [SolidJS](https://github.com/solidjs/solid) & [Dexie.js](https://dexie.org/), (HTML, CSS, JS)


## Project Roadmap

- [x] List of transactions (income, expenses) with optional user-defined tags to help sort
- [X] Budget sheet implementation
- [X] Savings goal implementation
- [X] Ability to save & load user profile & data
- [X] Optional payment plan for each savings goal
    - [X] Display the amount of money the user should contribute each week/biweek/month, based on the end date of the goal.
    - [ ] Calendar view of all the user's payment plans
- [ ] Dark mode 


