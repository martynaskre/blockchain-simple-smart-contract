const Lottery = artifacts.require('./Lottery.sol');

contract('Lottery', (accounts) => {
    let manager = null;
    let player1 = null;
    let player2 = null;

	before(async () => {
        manager = accounts[0];
        player1 = accounts[1];
        player2 = accounts[2];
	});

    it(`should throw an exception on slot > 1`, (done) => {
        Lottery
            .new({from: manager})
            .then(instance => instance.enter.sendTransaction(2, {
                from: player1,
                value: web3.utils.toWei('0.1', 'ether')
            }))
            .catch((e) => {
                assert(e.message.indexOf('revert') > -1);

                done();
            });
    });

    it('should throw an exception if betting on sold slots', (done) => {
        Lottery
            .new({from: manager})
            .then(async (instance) => {
                await instance.enter.sendTransaction(1, {
                    from: player1,
                    value: web3.utils.toWei('0.1', 'ether')
                });

                await instance.enter.sendTransaction(1, {
                    from: player2,
                    value: web3.utils.toWei('0.1', 'ether')
                });
            })
            .catch((e) => {
                assert(e.message.indexOf('revert') > -1);

                done();
            });
    });

    it('should throw an exception if message value is not 0.1 ether', (done) => {
        Lottery
            .new({from: manager})
            .then(instance => instance.enter.sendTransaction(0, {
                from: player1,
                value: web3.utils.toWei('0.01', 'ether')
            }))
            .catch((e) => {
                assert(e.message.indexOf('revert') > -1);

                done();
            });
    });

    it('should pick a random winner if all slots are sold', (done) => {
        Lottery
            .new({from: manager})
            .then(async (instance) => {
                await instance.enter.sendTransaction(0, {
                    from: player1,
                    value: web3.utils.toWei('0.1', 'ether')
                });

                await instance.enter.sendTransaction(1, {
                    from: player2,
                    value: web3.utils.toWei('0.1', 'ether')
                });

                assert.notEqual(await instance.winner(), '0x0000000000000000000000000000000000000000');

                done();
            });
    });

    it('should destroy the contract if manager called for it', (done) => {
        Lottery
            .new({from: manager})
            .then(async (instance) => {
                await instance.resetLottery.call({
                    from: manager,
                });

                assert.equal(await instance.winner(), '0x0000000000000000000000000000000000000000');

                done();
            });
    });
});
