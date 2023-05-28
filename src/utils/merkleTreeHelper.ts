import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { DEFAULT_MERKLE_ROOT } from '../constants/index';


export const buf2hex = x => '0x' + x.toString('hex')

export const handleMerkleTree = ({
    address = [],
    account = '',
    isGetProof = false,
}) => {

    /* Merkle tree */

    let dataRoot = ''
    let dataProofs = []
    let dataTree = ''

    const addresses = [...address]

    if (addresses.length > 0) {
        try {
            const accountKECCAK256 = keccak256(account)
            const leaves = addresses.map((item) =>
                keccak256(item)
            );
            const tree = new MerkleTree(leaves, keccak256, { sort: true })
            dataTree = tree.toString()
            // const treeSting = dataTree.toString()
            // console.log('>>> Log: ', treeSting.getOldTransaction());
            // console.log('>>> Root Hash: ', treeSting.getRootHash());
            dataRoot = tree.getHexRoot(); // == buf2hex(tree.getRoot());


            if (account.length > 0 && isGetProof) {
                dataProofs = tree.getProof(accountKECCAK256).map(item => buf2hex(item.data));
                console.log(`tree.verify:`, tree.verify(dataProofs, accountKECCAK256, dataRoot))
            }

        } catch (error) {
            console.log(`error`, error);
        }
    } else {
        dataRoot = DEFAULT_MERKLE_ROOT
    }

    /* Merkle tree */

    return ({
        root: dataRoot,
        proofs: dataProofs,
        tree: dataTree,
    })
}