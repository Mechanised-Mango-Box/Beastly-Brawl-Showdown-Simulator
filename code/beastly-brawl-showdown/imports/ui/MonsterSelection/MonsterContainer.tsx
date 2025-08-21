import React from "react";

export const MonsterContainer = ({
  name,
  type,
  currentlySelectedMonster,
}: {
  name: string;
  type: string;
  currentlySelectedMonster: (name: string) => void;
}) => {
  function onClick() {
    currentlySelectedMonster(name);
  }

  return (
    <div className="monster-selection-card" id={name} onClick={onClick}>
      <div className="monster-avatar">
        <img src={`/monsters/${name}.png`} alt={name} />
      </div>
      <div className="monster-selection-card-info">
        {/* All of these are placeholder texts */}
        <div className="monster-name">{name}</div>
        <div className="monster-type">{type}</div>
        <div className="monster-desc">
          A fierce dragon-like creature with burning claws
        </div>
        <div className="ability-desc">
          Ability: Ignite - Burns enemies on contact
        </div>
      </div>
    </div>
  );
};
