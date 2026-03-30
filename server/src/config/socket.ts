import { Server } from "socket.io";

let io : Server;

export const initSocket = (server : any) =>{
    io = new Server(server, {
        cors: {
            origin : "*", 
            methods : ["GET",  "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log(`Client Connected : ${socket.id}`);

        socket.on("disconnect", () => {
            console.log("Client Disconnected", socket.id);
        });
    });
};

export const getIO = () => {
    if(!io){
        throw new Error("Socket not initialised");
    }
    return io;
}