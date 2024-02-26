
// adress of the server to connect to (mock or real)
const serverAdress = 'ws://localhost:8080';

describe("client initialization", () => {
    it("basic creation", () => {
        const client = new CandyRushClient();
        chai.expect(client.status).to.equal("disconnected");
    });

    it("client connection'", ()=>{
        const client = new CandyRushClient();
        // The adress of the server doesn't matter, we just want to test the connection status here
        client.connect(serverAdress); 
        chai.expect(client.status).to.equal("connecting")
    })
});

describe("client communication", () => {
   
    const client = new CandyRushClient();
    // The address of the server is the one of a valid server
    
    it("client connection", (done) => { // Use done() to signal the completion of the asynchronous test
            
            client.addEventListener(ClientEvent.CONNECTING_STATUS_CHANGE, (event) => {
                const status = client.status;
                if(status === "connected") {
                    chai.expect(status).to.equal("connected");
                    done(); // Signal the completion of the test
                }
            });
       client.connect(serverAdress);
    }).timeout(3000); // Set a timeout for the test to ensure it doesn't run indefinitely
});