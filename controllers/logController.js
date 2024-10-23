import Log from "../models/logModel.js";


export const getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const logs = await Log.find({ deleted: false })
            .skip(skip)
            .limit(limit);


        const totalLogs = await Log.countDocuments({ deleted: false });

        if (!logs) {
            return res.status(400).json({ message: "No logs found" });
        }

        res.status(200).json({
            message: "All logs",
            logs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            totalLogs,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const logs = await Log.find({ userId, deleted: false })
            .skip(skip)
            .limit(limit);


        const totalLogs = await Log.countDocuments({ userId, deleted: false });

        if (!logs) {
            return res.status(400).json({ message: "Logs with that user not found" });
        }

        res.status(200).json({
            message: "User logs",
            logs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            totalLogs,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteLog = async (req, res) => {
    try {
        const logId = req.params.id;
        const userId = req.user.id;
        const userEmail = req.user.email
        const log = await Log.findById(logId);
        if (!log) {
            return res.status(400).json({ message: "Log with that id does not found" })
        }
        if (log.userId.toString() !== userId) {
            return res.status(400).json({ message: "You can't delete this log" })
        }
        log.deleted = true;
        await log.save();

        await Log.create({
            actionType: 'delete',
            userId: userId,
            role: log.role,
            additionalData: { email: userEmail },
        });

        return res.status(200).json({ message: 'Log soft deleted successfully', log });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateLog = async (req, res) => {
    try {
        const logId = req.params.id;
        const userId = req.user.id;
        const userEmail = req.user.email;
        const { actionType, additionalData } = req.body;


        const log = await Log.findById(logId);
        if (!log) {
            return res.status(400).json({ message: "Log with that id does not found" });
        }


        if (log.userId.toString() !== userId) {
            return res.status(400).json({ message: "You can't update this log" });
        }


        log.deleted = true;
        await log.save();


        const newLog = await Log.create({
            actionType: `Updated log for action: ${actionType}`,
            userId: userId,
            role: log.role,
            additionalData: {
                email: userEmail
            },
        });

        return res.status(200).json({
            message: 'Log updated successfully',
            newLog,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


