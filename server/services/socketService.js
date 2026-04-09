const socketService = (io) => {
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        // Join a specific room (e.g., table room or kitchen room)
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        // Handle Call Waiter
        socket.on('call_waiter', (data) => {
            const { tableNumber } = data;
            console.log(`Waiter called at table ${tableNumber}`);
            io.to('kitchen').to('admin').emit('waiter_needed', { tableNumber, time: new Date() });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketService;
