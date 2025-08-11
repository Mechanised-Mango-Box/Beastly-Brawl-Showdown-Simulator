import React, { useState, useEffect } from "react";
import { MonsterContainer } from "./MonsterContainer";
import { useNavigate } from "react-router-dom";

interface MonsterSelectionScreenProps {
  setSelectedMonsterCallback: (value: string) => void;
}

export const MonsterSelectionScreen: React.FC<MonsterSelectionScreenProps> = ({ setSelectedMonsterCallback }) => {
  const navigate = useNavigate();

  const [selectedMonster, setSelectedMonster] = useState<string>("");
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);


  function highlightAndShowConfirm(name: string) {
    console.log("Monster clicked:", name);

    // Remove styling from previous selection
    if (selectedMonster) {
      const deselect = document.getElementById(selectedMonster);
      if (deselect) {
        deselect.style.border = "none";
        deselect.style.opacity = "1";
      }
    }

    // Add styling to new selection
    const selected = document.getElementById(name);
    if (selected) {
      selected.style.border = "solid";
      selected.style.borderWidth = "8px";
      selected.style.opacity = "0.5";
    }

    setSelectedMonster(name);
    setConfirmEnabled(true);
  }

   // Called when the confirm button is clicked

  function handleConfirm() {
    if (selectedMonster) {
      console.log("Confirmed monster:", selectedMonster);
      setIsConfirmed(true);
      navigate("/play");
    }
  }

   // Notify parent after confirmation
  useEffect(() => {
    if (isConfirmed && selectedMonster) {
      setSelectedMonsterCallback(selectedMonster);
    }
  }, [isConfirmed, selectedMonster, setSelectedMonsterCallback]);

  return (
    <div className="monsterSelectionScreen">
      <h1>Choose your Monster:</h1>

      <MonsterContainer
        image="img/placeholder_monster_1.png"
        name="monster1"
        currentlySelectedMonster={highlightAndShowConfirm}
      />
      <MonsterContainer
        image="img/placeholder_monster_2.png"
        name="monster2"
        currentlySelectedMonster={highlightAndShowConfirm}
      />
      <MonsterContainer
        image="img/placeholder_monster_3.png"
        name="monster3"
        currentlySelectedMonster={highlightAndShowConfirm}
      />

      <button
        id="confirmMonsterButton"
        onClick={handleConfirm}
        disabled={!confirmEnabled}
        
      >
        Confirm
      </button>
    </div>
  );
};
