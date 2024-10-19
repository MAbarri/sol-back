import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

// Minimal ABI for ERC-20 `balanceOf`
const ERC20_ABI: AbiItem[] = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
    }
];

// Define the return type of the hook
interface UseWeb3Return {
    balance: string | null;
    web3: Web3 | null;
}

const useWeb3 = (contractAddress: string, userAddress: string): UseWeb3Return => {
    const [balance, setBalance] = useState<string | null>(null);
    const [web3, setWeb3] = useState<Web3 | null>(null);

    useEffect(() => {
        const initWeb3 = async () => {
            try {
                const web3Instance = new Web3('https://bsc-dataseed.binance.org/');
                const contract = new web3Instance.eth.Contract(ERC20_ABI, contractAddress);

                
                const userBalance = await contract.methods.balanceOf(userAddress).call() as string;
                setBalance(web3Instance.utils.fromWei(userBalance, 'ether'));
                setWeb3(web3Instance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        initWeb3();
    }, [contractAddress, userAddress]);

    return { balance, web3 };
};

export default useWeb3;
