const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cashier'
    },
    status: String,
    action: String,
    value: Number
},
    {
        timestamps: true,
    })

TransactionSchema.statics.aggJoinCreatedBy = [
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "obj_creator"
        }
    },
    { $unwind: { path: "$obj_creator", preserveNullAndEmptyArrays: true } }
]

TransactionSchema.statics.aggJoinOwner = [
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "obj_owner"
        }
    },
    { $unwind: { path: "$obj_owner", preserveNullAndEmptyArrays: true } }
]

TransactionSchema.statics.aggJoinCashier = [
    {
        $lookup: {
            from: "cashiers",
            localField: "cashier",
            foreignField: "_id",
            as: "obj_cashier"
        }
    },
    { $unwind: { path: "$obj_cashier", preserveNullAndEmptyArrays: true } }
]

TransactionSchema.statics.aggJoinAll = [
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "obj_creator"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "obj_owner"
        }
    },
    {
        $lookup: {
            from: "cashiers",
            localField: "cashier",
            foreignField: "_id",
            as: "obj_cashier"
        }
    },
    { $unwind: { path: "$obj_creator", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_owner", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_cashier", preserveNullAndEmptyArrays: true } }
]

TransactionSchema.statics.aggJoinAll = [
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "obj_creator"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "obj_owner"
        }
    },
    {
        $lookup: {
            from: "cashiers",
            localField: "cashier",
            foreignField: "_id",
            as: "obj_cashier"
        }
    },
    { $unwind: { path: "$obj_creator", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_owner", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_cashier", preserveNullAndEmptyArrays: true } }
]


TransactionSchema.statics.aggGroupByDate = [
    {
        $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "obj_creator"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "obj_owner"
        }
    },
    {
        $lookup: {
            from: "cashiers",
            localField: "cashier",
            foreignField: "_id",
            as: "obj_cashier"
        }
    },
    { $unwind: { path: "$obj_creator", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_owner", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$obj_cashier", preserveNullAndEmptyArrays: true } },
    {
        $group: {
            _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            data: {
                $push: {
                    _id: "$_id",
                    createdBy: {
                        _id: "$obj_creator._id",
                        username: "$obj_creator.username",
                        mail: "$obj_creator.mail"
                    },
                    owner: {
                        _id: "$obj_owner._id",
                        username: "$obj_owner.username",
                        mail: "$obj_owner.mail"
                    },
                    cashier: {
                        _id: "$obj_cashier._id",
                        owner: "$obj_cashier.owner",
                        name: "$obj_cashier.name"
                    },
                    status: "$status",
                    action: "$action",
                    value: "$value",
                }
            }
        }
    },
    { $sort: { "_id.date": -1 } }
]

module.exports = mongoose.model('Transaction', TransactionSchema);