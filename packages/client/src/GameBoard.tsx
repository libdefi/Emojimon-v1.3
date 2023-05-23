import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { GameMap } from "./GameMap";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { hexToArray } from "@latticexyz/utils";
import { TerrainType, terrainTypes } from "./terrainTypes";
import { EncounterScreen } from "./EncounterScreen";
import { runQuery, HasValue, Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { MonsterType, monsterTypes } from "./monsterTypes";
import { toast } from "react-toastify";

export const GameBoard = () => {
  useKeyboardMovement();
 
  const {
    components: { Encounter, MapConfig, Monster, Player, Position },
    network: { playerEntity, singletonEntity },
    systemCalls: { spawn, rewardMint, rewardListedCheck },
  } = useMUD();
  
  // Able to determine if the goal has been achieved.
  const matchingEntities = runQuery([
    HasValue(Position, {x: 19, y: 0})
  ])
  
  console.log("@@@matchingEntities=", matchingEntities)
 
  const canSpawn = useComponentValue(Player, playerEntity)?.value !== true;
 
  const players = useEntityQuery([Has(Player), Has(Position)]).map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    
    return {
      entity,
      x: position.x,
      y: position.y,
      emoji: entity === playerEntity ? "🐕‍🦺" : "🐒",
    };
  });
 
  const mapConfig = useComponentValue(MapConfig, singletonEntity);
  if (mapConfig == null) {
    throw new Error("map config not set or not ready, only use this hook after loading state === LIVE");
  }
 
  const { width, height, terrain: terrainData } = mapConfig;
  const terrain = Array.from(hexToArray(terrainData)).map((value, index) => {
    const { emoji } = value in TerrainType ? terrainTypes[value as TerrainType] : { emoji: "" };
    return {
      x: index % width,
      y: Math.floor(index / width),
      emoji,
    };
  });
 
  const encounter = useComponentValue(Encounter, playerEntity);
  const monsterType = useComponentValue(Monster, encounter ? (encounter.monster as Entity) : undefined)?.value;
  const monster = monsterType != null && monsterType in MonsterType ? monsterTypes[monsterType as MonsterType] : null;
 
  return (
    <div>
      <GameMap
        width={width}
        height={height}
        terrain={terrain}
        onTileClick={canSpawn ? spawn : undefined}
        players={players}
        encounter={
          encounter ? (
            <EncounterScreen monsterName={monster?.name ?? "MissingNo"} monsterEmoji={monster?.emoji ?? "💱"} />
          ) : undefined
        }
      />
      <button
        type="button"
        className="bg-blue-600 hover:ring rounded-lg px-4 py-2 w-full"
        onClick={async () => {
          const toastId = toast.loading("Running away…");
          await rewardMint();
          toast.update(toastId, {
            isLoading: false,
            type: "default",
            render: `You ran away!`,
            autoClose: 5000,
            closeButton: true,
          });
        }}
      >
        Got a crawn, Reward Mint (ERC721)
      </button>

    </div>
  );
};
