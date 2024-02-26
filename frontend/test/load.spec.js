describe("server charge", () => {
    
    it("server charge", (done) => { // Use done() to signal the completion of the asynchronous test
        const connectionNumber = 200;
        let connectionCount = 0;
        const clients = [];

        for(let i = 0; i < connectionNumber; i++) {
            const client = new CandyRushClient();
            client.addEventListener(ClientEvent.CONNECTING_STATUS_CHANGE, (event) => {
                const status = client.status;
                if(status === "connected") {
                    connectionCount++;
                    if(connectionCount === connectionNumber) {
                        chai.expect(connectionCount).to.equal(connectionNumber);
                        done(); // Signal the completion of the test
                    }
                }
            });
            client.connect(serverAdress);
            clients.push(client);
        }

    }).timeout(10000); // Set a timeout for the test to ensure it doesn't run indefinitely
});