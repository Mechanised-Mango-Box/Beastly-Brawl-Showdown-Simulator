import React from "react";

type BattleBottomProps = {
  onAttack: () => void;
  onAbility: () => void;
  onDefend: () => void;
  shieldUsesLeft?: number;
};

export const BattleBottom: React.FC<BattleBottomProps> = ({
  onAttack,
  onAbility,
  onDefend,
  shieldUsesLeft = 3,
}) => {
  // const handleRoll = () => {
  //   onRoll();
  //   //basically just clals whatever function is given to this as a parameter
  // };
  return (
    <div className="battleScreenBottom">
      <button className="glb-btn" id="attack" onClick={onAttack}>
        <img
          className="battleScreenBottomButtonImage"
          src="/img/sword3.png"
          alt="Sword"
        />
      </button>
      <button className="glb-btn" id="ability" onClick={onAbility}>
        <img
          className="battleScreenBottomButtonImage"
          src="/img/ability2.png"
          alt="Ability"
        />
      </button>
      <button className="glb-btn" id="defend" onClick={onDefend}>
        <img
          className="battleScreenBottomButtonImage"
          src="/img/shield2.png"
          alt="Shield"
        />
      </button>
      <div className="shield-uses">{shieldUsesLeft}</div>
    </div>
  );
};
