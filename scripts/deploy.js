
const hre = require("hardhat");

async function main() {
  const Shark = await hre.ethers.getContractFactory("shark")
  const shark = await Shark.deploy()
  
  await shark.deployed()

  console.log(shark.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
