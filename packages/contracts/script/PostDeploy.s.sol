// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { EncounterTrigger, MapConfig, Obstruction, Position, Reward} from "../src/codegen/Tables.sol";
import { TerrainType } from "../src/codegen/Types.sol";
import { positionToEntityKey } from "../src/positionToEntityKey.sol";
import { RewardNFT } from "../src/RewardNFT.sol";
import { addressToEntityKey } from "../src/addressToEntityKey.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    IWorld world = IWorld(worldAddress); 
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    
    RewardNFT rewardNFT = new RewardNFT("RewardNFT", "RNT");
    address rewardNFTAddress = address(rewardNFT);
    bytes32 worldKey= addressToEntityKey(address(worldAddress));
    Reward.set(world, worldKey, rewardNFTAddress);
    
    runNext(world);
    vm.stopBroadcast();
  }

  function runNext(IWorld world) internal {
    TerrainType O = TerrainType.None;
    TerrainType T = TerrainType.TallGrass;
    TerrainType B = TerrainType.Boulder;
    TerrainType Goal = TerrainType.Goal;
    TerrainType Start = TerrainType.Start;
 
    TerrainType[20][20] memory map = [
      [T, T, T, T, T, T, T, O, O, O, O, O, O, O, T, T, T, T, T, Goal],
      [T, O, T, O, O, O, O, O, T, O, O, O, O, B, T, T, T, T, T, T],
      [T, O, T, O, O, O, O, O, T, O, O, O, O, B, T, T, T, T, T, T],
      [T, T, T, T, T, O, O, O, O, O, O, O, O, O, T, T, T, T, T, T],
      [T, O, T, T, T, T, O, O, O, O, B, O, O, O, T, T, T, T, T, T],
      [T, O, O, O, T, T, O, O, O, O, O, O, O, O, T, T, T, T, T, T],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
      [O, T, O, O, O, B, B, O, O, O, O, T, O, O, O, O, O, B, O, O],
      [O, O, T, T, O, O, O, O, O, T, O, B, O, O, T, O, B, O, O, O],
      [O, O, T, O, O, O, O, T, T, T, O, B, B, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, T, T, T, O, B, T, O, T, T, O, O, O, O],
      [O, B, O, O, O, B, O, O, T, T, O, B, O, O, T, T, O, O, O, O],
      [O, O, B, O, O, O, T, O, T, T, O, O, B, T, T, T, O, O, O, O],
      [O, O, B, B, O, O, O, O, T, O, O, O, B, O, T, O, O, O, O, O],
      [O, O, O, B, B, O, O, O, O, O, O, O, O, B, O, T, O, O, O, O],
      [O, T, T, T, B, T, O, O, O, O, O, O, T, O, O, O, O, O, O, O],
      [O, O, O, O, O, O, O, O, O, O, B, B, T, O, T, O, O, O, O, O],
      [O, O, O, O, T, O, O, O, T, B, O, O, T, T, T, O, B, O, O, O],
      [O, O, O, T, O, T, T, T, O, O, O, O, T, O, O, T, O, O, O, O],
      [Start, O, T, O, T, T, O, O, O, O, O, O, T, O, O, O, O, O, O, O]
    ];
 
    uint32 height = uint32(map.length);
    uint32 width = uint32(map[0].length);
    bytes memory terrain = new bytes(width * height);
 
    for (uint32 y = 0; y < height; y++) {
      for (uint32 x = 0; x < width; x++) {
        TerrainType terrainType = map[y][x];
        if (terrainType == TerrainType.None) continue;
 
        terrain[(y * width) + x] = bytes1(uint8(terrainType));
 
        bytes32 entity = positionToEntityKey(x, y);
        if (terrainType == TerrainType.Boulder) {
          Position.set(world, entity, x, y);
          Obstruction.set(world, entity, true);
        } else if (terrainType == TerrainType.TallGrass) {
          Position.set(world, entity, x, y);
          EncounterTrigger.set(world, entity, true);
        } 
      }
    }
 
    MapConfig.set(world, width, height, terrain);
  }
}
