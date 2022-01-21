const main = async () => {

    const [owner, _ ] = await hre.ethers.getSigners()

    const secretStoreFactory =   await hre.ethers.getContractFactory("SecretStore") // compile the contract
    const secretStore = await secretStoreFactory.deploy({
        value : hre.ethers.utils.parseEther('1'), // funding contract with 1 ETH
    })

    await secretStore.deployed() // mining
    
    console.log("Contract addr - ", secretStore.address) 
    console.log("Contract bal - ", hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(secretStore.address)));
    
    
    let txn = await secretStore.connect(_).send("Sshhh.. secret!")
    await txn.wait()
    
    console.log("Contract bal - ", hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(secretStore.address)));
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()
