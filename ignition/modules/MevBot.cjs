// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
const modules = require("@nomicfoundation/hardhat-ignition/modules");

const MevModule = modules.buildModule("MevBotModule", (m) => {
    const addressProvider = m.getParameter("addressProvider", "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
    const _swapRouter = m.getParameter("_swapRouter", "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45")
    const lock = m.contract("MevBot", [addressProvider, _swapRouter], {});
    return { lock };
});

module.exports = MevModule;
