import { getIO } from "../config/socket";

export const emitNodeUpdate = (nodeId: string, status: string, data: any = {}) => {
    const io = getIO();

    io.emit("node:update", {
        nodeId,
        status,
        data
    });
};

export const emitLog = (log: any) => {
    const io = getIO();

    io.emit("log:new", {
        ...log,
        timestamp: new Date()   
    });
};