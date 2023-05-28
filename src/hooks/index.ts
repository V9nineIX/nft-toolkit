import { gql } from "@apollo/client";

const LIST_TOKEN = gql`
  query (
    $id: String,
    $offset: Int,
    $limit: Int,
    $filter: [FilterParam],
    $startIndex: Int
    ) {
    nft(
      id: $id,
      offset: $offset,
      limit: $limit,
      filter: $filter,
      startIndex: $startIndex
    ) {
      _id,
      name,
      ownerId,
      status,
      symbol,
      description,
      totalSupply,
      projectDir,
      royaltyFee,
      defaultPrice,
      imagePath,
      totalImage,
      nftType,
      ipfsJsonHash,
      ipfsImageHash,
      maxPublicSupply,
      maxTokensPerAddress,
      smartContractAddress,
      isHasUpdate,
      imageUrl,
      metaUrl,
      nftStorageType,
      phase{
        phaseNumber,
        whiteListAddress,
      },
      version {
        version,
        ipfsImageHash,
        ipfsJsonHash,
        buildFolder,
        totalSupply
      },
      meta{
        name,
        image,
        edition,
        rawImage,
        qty,
        attributes{
          trait_type,
          value
        },
        customAttributes{
          trait_type,
          value
        }
      },
      layers{
         name,
         images{
          name
        }
      },
  }
  }
`;

const QUERY_META = gql`
  query ($contractAddress: String) {
    metas(contractAddress: $contractAddress) {
      id
      traitType
      value
      useCount
    }
  }
`;

const FILTER_TOKEN = gql`
  query (
    $contractAddress: String
    $first: Int
    $skip: Int
    $filter: [FilterParam]
  ) {
    tokens(
      contractAddress: $contractAddress
      first: $first
      skip: $skip
      filter: $filter
    ) {
      id
      ipfsURI
      image
      name
      metas {
        id
        traitType
        value
      }
    }
  }
`;

const RESET_TOKEN = gql`
mutation restoreCollection($id: String, $versionNumber: Int) {
    restoreCollection(id: $id, versionNumber: $versionNumber)
  }
`;


const DELETE_META = gql`
mutation deleteMeta($id: String, $edition: Int) {
  deleteMeta(id: $id, edition: $edition)
}
`;


const UPDATE_CUSTOM_TOKEN = gql`
mutation updateMeta(
    $id: String,
    $meta:MetaParam
) {
    updateMeta(
        id: $id,
        meta: $meta
    ) 
} `;


const DELETE_BULK_META = gql`
mutation deleteBulkMeta(
  $id: String, 
  $removeNumber: Int,
  #$totalMint: Int,
  $excludedNumber: Int,
) {
  deleteBulkMeta(
    id: $id, 
    removeNumber: $removeNumber,
    #totalMint: $totalMint,
    excludedNumber: $excludedNumber,
    ){
      status
      totalSupply
    }
}
`;

const QUERY_MERKLE_PROOF = gql` 
query ($contractAddress: String, $address: String, $phaseNumber: Int) {
  getMerkleProof(
    address: $address,
    contractAddress: $contractAddress
    phaseNumber: $phaseNumber
  ) {
    root
    proof
  }
}`;


export {
  LIST_TOKEN,
  QUERY_META,
  FILTER_TOKEN,
  DELETE_META,
  UPDATE_CUSTOM_TOKEN,
  DELETE_BULK_META,
  RESET_TOKEN,
  QUERY_MERKLE_PROOF
};
