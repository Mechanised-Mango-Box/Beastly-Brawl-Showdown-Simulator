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
    <div className="canvas-body" id="monster-selection-screen">
            <h1 className="monster-selection-screen-title">Choose Your</h1>
            <h1 className="monster-selection-screen-title" id="header-2">Monster!</h1>
            <div className="monster-selection-grid">
                <MonsterContainer name="monster1" type="Attacker" currentlySelectedMonster={highlightAndShowConfirm} />
                <MonsterContainer name="monster2" type="Defender" currentlySelectedMonster={highlightAndShowConfirm} />
                <MonsterContainer name="monster3" type="Balanced" currentlySelectedMonster={highlightAndShowConfirm} />

      <button
        className="glb-btn"
        id="monster-selection-btn"
        onClick={handleConfirm}
        disabled={!confirmEnabled}
        
      >
        Confirm
      </button>
          </div>
            </div>   
          
  );
};
