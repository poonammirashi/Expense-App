const Expense = require("../model/expense");
const path = require("path");
const User = require("../model/users");
const sequelize = require("../database");
const userService = require("../services/usersServices");
const s3Service = require("../services/s3Services");
const UrlFile = require("../model/uplodedFiles");


exports.uploadFile = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringfiedExpenses = JSON.stringify(expenses)
        const userId = req.user.id;
        const filename = `Expense/${userId}/${new Date()}.txt`;
        const fileUrl = await s3Service.uploadFile(stringfiedExpenses, filename);
        const today = `${new Date()}`;
                const userUrl = await req.user.createUrlfile({ url: fileUrl, date: today.split("G")[0] });
        res.status(200).json({ userUrl, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }

}

exports.getfiles = async (req, res) => {
    try {
        const files = await req.user.getUrlfiles();
        res.status(200).json({ files, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }
}


exports.postAddExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        console.log(req.header("Authorization"))
        const { amount, description, category } = req.body;
        if (userService.isValidString(amount) || userService.isValidString(description) || userService.isValidString(category)) {
            return res.status(501).json("invalid inputs")
        }
        const newExpense = await req.user.createExpense({ amount, description, category }, { transaction: t })
        const userExpense = await req.user.update({ total_expense: req.user.total_expense + parseInt(amount) }, { transaction: t });
        await t.commit()
        return res.status(200).json({newExpense, success:true });
    }
    catch (err) {
        await t.rollback();
        console.log(err)
        res.status(502).json({err, success: false})
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        let limitPerPage = parseInt(req.query.limit);
        if(!limitPerPage) {
            limitPerPage = 5;
        }
        const expenses= await Expense.findAndCountAll(
            {
                where: { userId: req.user.id },
                offset: (page - 1) * limitPerPage,
                limit: limitPerPage
            });
        res.status(200).json({
            limit: limitPerPage,
            expenses: expenses.rows,
            hasprevpage: page > 1,
            hasnextpage: page * limitPerPage < expenses.count,
            prevpage : page - 1 ,
            currpage : page ,
            lastpage : Math.ceil(expenses.count/limitPerPage),
            nextpage : page + 1
        });

    }
    catch (err) {
        console.log(err)
        res.status(501).json(err)
    }
}

exports.postDeleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const exp = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id }, transaction: t })
        const totalExpense = await req.user.update({ total_expense: parseInt(req.user.total_expense) - parseInt(exp.amount) }, { transaction: t })
        await exp.destroy({ transaction: t });
        await t.commit();
        if (exp === 0) {
            return res.status(402).json({ success: "failed", message: "expense not belong to the user" })
        }
        res.status(200).json({ deletedExpense: exp, totalExpense })
    }
    catch (err) {
        await t.rollback();
        res.status(501).json(err);
    }
}

exports.getpremiumFeature = async (req,res,next) => {
    try {
        const users =await User.findAll({
            attributes: ["name","total_expense"],
            order:[['total_expense', 'DESC']]
        });
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({err})
    }
}