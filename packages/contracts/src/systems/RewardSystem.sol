// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Player, Encounter, EncounterData, MonsterCatchAttempt, OwnedBy, Monster,Reward } from "../codegen/Tables.sol";
import { MonsterCatchResult } from "../codegen/Types.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";
import { RewardNFT } from "../RewardNFT.sol";
 
contract RewardSystem is System {
  function rewardMint() public {
    address rewardNftAddress = Reward.get(addressToEntityKey(address(_world())));
    RewardNFT RewardContract = RewardNFT(rewardNftAddress);
    RewardContract.mint(address(_msgSender()), 1);
  }

  function rewardListedCheck() public {  
    address rewardNftAddress = Reward.get(addressToEntityKey(address(_world())));
    RewardNFT RewardContract = RewardNFT(rewardNftAddress);
    RewardContract.isInAllowList(address(_msgSender())); 
  }
}
