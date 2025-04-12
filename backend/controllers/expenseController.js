const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date){
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Get All Expense Sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        // This sort will help to arrange the data in descending order based on their creation time. So the latest created data will be at top and oldest one at bottom.
        const expenseSources = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenseSources);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Delete Expense source
exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch(error){
        res.status(500).json({ message: 'Server Error' });
    }
}

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new(); // creating a workbook
        const ws = xlsx.utils.json_to_sheet(data); // creating a worksheet with the json data

        xlsx.utils.book_append_sheet(wb, ws, "Expense"); // append the worksheet in the workbook
        xlsx.writeFile(wb, "expense_details.xlsx"); // write file

        res.download("expense_details.xlsx"); // downloading the excel file
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}