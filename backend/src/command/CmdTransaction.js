const Command = require('./Command');
const ActionTransaction = require('./ActionTransaction');

module.exports = (function () {

	class TransactionCommand extends Command {

		constructor(userLogged, transaction, action) {
			super();

			this._userLogged = userLogged
            this._transaction = transaction;
            this._action = action;
		}

		/**
         * @param {String} value
         */
		set Action(value) {
			this._action = value;
		}

		/**
         * @param {String} value
         */
		set Transaction(value) {
			this._action = value;
		}

		async Execute() {
            await new ActionTransaction().Run(this._userLogged, this._transaction, this._action);
		}

	}

	return TransactionCommand;

})();