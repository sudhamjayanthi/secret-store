const main = async () => {
  const secretStore = await hre.ethers.getContractFactory("SecretStore");
  const contract = await secretStore.deploy({
      value : hre.ethers.utils.parseEther('0.01')
  });

  console.log("Contract deployed at - ", contract.address);
};

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) { 
    console.error(error)
    process.exit(1)
  }
}

runMain()

// Contract Addy on Rinkeby - 0x39940975272FDb6288ff6B067CAEFb100F99560F