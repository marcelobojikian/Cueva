const Dashboard = require('../models/Dashboard')
const Transaction = require('../models/Transaction')
const Cashier = require('../models/Cashier')

module.exports = (function () {

    class Action {

        async Run(userLogged, transaction, action) {

            const transactionInDB = await Transaction.findById(transaction)
            const { owner, cashier, action: actionTransaction, status, value } = transactionInDB

            switch (action) {
                case 'schedule':
                    console.log('transaction:', transaction, 'foi', action)
                    break;
                case 'submit':

                    await this.havePermission(userLogged, owner)

                    if (status == 'SUBMITED') {
                        return
                    }

                    if (status == 'FINISHED') {
                        throw new Error(`Transaction finished`);
                    }

                    if (status == 'CANCELED') {
                        throw new Error(`Transaction canceled`);
                    }

                    transactionInDB.status = 'SUBMITED'

                    transactionInDB.save()

                    console.log('transaction:', transaction, 'is', action)

                    break;
                case 'confirm':

                    await this.havePermission(userLogged, owner)

                    if (status == 'FINISHED') {
                        return
                    }

                    if (status == 'CANCELED') {
                        throw new Error(`Transaction canceled`);
                    }

                    const cashiersInDB = await Cashier.findById(cashier)

                    console.log(cashiersInDB.name, ' current:', cashiersInDB.balance)

                    if (actionTransaction == 'deposit') {
                        cashiersInDB.balance += value
                    } else if (actionTransaction == 'withdraw') {
                        cashiersInDB.balance -= value
                    }

                    console.log(actionTransaction, value, 'in', cashiersInDB.name, 'Total:', cashiersInDB.balance)

                    transactionInDB.status = 'FINISHED'

                    transactionInDB.save()
                    cashiersInDB.save()

                    console.log('Action', action, 'concluida')
                    break;

                case 'cancel':

                    await this.havePermission(userLogged, owner)

                    if (status == 'CANCELED') {
                        return
                    }

                    if (status == 'FINISHED') {
                        throw new Error(`Transaction finished`);
                    }

                    transactionInDB.status = 'CANCELED'

                    transactionInDB.save()

                    console.log('transaction:', transaction, 'foi', action)
                    break;

                default: throw new Error(`Action '${action}' invalid`);
            }

        }

        async havePermission(userLogged, owner) {

            const dashboard = await Dashboard.findOne({ user: userLogged })
            const enableToConfirm = dashboard.flatmates
            enableToConfirm.push(userLogged.id)

            if (!enableToConfirm.includes(owner._id)) {
                console.log(owner._id, 'not in', enableToConfirm)
                throw new Error(`User does not have permission for this operation`);
            }

        }

    }

    return Action;

})();